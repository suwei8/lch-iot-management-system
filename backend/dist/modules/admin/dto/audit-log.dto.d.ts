export declare class CreateAuditLogDto {
    action: string;
    resourceType: string;
    resourceId?: number;
    description: string;
    userId: number;
    userRole: string;
    ipAddress?: string;
    userAgent?: string;
    beforeData?: string;
    afterData?: string;
    status?: string;
    errorMessage?: string;
    requestData?: string;
    responseData?: string;
}
export declare class AuditLogQueryDto {
    page?: number;
    limit?: number;
    query?: string;
    action?: string;
    resourceType?: string;
    userId?: number;
    userRole?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    ipAddress?: string;
    resource?: string;
}
export declare class AuditLogStatsQueryDto {
    startDate?: string;
    endDate?: string;
    dimension?: string;
    userId?: number;
    userRole?: string;
}
