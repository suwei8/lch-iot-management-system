import { Store } from '../../store/entities/store.entity';
import { Device } from '../../device/entities/device.entity';
import { User } from '../../user/entities/user.entity';
export declare class Alert {
    id: number;
    type: string;
    level: string;
    title: string;
    content: string;
    status: string;
    metadata: any;
    acknowledgedAt: Date;
    acknowledgedBy: number;
    resolution: string;
    resolvedAt: Date;
    remark: string;
    createdAt: Date;
    updatedAt: Date;
    storeId: number;
    deviceId: number;
    handlerId: number;
    store: Store;
    device: Device;
    handler: User;
}
