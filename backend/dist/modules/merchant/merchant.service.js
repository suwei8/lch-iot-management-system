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
exports.MerchantService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const device_entity_1 = require("../device/entities/device.entity");
const order_entity_1 = require("../order/entities/order.entity");
const merchant_entity_1 = require("./entities/merchant.entity");
const store_entity_1 = require("../store/entities/store.entity");
const inventory_entity_1 = require("../inventory/entities/inventory.entity");
const alert_entity_1 = require("../alert/entities/alert.entity");
const audit_log_entity_1 = require("../audit/entities/audit-log.entity");
const device_log_entity_1 = require("../device/entities/device-log.entity");
const redis_config_1 = require("../../config/redis.config");
const bcrypt = require("bcrypt");
let MerchantService = class MerchantService {
    constructor(userRepository, deviceRepository, orderRepository, merchantRepository, storeRepository, inventoryRepository, alertRepository, auditLogRepository, deviceLogRepository, redisService, dataSource) {
        this.userRepository = userRepository;
        this.deviceRepository = deviceRepository;
        this.orderRepository = orderRepository;
        this.merchantRepository = merchantRepository;
        this.storeRepository = storeRepository;
        this.inventoryRepository = inventoryRepository;
        this.alertRepository = alertRepository;
        this.auditLogRepository = auditLogRepository;
        this.deviceLogRepository = deviceLogRepository;
        this.redisService = redisService;
        this.dataSource = dataSource;
    }
    async getDashboardStats(merchantId) {
        const merchant = await this.merchantRepository.findOne({
            where: { id: merchantId },
            relations: ['stores'],
        });
        if (!merchant) {
            throw new common_1.NotFoundException('商户不存在');
        }
        const storeIds = merchant.stores.map(store => store.id);
        const totalStores = storeIds.length;
        const activeStores = await this.storeRepository.count({
            where: { merchantId, status: 'active' },
        });
        const totalDevices = await this.deviceRepository.count({
            where: { storeId: storeIds.length > 0 ? (0, typeorm_2.In)(storeIds) : undefined },
        });
        const onlineDevices = await this.deviceRepository.count({
            where: {
                storeId: storeIds.length > 0 ? (0, typeorm_2.In)(storeIds) : undefined,
                status: 'online',
            },
        });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todayOrders = await this.orderRepository.count({
            where: {
                storeId: storeIds.length > 0 ? (0, typeorm_2.In)(storeIds) : undefined,
                createdAt: (0, typeorm_2.Between)(today, tomorrow),
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
        const pendingAlerts = await this.alertRepository.count({
            where: {
                storeId: storeIds.length > 0 ? (0, typeorm_2.In)(storeIds) : undefined,
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
    async getMerchantProfile(merchantId) {
        const merchant = await this.merchantRepository.findOne({
            where: { id: merchantId },
        });
        if (!merchant) {
            throw new common_1.NotFoundException('商户不存在');
        }
        return merchant;
    }
    async updateMerchantProfile(merchantId, updateData, operatorId, clientIp) {
        const merchant = await this.merchantRepository.findOne({
            where: { id: merchantId },
        });
        if (!merchant) {
            throw new common_1.NotFoundException('商户不存在');
        }
        await this.merchantRepository.update(merchantId, updateData);
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
    async getStores(merchantId, query) {
        const { page = 1, limit = 10, search, status, city, district } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.storeRepository
            .createQueryBuilder('store')
            .where('store.merchantId = :merchantId', { merchantId });
        if (search) {
            queryBuilder.andWhere('(store.name LIKE :search OR store.address LIKE :search)', { search: `%${search}%` });
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
    async getStoreById(merchantId, storeId) {
        const store = await this.storeRepository.findOne({
            where: { id: storeId, merchantId },
            relations: ['devices', 'inventory'],
        });
        if (!store) {
            throw new common_1.NotFoundException('门店不存在');
        }
        return store;
    }
    async createStore(merchantId, createData, operatorId, clientIp) {
        const store = this.storeRepository.create({
            ...createData,
            merchantId,
        });
        const savedStore = await this.storeRepository.save(store);
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
    async updateStore(merchantId, storeId, updateData, operatorId, clientIp) {
        const store = await this.storeRepository.findOne({
            where: { id: storeId, merchantId },
        });
        if (!store) {
            throw new common_1.NotFoundException('门店不存在');
        }
        await this.storeRepository.update(storeId, updateData);
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
    async deleteStore(merchantId, storeId, operatorId, clientIp) {
        const store = await this.storeRepository.findOne({
            where: { id: storeId, merchantId },
        });
        if (!store) {
            throw new common_1.NotFoundException('门店不存在');
        }
        const deviceCount = await this.deviceRepository.count({
            where: { storeId },
        });
        if (deviceCount > 0) {
            throw new common_1.BadRequestException('门店下还有设备，无法删除');
        }
        await this.storeRepository.softDelete(storeId);
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
    async getDevices(merchantId, query) {
        const { page = 1, limit = 10, search, storeId, status, model } = query;
        const skip = (page - 1) * limit;
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
            queryBuilder.andWhere('(device.name LIKE :search OR device.devid LIKE :search)', { search: `%${search}%` });
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
    async getDeviceById(merchantId, deviceId) {
        const device = await this.deviceRepository
            .createQueryBuilder('device')
            .leftJoinAndSelect('device.store', 'store')
            .where('device.id = :deviceId', { deviceId })
            .andWhere('store.merchantId = :merchantId', { merchantId })
            .getOne();
        if (!device) {
            throw new common_1.NotFoundException('设备不存在');
        }
        return device;
    }
    async createDevice(merchantId, createData, operatorId, clientIp) {
        const store = await this.storeRepository.findOne({
            where: { id: createData.storeId, merchantId },
        });
        if (!store) {
            throw new common_1.NotFoundException('门店不存在');
        }
        const existingDevice = await this.deviceRepository.findOne({
            where: { devid: createData.devid },
        });
        if (existingDevice) {
            throw new common_1.BadRequestException('设备ID已存在');
        }
        const device = this.deviceRepository.create(createData);
        const savedDevice = await this.deviceRepository.save(device);
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
    async updateDevice(merchantId, deviceId, updateData, operatorId, clientIp) {
        const device = await this.deviceRepository
            .createQueryBuilder('device')
            .leftJoinAndSelect('device.store', 'store')
            .where('device.id = :deviceId', { deviceId })
            .andWhere('store.merchantId = :merchantId', { merchantId })
            .getOne();
        if (!device) {
            throw new common_1.NotFoundException('设备不存在');
        }
        if (updateData.storeId) {
            const store = await this.storeRepository.findOne({
                where: { id: updateData.storeId, merchantId },
            });
            if (!store) {
                throw new common_1.NotFoundException('目标门店不存在');
            }
        }
        await this.deviceRepository.update(deviceId, updateData);
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
    async deleteDevice(merchantId, deviceId, operatorId, clientIp) {
        const device = await this.deviceRepository
            .createQueryBuilder('device')
            .leftJoinAndSelect('device.store', 'store')
            .where('device.id = :deviceId', { deviceId })
            .andWhere('store.merchantId = :merchantId', { merchantId })
            .getOne();
        if (!device) {
            throw new common_1.NotFoundException('设备不存在');
        }
        await this.deviceRepository.softDelete(deviceId);
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
    async getDeviceLogs(merchantId, deviceId, query) {
        const { page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        const device = await this.deviceRepository
            .createQueryBuilder('device')
            .leftJoinAndSelect('device.store', 'store')
            .where('device.id = :deviceId', { deviceId })
            .andWhere('store.merchantId = :merchantId', { merchantId })
            .getOne();
        if (!device) {
            throw new common_1.NotFoundException('设备不存在');
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
    async getOrders(merchantId, query) {
        const { page = 1, limit = 10, search, storeId, status, serviceType, startDate, endDate, minAmount, maxAmount, } = query;
        const skip = (page - 1) * limit;
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
            queryBuilder.andWhere('(order.orderNumber LIKE :search OR user.phone LIKE :search)', { search: `%${search}%` });
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
    async getOrderById(merchantId, orderId) {
        const order = await this.orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.user', 'user')
            .leftJoinAndSelect('order.device', 'device')
            .leftJoinAndSelect('order.store', 'store')
            .where('order.id = :orderId', { orderId })
            .andWhere('store.merchantId = :merchantId', { merchantId })
            .getOne();
        if (!order) {
            throw new common_1.NotFoundException('订单不存在');
        }
        return order;
    }
    async getInventory(merchantId, query) {
        const { page = 1, limit = 10, search, storeId, lowStock, category } = query;
        const skip = (page - 1) * limit;
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
            queryBuilder.andWhere('(inventory.itemName LIKE :search OR inventory.itemCode LIKE :search)', { search: `%${search}%` });
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
    async updateInventory(merchantId, inventoryId, updateData, operatorId, clientIp) {
        const inventory = await this.inventoryRepository
            .createQueryBuilder('inventory')
            .leftJoinAndSelect('inventory.store', 'store')
            .where('inventory.id = :inventoryId', { inventoryId })
            .andWhere('store.merchantId = :merchantId', { merchantId })
            .getOne();
        if (!inventory) {
            throw new common_1.NotFoundException('库存记录不存在');
        }
        await this.inventoryRepository.update(inventoryId, updateData);
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
    async getAlerts(merchantId, query) {
        const { page = 1, limit = 10, storeId, alertType, level, acknowledged } = query;
        const skip = (page - 1) * limit;
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
    async acknowledgeAlert(merchantId, alertId, acknowledgeData, operatorId, clientIp) {
        const alert = await this.alertRepository
            .createQueryBuilder('alert')
            .leftJoinAndSelect('alert.store', 'store')
            .where('alert.id = :alertId', { alertId })
            .andWhere('store.merchantId = :merchantId', { merchantId })
            .getOne();
        if (!alert) {
            throw new common_1.NotFoundException('告警不存在');
        }
        await this.alertRepository.update(alertId, {
            status: 'acknowledged',
            acknowledgedAt: new Date(),
            remark: acknowledgeData.resolution,
        });
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
    async getStaff(merchantId, query) {
        const { page = 1, limit = 10, search, staffRole, status } = query;
        const skip = (page - 1) * limit;
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
            queryBuilder.andWhere('(user.phone LIKE :search OR user.nickname LIKE :search)', { search: `%${search}%` });
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
    async createStaff(merchantId, storeId, createData, operatorId, clientIp) {
        const store = await this.storeRepository.findOne({
            where: { id: storeId, merchantId },
        });
        if (!store) {
            throw new common_1.NotFoundException('门店不存在');
        }
        const existingUser = await this.userRepository.findOne({
            where: { phone: createData.phone },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('手机号已存在');
        }
        const hashedPassword = await bcrypt.hash(createData.password, 10);
        const user = this.userRepository.create({
            ...createData,
            password: hashedPassword,
            role: createData.staffRole,
            storeId,
        });
        const savedUser = await this.userRepository.save(user);
        await this.auditLogRepository.save({
            action: 'create_staff',
            entityType: 'user',
            entityId: savedUser.id,
            operatorId,
            details: `创建员工: ${savedUser.phone} (${savedUser.role})`,
            ipAddress: clientIp,
        });
        const { password, ...result } = savedUser;
        return result;
    }
    async updateStaff(merchantId, staffId, updateData, operatorId, clientIp) {
        const staff = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.store', 'store')
            .where('user.id = :staffId', { staffId })
            .andWhere('store.merchantId = :merchantId', { merchantId })
            .andWhere('user.role IN (:...roles)', { roles: ['store_manager', 'store_staff'] })
            .getOne();
        if (!staff) {
            throw new common_1.NotFoundException('员工不存在');
        }
        const updatePayload = { ...updateData };
        if (updateData.staffRole) {
            updatePayload.role = updateData.staffRole;
            delete updatePayload.staffRole;
        }
        await this.userRepository.update(staffId, updatePayload);
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
    async deleteStaff(merchantId, staffId, operatorId, clientIp) {
        const staff = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.store', 'store')
            .where('user.id = :staffId', { staffId })
            .andWhere('store.merchantId = :merchantId', { merchantId })
            .andWhere('user.role IN (:...roles)', { roles: ['store_manager', 'store_staff'] })
            .getOne();
        if (!staff) {
            throw new common_1.NotFoundException('员工不存在');
        }
        await this.userRepository.softDelete(staffId);
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
    async getReports(merchantId, query) {
        const { startDate, endDate, storeId, groupBy = 'day' } = query;
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
};
exports.MerchantService = MerchantService;
exports.MerchantService = MerchantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(device_entity_1.Device)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(3, (0, typeorm_1.InjectRepository)(merchant_entity_1.Merchant)),
    __param(4, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
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
        redis_config_1.RedisService,
        typeorm_2.DataSource])
], MerchantService);
//# sourceMappingURL=merchant.service.js.map