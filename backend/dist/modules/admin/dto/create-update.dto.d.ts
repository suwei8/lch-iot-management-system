import { UserRole } from '../../../common/decorators/roles.decorator';
export declare class CreateMerchantDto {
    name: string;
    code: string;
    contact: string;
    phone: string;
    address: string;
    longitude?: number;
    latitude?: number;
    shareRatio?: number;
    description?: string;
    businessHours?: string;
}
export declare class UpdateMerchantDto {
    name?: string;
    contact?: string;
    phone?: string;
    address?: string;
    longitude?: number;
    latitude?: number;
    status?: string;
    shareRatio?: number;
    description?: string;
    businessHours?: string;
}
export declare class CreateStoreDto {
    name: string;
    code: string;
    address: string;
    contact: string;
    phone: string;
    merchantId: number;
    longitude?: number;
    latitude?: number;
    businessHours?: string;
    description?: string;
    basicPrice?: number;
    premiumPrice?: number;
    deluxePrice?: number;
}
export declare class UpdateStoreDto {
    name?: string;
    address?: string;
    contact?: string;
    phone?: string;
    longitude?: number;
    latitude?: number;
    status?: string;
    businessHours?: string;
    description?: string;
    basicPrice?: number;
    premiumPrice?: number;
    deluxePrice?: number;
}
export declare class CreateDeviceDto {
    devid: string;
    name: string;
    storeId: number;
    model?: string;
    iccid?: string;
    location?: string;
    longitude?: number;
    latitude?: number;
    config?: string;
}
export declare class UpdateDeviceDto {
    name?: string;
    model?: string;
    status?: string;
    iccid?: string;
    location?: string;
    longitude?: number;
    latitude?: number;
    storeId?: number;
    config?: string;
    version?: string;
}
export declare class UpdateUserDto {
    nickname?: string;
    role?: UserRole;
    status?: string;
    balance?: number;
    storeId?: number;
    staffRole?: string;
}
export declare class UpdateOrderDto {
    status?: string;
    remark?: string;
    refundReason?: string;
}
export declare class UpdateInventoryDto {
    currentStock?: number;
    minThreshold?: number;
    maxCapacity?: number;
    unitPrice?: number;
    supplier?: string;
    status?: string;
    remark?: string;
    operationType?: string;
    operationAmount?: number;
}
export declare class AcknowledgeAlertDto {
    resolution: string;
    remark?: string;
}
export declare class ExportDataDto {
    type: string;
    format?: string;
    startDate?: string;
    endDate?: string;
    merchantId?: number;
    storeId?: number;
}
