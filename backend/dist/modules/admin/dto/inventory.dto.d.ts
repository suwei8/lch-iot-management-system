export declare class CreateInventoryDto {
    itemName: string;
    itemCode: string;
    itemType: string;
    storeId: number;
    currentStock: number;
    minThreshold: number;
    maxCapacity: number;
    unit: string;
    unitPrice?: number;
    supplier?: string;
    remark?: string;
}
export declare class InventoryOperationDto {
    operationType: string;
    operationAmount: number;
    reason?: string;
    remark?: string;
}
export declare class BatchInventoryOperationDto {
    inventoryIds: number[];
    operationType: string;
    reason?: string;
    remark?: string;
}
