import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserService } from '../user/user.service';
import { DeviceService } from '../device/device.service';
import { RedisService } from '../../config/redis.config';

/**
 * 订单服务
 */
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private userService: UserService,
    private deviceService: DeviceService,
    private redisService: RedisService,
  ) {}

  /**
   * 创建订单
   * @param userId 用户ID
   * @param createOrderDto 创建订单数据
   */
  async create(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    const { deviceId, washType, duration, amount } = createOrderDto;

    // 验证用户存在
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 验证设备存在且可用
    const device = await this.deviceService.findOne(deviceId);
    if (!device) {
      throw new NotFoundException('设备不存在');
    }

    if (device.status !== 'online') {
      throw new BadRequestException('设备当前不可用');
    }

    // 检查用户余额
    if (user.balance < amount) {
      throw new BadRequestException('余额不足');
    }

    // 生成订单号
    const orderNo = this.generateOrderNumber();

    const order = this.orderRepository.create({
      orderNo,
      userId,
      merchantId: device.merchantId,
      deviceId,
      amount,
      status: 'pending',
      washType,
      duration,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedOrder = await this.orderRepository.save(order);

    // 扣除用户余额
    await this.userService.updateBalance(userId, -amount);

    // 在Redis中设置订单状态
    await this.redisService.set(
      `order:${orderNo}:status`,
      'pending',
      3600, // 1小时过期
    );

    return savedOrder;
  }

  /**
   * 获取订单列表
   * @param page 页码
   * @param limit 每页数量
   * @param userId 用户ID筛选
   * @param merchantId 商户ID筛选
   * @param status 状态筛选
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    userId?: number,
    merchantId?: number,
    status?: string,
  ) {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.merchant', 'merchant')
      .leftJoinAndSelect('order.device', 'device');

    if (userId) {
      queryBuilder.andWhere('order.userId = :userId', { userId });
    }

    if (merchantId) {
      queryBuilder.andWhere('order.merchantId = :merchantId', { merchantId });
    }

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    queryBuilder
      .orderBy('order.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [orders, total] = await queryBuilder.getManyAndCount();

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 根据ID获取订单
   * @param id 订单ID
   */
  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'merchant', 'device'],
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return order;
  }

  /**
   * 根据订单号查找订单
   * @param orderNumber 订单号
   */
  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderNo: orderNumber },
      relations: ['user', 'merchant', 'device'],
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return order;
  }

  /**
   * 更新订单
   * @param id 订单ID
   * @param updateOrderDto 更新数据
   */
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    
    await this.orderRepository.update(id, {
      ...updateOrderDto,
      updatedAt: new Date(),
    });

    return await this.findOne(id);
  }

  /**
   * 开始洗车
   * @param orderNumber 订单号
   */
  async startWash(orderNumber: string): Promise<Order> {
    const order = await this.findByOrderNumber(orderNumber);

    if (order.status !== 'paid') {
      throw new BadRequestException('订单状态不正确，无法开始洗车');
    }

    // 更新订单状态
    await this.orderRepository.update(order.id, {
      status: 'in_progress',
      startTime: new Date(),
      updatedAt: new Date(),
    });

    // 更新Redis中的订单状态
    await this.redisService.set(
      `order:${order.orderNo}:status`,
      'in_progress',
      order.duration * 60, // 转换为秒
    );

    return await this.findOne(order.id);
  }

  /**
   * 完成洗车
   * @param orderNumber 订单号
   * @param actualDuration 实际洗车时长（分钟）
   */
  async completeWash(orderNumber: string, actualDuration?: number): Promise<Order> {
    const order = await this.findByOrderNumber(orderNumber);

    if (order.status !== 'in_progress') {
      throw new BadRequestException('订单状态不正确，无法完成洗车');
    }

    // 更新订单状态
    const updateData: any = {
      status: 'completed',
      endTime: new Date(),
      updatedAt: new Date(),
    };

    if (actualDuration) {
      updateData.duration = actualDuration;
    }

    await this.orderRepository.update(order.id, updateData);

    // 更新Redis中的订单状态
    await this.redisService.set(
      `order:${order.orderNo}:status`,
      'completed',
      3600, // 1小时过期
    );

    return await this.findOne(order.id);
  }

  /**
   * 取消订单
   * @param id 订单ID
   * @param userId 用户ID（用于权限验证）
   */
  async cancel(id: number, userId: number): Promise<Order> {
    const order = await this.findOne(id);

    // 验证订单所有者
    if (order.userId !== userId) {
      throw new BadRequestException('无权取消此订单');
    }

    // 只有待支付和已支付的订单可以取消
    if (!['pending', 'paid'].includes(order.status)) {
      throw new BadRequestException('订单状态不允许取消');
    }

    // 更新订单状态
    await this.orderRepository.update(id, {
      status: 'cancelled',
      updatedAt: new Date(),
    });

    // 如果订单已支付，退还余额
    if (order.status === 'paid') {
      await this.userService.updateBalance(userId, order.amount);
    }

    // 更新Redis中的订单状态
    await this.redisService.set(
      `order:${order.orderNo}:status`,
      'cancelled',
      3600, // 1小时过期
    );

    return await this.findOne(id);
  }

  /**
   * 支付订单（模拟支付）
   * @param orderNumber 订单号
   * @param paymentMethod 支付方式
   */
  async pay(orderNumber: string, paymentMethod: string): Promise<Order> {
    const order = await this.findByOrderNumber(orderNumber);

    if (order.status !== 'pending') {
      throw new BadRequestException('订单状态不正确，无法支付');
    }

    // 模拟第三方支付订单号
    const thirdPartyOrderNumber = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 更新订单状态
    await this.orderRepository.update(order.id, {
      status: 'paid',
      paymentMethod,
      thirdPartyOrderNumber,
      paidAt: new Date(),
      updatedAt: new Date(),
    });

    // 更新Redis中的订单状态
    await this.redisService.set(
      `order:${order.orderNo}:status`,
      'paid',
      3600, // 1小时过期
    );

    return await this.findOne(order.id);
  }

  /**
   * 生成订单号
   */
  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `WC${timestamp}${random}`;
  }

  /**
   * 获取用户订单统计
   * @param userId 用户ID
   */
  async getUserOrderStats(userId: number) {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .where('order.userId = :userId', { userId });

    const totalOrders = await queryBuilder.getCount();
    
    const completedOrders = await queryBuilder
      .andWhere('order.status = :status', { status: 'completed' })
      .getCount();

    const totalAmount = await queryBuilder
      .select('SUM(order.amount)', 'total')
      .getRawOne();

    return {
      totalOrders,
      completedOrders,
      totalAmount: parseFloat(totalAmount.total) || 0,
    };
  }
}