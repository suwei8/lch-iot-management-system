import { Test, TestingModule } from '@nestjs/testing';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import {
  StoreQueryDto,
  DeviceQueryDto,
  OrderQueryDto,
  InventoryQueryDto,
  AlertQueryDto,
  PaginationDto,
  UserQueryDto,
} from './dto/pagination.dto';
import {
  CreateStoreDto,
  UpdateStoreDto,
  CreateDeviceDto,
  UpdateDeviceDto,
  UpdateInventoryDto,
  AcknowledgeAlertDto,
  CreateStaffDto,
  UpdateStaffDto,
  UpdateMerchantProfileDto,
} from './dto/create-update.dto';

describe('MerchantController', () => {
  let controller: MerchantController;
  let merchantService: MerchantService;

  const mockMerchantService = {
    getDashboardStats: jest.fn(),
    getMerchantProfile: jest.fn(),
    updateMerchantProfile: jest.fn(),
    getStores: jest.fn(),
    createStore: jest.fn(),
    getStoreById: jest.fn(),
    updateStore: jest.fn(),
    getStaff: jest.fn(),
    createStaff: jest.fn(),
    updateStaff: jest.fn(),
    deleteStaff: jest.fn(),
    getDevices: jest.fn(),
    createDevice: jest.fn(),
    getDeviceById: jest.fn(),
    updateDevice: jest.fn(),
    getDeviceLogs: jest.fn(),
    getOrders: jest.fn(),
    getOrderById: jest.fn(),
    getReports: jest.fn(),
    getInventory: jest.fn(),
    updateInventory: jest.fn(),
    getAlerts: jest.fn(),
    acknowledgeAlert: jest.fn(),
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
    user: { id: 1, role: 'merchant' },
  };

  const mockIp = '127.0.0.1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantController],
      providers: [
        {
          provide: MerchantService,
          useValue: mockMerchantService,
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

    controller = module.get<MerchantController>(MerchantController);
    merchantService = module.get<MerchantService>(MerchantService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Dashboard APIs', () => {
    describe('getDashboard', () => {
      it('should return merchant dashboard data', async () => {
        const mockDashboard = {
          storeCount: 5,
          deviceCount: 20,
          todayOrderCount: 15,
          todayRevenue: 450.00,
          monthlyRevenue: 12000.00,
          onlineDeviceCount: 18,
          deviceOnlineRate: '90.00',
        };

        mockMerchantService.getDashboardStats.mockResolvedValue(mockDashboard);

        const result = await controller.getDashboard(mockRequest);

        expect(merchantService.getDashboardStats).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockDashboard);
      });
    });
  });

  describe('Profile Management APIs', () => {
    describe('getProfile', () => {
      it('should return merchant profile', async () => {
        const mockProfile = {
          id: 1,
          name: '测试商户',
          contactName: '张三',
          contactPhone: '13800138000',
          email: 'test@example.com',
          status: 'active',
        };

        mockMerchantService.getMerchantProfile.mockResolvedValue(mockProfile);

        const result = await controller.getProfile(mockRequest);

        expect(merchantService.getMerchantProfile).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockProfile);
      });
    });

    describe('updateProfile', () => {
      it('should update merchant profile successfully', async () => {
        const updateProfileDto: UpdateMerchantProfileDto = {
          name: '更新商户名',
          phone: '13900139000',
          address: '更新地址',
        };
        const mockUpdatedProfile = { id: 1, ...updateProfileDto };

        mockMerchantService.updateMerchantProfile.mockResolvedValue(mockUpdatedProfile);

        const result = await controller.updateProfile(updateProfileDto, mockRequest, mockIp);

        expect(merchantService.updateMerchantProfile).toHaveBeenCalledWith(
          1,
          updateProfileDto,
          1,
          mockIp
        );
        expect(result).toEqual(mockUpdatedProfile);
      });
    });
  });

  describe('Store Management APIs', () => {
    describe('getStores', () => {
      it('should return paginated stores', async () => {
        const query: StoreQueryDto = { page: 1, limit: 10 };
        const mockStores = {
          data: [{ id: 1, name: '测试门店', address: '测试地址' }],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        };

        mockMerchantService.getStores.mockResolvedValue(mockStores);

        const result = await controller.getStores(query, mockRequest);

        expect(merchantService.getStores).toHaveBeenCalledWith(1, query);
        expect(result).toEqual(mockStores);
      });
    });

    describe('createStore', () => {
      it('should create store successfully', async () => {
        const createStoreDto: CreateStoreDto = {
          name: '新门店',
          address: '新地址',
          city: '北京市',
          district: '朝阳区',
        };
        const mockStore = { id: 1, ...createStoreDto };

        mockMerchantService.createStore.mockResolvedValue(mockStore);

        const result = await controller.createStore(createStoreDto, mockRequest, mockIp);

        expect(merchantService.createStore).toHaveBeenCalledWith(
          1,
          createStoreDto,
          1,
          mockIp
        );
        expect(result).toEqual(mockStore);
      });
    });

    describe('getStoreById', () => {
      it('should return store by id', async () => {
        const mockStore = { id: 1, name: '测试门店', address: '测试地址' };

        mockMerchantService.getStoreById.mockResolvedValue(mockStore);

        const result = await controller.getStoreById(1, mockRequest);

        expect(merchantService.getStoreById).toHaveBeenCalledWith(1, 1);
        expect(result).toEqual(mockStore);
      });
    });

    describe('updateStore', () => {
      it('should update store successfully', async () => {
        const updateStoreDto: UpdateStoreDto = {
          name: '更新门店名',
          address: '更新地址',
        };
        const mockUpdatedStore = { id: 1, ...updateStoreDto };

        mockMerchantService.updateStore.mockResolvedValue(mockUpdatedStore);

        const result = await controller.updateStore(1, updateStoreDto, mockRequest, mockIp);

        expect(merchantService.updateStore).toHaveBeenCalledWith(
          1,
          1,
          updateStoreDto,
          1,
          mockIp
        );
        expect(result).toEqual(mockUpdatedStore);
      });
    });
  });

  describe('Staff Management APIs', () => {
    describe('getStoreStaff', () => {
      it('should return store staff list', async () => {
        const query: UserQueryDto = { page: 1, limit: 10 };
        const mockStaff = {
          data: [{ id: 1, phone: '13800138000', nickname: '员工1', role: 'store_manager' }],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        };

        mockMerchantService.getStaff.mockResolvedValue(mockStaff);

        const result = await controller.getStoreStaff(1, query, mockRequest);

        expect(merchantService.getStaff).toHaveBeenCalledWith(1, query);
        expect(result).toEqual(mockStaff);
      });
    });

    describe('createStoreStaff', () => {
      it('should create store staff successfully', async () => {
        const createStaffDto: CreateStaffDto = {
          phone: '13900139000',
          password: '123456',
          nickname: '新员工',
          staffRole: 'store_manager',
        };
        const mockStaff = { id: 2, ...createStaffDto };

        mockMerchantService.createStaff.mockResolvedValue(mockStaff);

        const result = await controller.createStoreStaff(1, createStaffDto, mockRequest, mockIp);

        expect(merchantService.createStaff).toHaveBeenCalledWith(
          1,
          1,
          createStaffDto,
          1,
          mockIp
        );
        expect(result).toEqual(mockStaff);
      });
    });

    describe('updateStaff', () => {
      it('should update staff successfully', async () => {
        const updateStaffDto: UpdateStaffDto = {
          nickname: '更新员工名',
          status: 'active',
        };
        const mockUpdatedStaff = { id: 1, ...updateStaffDto };

        mockMerchantService.updateStaff.mockResolvedValue(mockUpdatedStaff);

        const result = await controller.updateStaff(1, updateStaffDto, mockRequest, mockIp);

        expect(merchantService.updateStaff).toHaveBeenCalledWith(
          1,
          1,
          updateStaffDto,
          1,
          mockIp
        );
        expect(result).toEqual(mockUpdatedStaff);
      });
    });

    describe('deleteStaff', () => {
      it('should delete staff successfully', async () => {
        const mockResult = { success: true, message: '员工删除成功' };

        mockMerchantService.deleteStaff.mockResolvedValue(mockResult);

        const result = await controller.deleteStaff(1, mockRequest, mockIp);

        expect(merchantService.deleteStaff).toHaveBeenCalledWith(1, 1, 1, mockIp);
        expect(result).toEqual(mockResult);
      });
    });
  });

  describe('Device Management APIs', () => {
    describe('getDevices', () => {
      it('should return paginated devices', async () => {
        const query: DeviceQueryDto = { page: 1, limit: 10 };
        const mockDevices = {
          data: [{ id: 1, name: '设备1', serialNumber: 'DEV001', status: 'online' }],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        };

        mockMerchantService.getDevices.mockResolvedValue(mockDevices);

        const result = await controller.getDevices(query, mockRequest);

        expect(merchantService.getDevices).toHaveBeenCalledWith(1, query);
        expect(result).toEqual(mockDevices);
      });
    });

    describe('createDevice', () => {
      it('should create device successfully', async () => {
        const createDeviceDto: CreateDeviceDto = {
          devid: 'DEV002',
          name: '新设备',
          model: 'MODEL-X2',
          storeId: 1,
          serialNumber: 'DEV002',
        };
        const mockDevice = { id: 2, ...createDeviceDto };

        mockMerchantService.createDevice.mockResolvedValue(mockDevice);

        const result = await controller.createDevice(createDeviceDto, mockRequest, mockIp);

        expect(merchantService.createDevice).toHaveBeenCalledWith(
          1,
          createDeviceDto,
          1,
          mockIp
        );
        expect(result).toEqual(mockDevice);
      });
    });

    describe('getDeviceById', () => {
      it('should return device by id', async () => {
        const mockDevice = { id: 1, name: '设备1', serialNumber: 'DEV001', status: 'online' };

        mockMerchantService.getDeviceById.mockResolvedValue(mockDevice);

        const result = await controller.getDeviceById(1, mockRequest);

        expect(merchantService.getDeviceById).toHaveBeenCalledWith(1, 1);
        expect(result).toEqual(mockDevice);
      });
    });

    describe('updateDevice', () => {
      it('should update device successfully', async () => {
        const updateDeviceDto: UpdateDeviceDto = {
          name: '更新设备名',
          status: 'maintenance',
        };
        const mockUpdatedDevice = { id: 1, ...updateDeviceDto };

        mockMerchantService.updateDevice.mockResolvedValue(mockUpdatedDevice);

        const result = await controller.updateDevice(1, updateDeviceDto, mockRequest, mockIp);

        expect(merchantService.updateDevice).toHaveBeenCalledWith(
          1,
          1,
          updateDeviceDto,
          1,
          mockIp
        );
        expect(result).toEqual(mockUpdatedDevice);
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

        mockMerchantService.getDeviceLogs.mockResolvedValue(mockLogs);

        const result = await controller.getDeviceLogs(1, query, mockRequest);

        expect(merchantService.getDeviceLogs).toHaveBeenCalledWith(1, 1, query);
        expect(result).toEqual(mockLogs);
      });
    });
  });

  describe('Order Management APIs', () => {
    describe('getOrders', () => {
      it('should return paginated orders', async () => {
        const query: OrderQueryDto = { page: 1, limit: 10 };
        const mockOrders = {
          data: [{ id: 1, orderNumber: 'ORD001', status: 'completed', amount: 30.00 }],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        };

        mockMerchantService.getOrders.mockResolvedValue(mockOrders);

        const result = await controller.getOrders(query, mockRequest);

        expect(merchantService.getOrders).toHaveBeenCalledWith(1, query);
        expect(result).toEqual(mockOrders);
      });
    });

    describe('getOrderById', () => {
      it('should return order by id', async () => {
        const mockOrder = { id: 1, orderNumber: 'ORD001', status: 'completed', amount: 30.00 };

        mockMerchantService.getOrderById.mockResolvedValue(mockOrder);

        const result = await controller.getOrderById(1, mockRequest);

        expect(merchantService.getOrderById).toHaveBeenCalledWith(1, 1);
        expect(result).toEqual(mockOrder);
      });
    });

    describe('getOrderReports', () => {
      it('should return order reports', async () => {
        const query = { startDate: '2023-12-01', endDate: '2023-12-31' };
        const mockReports = {
          totalOrders: 100,
          totalRevenue: 3000.00,
          averageOrderValue: 30.00,
          dailyStats: [
            { date: '2023-12-01', orderCount: 5, revenue: 150.00 },
          ],
        };

        mockMerchantService.getReports.mockResolvedValue(mockReports);

        const result = await controller.getOrderReports(query, mockRequest);

        expect(merchantService.getReports).toHaveBeenCalledWith(1, query);
        expect(result).toEqual(mockReports);
      });
    });

    describe('getRevenueReports', () => {
      it('should return revenue reports', async () => {
        const query = { startDate: '2023-12-01', endDate: '2023-12-31' };
        const mockReports = {
          totalRevenue: 3000.00,
          monthlyRevenue: 3000.00,
          dailyAverage: 96.77,
          revenueGrowth: 15.5,
        };

        mockMerchantService.getReports.mockResolvedValue(mockReports);

        const result = await controller.getRevenueReports(query, mockRequest);

        expect(merchantService.getReports).toHaveBeenCalledWith(1, query);
        expect(result).toEqual(mockReports);
      });
    });
  });

  describe('Inventory Management APIs', () => {
    describe('getInventory', () => {
      it('should return paginated inventory', async () => {
        const query: InventoryQueryDto = { page: 1, limit: 10 };
        const mockInventory = {
          data: [{ id: 1, itemName: '洗车液', quantity: 100, minThreshold: 20 }],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        };

        mockMerchantService.getInventory.mockResolvedValue(mockInventory);

        const result = await controller.getInventory(query, mockRequest);

        expect(merchantService.getInventory).toHaveBeenCalledWith(1, query);
        expect(result).toEqual(mockInventory);
      });
    });

    describe('updateInventory', () => {
      it('should update inventory successfully', async () => {
        const updateInventoryDto: UpdateInventoryDto = {
          currentStock: 150,
          minStock: 25,
        };
        const mockUpdatedInventory = { id: 1, ...updateInventoryDto };

        mockMerchantService.updateInventory.mockResolvedValue(mockUpdatedInventory);

        const result = await controller.updateInventory(1, updateInventoryDto, mockRequest, mockIp);

        expect(merchantService.updateInventory).toHaveBeenCalledWith(
          1,
          1,
          updateInventoryDto,
          1,
          mockIp
        );
        expect(result).toEqual(mockUpdatedInventory);
      });
    });
  });

  describe('Alert Management APIs', () => {
    describe('getAlerts', () => {
      it('should return paginated alerts', async () => {
        const query: AlertQueryDto = { page: 1, limit: 10 };
        const mockAlerts = {
          data: [{ id: 1, type: 'device_offline', message: '设备离线', status: 'pending' }],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        };

        mockMerchantService.getAlerts.mockResolvedValue(mockAlerts);

        const result = await controller.getAlerts(query, mockRequest);

        expect(merchantService.getAlerts).toHaveBeenCalledWith(1, query);
        expect(result).toEqual(mockAlerts);
      });
    });

    describe('acknowledgeAlert', () => {
      it('should acknowledge alert successfully', async () => {
        const acknowledgeAlertDto: AcknowledgeAlertDto = {
          resolution: '已处理设备离线问题',
        };
        const mockResult = { success: true, message: '告警确认成功' };

        mockMerchantService.acknowledgeAlert.mockResolvedValue(mockResult);

        const result = await controller.acknowledgeAlert(1, acknowledgeAlertDto, mockRequest, mockIp);

        expect(merchantService.acknowledgeAlert).toHaveBeenCalledWith(
          1,
          1,
          acknowledgeAlertDto,
          1,
          mockIp
        );
        expect(result).toEqual(mockResult);
      });
    });
  });
});