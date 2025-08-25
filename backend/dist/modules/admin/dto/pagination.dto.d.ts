export declare class PaginationDto {
    page?: number;
    limit?: number;
    query?: string;
}
export declare class UserQueryDto extends PaginationDto {
    role?: string;
    status?: string;
    search?: string;
}
export declare class MerchantQueryDto extends PaginationDto {
    status?: string;
    search?: string;
}
export declare class StoreQueryDto extends PaginationDto {
    merchantId?: number;
    status?: string;
    search?: string;
}
export declare class DeviceQueryDto extends PaginationDto {
    storeId?: number;
    status?: string;
    search?: string;
}
export declare class OrderQueryDto extends PaginationDto {
    merchantId?: number;
    storeId?: number;
    status?: string;
    search?: string;
}
export declare class InventoryQueryDto extends PaginationDto {
    storeId?: number;
    type?: string;
    status?: string;
    search?: string;
    lowStock?: boolean;
}
export declare class AlertQueryDto extends PaginationDto {
    storeId?: number;
    type?: string;
    status?: string;
    level?: string;
}
