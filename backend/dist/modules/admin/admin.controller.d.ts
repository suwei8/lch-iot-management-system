import { AdminService } from './admin.service';
import { PaginationDto, UserQueryDto, MerchantQueryDto, StoreQueryDto, DeviceQueryDto, OrderQueryDto, InventoryQueryDto, AlertQueryDto } from './dto/pagination.dto';
import { UpdateUserDto, CreateMerchantDto, UpdateMerchantDto, CreateStoreDto, UpdateStoreDto, CreateDeviceDto, UpdateDeviceDto, UpdateOrderDto, UpdateInventoryDto, AcknowledgeAlertDto, ExportDataDto } from './dto/create-update.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
    getUserGrowthTrend(): Promise<any[]>;
    getOrderTrend(): Promise<any[]>;
    getDeviceUsageStats(): Promise<any[]>;
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
    getSystemLogs(query: PaginationDto): Promise<{
        data: import("../audit/entities/audit-log.entity").AuditLog[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    clearCache(req: any, ip: string): Promise<{
        message: string;
    }>;
    getUsers(query: UserQueryDto): Promise<{
        data: import("../user/entities/user.entity").User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUserById(id: number): Promise<import("../user/entities/user.entity").User>;
    updateUser(id: number, updateUserDto: UpdateUserDto, req: any, ip: string): Promise<import("../user/entities/user.entity").User>;
    deleteUser(id: number, req: any, ip: string): Promise<{
        message: string;
    }>;
    createMerchant(createMerchantDto: CreateMerchantDto, req: any, ip: string): Promise<import("../merchant/entities/merchant.entity").Merchant>;
    getMerchants(query: MerchantQueryDto): Promise<{
        data: import("../merchant/entities/merchant.entity").Merchant[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getMerchantById(id: number): Promise<import("../merchant/entities/merchant.entity").Merchant>;
    updateMerchant(id: number, updateMerchantDto: UpdateMerchantDto, req: any, ip: string): Promise<import("../merchant/entities/merchant.entity").Merchant>;
    deleteMerchant(id: number, req: any, ip: string): Promise<{
        message: string;
    }>;
    createStore(createStoreDto: CreateStoreDto, req: any, ip: string): Promise<import("../store/entities/store.entity").Store>;
    getStores(query: StoreQueryDto): Promise<{
        data: import("../store/entities/store.entity").Store[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getStoreById(id: number): Promise<import("../store/entities/store.entity").Store>;
    updateStore(id: number, updateStoreDto: UpdateStoreDto, req: any, ip: string): Promise<import("../store/entities/store.entity").Store>;
    deleteStore(id: number, req: any, ip: string): Promise<{
        message: string;
    }>;
    createDevice(createDeviceDto: CreateDeviceDto, req: any, ip: string): Promise<import("../device/entities/device.entity").Device>;
    getDevices(query: DeviceQueryDto): Promise<{
        data: import("../device/entities/device.entity").Device[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getDeviceById(id: number): Promise<import("../device/entities/device.entity").Device>;
    updateDevice(id: number, updateDeviceDto: UpdateDeviceDto, req: any, ip: string): Promise<import("../device/entities/device.entity").Device>;
    deleteDevice(id: number, req: any, ip: string): Promise<{
        message: string;
    }>;
    getDeviceLogs(id: number, query: PaginationDto): Promise<{
        data: import("../device/entities/device-log.entity").DeviceLog[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getOrders(query: OrderQueryDto): Promise<{
        data: import("../order/entities/order.entity").Order[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getOrderById(id: number): Promise<import("../order/entities/order.entity").Order>;
    updateOrder(id: number, updateOrderDto: UpdateOrderDto, req: any, ip: string): Promise<import("../order/entities/order.entity").Order>;
    getInventory(query: InventoryQueryDto): Promise<{
        data: import("../inventory/entities/inventory.entity").Inventory[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateInventory(id: number, updateInventoryDto: UpdateInventoryDto, req: any, ip: string): Promise<import("../inventory/entities/inventory.entity").Inventory>;
    getAlerts(query: AlertQueryDto): Promise<{
        data: import("../alert/entities/alert.entity").Alert[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    acknowledgeAlert(id: number, acknowledgeAlertDto: AcknowledgeAlertDto, req: any, ip: string): Promise<import("../alert/entities/alert.entity").Alert>;
    exportData(exportDataDto: ExportDataDto, req: any, ip: string): Promise<{
        data: any[];
        filename: string;
        total: number;
    }>;
}
