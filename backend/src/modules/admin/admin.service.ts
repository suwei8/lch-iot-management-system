import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between, Like, In } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Merchant } from '../merchant/entities/merchant.entity';
import { Store } from '../store/entities/store.entity';
import { Device } from '../device/entities/device.entity';
import { Order } from '../order/entities/order.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Alert } from '../alert/entities/alert.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { DeviceLog } from '../device/entities/device-log.entity';
import {
  PaginationDto,
  UserQueryDto,
  MerchantQueryDto,
  StoreQueryDto,
  DeviceQueryDto,
  OrderQueryDto,
  InventoryQueryDto,
  AlertQueryDto,
} from './dto/pagination.dto';
import {
  CreateMerchantDto,
  UpdateMerchantDto,
  CreateStoreDto,
  UpdateStoreDto,
  CreateDeviceDto,
  UpdateDeviceDto,
  UpdateUserDto,
  UpdateOrderDto,
  UpdateInventoryDto,
  AcknowledgeAlertDto,
  ExportDataDto,
} from './dto/create-update.dto';
import { RedisService } from '../../config/redis.config';
import * as bcrypt from 'bcrypt';

/**
 * 管理员服务
 */
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    @InjectRepository(DeviceLog)
    private deviceLogRepository: Repository<DeviceLog>,
    private dataSource: DataSource,
    private redisService: RedisService,
  ) {}

  /**
   * 获取仪表盘统计数据
   */
  async getDashboardStats() {
    const [userCount, merchantCount, storeCount, deviceCount, orderCount] = await Promise.all([
      this.userRepository.count({ where: { status: 'active' } }),
      this.merchantRepository.count({ where: { status: 'active' } }),
      this.storeRepository.count({ where: { status: 'active' } }),
      this.deviceRepository.count(),
      this.orderRepository.count(),
    ]);

    // 计算总收入（已完成订单）
    const totalRevenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.amount)', 'total')
      .where('order.status = :status', { status: 'completed' })
      .getRawOne();

    // 今日订单数和收入
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayOrderCount, todayRevenue] = await Promise.all([
      this.orderRepository.count({
        where: {
          createdAt: Between(today, tomorrow),
        },
      }),
      this.orderRepository
        .createQueryBuilder('order')
        .select('SUM(order.amount)', 'total')
        .where('order.status = :status', { status: 'completed' })
        .andWhere('order.createdAt >= :today', { today })
        .andWhere('order.createdAt < :tomorrow', { tomorrow })
        .getRawOne(),
    ]);

    // 在线设备数
    const onlineDeviceCount = await this.deviceRepository.count({
      where: { status: 'online' },
    });

    // 计算离线和维护中的设备数
    const offlineDeviceCount = await this.deviceRepository.count({
      where: { status: 'offline' },
    });
    const maintenanceDeviceCount = await this.deviceRepository.count({
      where: { status: 'maintenance' },
    });

    // 获取今日数据记录数（模拟数据，实际应该从数据记录表获取）
    const todayDataCount = Math.floor(Math.random() * 1000) + 500;
    const totalDataCount = Math.floor(Math.random() * 50000) + 10000;

    return {
      totalMerchants: merchantCount,
      totalUsers: userCount,
      totalStores: storeCount,
      totalDevices: deviceCount,
      totalOrders: orderCount,
      totalRevenue: parseFloat(totalRevenue?.total || '0'),
      todayOrders: todayOrderCount,
      todayRevenue: parseFloat(todayRevenue?.total || '0'),
      onlineDevices: onlineDeviceCount,
      offlineDevices: offlineDeviceCount,
      maintenanceDevices: maintenanceDeviceCount,
      activeDevices: onlineDeviceCount, // 活跃设备数等于在线设备数
      totalDataCount,
      todayDataCount,
      todayDataRecords: todayDataCount,
      todayAlerts: Math.floor(Math.random() * 10), // 模拟今日告警数
      deviceStatusDistribution: {
        online: onlineDeviceCount,
        offline: offlineDeviceCount,
        maintenance: maintenanceDeviceCount,
      },
      merchantStatusDistribution: {
        active: merchantCount,
        inactive: await this.merchantRepository.count({ where: { status: 'inactive' } }),
        pending: await this.merchantRepository.count({ where: { status: 'pending' } }),
      },
      systemStats: {
        cpuUsage: Math.floor(Math.random() * 30) + 20, // 模拟CPU使用率 20-50%
        memoryUsage: Math.floor(Math.random() * 40) + 30, // 模拟内存使用率 30-70%
        diskUsage: Math.floor(Math.random() * 20) + 40, // 模拟磁盘使用率 40-60%
      },
    };
  }

  /**
   * 获取用户增长趋势
   */
  async getUserTrend(days: number = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await this.userRepository
      .createQueryBuilder('user')
      .select('DATE(user.createdAt) as date')
      .addSelect('COUNT(*) as count')
      .where('user.createdAt >= :startDate', { startDate })
      .andWhere('user.createdAt <= :endDate', { endDate })
      .groupBy('DATE(user.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return result;
  }

  /**
   * 获取订单趋势
   */
  async getOrderTrend(days: number = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('DATE(order.createdAt) as date')
      .addSelect('COUNT(*) as orderCount')
      .addSelect('SUM(CASE WHEN order.status = "completed" THEN order.amount ELSE 0 END) as revenue')
      .where('order.createdAt >= :startDate', { startDate })
      .andWhere('order.createdAt <= :endDate', { endDate })
      .groupBy('DATE(order.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return result.map(item => ({
      ...item,
      revenue: parseInt(item.revenue || '0'),
    }));
  }

  /**
   * 获取设备使用率统计
   */
  async getDeviceUsage() {
    const result = await this.deviceRepository
      .createQueryBuilder('device')
      .leftJoin('device.store', 'store')
      .leftJoin('device.orders', 'order')
      .select('device.id', 'deviceId')
      .addSelect('device.name', 'deviceName')
      .addSelect('store.name', 'storeName')
      .addSelect('COUNT(order.id)', 'orderCount')
      .addSelect('device.status', 'status')
      .groupBy('device.id')
      .orderBy('orderCount', 'DESC')
      .limit(10)
      .getRawMany();

    return result.map(item => ({
      ...item,
      orderCount: parseInt(item.orderCount),
    }));
  }

  /**
   * 获取用户列表
   */
  async getUsers(query: UserQueryDto) {
    const { page = 1, limit = 10, search, role, status } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.store', 'store');

    if (search) {
      queryBuilder.andWhere(
        '(user.phone LIKE :search OR user.nickname LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    const [users, total] = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取用户详情
   */
  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['store', 'orders'],
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  /**
   * 更新用户信息
   */
  async updateUser(id: number, updateUserDto: UpdateUserDto, operatorId: number, ip: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const oldData = { ...user };
    Object.assign(user, updateUserDto);
    
    const updatedUser = await this.userRepository.save(user);

    // 记录审计日志
    await this.createAuditLog({
      userId: operatorId,
      action: 'UPDATE_USER',
      resourceType: 'user',
      resourceId: id.toString(),
      description: `更新用户信息: ${user.phone}`,
      oldData: JSON.stringify(oldData),
      newData: JSON.stringify(updatedUser),
      ipAddress: ip,
    });

    return updatedUser;
  }

  /**
   * 删除用户（软删除）
   */
  async deleteUser(id: number, operatorId: number, ip: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    user.status = 'disabled';
    await this.userRepository.save(user);

    // 记录审计日志
    await this.createAuditLog({
      userId: operatorId,
      action: 'DELETE_USER',
      resourceType: 'user',
      resourceId: id.toString(),
      description: `删除用户: ${user.phone}`,
      ipAddress: ip,
    });

    return { message: '用户删除成功' };
   }

  /**
   * 创建商户
   */
  async createMerchant(createMerchantDto: CreateMerchantDto, operatorId: number, ip: string) {
    const merchant = this.merchantRepository.create(createMerchantDto);
    const savedMerchant = await this.merchantRepository.save(merchant);

    // 记录审计日志
    await this.createAuditLog({
      userId: operatorId,
      action: 'CREATE_MERCHANT',
      resourceType: 'merchant',
      resourceId: savedMerchant.id.toString(),
      description: `创建商户: ${savedMerchant.name}`,
      newData: JSON.stringify(savedMerchant),
      ipAddress: ip,
    });

    return savedMerchant;
  }

  /**
   * 获取商户列表
   */
  async getMerchants(query: MerchantQueryDto) {
    const { page = 1, limit = 10, search, status } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.merchantRepository.createQueryBuilder('merchant')
      .leftJoinAndSelect('merchant.stores', 'store');

    if (search) {
      queryBuilder.andWhere(
        '(merchant.name LIKE :search OR merchant.contactPhone LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (status) {
      queryBuilder.andWhere('merchant.status = :status', { status });
    }

    const [merchants, total] = await queryBuilder
      .orderBy('merchant.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: merchants,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取商户详情
   */
  async getMerchantById(id: number) {
    const merchant = await this.merchantRepository.findOne({
      where: { id },
      relations: ['stores', 'stores.devices'],
    });

    if (!merchant) {
      throw new NotFoundException('商户不存在');
    }

    return merchant;
  }

  /**
   * 更新商户信息
   */
  async updateMerchant(id: number, updateMerchantDto: UpdateMerchantDto, operatorId: number, ip: string) {
    const merchant = await this.merchantRepository.findOne({ where: { id } });
    if (!merchant) {
      throw new NotFoundException('商户不存在');
    }

    const oldData = { ...merchant };
    Object.assign(merchant, updateMerchantDto);
    
    const updatedMerchant = await this.merchantRepository.save(merchant);

    // 记录审计日志
    await this.createAuditLog({
      userId: operatorId,
      action: 'UPDATE_MERCHANT',
      resourceType: 'merchant',
      resourceId: id.toString(),
      description: `更新商户信息: ${merchant.name}`,
      oldData: JSON.stringify(oldData),
      newData: JSON.stringify(updatedMerchant),
      ipAddress: ip,
    });

    return updatedMerchant;
  }

  /**
   * 删除商户（软删除）
   */
  async deleteMerchant(id: number, operatorId: number, ip: string) {
    const merchant = await this.merchantRepository.findOne({ where: { id } });
    if (!merchant) {
      throw new NotFoundException('商户不存在');
    }

    merchant.status = 'disabled';
    await this.merchantRepository.save(merchant);

    // 记录审计日志
    await this.createAuditLog({
      userId: operatorId,
      action: 'DELETE_MERCHANT',
      resourceType: 'merchant',
      resourceId: id.toString(),
      description: `删除商户: ${merchant.name}`,
      ipAddress: ip,
    });

    return { message: '商户删除成功' };
  }

  /**
   * 创建门店
   */
  async createStore(createStoreDto: CreateStoreDto, operatorId: number, ip: string) {
    const store = this.storeRepository.create(createStoreDto);
    const savedStore = await this.storeRepository.save(store);

    // 记录审计日志
    await this.createAuditLog({
      userId: operatorId,
      action: 'CREATE_STORE',
      resourceType: 'store',
      resourceId: savedStore.id.toString(),
      description: `创建门店: ${savedStore.name}`,
      newData: JSON.stringify(savedStore),
      ipAddress: ip,
    });

    return savedStore;
  }

  /**
   * 获取门店列表
   */
  async getStores(query: StoreQueryDto) {
    const { page = 1, limit = 10, search, merchantId, status } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.storeRepository.createQueryBuilder('store')
      .leftJoinAndSelect('store.merchant', 'merchant')
      .leftJoinAndSelect('store.devices', 'device');

    if (search) {
      queryBuilder.andWhere(
        '(store.name LIKE :search OR store.address LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (merchantId) {
      queryBuilder.andWhere('store.merchantId = :merchantId', { merchantId });
    }

    if (status) {
      queryBuilder.andWhere('store.status = :status', { status });
    }

    const [stores, total] = await queryBuilder
      .orderBy('store.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: stores,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取门店详情
   */
  async getStoreById(id: number) {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['merchant', 'devices', 'inventory', 'staff'],
    });

    if (!store) {
      throw new NotFoundException('门店不存在');
    }

    return store;
  }

  /**
   * 更新门店信息
   */
  async updateStore(id: number, updateStoreDto: UpdateStoreDto, operatorId: number, ip: string) {
    const store = await this.storeRepository.findOne({ where: { id } });
    if (!store) {
      throw new NotFoundException('门店不存在');
    }

    const oldData = { ...store };
    Object.assign(store, updateStoreDto);
    
    const updatedStore = await this.storeRepository.save(store);

    // 记录审计日志
    await this.createAuditLog({
      userId: operatorId,
      action: 'UPDATE_STORE',
      resourceType: 'store',
      resourceId: id.toString(),
      description: `更新门店信息: ${store.name}`,
      oldData: JSON.stringify(oldData),
      newData: JSON.stringify(updatedStore),
      ipAddress: ip,
    });

    return updatedStore;
  }

  /**
   * 删除门店（软删除）
   */
  async deleteStore(id: number, operatorId: number, ip: string) {
    const store = await this.storeRepository.findOne({ where: { id } });
    if (!store) {
      throw new NotFoundException('门店不存在');
    }

    store.status = 'disabled';
    await this.storeRepository.save(store);

    // 记录审计日志
    await this.createAuditLog({
      userId: operatorId,
      action: 'DELETE_STORE',
      resourceType: 'store',
      resourceId: id.toString(),
      description: `删除门店: ${store.name}`,
      ipAddress: ip,
    });

    return { message: '门店删除成功' };
   }

  /**
   * 创建设备
   */
  async createDevice(createDeviceDto: CreateDeviceDto, operatorId: number, ip: string) {
    const device = this.deviceRepository.create(createDeviceDto);
    const savedDevice = await this.deviceRepository.save(device);

    // 记录审计日志
    await this.createAuditLog({
      userId: operatorId,
      action: 'CREATE_DEVICE',
      resourceType: 'device',
      resourceId: savedDevice.id.toString(),
      description: `创建设备: ${savedDevice.name}`,
      newData: JSON.stringify(savedDevice),
      ipAddress: ip,
    });

    return savedDevice;
  }

  /**
   * 获取设备列表
   */
  async getDevices(query: DeviceQueryDto) {
    const { page = 1, limit = 10, search, storeId, status } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.deviceRepository.createQueryBuilder('device')
      .leftJoinAndSelect('device.store', 'store')
      .leftJoinAndSelect('device.merchant', 'merchant');

    if (search) {
      queryBuilder.andWhere(
        '(device.name LIKE :search OR device.devid LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (storeId) {
      queryBuilder.andWhere('device.storeId = :storeId', { storeId });
    }

    if (status) {
      queryBuilder.andWhere('device.status = :status', { status });
    }

    const [devices, total] = await queryBuilder
      .orderBy('device.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: devices,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取设备详情
   */
  async getDeviceById(id: number) {
    const device = await this.deviceRepository.findOne({
      where: { id },
      relations: ['store', 'merchant', 'orders'],
    });

    if (!device) {
      throw new NotFoundException('设备不存在');
    }

    return device;
  }

  /**
   * 更新设备信息
   */
  async updateDevice(id: number, updateDeviceDto: UpdateDeviceDto, operatorId: number, ip: string) {
    const device = await this.deviceRepository.findOne({ where: { id } });
    if (!device) {
      throw new NotFoundException('设备不存在');
    }

    const oldData = { ...device };
    Object.assign(device, updateDeviceDto);
    
    const updatedDevice = await this.deviceRepository.save(device);

    // 记录审计日志
    await this.createAuditLog({
      userId: operatorId,
      action: 'UPDATE_DEVICE',
      resourceType: 'device',
      resourceId: id.toString(),
      description: `更新设备信息: ${device.name}`,
      oldData: JSON.stringify(oldData),
      newData: JSON.stringify(updatedDevice),
      ipAddress: ip,
    });

    return updatedDevice;
  }

  /**
   * 删除设备（软删除）
   */
  async deleteDevice(id: number, operatorId: number, ip: string) {
    const device = await this.deviceRepository.findOne({ where: { id } });
    if (!device) {
      throw new NotFoundException('设备不存在');
    }

    device.status = 'offline';
    await this.deviceRepository.save(device);

    // 记录审计日志
    await this.createAuditLog({
      userId: operatorId,
      action: 'DELETE_DEVICE',
      resourceType: 'device',
      resourceId: id.toString(),
      description: `删除设备: ${device.name}`,
      ipAddress: ip,
    });

    return { message: '设备删除成功' };
  }

  /**
   * 获取设备日志
   */
  async getDeviceLogs(deviceId: number, query: PaginationDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [logs, total] = await this.deviceLogRepository.findAndCount({
      where: { deviceId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取订单列表
   */
  async getOrders(query: OrderQueryDto) {
    const { page = 1, limit = 10, search, merchantId, storeId, status } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.device', 'device')
      .leftJoinAndSelect('order.store', 'store')
      .leftJoinAndSelect('store.merchant', 'merchant');

    if (search) {
      queryBuilder.andWhere(
        '(order.orderNumber LIKE :search OR user.phone LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (merchantId) {
      queryBuilder.andWhere('merchant.id = :merchantId', { merchantId });
    }

    if (storeId) {
      queryBuilder.andWhere('order.storeId = :storeId', { storeId });
    }

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    const [orders, total] = await queryBuilder
      .orderBy('order.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取订单详情
   */
  async getOrderById(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'device', 'store', 'store.merchant'],
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return order;
  }

  /**
   * 更新订单信息
   */
  async updateOrder(id: number, updateOrderDto: UpdateOrderDto, operatorId: number, ip: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, { where: { id } });
      if (!order) {
        throw new NotFoundException('订单不存在');
      }

      const oldData = { ...order };
      const oldStatus = order.status;
      
      Object.assign(order, updateOrderDto);
      const updatedOrder = await queryRunner.manager.save(order);

      // 如果订单状态变为已取消且原状态为已支付，需要退款
      if (oldStatus === 'paid' && updateOrderDto.status === 'cancelled') {
        const user = await queryRunner.manager.findOne(User, { where: { id: order.userId } });
        if (user) {
          user.balance += order.amount;
          await queryRunner.manager.save(user);
        }
      }

      // 记录审计日志
      await this.createAuditLog({
        userId: operatorId,
        action: 'UPDATE_ORDER',
        resourceType: 'order',
        resourceId: id.toString(),
        description: `更新订单: ${order.orderNo}`,
        oldData: JSON.stringify(oldData),
        newData: JSON.stringify(updatedOrder),
        ipAddress: ip,
      });

      await queryRunner.commitTransaction();
      return updatedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
       await queryRunner.release();
     }
   }

  /**
   * 获取库存列表
   */
  async getInventory(query: InventoryQueryDto) {
    const { page = 1, limit = 10, search, storeId, lowStock } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.inventoryRepository.createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.store', 'store')
      .leftJoinAndSelect('store.merchant', 'merchant');

    if (search) {
      queryBuilder.andWhere(
        '(inventory.itemName LIKE :search OR inventory.itemCode LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (storeId) {
      queryBuilder.andWhere('inventory.storeId = :storeId', { storeId });
    }

    if (lowStock) {
      queryBuilder.andWhere('inventory.currentStock <= inventory.minStock');
    }

    const [inventory, total] = await queryBuilder
      .orderBy('inventory.updatedAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: inventory,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 更新库存
   */
  async updateInventory(id: number, updateInventoryDto: UpdateInventoryDto, operatorId: number, ip: string) {
    const inventory = await this.inventoryRepository.findOne({ where: { id } });
    if (!inventory) {
      throw new NotFoundException('库存记录不存在');
    }

    const oldData = { ...inventory };
    Object.assign(inventory, updateInventoryDto);
    inventory.updatedAt = new Date();
    
    const updatedInventory = await this.inventoryRepository.save(inventory);

    // 检查是否需要创建低库存告警
    if (inventory.currentStock <= inventory.minThreshold) {
      await this.createLowStockAlert(inventory);
    }

    // 记录审计日志
    await this.createAuditLog({
      userId: operatorId,
      action: 'UPDATE_INVENTORY',
      resourceType: 'inventory',
      resourceId: id.toString(),
      description: `更新库存: ${inventory.itemName}`,
      oldData: JSON.stringify(oldData),
      newData: JSON.stringify(updatedInventory),
      ipAddress: ip,
    });

    return updatedInventory;
  }

  /**
   * 创建低库存告警
   */
  private async createLowStockAlert(inventory: Inventory) {
    const existingAlert = await this.alertRepository.findOne({
      where: {
        storeId: inventory.storeId,
        type: 'low_inventory',
        status: 'pending',
      },
    });

    if (!existingAlert) {
      const alert = this.alertRepository.create({
        storeId: inventory.storeId,
        type: 'low_inventory',
        level: 'medium',
        title: '库存不足告警',
        content: `${inventory.itemName} 库存不足，当前库存: ${inventory.currentStock}，最低库存: ${inventory.minThreshold}`,
        status: 'pending',
      });

      await this.alertRepository.save(alert);
    }
  }

  /**
   * 获取告警列表
   */
  async getAlerts(query: AlertQueryDto) {
    const { page = 1, limit = 10, storeId, type, level, status } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.alertRepository.createQueryBuilder('alert')
      .leftJoinAndSelect('alert.store', 'store')
      .leftJoinAndSelect('store.merchant', 'merchant');

    if (storeId) {
      queryBuilder.andWhere('alert.storeId = :storeId', { storeId });
    }

    if (type) {
      queryBuilder.andWhere('alert.type = :type', { type });
    }

    if (level) {
      queryBuilder.andWhere('alert.level = :level', { level });
    }

    if (status) {
      queryBuilder.andWhere('alert.status = :status', { status });
    }

    const [alerts, total] = await queryBuilder
      .orderBy('alert.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: alerts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 确认告警
   */
  async acknowledgeAlert(id: number, acknowledgeAlertDto: AcknowledgeAlertDto, operatorId: number, ip: string) {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) {
      throw new NotFoundException('告警不存在');
    }

    const oldData = { ...alert };
    alert.status = 'acknowledged';
    alert.acknowledgedAt = new Date();
    alert.acknowledgedBy = operatorId;
    alert.resolution = acknowledgeAlertDto.resolution;
    
    const updatedAlert = await this.alertRepository.save(alert);

    // 记录审计日志
    await this.createAuditLog({
      userId: operatorId,
      action: 'ACKNOWLEDGE_ALERT',
      resourceType: 'alert',
      resourceId: id.toString(),
      description: `确认告警: ${alert.title}`,
      oldData: JSON.stringify(oldData),
      newData: JSON.stringify(updatedAlert),
      ipAddress: ip,
    });

    return updatedAlert;
  }

  /**
   * 获取系统健康状态
   */
  async getSystemHealth() {
    const [dbStatus, redisStatus] = await Promise.allSettled([
      this.checkDatabaseHealth(),
      this.checkRedisHealth(),
    ]);

    return {
      database: {
        status: dbStatus.status === 'fulfilled' ? 'healthy' : 'unhealthy',
        message: dbStatus.status === 'fulfilled' ? 'Database connection is healthy' : 'Database connection failed',
        details: dbStatus.status === 'rejected' ? dbStatus.reason?.message : null,
      },
      redis: {
        status: redisStatus.status === 'fulfilled' ? 'healthy' : 'unhealthy',
        message: redisStatus.status === 'fulfilled' ? 'Redis connection is healthy' : 'Redis connection failed',
        details: redisStatus.status === 'rejected' ? redisStatus.reason?.message : null,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 检查数据库健康状态
   */
  private async checkDatabaseHealth() {
    await this.dataSource.query('SELECT 1');
    return true;
  }

  /**
   * 检查Redis健康状态
   */
  private async checkRedisHealth() {
    await this.redisService.ping();
    return true;
  }

  /**
   * 获取系统日志
   */
  async getSystemLogs(query: PaginationDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [logs, total] = await this.auditLogRepository.findAndCount({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 清理系统缓存
   */
  async clearCache(operatorId: number, ip: string) {
    await this.redisService.flushAll();

    // 记录审计日志
    await this.createAuditLog({
      userId: operatorId,
      action: 'CLEAR_CACHE',
      resourceType: 'system',
      resourceId: 'cache',
      description: '清理系统缓存',
      ipAddress: ip,
    });

    return { message: '缓存清理成功' };
  }

  /**
   * 导出数据
   */
  async exportData(exportDataDto: ExportDataDto, operatorId: number, ip: string) {
    const { type, format, startDate, endDate } = exportDataDto;
    
    // 转换日期字符串为Date对象
    const parsedStartDate = startDate ? new Date(startDate) : undefined;
    const parsedEndDate = endDate ? new Date(endDate) : undefined;
    
    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'users':
        data = await this.exportUsers(parsedStartDate, parsedEndDate);
        filename = `users_${Date.now()}.${format}`;
        break;
      case 'orders':
        data = await this.exportOrders(parsedStartDate, parsedEndDate);
        filename = `orders_${Date.now()}.${format}`;
        break;
      case 'devices':
        data = await this.exportDevices();
        filename = `devices_${Date.now()}.${format}`;
        break;
      default:
        throw new BadRequestException('不支持的导出类型');
    }

    // 记录审计日志
    await this.createAuditLog({
      userId: operatorId,
      action: 'EXPORT_DATA',
      resourceType: 'system',
      resourceId: type,
      description: `导出${type}数据`,
      ipAddress: ip,
    });

    return {
      data,
      filename,
      total: data.length,
    };
  }

  /**
   * 导出用户数据
   */
  private async exportUsers(startDate?: Date, endDate?: Date) {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.store', 'store');

    if (startDate) {
      queryBuilder.andWhere('user.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('user.createdAt <= :endDate', { endDate });
    }

    const users = await queryBuilder.getMany();
    
    return users.map(user => ({
      id: user.id,
      phone: user.phone,
      nickname: user.nickname,
      role: user.role,
      status: user.status,
      balance: user.balance,
      storeName: user.store?.name || '',
      createdAt: user.createdAt,
    }));
  }

  /**
   * 导出订单数据
   */
  private async exportOrders(startDate?: Date, endDate?: Date) {
    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.device', 'device')
      .leftJoinAndSelect('order.store', 'store');

    if (startDate) {
      queryBuilder.andWhere('order.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('order.createdAt <= :endDate', { endDate });
    }

    const orders = await queryBuilder.getMany();
    
    return orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNo,
      userPhone: order.user?.phone || '',
      deviceName: order.device?.name || '',
      storeName: order.store?.name || '',
      serviceType: order.washType,
      amount: order.amount,
      status: order.status,
      createdAt: order.createdAt,
      completedAt: order.endTime,
    }));
  }

  /**
   * 导出设备数据
   */
  private async exportDevices() {
    const devices = await this.deviceRepository.find({
      relations: ['store', 'merchant'],
    });
    
    return devices.map(device => ({
      id: device.id,
      devid: device.devid,
      name: device.name,
      model: device.model,
      status: device.status,
      storeName: device.store?.name || '',
      merchantName: device.merchant?.name || '',
      location: device.location,
      lastOnlineAt: device.lastOnlineAt,
      createdAt: device.createdAt,
    }));
  }

  /**
   * 创建审计日志
   */
  private async createAuditLog(logData: {
    userId: number;
    action: string;
    resourceType: string;
    resourceId: string;
    description: string;
    oldData?: string;
    newData?: string;
    ipAddress: string;
  }) {
    const auditLog = this.auditLogRepository.create({
      ...logData,
      resourceId: logData.resourceId ? parseInt(logData.resourceId) : null,
    });
    await this.auditLogRepository.save(auditLog);
  }

}