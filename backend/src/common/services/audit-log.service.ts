import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, In } from 'typeorm';
import { AuditLog } from '../../modules/audit/entities/audit-log.entity';
import { CreateAuditLogDto, AuditLogQueryDto, AuditLogStatsQueryDto } from '../../modules/admin/dto/audit-log.dto';
import { PaginatedResponseDto } from '../dto/response.dto';

/**
 * 审计日志服务
 */
@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * 创建审计日志
   */
  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
      ...createAuditLogDto,
      requestData: createAuditLogDto.requestData ? JSON.stringify(createAuditLogDto.requestData) : null,
      responseData: createAuditLogDto.responseData ? JSON.stringify(createAuditLogDto.responseData) : null,
      createdAt: new Date(),
    });

    return await this.auditLogRepository.save(auditLog);
  }

  /**
   * 批量创建审计日志
   */
  async createBatch(createAuditLogDtos: CreateAuditLogDto[]): Promise<AuditLog[]> {
    const auditLogs = createAuditLogDtos.map(dto => 
      this.auditLogRepository.create({
        ...dto,
        requestData: dto.requestData ? JSON.stringify(dto.requestData) : null,
        responseData: dto.responseData ? JSON.stringify(dto.responseData) : null,
        createdAt: new Date(),
      })
    );

    return await this.auditLogRepository.save(auditLogs);
  }

  /**
   * 分页查询审计日志
   */
  async findAll(queryDto: AuditLogQueryDto): Promise<PaginatedResponseDto<AuditLog>> {
    const {
      page = 1,
      limit = 10,
      query,
      action,
      resource,
      userId,
      userRole,
      status,
      startDate,
      endDate,
      ipAddress,
    } = queryDto;

    const queryBuilder = this.auditLogRepository.createQueryBuilder('audit_log');

    // 关键词搜索
    if (query) {
      queryBuilder.andWhere(
        '(audit_log.description LIKE :query OR audit_log.action LIKE :query OR audit_log.resource LIKE :query)',
        { query: `%${query}%` }
      );
    }

    // 操作类型筛选
    if (action) {
      queryBuilder.andWhere('audit_log.action = :action', { action });
    }

    // 资源类型筛选
    if (resource) {
      queryBuilder.andWhere('audit_log.resource = :resource', { resource });
    }

    // 用户ID筛选
    if (userId) {
      queryBuilder.andWhere('audit_log.userId = :userId', { userId });
    }

    // 用户角色筛选
    if (userRole) {
      queryBuilder.andWhere('audit_log.userRole = :userRole', { userRole });
    }

    // 操作状态筛选
    if (status) {
      queryBuilder.andWhere('audit_log.status = :status', { status });
    }

    // IP地址筛选
    if (ipAddress) {
      queryBuilder.andWhere('audit_log.ipAddress LIKE :ipAddress', { ipAddress: `%${ipAddress}%` });
    }

    // 日期范围筛选
    if (startDate && endDate) {
      queryBuilder.andWhere('audit_log.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    } else if (startDate) {
      queryBuilder.andWhere('audit_log.createdAt >= :startDate', {
        startDate: new Date(startDate),
      });
    } else if (endDate) {
      queryBuilder.andWhere('audit_log.createdAt <= :endDate', {
        endDate: new Date(endDate),
      });
    }

    // 排序
    queryBuilder.orderBy('audit_log.createdAt', 'DESC');

    // 分页
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResponseDto(items, total, page, limit);
  }

  /**
   * 根据ID查询审计日志详情
   */
  async findOne(id: number): Promise<AuditLog> {
    const auditLog = await this.auditLogRepository.findOne({
      where: { id },
    });

    if (!auditLog) {
      throw new Error('审计日志不存在');
    }

    return auditLog;
  }

  /**
   * 获取审计日志统计信息
   */
  async getStats(queryDto: AuditLogStatsQueryDto) {
    const { startDate, endDate, dimension = 'daily', userId, userRole } = queryDto;

    const queryBuilder = this.auditLogRepository.createQueryBuilder('audit_log');

    // 日期范围筛选
    if (startDate && endDate) {
      queryBuilder.andWhere('audit_log.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }

    // 用户筛选
    if (userId) {
      queryBuilder.andWhere('audit_log.userId = :userId', { userId });
    }

    if (userRole) {
      queryBuilder.andWhere('audit_log.userRole = :userRole', { userRole });
    }

    // 基础统计
    const totalCount = await queryBuilder.getCount();
    
    const successCount = await queryBuilder
      .clone()
      .andWhere('audit_log.status = :status', { status: 'success' })
      .getCount();

    const failureCount = totalCount - successCount;

    // 按操作类型统计
    const actionStats = await this.auditLogRepository
      .createQueryBuilder('audit_log')
      .select('audit_log.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .where(queryBuilder.getQuery())
      .setParameters(queryBuilder.getParameters())
      .groupBy('audit_log.action')
      .orderBy('count', 'DESC')
      .getRawMany();

    // 按资源类型统计
    const resourceStats = await this.auditLogRepository
      .createQueryBuilder('audit_log')
      .select('audit_log.resource', 'resource')
      .addSelect('COUNT(*)', 'count')
      .where(queryBuilder.getQuery())
      .setParameters(queryBuilder.getParameters())
      .groupBy('audit_log.resource')
      .orderBy('count', 'DESC')
      .getRawMany();

    // 按用户统计
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

    // 时间维度统计
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
    } else if (dimension === 'hourly') {
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

  /**
   * 清理过期的审计日志
   */
  async cleanup(daysToKeep: number = 90): Promise<{ deletedCount: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.auditLogRepository
      .createQueryBuilder()
      .delete()
      .from(AuditLog)
      .where('createdAt < :cutoffDate', { cutoffDate })
      .execute();

    return { deletedCount: result.affected || 0 };
  }

  /**
   * 导出审计日志
   */
  async export(queryDto: AuditLogQueryDto): Promise<AuditLog[]> {
    const queryBuilder = this.auditLogRepository.createQueryBuilder('audit_log');

    // 应用查询条件（复用findAll的逻辑）
    const { query, action, resource, userId, userRole, status, startDate, endDate, ipAddress } = queryDto;

    if (query) {
      queryBuilder.andWhere(
        '(audit_log.description LIKE :query OR audit_log.action LIKE :query OR audit_log.resource LIKE :query)',
        { query: `%${query}%` }
      );
    }

    if (action) queryBuilder.andWhere('audit_log.action = :action', { action });
    if (resource) queryBuilder.andWhere('audit_log.resource = :resource', { resource });
    if (userId) queryBuilder.andWhere('audit_log.userId = :userId', { userId });
    if (userRole) queryBuilder.andWhere('audit_log.userRole = :userRole', { userRole });
    if (status) queryBuilder.andWhere('audit_log.status = :status', { status });
    if (ipAddress) queryBuilder.andWhere('audit_log.ipAddress LIKE :ipAddress', { ipAddress: `%${ipAddress}%` });

    if (startDate && endDate) {
      queryBuilder.andWhere('audit_log.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }

    queryBuilder.orderBy('audit_log.createdAt', 'DESC');
    queryBuilder.limit(10000); // 限制导出数量

    return await queryBuilder.getMany();
  }

  /**
   * 批量删除审计日志
   */
  async batchDelete(ids: number[]): Promise<{ deletedCount: number }> {
    const result = await this.auditLogRepository.delete(ids);
    
    return {
      deletedCount: result.affected || 0,
    };
  }
}