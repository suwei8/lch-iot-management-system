import { UserRole } from '../../common/decorators/roles.decorator';
import { MerchantService } from './merchant.service';
import { StoreQueryDto, DeviceQueryDto, OrderQueryDto, InventoryQueryDto, AlertQueryDto, PaginationDto, UserQueryDto } from './dto/pagination.dto';
import { CreateStoreDto, UpdateStoreDto, CreateDeviceDto, UpdateDeviceDto, UpdateInventoryDto, AcknowledgeAlertDto, CreateStaffDto, UpdateStaffDto, UpdateMerchantProfileDto } from './dto/create-update.dto';
export declare class MerchantController {
    private readonly merchantService;
    constructor(merchantService: MerchantService);
    getDashboard(req: any): Promise<{
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
    getProfile(req: any): Promise<import("./entities/merchant.entity").Merchant>;
    updateProfile(updateProfileDto: UpdateMerchantProfileDto, req: any, ip: string): Promise<import("./entities/merchant.entity").Merchant>;
    getStores(query: StoreQueryDto, req: any): Promise<{
        data: import("../store/entities/store.entity").Store[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    createStore(createStoreDto: CreateStoreDto, req: any, ip: string): Promise<import("../store/entities/store.entity").Store>;
    getStoreById(id: number, req: any): Promise<import("../store/entities/store.entity").Store>;
    updateStore(id: number, updateStoreDto: UpdateStoreDto, req: any, ip: string): Promise<import("../store/entities/store.entity").Store>;
    getStoreStaff(storeId: number, query: UserQueryDto, req: any): Promise<{
        data: import("../user/entities/user.entity").User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    createStoreStaff(storeId: number, createStaffDto: CreateStaffDto, req: any, ip: string): Promise<{
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
        orders: import("../order/entities/order.entity").Order[];
        store: import("../store/entities/store.entity").Store;
        auditLogs: import("../audit/entities/audit-log.entity").AuditLog[];
    }>;
    updateStaff(staffId: number, updateStaffDto: UpdateStaffDto, req: any, ip: string): Promise<import("../user/entities/user.entity").User>;
    deleteStaff(staffId: number, req: any, ip: string): Promise<{
        message: string;
    }>;
    getDevices(query: DeviceQueryDto, req: any): Promise<{
        data: import("../device/entities/device.entity").Device[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    createDevice(createDeviceDto: CreateDeviceDto, req: any, ip: string): Promise<import("../device/entities/device.entity").Device>;
    getDeviceById(id: number, req: any): Promise<import("../device/entities/device.entity").Device>;
    updateDevice(id: number, updateDeviceDto: UpdateDeviceDto, req: any, ip: string): Promise<import("../device/entities/device.entity").Device>;
    getDeviceLogs(id: number, query: PaginationDto, req: any): Promise<{
        data: import("../device/entities/device-log.entity").DeviceLog[];
        total: number;
        page: any;
        limit: any;
        totalPages: number;
    }>;
    getOrders(query: OrderQueryDto, req: any): Promise<{
        data: import("../order/entities/order.entity").Order[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getOrderById(id: number, req: any): Promise<import("../order/entities/order.entity").Order>;
    getOrderReports(query: any, req: any): Promise<{
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
    getRevenueReports(query: any, req: any): Promise<{
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
    getInventory(query: InventoryQueryDto, req: any): Promise<{
        data: import("../inventory/entities/inventory.entity").Inventory[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateInventory(id: number, updateInventoryDto: UpdateInventoryDto, req: any, ip: string): Promise<import("../inventory/entities/inventory.entity").Inventory>;
    getAlerts(query: AlertQueryDto, req: any): Promise<{
        data: import("../alert/entities/alert.entity").Alert[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    acknowledgeAlert(id: number, acknowledgeAlertDto: AcknowledgeAlertDto, req: any, ip: string): Promise<import("../alert/entities/alert.entity").Alert>;
}
