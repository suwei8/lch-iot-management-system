import { Repository } from 'typeorm';
import { AuditLog } from '../../modules/audit/entities/audit-log.entity';
import { CreateAuditLogDto, AuditLogQueryDto, AuditLogStatsQueryDto } from '../../modules/admin/dto/audit-log.dto';
import { PaginatedResponseDto } from '../dto/response.dto';
export declare class AuditLogService {
    private auditLogRepository;
    constructor(auditLogRepository: Repository<AuditLog>);
    create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog>;
    createBatch(createAuditLogDtos: CreateAuditLogDto[]): Promise<AuditLog[]>;
    findAll(queryDto: AuditLogQueryDto): Promise<PaginatedResponseDto<AuditLog>>;
    findOne(id: number): Promise<AuditLog>;
    getStats(queryDto: AuditLogStatsQueryDto): Promise<{
        summary: {
            totalCount: number;
            successCount: number;
            failureCount: number;
            successRate: string;
        };
        actionStats: {
            action: any;
            count: number;
        }[];
        resourceStats: {
            resource: any;
            count: number;
        }[];
        userStats: {
            userId: any;
            userRole: any;
            count: number;
        }[];
        timeStats: {
            time: any;
            count: number;
        }[];
    }>;
    cleanup(daysToKeep?: number): Promise<{
        deletedCount: number;
    }>;
    export(queryDto: AuditLogQueryDto): Promise<AuditLog[]>;
    batchDelete(ids: number[]): Promise<{
        deletedCount: number;
    }>;
}
