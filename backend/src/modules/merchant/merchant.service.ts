import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between, In } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../../common/decorators/roles.decorator';
import { Device } from '../device/entities/device.entity';
import { Order } from '../order/entities/order.entity';
import { Merchant } from './entities/merchant.entity';
import { Store } from '../store/entities/store.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Alert } from '../alert/entities/alert.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { DeviceLog } from '../device/entities/device-log.entity';
import { RedisService } from '../../config/redis.config';
import {
  StoreQueryDto,
  DeviceQueryDto,
  OrderQueryDto,
  InventoryQueryDto,
  AlertQueryDto,
  UserQueryDto,
  ReportQueryDto,
} from './dto/pagination.dto';
import {
  UpdateMerchantProfileDto,
  CreateStoreDto,
  UpdateStoreDto,
  CreateDeviceDto,
  UpdateDeviceDto,
  CreateStaffDto,
  UpdateStaffDto,
  UpdateInventoryDto,
  AcknowledgeAlertDto,
} from './dto/create-update.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    @InjectRepository(DeviceLog)
    private deviceLogRepository: Repository<DeviceLog>,
    private redisService: RedisService,
    private dataSource: DataSource,
  ) {}

  /**
   * 获取商户仪表盘统计数据
   */
  async getDashboardStats(merchantId: number) {
    const merchant = await this.merchantRepository.findOne({
      where: { id: merchantId },
      relations: ['stores'],
    });

    if (!merchant) {
      throw new NotFoundException('商户不存在');
    }

    const storeIds = merchant.stores.map(store => store.id);

    // 门店统计
    const totalStores = storeIds.length;
    const activeStores = await this.storeRepository.count({
      where: { merchantId, status: 'active' },
    });

    // 设备统计
    const totalDevices = await this.deviceRepository.count({
      where: { storeId: storeIds.length > 0 ? In(storeIds) : undefined },
    });
    const onlineDevices = await this.deviceRepository.count({
      where: {
        storeId: storeIds.length > 0 ? In(storeIds) : undefined,
        status: 'online',
      },
    });

    // 今日订单统计
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = await this.orderRepository.count({
      where: {
        storeId: storeIds.length > 0 ? In(storeIds) : undefined,
        createdAt: Between(today, tomorrow),
      },
    });

    const todayRevenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.storeId IN (:...storeIds)', { storeIds: storeIds.length > 0 ? storeIds : [0] })
      .andWhere('order.createdAt >= :today', { today })
      .andWhere('order.createdAt < :tomorrow', { tomorrow })
      .andWhere('order.status = :status', { status: 'completed' })
      .getRawOne();

    // 待处理告警
    const pendingAlerts = await this.alertRepository.count({
      where: {
        storeId: storeIds.length > 0 ? In(storeIds) : undefined,
        status: 'pending',
      },
    });

    return {
      stores: {
        total: totalStores,
        active: activeStores,
      },
      devices: {
        total: totalDevices,
        online: onlineDevices,
        onlineRate: totalDevices > 0 ? ((onlineDevices / totalDevices) * 100).toFixed(1) : '0',
      },
      today: {
        orders: todayOrders,
        revenue: parseFloat(todayRevenue?.total || '0'),
      },
      alerts: {
        pending: pendingAlerts,
      },
    };
  }

  /**
   * 获取商户资料
   */
  async getMerchantProfile(merchantId: number) {
    const merchant = await this.merchantRepository.findOne({
      where: { id: merchantId },
    });

    if (!merchant) {
      throw new NotFoundException('商户不存在');
    }

    return merchant;
  }

  /**
   * 更新商户资料
   */
  async updateMerchantProfile(
    merchantId: number,
    updateData: UpdateMerchantProfileDto,
    operatorId: number,
    clientIp: string,
  ) {
    const merchant = await this.merchantRepository.findOne({
      where: { id: merchantId },
    });

    if (!merchant) {
      throw new NotFoundException('商户不存在');
    }

    await this.merchantRepository.update(merchantId, updateData);

    // 记录审计日志
    await this.auditLogRepository.save({
      action: 'update_merchant_profile',
      entityType: 'merchant',
      entityId: merchantId,
      operatorId,
      details: `更新商户资料: ${JSON.stringify(updateData)}`,
      ipAddress: clientIp,
    });

    return await this.merchantRepository.findOne({ where: { id: merchantId } });
  }

  /**
   * 获取门店列表
   */
  async getStores(merchantId: number, query: StoreQueryDto) {
    const { page = 1, limit = 10, search, status, city, district } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.storeRepository
      .createQueryBuilder('store')
      .where('store.merchantId = :merchantId', { merchantId });

    if (search) {
      queryBuilder.andWhere(
        '(store.name LIKE :search OR store.address LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('store.status = :status', { status });
    }

    if (city) {
      queryBuilder.andWhere('store.city = :city', { city });
    }

    if (district) {
      queryBuilder.andWhere('store.district = :district', { district });
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
  async getStoreById(merchantId: number, storeId: number) {
    const store = await this.storeRepository.findOne({
      where: { id: storeId, merchantId },
      relations: ['devices', 'inventory'],
    });

    if (!store) {
      throw new NotFoundException('门店不存在');
    }

    return store;
  }

  /**
   * 创建门店
   */
  async createStore(
    merchantId: number,
    createData: CreateStoreDto,
    operatorId: number,
    clientIp: string,
  ) {
    const store = this.storeRepository.create({
      ...createData,
      merchantId,
    });

    const savedStore = await this.storeRepository.save(store);

    // 记录审计日志
    await this.auditLogRepository.save({
      action: 'create_store',
      entityType: 'store',
      entityId: savedStore.id,
      operatorId,
      details: `创建门店: ${savedStore.name}`,
      ipAddress: clientIp,
    });

    return savedStore;
  }

  /**
   * 更新门店
   */
  async updateStore(
    merchantId: number,
    storeId: number,
    updateData: UpdateStoreDto,
    operatorId: number,
    clientIp: string,
  ) {
    const store = await this.storeRepository.findOne({
      where: { id: storeId, merchantId },
    });

    if (!store) {
      throw new NotFoundException('门店不存在');
    }

    await this.storeRepository.update(storeId, updateData);

    // 记录审计日志
    await this.auditLogRepository.save({
      action: 'update_store',
      entityType: 'store',
      entityId: storeId,
      operatorId,
      details: `更新门店: ${JSON.stringify(updateData)}`,
      ipAddress: clientIp,
    });

    return await this.storeRepository.findOne({ where: { id: storeId } });
  }

  /**
   * 删除门店
   */
  async deleteStore(
    merchantId: number,
    storeId: number,
    operatorId: number,
    clientIp: string,
  ) {
    const store = await this.storeRepository.findOne({
      where: { id: storeId, merchantId },
    });

    if (!store) {
      throw new NotFoundException('门店不存在');
    }

    // 检查是否有关联设备
    const deviceCount = await this.deviceRepository.count({
      where: { storeId },
    });

    if (deviceCount > 0) {
      throw new BadRequestException('门店下还有设备，无法删除');
    }

    await this.storeRepository.softDelete(storeId);

    // 记录审计日志
    await this.auditLogRepository.save({
      action: 'delete_store',
      entityType: 'store',
      entityId: storeId,
      operatorId,
      details: `删除门店: ${store.name}`,
      ipAddress: clientIp,
    });

    return { message: '门店删除成功' };
  }

  /**
   * 获取设备列表
   */
  async getDevices(merchantId: number, query: DeviceQueryDto) {
    const { page = 1, limit = 10, search, storeId, status, model } = query;
    const skip = (page - 1) * limit;

    // 获取商户的所有门店ID
    const stores = await this.storeRepository.find({
      where: { merchantId },
      select: ['id'],
    });
    const storeIds = stores.map(store => store.id);

    if (storeIds.length === 0) {
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    const queryBuilder = this.deviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.store', 'store')
      .where('device.storeId IN (:...storeIds)', { storeIds });

    if (search) {
      queryBuilder.andWhere(
        '(device.name LIKE :search OR device.devid LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (storeId) {
      queryBuilder.andWhere('device.storeId = :storeId', { storeId });
    }

    if (status) {
      queryBuilder.andWhere('device.status = :status', { status });
    }

    if (model) {
      queryBuilder.andWhere('device.model = :model', { model });
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
  async getDeviceById(merchantId: number, deviceId: number) {
    const device = await this.deviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.store', 'store')
      .where('device.id = :deviceId', { deviceId })
      .andWhere('store.merchantId = :merchantId', { merchantId })
      .getOne();

    if (!device) {
      throw new NotFoundException('设备不存在');
    }

    return device;
  }

  /**
   * 创建设备
   */
  async createDevice(
    merchantId: number,
    createData: CreateDeviceDto,
    operatorId: number,
    clientIp: string,
  ) {
    // 验证门店是否属于该商户
    const store = await this.storeRepository.findOne({
      where: { id: createData.storeId, merchantId },
    });

    if (!store) {
      throw new NotFoundException('门店不存在');
    }

    // 检查设备ID是否已存在
    const existingDevice = await this.deviceRepository.findOne({
      where: { devid: createData.devid },
    });

    if (existingDevice) {
      throw new BadRequestException('设备ID已存在');
    }

    const device = this.deviceRepository.create(createData);
    const savedDevice = await this.deviceRepository.save(device);

    // 记录审计日志
    await this.auditLogRepository.save({
      action: 'create_device',
      entityType: 'device',
      entityId: savedDevice.id,
      operatorId,
      details: `创建设备: ${savedDevice.name} (${savedDevice.devid})`,
      ipAddress: clientIp,
    });

    return savedDevice;
  }

  /**
   * 更新设备
   */
  async updateDevice(
    merchantId: number,
    deviceId: number,
    updateData: UpdateDeviceDto,
    operatorId: number,
    clientIp: string,
  ) {
    const device = await this.deviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.store', 'store')
      .where('device.id = :deviceId', { deviceId })
      .andWhere('store.merchantId = :merchantId', { merchantId })
      .getOne();

    if (!device) {
      throw new NotFoundException('设备不存在');
    }

    // 如果要更新门店，验证新门店是否属于该商户
    if (updateData.storeId) {
      const store = await this.storeRepository.findOne({
        where: { id: updateData.storeId, merchantId },
      });

      if (!store) {
        throw new NotFoundException('目标门店不存在');
      }
    }

    await this.deviceRepository.update(deviceId, updateData);

    // 记录审计日志
    await this.auditLogRepository.save({
      action: 'update_device',
      entityType: 'device',
      entityId: deviceId,
      operatorId,
      details: `更新设备: ${JSON.stringify(updateData)}`,
      ipAddress: clientIp,
    });

    return await this.deviceRepository.findOne({
      where: { id: deviceId },
      relations: ['store'],
    });
  }

  /**
   * 删除设备
   */
  async deleteDevice(
    merchantId: number,
    deviceId: number,
    operatorId: number,
    clientIp: string,
  ) {
    const device = await this.deviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.store', 'store')
      .where('device.id = :deviceId', { deviceId })
      .andWhere('store.merchantId = :merchantId', { merchantId })
      .getOne();

    if (!device) {
      throw new NotFoundException('设备不存在');
    }

    await this.deviceRepository.softDelete(deviceId);

    // 记录审计日志
    await this.auditLogRepository.save({
      action: 'delete_device',
      entityType: 'device',
      entityId: deviceId,
      operatorId,
      details: `删除设备: ${device.name} (${device.devid})`,
      ipAddress: clientIp,
    });

    return { message: '设备删除成功' };
  }

  /**
   * 获取设备日志
   */
  async getDeviceLogs(merchantId: number, deviceId: number, query: any) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // 验证设备是否属于该商户
    const device = await this.deviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.store', 'store')
      .where('device.id = :deviceId', { deviceId })
      .andWhere('store.merchantId = :merchantId', { merchantId })
      .getOne();

    if (!device) {
      throw new NotFoundException('设备不存在');
    }

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
  async getOrders(merchantId: number, query: OrderQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      storeId,
      status,
      serviceType,
      startDate,
      endDate,
      minAmount,
      maxAmount,
    } = query;
    const skip = (page - 1) * limit;

    // 获取商户的所有门店ID
    const stores = await this.storeRepository.find({
      where: { merchantId },
      select: ['id'],
    });
    const storeIds = stores.map(store => store.id);

    if (storeIds.length === 0) {
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.device', 'device')
      .leftJoinAndSelect('order.store', 'store')
      .where('order.storeId IN (:...storeIds)', { storeIds });

    if (search) {
      queryBuilder.andWhere(
        '(order.orderNumber LIKE :search OR user.phone LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (storeId) {
      queryBuilder.andWhere('order.storeId = :storeId', { storeId });
    }

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (serviceType) {
      queryBuilder.andWhere('order.serviceType = :serviceType', { serviceType });
    }

    if (startDate) {
      queryBuilder.andWhere('order.createdAt >= :startDate', {
        startDate: new Date(startDate),
      });
    }

    if (endDate) {
      queryBuilder.andWhere('order.createdAt <= :endDate', {
        endDate: new Date(endDate),
      });
    }

    if (minAmount) {
      queryBuilder.andWhere('order.totalAmount >= :minAmount', { minAmount });
    }

    if (maxAmount) {
      queryBuilder.andWhere('order.totalAmount <= :maxAmount', { maxAmount });
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
  async getOrderById(merchantId: number, orderId: number) {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.device', 'device')
      .leftJoinAndSelect('order.store', 'store')
      .where('order.id = :orderId', { orderId })
      .andWhere('store.merchantId = :merchantId', { merchantId })
      .getOne();

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return order;
  }

  /**
   * 获取库存列表
   */
  async getInventory(merchantId: number, query: InventoryQueryDto) {
    const { page = 1, limit = 10, search, storeId, lowStock, category } = query;
    const skip = (page - 1) * limit;

    // 获取商户的所有门店ID
    const stores = await this.storeRepository.find({
      where: { merchantId },
      select: ['id'],
    });
    const storeIds = stores.map(store => store.id);

    if (storeIds.length === 0) {
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    const queryBuilder = this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.store', 'store')
      .where('inventory.storeId IN (:...storeIds)', { storeIds });

    if (search) {
      queryBuilder.andWhere(
        '(inventory.itemName LIKE :search OR inventory.itemCode LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (storeId) {
      queryBuilder.andWhere('inventory.storeId = :storeId', { storeId });
    }

    if (lowStock) {
      queryBuilder.andWhere('inventory.currentStock <= inventory.minStock');
    }

    if (category) {
      queryBuilder.andWhere('inventory.category = :category', { category });
    }

    const [inventory, total] = await queryBuilder
      .orderBy('inventory.createdAt', 'DESC')
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
  async updateInventory(
    merchantId: number,
    inventoryId: number,
    updateData: UpdateInventoryDto,
    operatorId: number,
    clientIp: string,
  ) {
    const inventory = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.store', 'store')
      .where('inventory.id = :inventoryId', { inventoryId })
      .andWhere('store.merchantId = :merchantId', { merchantId })
      .getOne();

    if (!inventory) {
      throw new NotFoundException('库存记录不存在');
    }

    await this.inventoryRepository.update(inventoryId, updateData);

    // 检查是否需要创建低库存告警
    if (updateData.currentStock !== undefined || updateData.minStock !== undefined) {
      const updatedInventory = await this.inventoryRepository.findOne({
        where: { id: inventoryId },
      });

      if (updatedInventory.currentStock <= updatedInventory.minThreshold) {
        await this.alertRepository.save({
          type: 'low_stock',
          level: 'warning',
          title: '库存不足告警',
          message: `${updatedInventory.itemName} 库存不足，当前库存: ${updatedInventory.currentStock}，最低库存: ${updatedInventory.minThreshold}`,
          storeId: updatedInventory.storeId,
          status: 'pending',
        });
      }
    }

    // 记录审计日志
    await this.auditLogRepository.save({
      action: 'update_inventory',
      entityType: 'inventory',
      entityId: inventoryId,
      operatorId,
      details: `更新库存: ${JSON.stringify(updateData)}`,
      ipAddress: clientIp,
    });

    return await this.inventoryRepository.findOne({
      where: { id: inventoryId },
      relations: ['store'],
    });
  }

  /**
   * 获取告警列表
   */
  async getAlerts(merchantId: number, query: AlertQueryDto) {
    const { page = 1, limit = 10, storeId, alertType, level, acknowledged } = query;
    const skip = (page - 1) * limit;

    // 获取商户的所有门店ID
    const stores = await this.storeRepository.find({
      where: { merchantId },
      select: ['id'],
    });
    const storeIds = stores.map(store => store.id);

    if (storeIds.length === 0) {
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    const queryBuilder = this.alertRepository
      .createQueryBuilder('alert')
      .leftJoinAndSelect('alert.store', 'store')
      .where('alert.storeId IN (:...storeIds)', { storeIds });

    if (storeId) {
      queryBuilder.andWhere('alert.storeId = :storeId', { storeId });
    }

    if (alertType) {
      queryBuilder.andWhere('alert.type = :alertType', { alertType });
    }

    if (level) {
      queryBuilder.andWhere('alert.level = :level', { level });
    }

    if (acknowledged !== undefined) {
      queryBuilder.andWhere('alert.acknowledged = :acknowledged', { acknowledged });
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
  async acknowledgeAlert(
    merchantId: number,
    alertId: number,
    acknowledgeData: AcknowledgeAlertDto,
    operatorId: number,
    clientIp: string,
  ) {
    const alert = await this.alertRepository
      .createQueryBuilder('alert')
      .leftJoinAndSelect('alert.store', 'store')
      .where('alert.id = :alertId', { alertId })
      .andWhere('store.merchantId = :merchantId', { merchantId })
      .getOne();

    if (!alert) {
      throw new NotFoundException('告警不存在');
    }

    await this.alertRepository.update(alertId, {
      status: 'acknowledged',
      acknowledgedAt: new Date(),
      remark: acknowledgeData.resolution,
    });

    // 记录审计日志
    await this.auditLogRepository.save({
      action: 'acknowledge_alert',
      entityType: 'alert',
      entityId: alertId,
      operatorId,
      details: `确认告警: ${acknowledgeData.resolution || '无备注'}`,
      ipAddress: clientIp,
    });

    return await this.alertRepository.findOne({
      where: { id: alertId },
      relations: ['store'],
    });
  }

  /**
   * 获取员工列表
   */
  async getStaff(merchantId: number, query: UserQueryDto) {
    const { page = 1, limit = 10, search, staffRole, status } = query;
    const skip = (page - 1) * limit;

    // 获取商户的所有门店ID
    const stores = await this.storeRepository.find({
      where: { merchantId },
      select: ['id'],
    });
    const storeIds = stores.map(store => store.id);

    if (storeIds.length === 0) {
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.storeId IN (:...storeIds)', { storeIds })
      .andWhere('user.role IN (:...roles)', { roles: ['store_manager', 'store_staff'] });

    if (search) {
      queryBuilder.andWhere(
        '(user.phone LIKE :search OR user.nickname LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (staffRole) {
      queryBuilder.andWhere('user.role = :staffRole', { staffRole });
    }

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    const [staff, total] = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: staff,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 创建员工
   */
  async createStaff(
    merchantId: number,
    storeId: number,
    createData: CreateStaffDto,
    operatorId: number,
    clientIp: string,
  ) {
    // 验证门店是否属于该商户
    const store = await this.storeRepository.findOne({
      where: { id: storeId, merchantId },
    });

    if (!store) {
      throw new NotFoundException('门店不存在');
    }

    // 检查手机号是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { phone: createData.phone },
    });

    if (existingUser) {
      throw new BadRequestException('手机号已存在');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(createData.password, 10);

    const user = this.userRepository.create({
      ...createData,
      password: hashedPassword,
      role: createData.staffRole as UserRole,
      storeId,
    });

    const savedUser = await this.userRepository.save(user) as User;

    // 记录审计日志
    await this.auditLogRepository.save({
      action: 'create_staff',
      entityType: 'user',
      entityId: savedUser.id,
      operatorId,
      details: `创建员工: ${savedUser.phone} (${savedUser.role})`,
      ipAddress: clientIp,
    });

    // 移除密码字段
    const { password, ...result } = savedUser;
    return result;
  }

  /**
   * 更新员工
   */
  async updateStaff(
    merchantId: number,
    staffId: number,
    updateData: UpdateStaffDto,
    operatorId: number,
    clientIp: string,
  ) {
    const staff = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.store', 'store')
      .where('user.id = :staffId', { staffId })
      .andWhere('store.merchantId = :merchantId', { merchantId })
      .andWhere('user.role IN (:...roles)', { roles: ['store_manager', 'store_staff'] })
      .getOne();

    if (!staff) {
      throw new NotFoundException('员工不存在');
    }

    const updatePayload: any = { ...updateData };
    if (updateData.staffRole) {
      updatePayload.role = updateData.staffRole;
      delete updatePayload.staffRole;
    }

    await this.userRepository.update(staffId, updatePayload);

    // 记录审计日志
    await this.auditLogRepository.save({
      action: 'update_staff',
      entityType: 'user',
      entityId: staffId,
      operatorId,
      details: `更新员工: ${JSON.stringify(updateData)}`,
      ipAddress: clientIp,
    });

    return await this.userRepository.findOne({
      where: { id: staffId },
      relations: ['store'],
    });
  }

  /**
   * 删除员工
   */
  async deleteStaff(
    merchantId: number,
    staffId: number,
    operatorId: number,
    clientIp: string,
  ) {
    const staff = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.store', 'store')
      .where('user.id = :staffId', { staffId })
      .andWhere('store.merchantId = :merchantId', { merchantId })
      .andWhere('user.role IN (:...roles)', { roles: ['store_manager', 'store_staff'] })
      .getOne();

    if (!staff) {
      throw new NotFoundException('员工不存在');
    }

    await this.userRepository.softDelete(staffId);

    // 记录审计日志
    await this.auditLogRepository.save({
      action: 'delete_staff',
      entityType: 'user',
      entityId: staffId,
      operatorId,
      details: `删除员工: ${staff.phone} (${staff.role})`,
      ipAddress: clientIp,
    });

    return { message: '员工删除成功' };
  }

  /**
   * 获取报表数据
   */
  async getReports(merchantId: number, query: ReportQueryDto) {
    const { startDate, endDate, storeId, groupBy = 'day' } = query;

    // 获取商户的所有门店ID
    const stores = await this.storeRepository.find({
      where: { merchantId },
      select: ['id'],
    });
    let storeIds = stores.map(store => store.id);

    if (storeId) {
      storeIds = storeIds.filter(id => id === storeId);
    }

    if (storeIds.length === 0) {
      return {
        orderStats: [],
        revenueStats: [],
        deviceStats: [],
      };
    }

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // 订单统计
    const orderStats = await this.orderRepository
      .createQueryBuilder('order')
      .select([
        `DATE_FORMAT(order.createdAt, '%Y-%m-%d') as date`,
        'COUNT(*) as orderCount',
        'SUM(order.totalAmount) as revenue',
      ])
      .where('order.storeId IN (:...storeIds)', { storeIds })
      .andWhere('order.createdAt BETWEEN :start AND :end', { start, end })
      .groupBy('DATE(order.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    // 设备使用统计
    const deviceStats = await this.deviceRepository
      .createQueryBuilder('device')
      .select([
        'device.status',
        'COUNT(*) as count',
      ])
      .where('device.storeId IN (:...storeIds)', { storeIds })
      .groupBy('device.status')
      .getRawMany();

    return {
      orderStats,
      deviceStats,
      summary: {
        totalOrders: orderStats.reduce((sum, item) => sum + parseInt(item.orderCount), 0),
        totalRevenue: orderStats.reduce((sum, item) => sum + parseFloat(item.revenue || '0'), 0),
        totalDevices: deviceStats.reduce((sum, item) => sum + parseInt(item.count), 0),
      },
    };
  }
}