export declare class CreateAlertDto {
    alertType: string;
    level: string;
    title: string;
    content: string;
    storeId?: number;
    deviceId?: number;
    inventoryId?: number;
    relatedData?: string;
}
export declare class BatchAcknowledgeAlertDto {
    alertIds: number[];
    remark?: string;
}
export declare class AlertStatsQueryDto {
    startDate?: string;
    endDate?: string;
    storeId?: number;
    merchantId?: number;
    alertType?: string;
    level?: string;
}
