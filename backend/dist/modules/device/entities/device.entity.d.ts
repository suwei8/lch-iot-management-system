import { Merchant } from '../../merchant/entities/merchant.entity';
import { Order } from '../../order/entities/order.entity';
import { DeviceLog } from './device-log.entity';
import { Store } from '../../store/entities/store.entity';
export declare class Device {
    id: number;
    devid: string;
    name: string;
    model: string;
    status: string;
    iccid: string;
    config: any;
    location: string;
    longitude: number;
    latitude: number;
    lastOnlineAt: Date;
    lastOfflineAt: Date;
    version: string;
    createdAt: Date;
    updatedAt: Date;
    merchantId: number;
    storeId: number;
    merchant: Merchant;
    store: Store;
    orders: Order[];
    logs: DeviceLog[];
}
