"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_log_entity_1 = require("../../modules/audit/entities/audit-log.entity");
const response_dto_1 = require("../dto/response.dto");
let AuditLogService = class AuditLogService {
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    async create(createAuditLogDto) {
        const auditLog = this.auditLogRepository.create({
            ...createAuditLogDto,
            requestData: createAuditLogDto.requestData ? JSON.stringify(createAuditLogDto.requestData) : null,
            responseData: createAuditLogDto.responseData ? JSON.stringify(createAuditLogDto.responseData) : null,
            createdAt: new Date(),
        });
        return await this.auditLogRepository.save(auditLog);
    }
    async createBatch(createAuditLogDtos) {
        const auditLogs = createAuditLogDtos.map(dto => this.auditLogRepository.create({
            ...dto,
            requestData: dto.requestData ? JSON.stringify(dto.requestData) : null,
            responseData: dto.responseData ? JSON.stringify(dto.responseData) : null,
            createdAt: new Date(),
        }));
        return await this.auditLogRepository.save(auditLogs);
    }
    async findAll(queryDto) {
        const { page = 1, limit = 10, query, action, resource, userId, userRole, status, startDate, endDate, ipAddress, } = queryDto;
        const queryBuilder = this.auditLogRepository.createQueryBuilder('audit_log');
        if (query) {
            queryBuilder.andWhere('(audit_log.description LIKE :query OR audit_log.action LIKE :query OR audit_log.resource LIKE :query)', { query: `%${query}%` });
        }
        if (action) {
            queryBuilder.andWhere('audit_log.action = :action', { action });
        }
        if (resource) {
            queryBuilder.andWhere('audit_log.resource = :resource', { resource });
        }
        if (userId) {
            queryBuilder.andWhere('audit_log.userId = :userId', { userId });
        }
        if (userRole) {
            queryBuilder.andWhere('audit_log.userRole = :userRole', { userRole });
        }
        if (status) {
            queryBuilder.andWhere('audit_log.status = :status', { status });
        }
        if (ipAddress) {
            queryBuilder.andWhere('audit_log.ipAddress LIKE :ipAddress', { ipAddress: `%${ipAddress}%` });
        }
        if (startDate && endDate) {
            queryBuilder.andWhere('audit_log.createdAt BETWEEN :startDate AND :endDate', {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            });
        }
        else if (startDate) {
            queryBuilder.andWhere('audit_log.createdAt >= :startDate', {
                startDate: new Date(startDate),
            });
        }
        else if (endDate) {
            queryBuilder.andWhere('audit_log.createdAt <= :endDate', {
                endDate: new Date(endDate),
            });
        }
        queryBuilder.orderBy('audit_log.createdAt', 'DESC');
        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);
        const [items, total] = await queryBuilder.getManyAndCount();
        return new response_dto_1.PaginatedResponseDto(items, total, page, limit);
    }
    async findOne(id) {
        const auditLog = await this.auditLogRepository.findOne({
            where: { id },
        });
        if (!auditLog) {
            throw new Error('审计日志不存在');
        }
        return auditLog;
    }
    async getStats(queryDto) {
        const { startDate, endDate, dimension = 'daily', userId, userRole } = queryDto;
        const queryBuilder = this.auditLogRepository.createQueryBuilder('audit_log');
        if (startDate && endDate) {
            queryBuilder.andWhere('audit_log.createdAt BETWEEN :startDate AND :endDate', {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            });
        }
        if (userId) {
            queryBuilder.andWhere('audit_log.userId = :userId', { userId });
        }
        if (userRole) {
            queryBuilder.andWhere('audit_log.userRole = :userRole', { userRole });
        }
        const totalCount = await queryBuilder.getCount();
        const successCount = await queryBuilder
            .clone()
            .andWhere('audit_log.status = :status', { status: 'success' })
            .getCount();
        const failureCount = totalCount - successCount;
        const actionStats = await this.auditLogRepository
            .createQueryBuilder('audit_log')
            .select('audit_log.action', 'action')
            .addSelect('COUNT(*)', 'count')
            .where(queryBuilder.getQuery())
            .setParameters(queryBuilder.getParameters())
            .groupBy('audit_log.action')
            .orderBy('count', 'DESC')
            .getRawMany();
        const resourceStats = await this.auditLogRepository
            .createQueryBuilder('audit_log')
            .select('audit_log.resource', 'resource')
            .addSelect('COUNT(*)', 'count')
            .where(queryBuilder.getQuery())
            .setParameters(queryBuilder.getParameters())
            .groupBy('audit_log.resource')
            .orderBy('count', 'DESC')
            .getRawMany();
        const userStats = await this.auditLogRepository
            .createQueryBuilder('audit_log')
            .select('audit_log.userId', 'userId')
            .addSelect('audit_log.userRole', 'userRole')
            .addSelect('COUNT(*)', 'count')
            .where(queryBuilder.getQuery())
            .setParameters(queryBuilder.getParameters())
            .andWhere('audit_log.userId IS NOT NULL')
            .groupBy('audit_log.userId, audit_log.userRole')
            .orderBy('count', 'DESC')
            .limit(10)
            .getRawMany();
        let timeStats = [];
        if (dimension === 'daily') {
            timeStats = await this.auditLogRepository
                .createQueryBuilder('audit_log')
                .select('DATE(audit_log.createdAt)', 'date')
                .addSelect('COUNT(*)', 'count')
                .where(queryBuilder.getQuery())
                .setParameters(queryBuilder.getParameters())
                .groupBy('DATE(audit_log.createdAt)')
                .orderBy('date', 'ASC')
                .getRawMany();
        }
        else if (dimension === 'hourly') {
            timeStats = await this.auditLogRepository
                .createQueryBuilder('audit_log')
                .select('DATE_FORMAT(audit_log.createdAt, "%Y-%m-%d %H:00:00")', 'hour')
                .addSelect('COUNT(*)', 'count')
                .where(queryBuilder.getQuery())
                .setParameters(queryBuilder.getParameters())
                .groupBy('DATE_FORMAT(audit_log.createdAt, "%Y-%m-%d %H:00:00")')
                .orderBy('hour', 'ASC')
                .getRawMany();
        }
        return {
            summary: {
                totalCount,
                successCount,
                failureCount,
                successRate: totalCount > 0 ? (successCount / totalCount * 100).toFixed(2) : '0.00',
            },
            actionStats: actionStats.map(item => ({
                action: item.action,
                count: parseInt(item.count, 10),
            })),
            resourceStats: resourceStats.map(item => ({
                resource: item.resource,
                count: parseInt(item.count, 10),
            })),
            userStats: userStats.map(item => ({
                userId: item.userId,
                userRole: item.userRole,
                count: parseInt(item.count, 10),
            })),
            timeStats: timeStats.map(item => ({
                time: item.date || item.hour,
                count: parseInt(item.count, 10),
            })),
        };
    }
    async cleanup(daysToKeep = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        const result = await this.auditLogRepository
            .createQueryBuilder()
            .delete()
            .from(audit_log_entity_1.AuditLog)
            .where('createdAt < :cutoffDate', { cutoffDate })
            .execute();
        return { deletedCount: result.affected || 0 };
    }
    async export(queryDto) {
        const queryBuilder = this.auditLogRepository.createQueryBuilder('audit_log');
        const { query, action, resource, userId, userRole, status, startDate, endDate, ipAddress } = queryDto;
        if (query) {
            queryBuilder.andWhere('(audit_log.description LIKE :query OR audit_log.action LIKE :query OR audit_log.resource LIKE :query)', { query: `%${query}%` });
        }
        if (action)
            queryBuilder.andWhere('audit_log.action = :action', { action });
        if (resource)
            queryBuilder.andWhere('audit_log.resource = :resource', { resource });
        if (userId)
            queryBuilder.andWhere('audit_log.userId = :userId', { userId });
        if (userRole)
            queryBuilder.andWhere('audit_log.userRole = :userRole', { userRole });
        if (status)
            queryBuilder.andWhere('audit_log.status = :status', { status });
        if (ipAddress)
            queryBuilder.andWhere('audit_log.ipAddress LIKE :ipAddress', { ipAddress: `%${ipAddress}%` });
        if (startDate && endDate) {
            queryBuilder.andWhere('audit_log.createdAt BETWEEN :startDate AND :endDate', {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            });
        }
        queryBuilder.orderBy('audit_log.createdAt', 'DESC');
        queryBuilder.limit(10000);
        return await queryBuilder.getMany();
    }
    async batchDelete(ids) {
        const result = await this.auditLogRepository.delete(ids);
        return {
            deletedCount: result.affected || 0,
        };
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuditLogService);
//# sourceMappingURL=audit-log.service.js.map