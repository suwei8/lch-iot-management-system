import { User } from '../../user/entities/user.entity';
import { Merchant } from '../../merchant/entities/merchant.entity';
import { Device } from '../../device/entities/device.entity';
import { Store } from '../../store/entities/store.entity';
export declare class Order {
    id: number;
    orderNo: string;
    amount: number;
    status: string;
    washType: string;
    duration: number;
    startTime: Date;
    endTime: Date;
    paidAt: Date;
    paymentMethod: string;
    paymentOrderNo: string;
    thirdPartyOrderNumber: string;
    remark: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    merchantId: number;
    deviceId: number;
    storeId: number;
    user: User;
    merchant: Merchant;
    device: Device;
    store: Store;
}
