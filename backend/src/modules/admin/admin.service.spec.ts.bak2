import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AdminService } from './admin.service';
import { User } from '../user/entities/user.entity';
import { Merchant } from '../merchant/entities/merchant.entity';
import { Store } from '../store/entities/store.entity';
import { Device } from '../device/entities/device.entity';
import { Order } from '../order/entities/order.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Alert } from '../alert/entities/alert.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { DeviceLog } from '../device/entities/device-log.entity';
import { RedisService } from '../../config/redis.config';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from './dto/create-update.dto';
import { UserQueryDto } from './dto/pagination.dto';

describe('AdminService', () => {
  let service: AdminService;
  let userRepository: Repository<User>;
  let merchantRepository: Repository<Merchant>;
  let storeRepository: Repository<Store>;
  let deviceRepository: Repository<Device>;
  let orderRepository: Repository<Order>;
  let inventoryRepository: Repository<Inventory>;
  let alertRepository: Repository<Alert>;
  let auditLogRepository: Repository<AuditLog>;
  let deviceLogRepository: Repository<DeviceLog>;
  let dataSource: DataSource;
  let redisService: RedisService;

  const mockUser = {
    id: 1,
    phone: '13800138000',
    nickname: '测试用户',
    role: 'user',
    status: 'active',
    balance: 100.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
    getRawMany: jest.fn(),
    getManyAndCount: jest.fn(),
    getCount: jest.fn(),
  };

  const mockUserRepository = {
    count: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockMerchantRepository = {
    count: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockStoreRepository = {
    count: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockDeviceRepository = {
    count: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockOrderRepository = {
    count: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockInventoryRepository = {
    count: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockAlertRepository = {
    count: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockAuditLogRepository = {
    save: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockDeviceLogRepository = {
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(),
  };

  const mockRedisService = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Merchant),
          useValue: mockMerchantRepository,
        },
        {
          provide: getRepositoryToken(Store),
          useValue: mockStoreRepository,
        },
        {
          provide: getRepositoryToken(Device),
          useValue: mockDeviceRepository,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(Inventory),
          useValue: mockInventoryRepository,
        },
        {
          provide: getRepositoryToken(Alert),
          useValue: mockAlertRepository,
        },
        {
          provide: getRepositoryToken(AuditLog),
          useValue: mockAuditLogRepository,
        },
        {
          provide: getRepositoryToken(DeviceLog),
          useValue: mockDeviceLogRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    merchantRepository = module.get<Repository<Merchant>>(getRepositoryToken(Merchant));
    storeRepository = module.get<Repository<Store>>(getRepositoryToken(Store));
    deviceRepository = module.get<Repository<Device>>(getRepositoryToken(Device));
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    inventoryRepository = module.get<Repository<Inventory>>(getRepositoryToken(Inventory));
    alertRepository = module.get<Repository<Alert>>(getRepositoryToken(Alert));
    auditLogRepository = module.get<Repository<AuditLog>>(getRepositoryToken(AuditLog));
    deviceLogRepository = module.get<Repository<DeviceLog>>(getRepositoryToken(DeviceLog));
    dataSource = module.get<DataSource>(DataSource);
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      // Mock repository counts
      mockUserRepository.count.mockResolvedValue(100);
      mockMerchantRepository.count.mockResolvedValue(20);
      mockStoreRepository.count.mockResolvedValue(50);
      mockDeviceRepository.count.mockResolvedValueOnce(30).mockResolvedValueOnce(25); // total and online
      mockOrderRepository.count.mockResolvedValueOnce(500).mockResolvedValueOnce(10); // total and today

      // Mock revenue queries
      mockQueryBuilder.getRawOne
        .mockResolvedValueOnce({ total: '15000' }) // total revenue
        .mockResolvedValueOnce({ total: '300' }); // today revenue

      const result = await service.getDashboardStats();

      expect(result).toEqual({
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
      });

      expect(mockUserRepository.count).toHaveBeenCalledWith({ where: { status: 'active' } });
      expect(mockMerchantRepository.count).toHaveBeenCalledWith({ where: { status: 'active' } });
      expect(mockStoreRepository.count).toHaveBeenCalledWith({ where: { status: 'active' } });
    });

    it('should handle zero device count', async () => {
      mockUserRepository.count.mockResolvedValue(0);
      mockMerchantRepository.count.mockResolvedValue(0);
      mockStoreRepository.count.mockResolvedValue(0);
      mockDeviceRepository.count.mockResolvedValue(0);
      mockOrderRepository.count.mockResolvedValue(0);
      mockQueryBuilder.getRawOne.mockResolvedValue({ total: '0' });

      const result = await service.getDashboardStats();

      expect(result.deviceOnlineRate).toBe('0');
    });
  });

  describe('getUserTrend', () => {
    it('should return user growth trend', async () => {
      const mockTrendData = [
        { date: '2023-12-01', count: '5' },
        { date: '2023-12-02', count: '8' },
        { date: '2023-12-03', count: '12' },
      ];

      mockQueryBuilder.getRawMany.mockResolvedValue(mockTrendData);

      const result = await service.getUserTrend(7);

      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith('DATE(user.createdAt) as date');
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('COUNT(*) as count');
      expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith('DATE(user.createdAt)');
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('date', 'ASC');
      expect(result).toEqual(mockTrendData);
    });
  });

  describe('getOrderTrend', () => {
    it('should return order trend with revenue', async () => {
      const mockTrendData = [
        { date: '2023-12-01', orderCount: '10', revenue: '150' },
        { date: '2023-12-02', orderCount: '15', revenue: '225' },
      ];

      mockQueryBuilder.getRawMany.mockResolvedValue(mockTrendData);

      const result = await service.getOrderTrend(7);

      expect(mockOrderRepository.createQueryBuilder).toHaveBeenCalledWith('order');
      expect(result).toEqual([
        { date: '2023-12-01', orderCount: '10', revenue: 150 },
        { date: '2023-12-02', orderCount: '15', revenue: 225 },
      ]);
    });
  });

  describe('getDeviceUsage', () => {
    it('should return device usage statistics', async () => {
      const mockUsageData = [
        {
          deviceId: '1',
          deviceName: '设备1',
          storeName: '门店1',
          orderCount: '25',
          status: 'online',
        },
        {
          deviceId: '2',
          deviceName: '设备2',
          storeName: '门店2',
          orderCount: '18',
          status: 'offline',
        },
      ];

      mockQueryBuilder.getRawMany.mockResolvedValue(mockUsageData);

      const result = await service.getDeviceUsage();

      expect(mockDeviceRepository.createQueryBuilder).toHaveBeenCalledWith('device');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('device.store', 'store');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('device.orders', 'order');
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(10);
      expect(result).toEqual([
        {
          deviceId: '1',
          deviceName: '设备1',
          storeName: '门店1',
          orderCount: 25,
          status: 'online',
        },
        {
          deviceId: '2',
          deviceName: '设备2',
          storeName: '门店2',
          orderCount: 18,
          status: 'offline',
        },
      ]);
    });
  });

  describe('getUsers', () => {
    const mockUsers = [mockUser];
    const query: UserQueryDto = {
      page: 1,
      limit: 10,
      search: '138',
      role: 'user',
      status: 'active',
    };

    it('should return paginated users with filters', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockUsers, 1]);

      const result = await service.getUsers(query);

      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('user.store', 'store');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(user.phone LIKE :search OR user.nickname LIKE :search)',
        { search: '%138%' }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('user.role = :role', { role: 'user' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('user.status = :status', { status: 'active' });
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(result).toEqual({
        data: mockUsers,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should return users without filters', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockUsers, 1]);

      const result = await service.getUsers({ page: 1, limit: 10 });

      expect(result.data).toEqual(mockUsers);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserById(1);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['store', 'orders'],
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    const updateUserDto: UpdateUserDto = {
      nickname: '新昵称',
      status: 'active',
    };

    it('should update user successfully', async () => {
      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);
      mockAuditLogRepository.create.mockReturnValue({});
      mockAuditLogRepository.save.mockResolvedValue({});

      const result = await service.updateUser(1, updateUserDto, 1, '127.0.0.1');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateUser(999, updateUserDto, 1, '127.0.0.1')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should soft delete user successfully', async () => {
      const userToDelete = { ...mockUser };
      mockUserRepository.findOne.mockResolvedValue(userToDelete);
      mockUserRepository.save.mockResolvedValue({ ...userToDelete, status: 'disabled' });
      mockAuditLogRepository.create.mockReturnValue({});
      mockAuditLogRepository.save.mockResolvedValue({});

      await service.deleteUser(1, 1, '127.0.0.1');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...userToDelete,
        status: 'disabled',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteUser(999, 1, '127.0.0.1')).rejects.toThrow(
        NotFoundException
      );
    });
  });
});