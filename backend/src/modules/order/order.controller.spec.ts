import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PayOrderDto } from './dto/pay-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrder = {
    id: 1,
    orderNo: 'WC1703123456ABC123',
    userId: 1,
    merchantId: 1,
    deviceId: 1,
    amount: 15.00,
    status: 'pending',
    washType: 'standard',
    duration: 10,
    paymentMethod: null,
    thirdPartyOrderNumber: null,
    startTime: null,
    endTime: null,
    paidAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: 1,
      phone: '13800138000',
      nickname: '测试用户',
    },
    merchant: {
      id: 1,
      name: '测试商户',
    },
    device: {
      id: 1,
      name: '测试设备',
    },
  };

  const mockOrderService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByOrderNumber: jest.fn(),
    update: jest.fn(),
    pay: jest.fn(),
    cancel: jest.fn(),
    startWash: jest.fn(),
    completeWash: jest.fn(),
    getUserOrderStats: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 1,
      role: 'user',
    },
  };

  const mockAdminRequest = {
    user: {
      id: 1,
      role: 'admin',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createOrderDto: CreateOrderDto = {
      deviceId: 1,
      washType: 'standard',
      duration: 10,
      amount: 15.00,
    };

    it('should create an order', async () => {
      mockOrderService.create.mockResolvedValue(mockOrder);

      const result = await controller.create(mockRequest, createOrderDto);

      expect(mockOrderService.create).toHaveBeenCalledWith(1, createOrderDto);
      expect(result).toEqual(mockOrder);
    });

    it('should handle service errors', async () => {
      mockOrderService.create.mockRejectedValue(new BadRequestException('余额不足'));

      await expect(
        controller.create(mockRequest, createOrderDto)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    const mockPaginatedResult = {
      orders: [mockOrder],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    it('should return paginated orders for regular user', async () => {
      mockOrderService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.findAll(mockRequest, '1', '10', 'pending');

      expect(mockOrderService.findAll).toHaveBeenCalledWith(
        1,
        10,
        1, // userId for regular user
        undefined,
        'pending'
      );
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should return all orders for admin user', async () => {
      mockOrderService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.findAll(mockAdminRequest, '1', '10');

      expect(mockOrderService.findAll).toHaveBeenCalledWith(
        1,
        10,
        undefined, // no userId filter for admin
        undefined,
        undefined
      );
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should use default pagination values', async () => {
      mockOrderService.findAll.mockResolvedValue(mockPaginatedResult);

      await controller.findAll(mockRequest);

      expect(mockOrderService.findAll).toHaveBeenCalledWith(
        1, // default page
        10, // default limit
        1,
        undefined,
        undefined
      );
    });
  });

  describe('findAllForAdmin', () => {
    const mockPaginatedResult = {
      orders: [mockOrder],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    it('should return all orders with filters for admin', async () => {
      mockOrderService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.findAllForAdmin(
        '1',
        '10',
        '1',
        '1',
        'completed'
      );

      expect(mockOrderService.findAll).toHaveBeenCalledWith(
        1,
        10,
        1, // userId filter
        1, // merchantId filter
        'completed'
      );
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle undefined filters', async () => {
      mockOrderService.findAll.mockResolvedValue(mockPaginatedResult);

      await controller.findAllForAdmin('1', '10');

      expect(mockOrderService.findAll).toHaveBeenCalledWith(
        1,
        10,
        undefined,
        undefined,
        undefined
      );
    });
  });

  describe('findOne', () => {
    it('should return order for owner', async () => {
      mockOrderService.findOne.mockResolvedValue(mockOrder);

      const result = await controller.findOne(mockRequest, 1);

      expect(mockOrderService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockOrder);
    });

    it('should return order for admin', async () => {
      const otherUserOrder = { ...mockOrder, userId: 2 };
      mockOrderService.findOne.mockResolvedValue(otherUserOrder);

      const result = await controller.findOne(mockAdminRequest, 1);

      expect(result).toEqual(otherUserOrder);
    });

    it('should throw error if user tries to access other user order', async () => {
      const otherUserOrder = { ...mockOrder, userId: 2 };
      mockOrderService.findOne.mockResolvedValue(otherUserOrder);

      await expect(
        controller.findOne(mockRequest, 1)
      ).rejects.toThrow('无权查看此订单');
    });
  });

  describe('update', () => {
    const updateOrderDto: UpdateOrderDto = {
      status: 'completed',
    };

    it('should update order (admin only)', async () => {
      const updatedOrder = { ...mockOrder, status: 'completed' };
      mockOrderService.update.mockResolvedValue(updatedOrder);

      const result = await controller.update(1, updateOrderDto);

      expect(mockOrderService.update).toHaveBeenCalledWith(1, updateOrderDto);
      expect(result).toEqual(updatedOrder);
    });
  });

  describe('pay', () => {
    const payOrderDto: PayOrderDto = {
      paymentMethod: 'wechat',
    };

    it('should pay order for owner', async () => {
      const paidOrder = { ...mockOrder, status: 'paid' };
      mockOrderService.findByOrderNumber.mockResolvedValue(mockOrder);
      mockOrderService.pay.mockResolvedValue(paidOrder);

      const result = await controller.pay(
        mockRequest,
        'WC1703123456ABC123',
        payOrderDto
      );

      expect(mockOrderService.findByOrderNumber).toHaveBeenCalledWith(
        'WC1703123456ABC123'
      );
      expect(mockOrderService.pay).toHaveBeenCalledWith(
        'WC1703123456ABC123',
        'wechat'
      );
      expect(result).toEqual(paidOrder);
    });

    it('should allow admin to pay any order', async () => {
      const otherUserOrder = { ...mockOrder, userId: 2 };
      const paidOrder = { ...otherUserOrder, status: 'paid' };
      mockOrderService.findByOrderNumber.mockResolvedValue(otherUserOrder);
      mockOrderService.pay.mockResolvedValue(paidOrder);

      const result = await controller.pay(
        mockAdminRequest,
        'WC1703123456ABC123',
        payOrderDto
      );

      expect(result).toEqual(paidOrder);
    });

    it('should throw error if user tries to pay other user order', async () => {
      const otherUserOrder = { ...mockOrder, userId: 2 };
      mockOrderService.findByOrderNumber.mockResolvedValue(otherUserOrder);

      await expect(
        controller.pay(mockRequest, 'WC1703123456ABC123', payOrderDto)
      ).rejects.toThrow('无权支付此订单');
    });
  });

  describe('cancel', () => {
    it('should cancel order', async () => {
      const cancelledOrder = { ...mockOrder, status: 'cancelled' };
      mockOrderService.cancel.mockResolvedValue(cancelledOrder);

      const result = await controller.cancel(mockRequest, 1);

      expect(mockOrderService.cancel).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(cancelledOrder);
    });

    it('should handle service errors', async () => {
      mockOrderService.cancel.mockRejectedValue(
        new BadRequestException('订单状态不允许取消')
      );

      await expect(controller.cancel(mockRequest, 1)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('startWash', () => {
    it('should start wash (admin only)', async () => {
      const inProgressOrder = { ...mockOrder, status: 'in_progress' };
      mockOrderService.startWash.mockResolvedValue(inProgressOrder);

      const result = await controller.startWash('WC1703123456ABC123');

      expect(mockOrderService.startWash).toHaveBeenCalledWith(
        'WC1703123456ABC123'
      );
      expect(result).toEqual(inProgressOrder);
    });

    it('should handle service errors', async () => {
      mockOrderService.startWash.mockRejectedValue(
        new BadRequestException('订单状态不正确')
      );

      await expect(
        controller.startWash('WC1703123456ABC123')
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('completeWash', () => {
    it('should complete wash without actual duration', async () => {
      const completedOrder = { ...mockOrder, status: 'completed' };
      mockOrderService.completeWash.mockResolvedValue(completedOrder);

      const result = await controller.completeWash('WC1703123456ABC123', {});

      expect(mockOrderService.completeWash).toHaveBeenCalledWith(
        'WC1703123456ABC123',
        undefined
      );
      expect(result).toEqual(completedOrder);
    });

    it('should complete wash with actual duration', async () => {
      const completedOrder = { ...mockOrder, status: 'completed', duration: 12 };
      mockOrderService.completeWash.mockResolvedValue(completedOrder);

      const result = await controller.completeWash('WC1703123456ABC123', {
        actualDuration: 12,
      });

      expect(mockOrderService.completeWash).toHaveBeenCalledWith(
        'WC1703123456ABC123',
        12
      );
      expect(result).toEqual(completedOrder);
    });

    it('should handle service errors', async () => {
      mockOrderService.completeWash.mockRejectedValue(
        new BadRequestException('订单状态不正确')
      );

      await expect(
        controller.completeWash('WC1703123456ABC123', {})
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUserStats', () => {
    const mockStats = {
      totalOrders: 10,
      completedOrders: 8,
      totalAmount: 150.0,
    };

    it('should return user order statistics', async () => {
      mockOrderService.getUserOrderStats.mockResolvedValue(mockStats);

      const result = await controller.getUserStats(mockRequest);

      expect(mockOrderService.getUserOrderStats).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockStats);
    });
  });

  describe('getUserStatsForAdmin', () => {
    const mockStats = {
      totalOrders: 5,
      completedOrders: 3,
      totalAmount: 75.0,
    };

    it('should return user order statistics for admin', async () => {
      mockOrderService.getUserOrderStats.mockResolvedValue(mockStats);

      const result = await controller.getUserStatsForAdmin(2);

      expect(mockOrderService.getUserOrderStats).toHaveBeenCalledWith(2);
      expect(result).toEqual(mockStats);
    });
  });
});