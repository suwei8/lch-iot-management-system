import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { UserService } from '../user/user.service';
import { DeviceService } from '../device/device.service';
import { RedisService } from '../../config/redis.config';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;
  let repository: Repository<Order>;
  let userService: UserService;
  let deviceService: DeviceService;
  let redisService: RedisService;

  const mockOrder: Order = {
    id: 1,
    orderNo: 'WC1703123456ABC123',
    userId: 1,
    merchantId: 1,
    deviceId: 1,
    storeId: 1,
    amount: 15.00,
    status: 'pending',
    washType: 'standard',
    duration: 10,
    paymentMethod: null,
    paymentOrderNo: null,
    thirdPartyOrderNumber: null,
    startTime: null,
    endTime: null,
    paidAt: null,
    remark: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: 1,
      phone: '13800138000',
      nickname: '测试用户',
      balance: 100.00,
    } as any,
    merchant: {
      id: 1,
      name: '测试商户',
    } as any,
    device: {
      id: 1,
      name: '测试设备',
      status: 'online',
      merchantId: 1,
    } as any,
    store: {
      id: 1,
      name: '测试门店',
      address: '测试地址',
    } as any,
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    getCount: jest.fn(),
    getRawOne: jest.fn(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockUserService = {
    findById: jest.fn(),
    updateBalance: jest.fn(),
  };

  const mockDeviceService = {
    findOne: jest.fn(),
  };

  const mockRedisService = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: DeviceService,
          useValue: mockDeviceService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
    userService = module.get<UserService>(UserService);
    deviceService = module.get<DeviceService>(DeviceService);
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createOrderDto: CreateOrderDto = {
      deviceId: 1,
      washType: 'standard',
      duration: 10,
      amount: 15.00,
    };

    it('should create an order successfully', async () => {
      const mockUser = { id: 1, balance: 100.00 };
      const mockDevice = { id: 1, status: 'online', merchantId: 1 };
      
      mockUserService.findById.mockResolvedValue(mockUser);
      mockDeviceService.findOne.mockResolvedValue(mockDevice);
      mockRepository.create.mockReturnValue(mockOrder);
      mockRepository.save.mockResolvedValue(mockOrder);
      mockUserService.updateBalance.mockResolvedValue(undefined);
      mockRedisService.set.mockResolvedValue(undefined);

      const result = await service.create(1, createOrderDto);

      expect(mockUserService.findById).toHaveBeenCalledWith(1);
      expect(mockDeviceService.findOne).toHaveBeenCalledWith(1);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockUserService.updateBalance).toHaveBeenCalledWith(1, -15.00);
      expect(mockRedisService.set).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserService.findById.mockResolvedValue(null);

      await expect(service.create(1, createOrderDto)).rejects.toThrow(
        NotFoundException
      );
      expect(mockUserService.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if device not found', async () => {
      const mockUser = { id: 1, balance: 100.00 };
      mockUserService.findById.mockResolvedValue(mockUser);
      mockDeviceService.findOne.mockResolvedValue(null);

      await expect(service.create(1, createOrderDto)).rejects.toThrow(
        NotFoundException
      );
      expect(mockDeviceService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException if device is offline', async () => {
      const mockUser = { id: 1, balance: 100.00 };
      const mockDevice = { id: 1, status: 'offline', merchantId: 1 };
      
      mockUserService.findById.mockResolvedValue(mockUser);
      mockDeviceService.findOne.mockResolvedValue(mockDevice);

      await expect(service.create(1, createOrderDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw BadRequestException if insufficient balance', async () => {
      const mockUser = { id: 1, balance: 5.00 };
      const mockDevice = { id: 1, status: 'online', merchantId: 1 };
      
      mockUserService.findById.mockResolvedValue(mockUser);
      mockDeviceService.findOne.mockResolvedValue(mockDevice);

      await expect(service.create(1, createOrderDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated orders', async () => {
      const mockOrders = [mockOrder];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockOrders, 1]);

      const result = await service.findAll(1, 10);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('order');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(3);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('order.createdAt', 'DESC');
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(result).toEqual({
        orders: mockOrders,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter by userId when provided', async () => {
      const mockOrders = [mockOrder];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockOrders, 1]);

      await service.findAll(1, 10, 1);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'order.userId = :userId',
        { userId: 1 }
      );
    });

    it('should filter by merchantId when provided', async () => {
      const mockOrders = [mockOrder];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockOrders, 1]);

      await service.findAll(1, 10, undefined, 1);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'order.merchantId = :merchantId',
        { merchantId: 1 }
      );
    });

    it('should filter by status when provided', async () => {
      const mockOrders = [mockOrder];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockOrders, 1]);

      await service.findAll(1, 10, undefined, undefined, 'completed');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'order.status = :status',
        { status: 'completed' }
      );
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user', 'merchant', 'device'],
      });
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException if order not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['user', 'merchant', 'device'],
      });
    });
  });

  describe('findByOrderNumber', () => {
    it('should return an order by order number', async () => {
      mockRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.findByOrderNumber('WC1703123456ABC123');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { orderNo: 'WC1703123456ABC123' },
        relations: ['user', 'merchant', 'device'],
      });
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException if order not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findByOrderNumber('INVALID_ORDER_NO')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateOrderDto: UpdateOrderDto = {
      status: 'completed',
    };

    it('should update an order successfully', async () => {
      const updatedOrder = { ...mockOrder, status: 'completed' };
      mockRepository.findOne.mockResolvedValueOnce(mockOrder);
      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValueOnce(updatedOrder);

      const result = await service.update(1, updateOrderDto);

      expect(mockRepository.update).toHaveBeenCalledWith(1, {
        ...updateOrderDto,
        updatedAt: expect.any(Date),
      });
      expect(result).toEqual(updatedOrder);
    });

    it('should throw NotFoundException if order not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateOrderDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('startWash', () => {
    it('should start wash successfully', async () => {
      const paidOrder = { ...mockOrder, status: 'paid' };
      const inProgressOrder = { ...mockOrder, status: 'in_progress' };
      
      mockRepository.findOne.mockResolvedValueOnce(paidOrder);
      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValueOnce(inProgressOrder);
      mockRedisService.set.mockResolvedValue(undefined);

      const result = await service.startWash('WC1703123456ABC123');

      expect(mockRepository.update).toHaveBeenCalledWith(paidOrder.id, {
        status: 'in_progress',
        startTime: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(mockRedisService.set).toHaveBeenCalled();
      expect(result).toEqual(inProgressOrder);
    });

    it('should throw BadRequestException if order status is not paid', async () => {
      mockRepository.findOne.mockResolvedValue(mockOrder); // status: 'pending'

      await expect(
        service.startWash('WC1703123456ABC123')
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('completeWash', () => {
    it('should complete wash successfully', async () => {
      const inProgressOrder = { ...mockOrder, status: 'in_progress' };
      const completedOrder = { ...mockOrder, status: 'completed' };
      
      mockRepository.findOne.mockResolvedValueOnce(inProgressOrder);
      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValueOnce(completedOrder);
      mockRedisService.set.mockResolvedValue(undefined);

      const result = await service.completeWash('WC1703123456ABC123');

      expect(mockRepository.update).toHaveBeenCalledWith(inProgressOrder.id, {
        status: 'completed',
        endTime: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(mockRedisService.set).toHaveBeenCalled();
      expect(result).toEqual(completedOrder);
    });

    it('should complete wash with actual duration', async () => {
      const inProgressOrder = { ...mockOrder, status: 'in_progress' };
      const completedOrder = { ...mockOrder, status: 'completed', duration: 12 };
      
      mockRepository.findOne.mockResolvedValueOnce(inProgressOrder);
      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValueOnce(completedOrder);
      mockRedisService.set.mockResolvedValue(undefined);

      const result = await service.completeWash('WC1703123456ABC123', 12);

      expect(mockRepository.update).toHaveBeenCalledWith(inProgressOrder.id, {
        status: 'completed',
        endTime: expect.any(Date),
        updatedAt: expect.any(Date),
        duration: 12,
      });
      expect(result).toEqual(completedOrder);
    });

    it('should throw BadRequestException if order status is not in_progress', async () => {
      mockRepository.findOne.mockResolvedValue(mockOrder); // status: 'pending'

      await expect(
        service.completeWash('WC1703123456ABC123')
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancel', () => {
    it('should cancel pending order successfully', async () => {
      const cancelledOrder = { ...mockOrder, status: 'cancelled' };
      
      mockRepository.findOne.mockResolvedValueOnce(mockOrder);
      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValueOnce(cancelledOrder);
      mockRedisService.set.mockResolvedValue(undefined);

      const result = await service.cancel(1, 1);

      expect(mockRepository.update).toHaveBeenCalledWith(1, {
        status: 'cancelled',
        updatedAt: expect.any(Date),
      });
      expect(mockUserService.updateBalance).not.toHaveBeenCalled();
      expect(mockRedisService.set).toHaveBeenCalled();
      expect(result).toEqual(cancelledOrder);
    });

    it('should cancel paid order and refund balance', async () => {
      const paidOrder = { ...mockOrder, status: 'paid' };
      const cancelledOrder = { ...mockOrder, status: 'cancelled' };
      
      mockRepository.findOne.mockResolvedValueOnce(paidOrder);
      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValueOnce(cancelledOrder);
      mockUserService.updateBalance.mockResolvedValue(undefined);
      mockRedisService.set.mockResolvedValue(undefined);

      const result = await service.cancel(1, 1);

      expect(mockUserService.updateBalance).toHaveBeenCalledWith(1, 15.00);
      expect(result).toEqual(cancelledOrder);
    });

    it('should throw BadRequestException if user is not order owner', async () => {
      mockRepository.findOne.mockResolvedValue(mockOrder); // userId: 1

      await expect(service.cancel(1, 2)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if order status does not allow cancellation', async () => {
      const completedOrder = { ...mockOrder, status: 'completed' };
      mockRepository.findOne.mockResolvedValue(completedOrder);

      await expect(service.cancel(1, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('pay', () => {
    it('should pay order successfully', async () => {
      const paidOrder = { 
        ...mockOrder, 
        status: 'paid',
        paymentMethod: 'wechat',
        paymentOrderNo: 'PAY_123456789_ABC123',
        thirdPartyOrderNumber: 'PAY_123456789_ABC123',
        paidAt: new Date(),
      };
      
      mockRepository.findOne.mockResolvedValueOnce(mockOrder);
      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValueOnce(paidOrder);
      mockRedisService.set.mockResolvedValue(undefined);

      const result = await service.pay('WC1703123456ABC123', 'wechat');

      expect(mockRepository.update).toHaveBeenCalledWith(mockOrder.id, {
        status: 'paid',
        paymentMethod: 'wechat',
        thirdPartyOrderNumber: expect.stringMatching(/^PAY_\d+_[a-z0-9]+$/),
        paidAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(mockRedisService.set).toHaveBeenCalled();
      expect(result).toEqual(paidOrder);
    });

    it('should throw BadRequestException if order status is not pending', async () => {
      const paidOrder = { ...mockOrder, status: 'paid' };
      mockRepository.findOne.mockResolvedValue(paidOrder);

      await expect(
        service.pay('WC1703123456ABC123', 'wechat')
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUserOrderStats', () => {
    it('should return user order statistics', async () => {
      mockQueryBuilder.getCount.mockResolvedValueOnce(10); // totalOrders
      mockQueryBuilder.getCount.mockResolvedValueOnce(8);  // completedOrders
      mockQueryBuilder.getRawOne.mockResolvedValue({ total: '150.00' });

      const result = await service.getUserOrderStats(1);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('order');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'order.userId = :userId',
        { userId: 1 }
      );
      expect(result).toEqual({
        totalOrders: 10,
        completedOrders: 8,
        totalAmount: 150.00,
      });
    });

    it('should handle null total amount', async () => {
      mockQueryBuilder.getCount.mockResolvedValueOnce(0);
      mockQueryBuilder.getCount.mockResolvedValueOnce(0);
      mockQueryBuilder.getRawOne.mockResolvedValue({ total: null });

      const result = await service.getUserOrderStats(1);

      expect(result).toEqual({
        totalOrders: 0,
        completedOrders: 0,
        totalAmount: 0,
      });
    });
  });
});