export declare class SystemConfigDto {
    key: string;
    value: string;
    description?: string;
    group?: string;
    isSensitive?: boolean;
}
export declare class BatchUpdateSystemConfigDto {
    configs: SystemConfigDto[];
}
export declare class SystemBackupDto {
    backupType: string;
    description?: string;
    compress?: boolean;
    includeTables?: string[];
    excludeTables?: string[];
}
export declare class SystemRestoreDto {
    backupFilePath: string;
    restoreType: string;
    overwrite?: boolean;
    includeTables?: string[];
}
export declare class SystemMonitorQueryDto {
    type?: string;
    timeRange?: string;
    startTime?: string;
    endTime?: string;
}
export declare class ReportQueryDto {
    reportType: string;
    timeDimension?: string;
    startDate: string;
    endDate: string;
    merchantId?: number;
    storeId?: number;
    deviceId?: number;
    groupBy?: string[];
    orderBy?: string;
    orderDirection?: string;
    exportFormat?: string;
}
export declare class SystemNotificationDto {
    type: string;
    level: string;
    title: string;
    content: string;
    targetRoles?: string[];
    targetUserIds?: number[];
    sendImmediately?: boolean;
    scheduledAt?: string;
}
