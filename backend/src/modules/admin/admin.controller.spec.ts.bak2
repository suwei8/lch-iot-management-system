import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import {
  UserQueryDto,
  MerchantQueryDto,
  StoreQueryDto,
  DeviceQueryDto,
  OrderQueryDto,
  InventoryQueryDto,
  AlertQueryDto,
  PaginationDto,
} from './dto/pagination.dto';
import {
  UpdateUserDto,
  CreateMerchantDto,
  UpdateMerchantDto,
  CreateStoreDto,
  UpdateStoreDto,
  CreateDeviceDto,
  UpdateOrderDto,
  UpdateInventoryDto,
  AcknowledgeAlertDto,
  ExportDataDto,
} from './dto/create-update.dto';

describe('AdminController', () => {
  let controller: AdminController;
  let adminService: AdminService;

  const mockAdminService = {
    getDashboardStats: jest.fn(),
    getUserTrend: jest.fn(),
    getOrderTrend: jest.fn(),
    getDeviceUsage: jest.fn(),
    getSystemHealth: jest.fn(),
    getSystemLogs: jest.fn(),
    clearCache: jest.fn(),
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    createMerchant: jest.fn(),
    getMerchants: jest.fn(),
    getMerchantById: jest.fn(),
    updateMerchant: jest.fn(),
    deleteMerchant: jest.fn(),
    createStore: jest.fn(),
    getStores: jest.fn(),
    getStoreById: jest.fn(),
    updateStore: jest.fn(),
    deleteStore: jest.fn(),
    createDevice: jest.fn(),
    getDevices: jest.fn(),
    getDeviceById: jest.fn(),
    updateDevice: jest.fn(),
    deleteDevice: jest.fn(),
    getDeviceLogs: jest.fn(),
    getOrders: jest.fn(),
    getOrderById: jest.fn(),
    updateOrder: jest.fn(),
    getInventory: jest.fn(),
    updateInventory: jest.fn(),
    getAlerts: jest.fn(),
    acknowledgeAlert: jest.fn(),
    exportData: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRolesGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockPermissionsGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRequest = {
    user: { id: 1, role: 'platform_admin' },
  };

  const mockIp = '127.0.0.1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .overrideGuard(PermissionsGuard)
      .useValue(mockPermissionsGuard)
      .compile();

    controller = module.get<AdminController>(AdminController);
    adminService = module.get<AdminService>(AdminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Dashboard APIs', () => {
    describe('getDashboardStats', () => {
      it('should return dashboard statistics', async () => {
        const mockStats = {
          userCount: 100,
          merchantCount: 20,
          storeCount: 50,
          deviceCount: 30,
          orderCount: 500,
          totalRevenue: 15000,
          todayOrderCount: 10,
          todayRevenue: 300,
          onlineDeviceCount: 25,
          deviceOnlineRate: '83.33',
        };

        mockAdminService.getDashboardStats.mockResolvedValue(mockStats);

        const result = await controller.getDashboardStats();

        expect(adminService.getDashboardStats).toHaveBeenCalled();
        expect(result).toEqual(mockStats);
      });
    });

    describe('getUserGrowthTrend', () => {
      it('should return user growth trend', async () => {
        const mockTrend = [
          { date: '2023-12-01', count: '5' },
          { date: '2023-12-02', count: '8' },
        ];

        mockAdminService.getUserTrend.mockResolvedValue(mockTrend);

        const result = await controller.getUserGrowthTrend();

        expect(adminService.getUserTrend).toHaveBeenCalled();
        expect(result).toEqual(mockTrend);
      });
    });

    describe('getOrderTrend', () => {
      it('should return order trend', async () => {
        const mockTrend = [
          { date: '2023-12-01', orderCount: '10', revenue: 150 },
          { date: '2023-12-02', orderCount: '15', revenue: 225 },
        ];

        mockAdminService.getOrderTrend.mockResolvedValue(mockTrend);

        const result = await controller.getOrderTrend();

        expect(adminService.getOrderTrend).toHaveBeenCalled();
        expect(result).toEqual(mockTrend);
      });
    });

    describe('getDeviceUsageStats', () => {
      it('should return device usage statistics', async () => {
        const mockUsage = [
          {
            deviceId: '1',
            deviceName: '设备1',
            storeName: '门店1',
            orderCount: 25,
            status: 'online',
          },
        ];

        mockAdminService.getDeviceUsage.mockResolvedValue(mockUsage);

        const result = await controller.getDeviceUsageStats();

        expect(adminService.getDeviceUsage).toHaveBeenCalled();
        expect(result).toEqual(mockUsage);
      });
    });
  });

  describe('System APIs', () => {
    describe('getSystemHealth', () => {
      it('should return system health status', async () => {
        const mockHealth = {
          status: 'healthy',
          database: 'connected',
          redis: 'connected',
          uptime: 3600,
        };

        mockAdminService.getSystemHealth.mockResolvedValue(mockHealth);

        const result = await controller.getSystemHealth();

        expect(adminService.getSystemHealth).toHaveBeenCalled();
        expect(result).toEqual(mockHealth);
      });
    });

    describe('getSystemLogs', () => {
      it('should return system logs', async () => {
        const query: PaginationDto = { page: 1, limit: 10 };
        const mockLogs = {
          data: [{ id: 1, message: 'System started', timestamp: new Date() }],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        };

        mockAdminService.getSystemLogs.mockResolvedValue(mockLogs);

        const result = await controller.getSystemLogs(query);

        expect(adminService.getSystemLogs).toHaveBeenCalledWith(query);
        expect(result).toEqual(mockLogs);
      });
    });

    describe('clearCache', () => {
      it('should clear system cache', async () => {
        const mockResult = { success: true, message: '缓存清理成功' };

        mockAdminService.clearCache.mockResolvedValue(mockResult);

        const result = await controller.clearCache(mockRequest, mockIp);

        expect(adminService.clearCache).toHaveBeenCalledWith(1, mockIp);
        expect(result).toEqual(mockResult);
      });
    });
  });

  describe('User Management APIs', () => {
    describe('getUsers', () => {
      it('should return paginated users', async () => {
        const query: UserQueryDto = {
          page: 1,
          limit: 10,
          search: '138',
          role: 'user',
          status: 'active',
        };
        const mockUsers = {
          data: [{ id: 1, phone: '13800138000', nickname: '测试用户' }],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        };

        mockAdminService.getUsers.mockResolvedValue(mockUsers);

        const result = await controller.getUsers(query);

        expect(adminService.getUsers).toHaveBeenCalledWith(query);
        expect(result).toEqual(mockUsers);
      });
    });

    describe('getUserById', () => {
      it('should return user by id', async () => {
        const mockUser = { id: 1, phone: '13800138000', nickname: '测试用户' };

        mockAdminService.getUserById.mockResolvedValue(mockUser);

        const result = await controller.getUserById(1);

        expect(adminService.getUserById).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockUser);
      });
    });

    describe('updateUser', () => {
      it('should update user successfully', async () => {
        const updateUserDto: UpdateUserDto = {
          nickname: '新昵称',
          status: 'active',
        };
        const mockUpdatedUser = { id: 1, nickname: '新昵称', status: 'active' };

        mockAdminService.updateUser.mockResolvedValue(mockUpdatedUser);

        const result = await controller.updateUser(1, updateUserDto, mockRequest, mockIp);

        expect(adminService.updateUser).toHaveBeenCalledWith(1, updateUserDto, 1, mockIp);
        expect(result).toEqual(mockUpdatedUser);
      });
    });

    describe('deleteUser', () => {
      it('should delete user successfully', async () => {
        const mockResult = { success: true, message: '用户删除成功' };

        mockAdminService.deleteUser.mockResolvedValue(mockResult);

        const result = await controller.deleteUser(1, mockRequest, mockIp);

        expect(adminService.deleteUser).toHaveBeenCalledWith(1, 1, mockIp);
        expect(result).toEqual(mockResult);
      });
    });
  });

  describe('Merchant Management APIs', () => {
    describe('createMerchant', () => {
      it('should create merchant successfully', async () => {
        const createMerchantDto: CreateMerchantDto = {
          name: '测试商户',
          code: 'TEST001',
          contact: '张三',
          phone: '13800138000',
          address: '测试地址123号',
        };
        const mockMerchant = { id: 1, ...createMerchantDto };

        mockAdminService.createMerchant.mockResolvedValue(mockMerchant);

        const result = await controller.createMerchant(createMerchantDto, mockRequest, mockIp);

        expect(adminService.createMerchant).toHaveBeenCalledWith(createMerchantDto, 1, mockIp);
        expect(result).toEqual(mockMerchant);
      });
    });

    describe('getMerchants', () => {
      it('should return paginated merchants', async () => {
        const query: MerchantQueryDto = { page: 1, limit: 10 };
        const mockMerchants = {
          data: [{ id: 1, name: '测试商户' }],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        };

        mockAdminService.getMerchants.mockResolvedValue(mockMerchants);

        const result = await controller.getMerchants(query);

        expect(adminService.getMerchants).toHaveBeenCalledWith(query);
        expect(result).toEqual(mockMerchants);
      });
    });

    describe('updateMerchant', () => {
      it('should update merchant successfully', async () => {
        const updateMerchantDto: UpdateMerchantDto = {
          name: '更新商户名',
          status: 'active',
        };
        const mockUpdatedMerchant = { id: 1, ...updateMerchantDto };

        mockAdminService.updateMerchant.mockResolvedValue(mockUpdatedMerchant);

        const result = await controller.updateMerchant(1, updateMerchantDto, mockRequest, mockIp);

        expect(adminService.updateMerchant).toHaveBeenCalledWith(1, updateMerchantDto, 1, mockIp);
        expect(result).toEqual(mockUpdatedMerchant);
      });
    });
  });

  describe('Store Management APIs', () => {
    describe('createStore', () => {
      it('should create store successfully', async () => {
        const createStoreDto: CreateStoreDto = {
          name: '测试门店',
          code: 'STORE001',
          address: '测试地址',
          contact: '李四',
          phone: '13800138001',
          merchantId: 1,
        };
        const mockStore = { id: 1, ...createStoreDto };

        mockAdminService.createStore.mockResolvedValue(mockStore);

        const result = await controller.createStore(createStoreDto, mockRequest, mockIp);

        expect(adminService.createStore).toHaveBeenCalledWith(createStoreDto, 1, mockIp);
        expect(result).toEqual(mockStore);
      });
    });

    describe('getStores', () => {
      it('should return paginated stores', async () => {
        const query: StoreQueryDto = { page: 1, limit: 10 };
        const mockStores = {
          data: [{ id: 1, name: '测试门店' }],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        };

        mockAdminService.getStores.mockResolvedValue(mockStores);

        const result = await controller.getStores(query);

        expect(adminService.getStores).toHaveBeenCalledWith(query);
        expect(result).toEqual(mockStores);
      });
    });
  });

  describe('Device Management APIs', () => {
    describe('createDevice', () => {
      it('should create device successfully', async () => {
        const createDeviceDto: CreateDeviceDto = {
            devid: 'DEV001',
            name: '测试设备',
            storeId: 1,
          };
        const mockDevice = { id: 1, ...createDeviceDto };

        mockAdminService.createDevice.mockResolvedValue(mockDevice);

        const result = await controller.createDevice(createDeviceDto, mockRequest, mockIp);

        expect(adminService.createDevice).toHaveBeenCalledWith(createDeviceDto, 1, mockIp);
        expect(result).toEqual(mockDevice);
      });
    });

    describe('getDevices', () => {
      it('should return paginated devices', async () => {
        const query: DeviceQueryDto = { page: 1, limit: 10 };
        const mockDevices = {
          data: [{ id: 1, name: '测试设备' }],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        };

        mockAdminService.getDevices.mockResolvedValue(mockDevices);

        const result = await controller.getDevices(query);

        expect(adminService.getDevices).toHaveBeenCalledWith(query);
        expect(result).toEqual(mockDevices);
      });
    });

    describe('getDeviceLogs', () => {
      it('should return device logs', async () => {
        const query: PaginationDto = { page: 1, limit: 10 };
        const mockLogs = {
          data: [{ id: 1, action: '设备启动', timestamp: new Date() }],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        };

        mockAdminService.getDeviceLogs.mockResolvedValue(mockLogs);

        const result = await controller.getDeviceLogs(1, query);

        expect(adminService.getDeviceLogs).toHaveBeenCalledWith(1, query);
        expect(result).toEqual(mockLogs);
      });
    });
  });

  describe('Order Management APIs', () => {
    describe('getOrders', () => {
      it('should return paginated orders', async () => {
        const query: OrderQueryDto = { page: 1, limit: 10 };
        const mockOrders = {
          data: [{ id: 1, orderNumber: 'ORD001', status: 'completed' }],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        };

        mockAdminService.getOrders.mockResolvedValue(mockOrders);

        const result = await controller.getOrders(query);

        expect(adminService.getOrders).toHaveBeenCalledWith(query);
        expect(result).toEqual(mockOrders);
      });
    });

    describe('updateOrder', () => {
      it('should update order successfully', async () => {
        const updateOrderDto: UpdateOrderDto = {
          status: 'completed',
        };
        const mockUpdatedOrder = { id: 1, status: 'completed' };

        mockAdminService.updateOrder.mockResolvedValue(mockUpdatedOrder);

        const result = await controller.updateOrder(1, updateOrderDto, mockRequest, mockIp);

        expect(adminService.updateOrder).toHaveBeenCalledWith(1, updateOrderDto, 1, mockIp);
        expect(result).toEqual(mockUpdatedOrder);
      });
    });
  });

  describe('Inventory Management APIs', () => {
    describe('getInventory', () => {
      it('should return paginated inventory', async () => {
        const query: InventoryQueryDto = { page: 1, limit: 10 };
        const mockInventory = {
          data: [{ id: 1, itemName: '洗车液', quantity: 100 }],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        };

        mockAdminService.getInventory.mockResolvedValue(mockInventory);

        const result = await controller.getInventory(query);

        expect(adminService.getInventory).toHaveBeenCalledWith(query);
        expect(result).toEqual(mockInventory);
      });
    });

    describe('updateInventory', () => {
      it('should update inventory successfully', async () => {
          const updateInventoryDto: UpdateInventoryDto = {
            operationType: 'in',
            operationAmount: 150,
          };
        const mockUpdatedInventory = { id: 1, quantity: 150 };

        mockAdminService.updateInventory.mockResolvedValue(mockUpdatedInventory);

        const result = await controller.updateInventory(1, updateInventoryDto, mockRequest, mockIp);

        expect(adminService.updateInventory).toHaveBeenCalledWith(1, updateInventoryDto, 1, mockIp);
        expect(result).toEqual(mockUpdatedInventory);
      });
    });
  });

  describe('Alert Management APIs', () => {
    describe('getAlerts', () => {
      it('should return paginated alerts', async () => {
        const query: AlertQueryDto = { page: 1, limit: 10 };
        const mockAlerts = {
          data: [{ id: 1, type: 'device_offline', message: '设备离线' }],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        };

        mockAdminService.getAlerts.mockResolvedValue(mockAlerts);

        const result = await controller.getAlerts(query);

        expect(adminService.getAlerts).toHaveBeenCalledWith(query);
        expect(result).toEqual(mockAlerts);
      });
    });

    describe('acknowledgeAlert', () => {
      it('should acknowledge alert successfully', async () => {
          const acknowledgeAlertDto: AcknowledgeAlertDto = {
            resolution: '已处理',
            remark: '备注信息',
          };
        const mockResult = { success: true, message: '告警确认成功' };

        mockAdminService.acknowledgeAlert.mockResolvedValue(mockResult);

        const result = await controller.acknowledgeAlert(1, acknowledgeAlertDto, mockRequest, mockIp);

        expect(adminService.acknowledgeAlert).toHaveBeenCalledWith(1, acknowledgeAlertDto, 1, mockIp);
        expect(result).toEqual(mockResult);
      });
    });
  });

  describe('Data Export API', () => {
    describe('exportData', () => {
      it('should export data successfully', async () => {
          const exportDataDto: ExportDataDto = {
            type: 'users',
            format: 'excel',
            startDate: '2023-12-01',
            endDate: '2023-12-31',
          };
        const mockResult = {
          success: true,
          downloadUrl: '/downloads/users_export_20231201.xlsx',
        };

        mockAdminService.exportData.mockResolvedValue(mockResult);

        const result = await controller.exportData(exportDataDto, mockRequest, mockIp);

        expect(adminService.exportData).toHaveBeenCalledWith(exportDataDto, 1, mockIp);
        expect(result).toEqual(mockResult);
      });
    });
  });
});