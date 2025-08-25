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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const user_service_1 = require("../user/user.service");
const device_service_1 = require("../device/device.service");
const redis_config_1 = require("../../config/redis.config");
let OrderService = class OrderService {
    constructor(orderRepository, userService, deviceService, redisService) {
        this.orderRepository = orderRepository;
        this.userService = userService;
        this.deviceService = deviceService;
        this.redisService = redisService;
    }
    async create(userId, createOrderDto) {
        const { deviceId, washType, duration, amount } = createOrderDto;
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('用户不存在');
        }
        const device = await this.deviceService.findOne(deviceId);
        if (!device) {
            throw new common_1.NotFoundException('设备不存在');
        }
        if (device.status !== 'online') {
            throw new common_1.BadRequestException('设备当前不可用');
        }
        if (user.balance < amount) {
            throw new common_1.BadRequestException('余额不足');
        }
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
        await this.userService.updateBalance(userId, -amount);
        await this.redisService.set(`order:${orderNo}:status`, 'pending', 3600);
        return savedOrder;
    }
    async findAll(page = 1, limit = 10, userId, merchantId, status) {
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
    async findOne(id) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['user', 'merchant', 'device'],
        });
        if (!order) {
            throw new common_1.NotFoundException('订单不存在');
        }
        return order;
    }
    async findByOrderNumber(orderNumber) {
        const order = await this.orderRepository.findOne({
            where: { orderNo: orderNumber },
            relations: ['user', 'merchant', 'device'],
        });
        if (!order) {
            throw new common_1.NotFoundException('订单不存在');
        }
        return order;
    }
    async update(id, updateOrderDto) {
        const order = await this.findOne(id);
        await this.orderRepository.update(id, {
            ...updateOrderDto,
            updatedAt: new Date(),
        });
        return await this.findOne(id);
    }
    async startWash(orderNumber) {
        const order = await this.findByOrderNumber(orderNumber);
        if (order.status !== 'paid') {
            throw new common_1.BadRequestException('订单状态不正确，无法开始洗车');
        }
        await this.orderRepository.update(order.id, {
            status: 'in_progress',
            startTime: new Date(),
            updatedAt: new Date(),
        });
        await this.redisService.set(`order:${order.orderNo}:status`, 'in_progress', order.duration * 60);
        return await this.findOne(order.id);
    }
    async completeWash(orderNumber, actualDuration) {
        const order = await this.findByOrderNumber(orderNumber);
        if (order.status !== 'in_progress') {
            throw new common_1.BadRequestException('订单状态不正确，无法完成洗车');
        }
        const updateData = {
            status: 'completed',
            endTime: new Date(),
            updatedAt: new Date(),
        };
        if (actualDuration) {
            updateData.duration = actualDuration;
        }
        await this.orderRepository.update(order.id, updateData);
        await this.redisService.set(`order:${order.orderNo}:status`, 'completed', 3600);
        return await this.findOne(order.id);
    }
    async cancel(id, userId) {
        const order = await this.findOne(id);
        if (order.userId !== userId) {
            throw new common_1.BadRequestException('无权取消此订单');
        }
        if (!['pending', 'paid'].includes(order.status)) {
            throw new common_1.BadRequestException('订单状态不允许取消');
        }
        await this.orderRepository.update(id, {
            status: 'cancelled',
            updatedAt: new Date(),
        });
        if (order.status === 'paid') {
            await this.userService.updateBalance(userId, order.amount);
        }
        await this.redisService.set(`order:${order.orderNo}:status`, 'cancelled', 3600);
        return await this.findOne(id);
    }
    async pay(orderNumber, paymentMethod) {
        const order = await this.findByOrderNumber(orderNumber);
        if (order.status !== 'pending') {
            throw new common_1.BadRequestException('订单状态不正确，无法支付');
        }
        const thirdPartyOrderNumber = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await this.orderRepository.update(order.id, {
            status: 'paid',
            paymentMethod,
            thirdPartyOrderNumber,
            paidAt: new Date(),
            updatedAt: new Date(),
        });
        await this.redisService.set(`order:${order.orderNo}:status`, 'paid', 3600);
        return await this.findOne(order.id);
    }
    generateOrderNumber() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 6).toUpperCase();
        return `WC${timestamp}${random}`;
    }
    async getUserOrderStats(userId) {
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
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService,
        device_service_1.DeviceService,
        redis_config_1.RedisService])
], OrderService);
//# sourceMappingURL=order.service.js.map