"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const merchant_entity_1 = require("../merchant/entities/merchant.entity");
const store_entity_1 = require("../store/entities/store.entity");
const device_entity_1 = require("../device/entities/device.entity");
const order_entity_1 = require("../order/entities/order.entity");
const inventory_entity_1 = require("../inventory/entities/inventory.entity");
const alert_entity_1 = require("../alert/entities/alert.entity");
const audit_log_entity_1 = require("../audit/entities/audit-log.entity");
const device_log_entity_1 = require("../device/entities/device-log.entity");
const redis_config_1 = require("../../config/redis.config");
let AdminService = class AdminService {
    constructor(userRepository, merchantRepository, storeRepository, deviceRepository, orderRepository, inventoryRepository, alertRepository, auditLogRepository, deviceLogRepository, dataSource, redisService) {
        this.userRepository = userRepository;
        this.merchantRepository = merchantRepository;
        this.storeRepository = storeRepository;
        this.deviceRepository = deviceRepository;
        this.orderRepository = orderRepository;
        this.inventoryRepository = inventoryRepository;
        this.alertRepository = alertRepository;
        this.auditLogRepository = auditLogRepository;
        this.deviceLogRepository = deviceLogRepository;
        this.dataSource = dataSource;
        this.redisService = redisService;
    }
    async getDashboardStats() {
        const [userCount, merchantCount, storeCount, deviceCount, orderCount] = await Promise.all([
            this.userRepository.count({ where: { status: 'active' } }),
            this.merchantRepository.count({ where: { status: 'active' } }),
            this.storeRepository.count({ where: { status: 'active' } }),
            this.deviceRepository.count(),
            this.orderRepository.count(),
        ]);
        const totalRevenue = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.amount)', 'total')
            .where('order.status = :status', { status: 'completed' })
            .getRawOne();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const [todayOrderCount, todayRevenue] = await Promise.all([
            this.orderRepository.count({
                where: {
                    createdAt: (0, typeorm_2.Between)(today, tomorrow),
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
        const onlineDeviceCount = await this.deviceRepository.count({
            where: { status: 'online' },
        });
        return {
            userCount,
            merchantCount,
            storeCount,
            deviceCount,
            orderCount,
            totalRevenue: parseInt(totalRevenue?.total || '0'),
            todayOrderCount,
            todayRevenue: parseInt(todayRevenue?.total || '0'),
            onlineDeviceCount,
            deviceOnlineRate: deviceCount > 0 ? ((onlineDeviceCount / deviceCount) * 100).toFixed(2) : '0',
        };
    }
    async getUserTrend(days = 7) {
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
    async getOrderTrend(days = 7) {
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
    async getUsers(query) {
        const { page = 1, limit = 10, search, role, status } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.store', 'store');
        if (search) {
            queryBuilder.andWhere('(user.phone LIKE :search OR user.nickname LIKE :search)', { search: `%${search}%` });
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
    async getUserById(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['store', 'orders'],
        });
        if (!user) {
            throw new common_1.NotFoundException('用户不存在');
        }
        return user;
    }
    async updateUser(id, updateUserDto, operatorId, ip) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('用户不存在');
        }
        const oldData = { ...user };
        Object.assign(user, updateUserDto);
        const updatedUser = await this.userRepository.save(user);
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
    async deleteUser(id, operatorId, ip) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('用户不存在');
        }
        user.status = 'disabled';
        await this.userRepository.save(user);
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
    async createMerchant(createMerchantDto, operatorId, ip) {
        const merchant = this.merchantRepository.create(createMerchantDto);
        const savedMerchant = await this.merchantRepository.save(merchant);
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
    async getMerchants(query) {
        const { page = 1, limit = 10, search, status } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.merchantRepository.createQueryBuilder('merchant')
            .leftJoinAndSelect('merchant.stores', 'store');
        if (search) {
            queryBuilder.andWhere('(merchant.name LIKE :search OR merchant.contactPhone LIKE :search)', { search: `%${search}%` });
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
    async getMerchantById(id) {
        const merchant = await this.merchantRepository.findOne({
            where: { id },
            relations: ['stores', 'stores.devices'],
        });
        if (!merchant) {
            throw new common_1.NotFoundException('商户不存在');
        }
        return merchant;
    }
    async updateMerchant(id, updateMerchantDto, operatorId, ip) {
        const merchant = await this.merchantRepository.findOne({ where: { id } });
        if (!merchant) {
            throw new common_1.NotFoundException('商户不存在');
        }
        const oldData = { ...merchant };
        Object.assign(merchant, updateMerchantDto);
        const updatedMerchant = await this.merchantRepository.save(merchant);
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
    async deleteMerchant(id, operatorId, ip) {
        const merchant = await this.merchantRepository.findOne({ where: { id } });
        if (!merchant) {
            throw new common_1.NotFoundException('商户不存在');
        }
        merchant.status = 'disabled';
        await this.merchantRepository.save(merchant);
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
    async createStore(createStoreDto, operatorId, ip) {
        const store = this.storeRepository.create(createStoreDto);
        const savedStore = await this.storeRepository.save(store);
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
    async getStores(query) {
        const { page = 1, limit = 10, search, merchantId, status } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.storeRepository.createQueryBuilder('store')
            .leftJoinAndSelect('store.merchant', 'merchant')
            .leftJoinAndSelect('store.devices', 'device');
        if (search) {
            queryBuilder.andWhere('(store.name LIKE :search OR store.address LIKE :search)', { search: `%${search}%` });
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
    async getStoreById(id) {
        const store = await this.storeRepository.findOne({
            where: { id },
            relations: ['merchant', 'devices', 'inventory', 'staff'],
        });
        if (!store) {
            throw new common_1.NotFoundException('门店不存在');
        }
        return store;
    }
    async updateStore(id, updateStoreDto, operatorId, ip) {
        const store = await this.storeRepository.findOne({ where: { id } });
        if (!store) {
            throw new common_1.NotFoundException('门店不存在');
        }
        const oldData = { ...store };
        Object.assign(store, updateStoreDto);
        const updatedStore = await this.storeRepository.save(store);
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
    async deleteStore(id, operatorId, ip) {
        const store = await this.storeRepository.findOne({ where: { id } });
        if (!store) {
            throw new common_1.NotFoundException('门店不存在');
        }
        store.status = 'disabled';
        await this.storeRepository.save(store);
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
    async createDevice(createDeviceDto, operatorId, ip) {
        const device = this.deviceRepository.create(createDeviceDto);
        const savedDevice = await this.deviceRepository.save(device);
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
    async getDevices(query) {
        const { page = 1, limit = 10, search, storeId, status } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.deviceRepository.createQueryBuilder('device')
            .leftJoinAndSelect('device.store', 'store')
            .leftJoinAndSelect('device.merchant', 'merchant');
        if (search) {
            queryBuilder.andWhere('(device.name LIKE :search OR device.devid LIKE :search)', { search: `%${search}%` });
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
    async getDeviceById(id) {
        const device = await this.deviceRepository.findOne({
            where: { id },
            relations: ['store', 'merchant', 'orders'],
        });
        if (!device) {
            throw new common_1.NotFoundException('设备不存在');
        }
        return device;
    }
    async updateDevice(id, updateDeviceDto, operatorId, ip) {
        const device = await this.deviceRepository.findOne({ where: { id } });
        if (!device) {
            throw new common_1.NotFoundException('设备不存在');
        }
        const oldData = { ...device };
        Object.assign(device, updateDeviceDto);
        const updatedDevice = await this.deviceRepository.save(device);
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
    async deleteDevice(id, operatorId, ip) {
        const device = await this.deviceRepository.findOne({ where: { id } });
        if (!device) {
            throw new common_1.NotFoundException('设备不存在');
        }
        device.status = 'offline';
        await this.deviceRepository.save(device);
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
    async getDeviceLogs(deviceId, query) {
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
    async getOrders(query) {
        const { page = 1, limit = 10, search, merchantId, storeId, status } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.orderRepository.createQueryBuilder('order')
            .leftJoinAndSelect('order.user', 'user')
            .leftJoinAndSelect('order.device', 'device')
            .leftJoinAndSelect('order.store', 'store')
            .leftJoinAndSelect('store.merchant', 'merchant');
        if (search) {
            queryBuilder.andWhere('(order.orderNumber LIKE :search OR user.phone LIKE :search)', { search: `%${search}%` });
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
    async getOrderById(id) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['user', 'device', 'store', 'store.merchant'],
        });
        if (!order) {
            throw new common_1.NotFoundException('订单不存在');
        }
        return order;
    }
    async updateOrder(id, updateOrderDto, operatorId, ip) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const order = await queryRunner.manager.findOne(order_entity_1.Order, { where: { id } });
            if (!order) {
                throw new common_1.NotFoundException('订单不存在');
            }
            const oldData = { ...order };
            const oldStatus = order.status;
            Object.assign(order, updateOrderDto);
            const updatedOrder = await queryRunner.manager.save(order);
            if (oldStatus === 'paid' && updateOrderDto.status === 'cancelled') {
                const user = await queryRunner.manager.findOne(user_entity_1.User, { where: { id: order.userId } });
                if (user) {
                    user.balance += order.amount;
                    await queryRunner.manager.save(user);
                }
            }
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
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getInventory(query) {
        const { page = 1, limit = 10, search, storeId, lowStock } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.inventoryRepository.createQueryBuilder('inventory')
            .leftJoinAndSelect('inventory.store', 'store')
            .leftJoinAndSelect('store.merchant', 'merchant');
        if (search) {
            queryBuilder.andWhere('(inventory.itemName LIKE :search OR inventory.itemCode LIKE :search)', { search: `%${search}%` });
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
    async updateInventory(id, updateInventoryDto, operatorId, ip) {
        const inventory = await this.inventoryRepository.findOne({ where: { id } });
        if (!inventory) {
            throw new common_1.NotFoundException('库存记录不存在');
        }
        const oldData = { ...inventory };
        Object.assign(inventory, updateInventoryDto);
        inventory.updatedAt = new Date();
        const updatedInventory = await this.inventoryRepository.save(inventory);
        if (inventory.currentStock <= inventory.minThreshold) {
            await this.createLowStockAlert(inventory);
        }
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
    async createLowStockAlert(inventory) {
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
    async getAlerts(query) {
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
    async acknowledgeAlert(id, acknowledgeAlertDto, operatorId, ip) {
        const alert = await this.alertRepository.findOne({ where: { id } });
        if (!alert) {
            throw new common_1.NotFoundException('告警不存在');
        }
        const oldData = { ...alert };
        alert.status = 'acknowledged';
        alert.acknowledgedAt = new Date();
        alert.acknowledgedBy = operatorId;
        alert.resolution = acknowledgeAlertDto.resolution;
        const updatedAlert = await this.alertRepository.save(alert);
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
    async checkDatabaseHealth() {
        await this.dataSource.query('SELECT 1');
        return true;
    }
    async checkRedisHealth() {
        await this.redisService.ping();
        return true;
    }
    async getSystemLogs(query) {
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
    async clearCache(operatorId, ip) {
        await this.redisService.flushAll();
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
    async exportData(exportDataDto, operatorId, ip) {
        const { type, format, startDate, endDate } = exportDataDto;
        const parsedStartDate = startDate ? new Date(startDate) : undefined;
        const parsedEndDate = endDate ? new Date(endDate) : undefined;
        let data = [];
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
                throw new common_1.BadRequestException('不支持的导出类型');
        }
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
    async exportUsers(startDate, endDate) {
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
    async exportOrders(startDate, endDate) {
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
    async exportDevices() {
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
    async createAuditLog(logData) {
        const auditLog = this.auditLogRepository.create({
            ...logData,
            resourceId: logData.resourceId ? parseInt(logData.resourceId) : null,
        });
        await this.auditLogRepository.save(auditLog);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(merchant_entity_1.Merchant)),
    __param(2, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(3, (0, typeorm_1.InjectRepository)(device_entity_1.Device)),
    __param(4, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(5, (0, typeorm_1.InjectRepository)(inventory_entity_1.Inventory)),
    __param(6, (0, typeorm_1.InjectRepository)(alert_entity_1.Alert)),
    __param(7, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __param(8, (0, typeorm_1.InjectRepository)(device_log_entity_1.DeviceLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        redis_config_1.RedisService])
], AdminService);
//# sourceMappingURL=admin.service.js.map