import { AuditLogService } from '../../common/services/audit-log.service';
import { AuditLogQueryDto, AuditLogStatsQueryDto } from './dto/audit-log.dto';
import { PaginatedResponseDto } from '../../common/dto/response.dto';
import { BatchIdDto } from '../../common/dto/validation.dto';
export declare class AuditLogController {
    private readonly auditLogService;
    constructor(auditLogService: AuditLogService);
    getAuditLogs(queryDto: AuditLogQueryDto): Promise<PaginatedResponseDto<import("../audit/entities/audit-log.entity").AuditLog>>;
    getAuditLog(id: number): Promise<import("../audit/entities/audit-log.entity").AuditLog>;
    getAuditLogStats(queryDto: AuditLogStatsQueryDto): Promise<{
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
    exportAuditLogs(queryDto: AuditLogQueryDto): Promise<import("../audit/entities/audit-log.entity").AuditLog[]>;
    batchDeleteAuditLogs(batchIdDto: BatchIdDto): Promise<{
        deletedCount: number;
    }>;
    cleanupExpiredLogs(body: {
        days: number;
    }): Promise<{
        deletedCount: number;
    }>;
}
