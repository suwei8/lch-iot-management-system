import { Repository, DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../../common/decorators/roles.decorator';
import { Device } from '../device/entities/device.entity';
import { Order } from '../order/entities/order.entity';
import { Merchant } from './entities/merchant.entity';
import { Store } from '../store/entities/store.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Alert } from '../alert/entities/alert.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { DeviceLog } from '../device/entities/device-log.entity';
import { RedisService } from '../../config/redis.config';
import { StoreQueryDto, DeviceQueryDto, OrderQueryDto, InventoryQueryDto, AlertQueryDto, UserQueryDto, ReportQueryDto } from './dto/pagination.dto';
import { UpdateMerchantProfileDto, CreateStoreDto, UpdateStoreDto, CreateDeviceDto, UpdateDeviceDto, CreateStaffDto, UpdateStaffDto, UpdateInventoryDto, AcknowledgeAlertDto } from './dto/create-update.dto';
export declare class MerchantService {
    private userRepository;
    private deviceRepository;
    private orderRepository;
    private merchantRepository;
    private storeRepository;
    private inventoryRepository;
    private alertRepository;
    private auditLogRepository;
    private deviceLogRepository;
    private redisService;
    private dataSource;
    constructor(userRepository: Repository<User>, deviceRepository: Repository<Device>, orderRepository: Repository<Order>, merchantRepository: Repository<Merchant>, storeRepository: Repository<Store>, inventoryRepository: Repository<Inventory>, alertRepository: Repository<Alert>, auditLogRepository: Repository<AuditLog>, deviceLogRepository: Repository<DeviceLog>, redisService: RedisService, dataSource: DataSource);
    getDashboardStats(merchantId: number): Promise<{
        stores: {
            total: number;
            active: number;
        };
        devices: {
            total: number;
            online: number;
            onlineRate: string;
        };
        today: {
            orders: number;
            revenue: number;
        };
        alerts: {
            pending: number;
        };
    }>;
    getMerchantProfile(merchantId: number): Promise<Merchant>;
    updateMerchantProfile(merchantId: number, updateData: UpdateMerchantProfileDto, operatorId: number, clientIp: string): Promise<Merchant>;
    getStores(merchantId: number, query: StoreQueryDto): Promise<{
        data: Store[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getStoreById(merchantId: number, storeId: number): Promise<Store>;
    createStore(merchantId: number, createData: CreateStoreDto, operatorId: number, clientIp: string): Promise<Store>;
    updateStore(merchantId: number, storeId: number, updateData: UpdateStoreDto, operatorId: number, clientIp: string): Promise<Store>;
    deleteStore(merchantId: number, storeId: number, operatorId: number, clientIp: string): Promise<{
        message: string;
    }>;
    getDevices(merchantId: number, query: DeviceQueryDto): Promise<{
        data: Device[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getDeviceById(merchantId: number, deviceId: number): Promise<Device>;
    createDevice(merchantId: number, createData: CreateDeviceDto, operatorId: number, clientIp: string): Promise<Device>;
    updateDevice(merchantId: number, deviceId: number, updateData: UpdateDeviceDto, operatorId: number, clientIp: string): Promise<Device>;
    deleteDevice(merchantId: number, deviceId: number, operatorId: number, clientIp: string): Promise<{
        message: string;
    }>;
    getDeviceLogs(merchantId: number, deviceId: number, query: any): Promise<{
        data: DeviceLog[];
        total: number;
        page: any;
        limit: any;
        totalPages: number;
    }>;
    getOrders(merchantId: number, query: OrderQueryDto): Promise<{
        data: Order[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getOrderById(merchantId: number, orderId: number): Promise<Order>;
    getInventory(merchantId: number, query: InventoryQueryDto): Promise<{
        data: Inventory[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateInventory(merchantId: number, inventoryId: number, updateData: UpdateInventoryDto, operatorId: number, clientIp: string): Promise<Inventory>;
    getAlerts(merchantId: number, query: AlertQueryDto): Promise<{
        data: Alert[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    acknowledgeAlert(merchantId: number, alertId: number, acknowledgeData: AcknowledgeAlertDto, operatorId: number, clientIp: string): Promise<Alert>;
    getStaff(merchantId: number, query: UserQueryDto): Promise<{
        data: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    createStaff(merchantId: number, storeId: number, createData: CreateStaffDto, operatorId: number, clientIp: string): Promise<{
        id: number;
        phone: string;
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
    }>;
    updateStaff(merchantId: number, staffId: number, updateData: UpdateStaffDto, operatorId: number, clientIp: string): Promise<User>;
    deleteStaff(merchantId: number, staffId: number, operatorId: number, clientIp: string): Promise<{
        message: string;
    }>;
    getReports(merchantId: number, query: ReportQueryDto): Promise<{
        orderStats: any[];
        revenueStats: any[];
        deviceStats: any[];
        summary?: undefined;
    } | {
        orderStats: any[];
        deviceStats: any[];
        summary: {
            totalOrders: any;
            totalRevenue: any;
            totalDevices: any;
        };
        revenueStats?: undefined;
    }>;
}
