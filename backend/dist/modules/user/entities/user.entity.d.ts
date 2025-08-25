import { Order } from '../../order/entities/order.entity';
import { Store } from '../../store/entities/store.entity';
import { AuditLog } from '../../audit/entities/audit-log.entity';
import { UserRole } from '../../../common/decorators/roles.decorator';
export declare class User {
    id: number;
    phone: string;
    password: string;
    role: UserRole;
    nickname: string;
    avatar: string;
    balance: number;
    status: string;
    storeId: number;
    staffRole: string;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
    orders: Order[];
    store: Store;
    auditLogs: AuditLog[];
}
