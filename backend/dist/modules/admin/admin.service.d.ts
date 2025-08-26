import { Repository, DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Merchant } from '../merchant/entities/merchant.entity';
import { Store } from '../store/entities/store.entity';
import { Device } from '../device/entities/device.entity';
import { Order } from '../order/entities/order.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Alert } from '../alert/entities/alert.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { DeviceLog } from '../device/entities/device-log.entity';
import { PaginationDto, UserQueryDto, MerchantQueryDto, StoreQueryDto, DeviceQueryDto, OrderQueryDto, InventoryQueryDto, AlertQueryDto } from './dto/pagination.dto';
import { CreateMerchantDto, UpdateMerchantDto, CreateStoreDto, UpdateStoreDto, CreateDeviceDto, UpdateDeviceDto, UpdateUserDto, UpdateOrderDto, UpdateInventoryDto, AcknowledgeAlertDto, ExportDataDto } from './dto/create-update.dto';
import { RedisService } from '../../config/redis.config';
export declare class AdminService {
    private userRepository;
    private merchantRepository;
    private storeRepository;
    private deviceRepository;
    private orderRepository;
    private inventoryRepository;
    private alertRepository;
    private auditLogRepository;
    private deviceLogRepository;
    private dataSource;
    private redisService;
    constructor(userRepository: Repository<User>, merchantRepository: Repository<Merchant>, storeRepository: Repository<Store>, deviceRepository: Repository<Device>, orderRepository: Repository<Order>, inventoryRepository: Repository<Inventory>, alertRepository: Repository<Alert>, auditLogRepository: Repository<AuditLog>, deviceLogRepository: Repository<DeviceLog>, dataSource: DataSource, redisService: RedisService);
    getDashboardStats(): Promise<{
        totalMerchants: number;
        totalUsers: number;
        totalStores: number;
        totalDevices: number;
        totalOrders: number;
        totalRevenue: number;
        todayOrders: number;
        todayRevenue: number;
        onlineDevices: number;
        offlineDevices: number;
        maintenanceDevices: number;
        activeDevices: number;
        totalDataCount: number;
        todayDataCount: number;
        todayDataRecords: number;
        todayAlerts: number;
        deviceStatusDistribution: {
            online: number;
            offline: number;
            maintenance: number;
        };
        merchantStatusDistribution: {
            active: number;
            inactive: number;
            pending: number;
        };
        systemStats: {
            cpuUsage: number;
            memoryUsage: number;
            diskUsage: number;
        };
    }>;
    getUserTrend(days?: number): Promise<any[]>;
    getOrderTrend(days?: number): Promise<any[]>;
    getDeviceUsage(): Promise<any[]>;
    getUsers(query: UserQueryDto): Promise<{
        data: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUserById(id: number): Promise<User>;
    updateUser(id: number, updateUserDto: UpdateUserDto, operatorId: number, ip: string): Promise<User>;
    deleteUser(id: number, operatorId: number, ip: string): Promise<{
        message: string;
    }>;
    createMerchant(createMerchantDto: CreateMerchantDto, operatorId: number, ip: string): Promise<Merchant>;
    getMerchants(query: MerchantQueryDto): Promise<{
        data: Merchant[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getMerchantById(id: number): Promise<Merchant>;
    updateMerchant(id: number, updateMerchantDto: UpdateMerchantDto, operatorId: number, ip: string): Promise<Merchant>;
    deleteMerchant(id: number, operatorId: number, ip: string): Promise<{
        message: string;
    }>;
    createStore(createStoreDto: CreateStoreDto, operatorId: number, ip: string): Promise<Store>;
    getStores(query: StoreQueryDto): Promise<{
        data: Store[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getStoreById(id: number): Promise<Store>;
    updateStore(id: number, updateStoreDto: UpdateStoreDto, operatorId: number, ip: string): Promise<Store>;
    deleteStore(id: number, operatorId: number, ip: string): Promise<{
        message: string;
    }>;
    createDevice(createDeviceDto: CreateDeviceDto, operatorId: number, ip: string): Promise<Device>;
    getDevices(query: DeviceQueryDto): Promise<{
        data: Device[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getDeviceById(id: number): Promise<Device>;
    updateDevice(id: number, updateDeviceDto: UpdateDeviceDto, operatorId: number, ip: string): Promise<Device>;
    deleteDevice(id: number, operatorId: number, ip: string): Promise<{
        message: string;
    }>;
    getDeviceLogs(deviceId: number, query: PaginationDto): Promise<{
        data: DeviceLog[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getOrders(query: OrderQueryDto): Promise<{
        data: Order[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getOrderById(id: number): Promise<Order>;
    updateOrder(id: number, updateOrderDto: UpdateOrderDto, operatorId: number, ip: string): Promise<Order>;
    getInventory(query: InventoryQueryDto): Promise<{
        data: Inventory[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateInventory(id: number, updateInventoryDto: UpdateInventoryDto, operatorId: number, ip: string): Promise<Inventory>;
    private createLowStockAlert;
    getAlerts(query: AlertQueryDto): Promise<{
        data: Alert[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    acknowledgeAlert(id: number, acknowledgeAlertDto: AcknowledgeAlertDto, operatorId: number, ip: string): Promise<Alert>;
    getSystemHealth(): Promise<{
        database: {
            status: string;
            message: string;
            details: any;
        };
        redis: {
            status: string;
            message: string;
            details: any;
        };
        timestamp: string;
    }>;
    private checkDatabaseHealth;
    private checkRedisHealth;
    getSystemLogs(query: PaginationDto): Promise<{
        data: AuditLog[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    clearCache(operatorId: number, ip: string): Promise<{
        message: string;
    }>;
    exportData(exportDataDto: ExportDataDto, operatorId: number, ip: string): Promise<{
        data: any[];
        filename: string;
        total: number;
    }>;
    private exportUsers;
    private exportOrders;
    private exportDevices;
    private createAuditLog;
}
