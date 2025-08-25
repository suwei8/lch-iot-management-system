import { Device } from '../../device/entities/device.entity';
import { Order } from '../../order/entities/order.entity';
import { Store } from '../../store/entities/store.entity';
export declare class Merchant {
    id: number;
    name: string;
    code: string;
    contact: string;
    phone: string;
    address: string;
    longitude: number;
    latitude: number;
    status: string;
    shareRatio: number;
    description: string;
    businessHours: string;
    createdAt: Date;
    updatedAt: Date;
    devices: Device[];
    orders: Order[];
    stores: Store[];
}
