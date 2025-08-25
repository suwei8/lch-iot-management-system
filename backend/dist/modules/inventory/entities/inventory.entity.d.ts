import { Store } from '../../store/entities/store.entity';
export declare class Inventory {
    id: number;
    itemName: string;
    itemType: string;
    currentStock: number;
    minThreshold: number;
    maxCapacity: number;
    unit: string;
    unitPrice: number;
    supplier: string;
    status: string;
    lastRestockAt: Date;
    remark: string;
    createdAt: Date;
    updatedAt: Date;
    storeId: number;
    store: Store;
}
