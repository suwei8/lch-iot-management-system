export declare class PaginationDto {
    page?: number;
    limit?: number;
}
export declare class StoreQueryDto extends PaginationDto {
    search?: string;
    status?: string;
    city?: string;
    district?: string;
}
export declare class DeviceQueryDto extends PaginationDto {
    search?: string;
    storeId?: number;
    status?: string;
    model?: string;
}
export declare class OrderQueryDto extends PaginationDto {
    search?: string;
    storeId?: number;
    status?: string;
    serviceType?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
}
export declare class InventoryQueryDto extends PaginationDto {
    search?: string;
    storeId?: number;
    lowStock?: boolean;
    category?: string;
}
export declare class AlertQueryDto extends PaginationDto {
    alertType?: string;
    level?: string;
    storeId?: number;
    acknowledged?: boolean;
}
export declare class StaffQueryDto extends PaginationDto {
    role?: string;
    status?: string;
    storeId?: number;
}
export declare class UserQueryDto extends PaginationDto {
    search?: string;
    staffRole?: string;
    status?: string;
}
export declare class ReportQueryDto extends PaginationDto {
    reportType?: string;
    startDate?: string;
    endDate?: string;
    storeId?: number;
    groupBy?: string;
}
