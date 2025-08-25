export declare class UpdateMerchantProfileDto {
    name?: string;
    description?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    district?: string;
    logo?: string;
    businessLicense?: string;
    legalPerson?: string;
}
export declare class CreateStoreDto {
    name: string;
    description?: string;
    address: string;
    city: string;
    district: string;
    postalCode?: string;
    phone?: string;
    manager?: string;
    businessHours?: string;
    latitude?: number;
    longitude?: number;
}
export declare class UpdateStoreDto {
    name?: string;
    description?: string;
    address?: string;
    city?: string;
    district?: string;
    postalCode?: string;
    phone?: string;
    manager?: string;
    businessHours?: string;
    latitude?: number;
    longitude?: number;
    status?: string;
}
export declare class CreateDeviceDto {
    devid: string;
    name: string;
    model: string;
    description?: string;
    storeId: number;
    location?: string;
    serialNumber?: string;
    firmwareVersion?: string;
}
export declare class UpdateDeviceDto {
    name?: string;
    description?: string;
    storeId?: number;
    location?: string;
    serialNumber?: string;
    firmwareVersion?: string;
    status?: string;
}
export declare class CreateStaffDto {
    phone: string;
    password: string;
    nickname?: string;
    staffRole: string;
    avatar?: string;
}
export declare class UpdateStaffDto {
    nickname?: string;
    staffRole?: string;
    avatar?: string;
    status?: string;
}
export declare class UpdateInventoryDto {
    itemName?: string;
    itemCode?: string;
    category?: string;
    unit?: string;
    currentStock?: number;
    minStock?: number;
    maxStock?: number;
    unitPrice?: number;
    description?: string;
}
export declare class AcknowledgeAlertDto {
    resolution?: string;
}
export declare class ReportQueryDto {
    reportType: string;
    startDate: string;
    endDate: string;
    storeId?: number;
    timeDimension?: string;
}
export declare class InventoryOperationDto {
    operationType: string;
    operationAmount: number;
    reason?: string;
    remark?: string;
}
export declare class ResetStaffPasswordDto {
    newPassword: string;
}
export declare class BatchStaffOperationDto {
    staffIds: number[];
    operation: string;
}
