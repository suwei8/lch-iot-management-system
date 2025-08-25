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
exports.DeviceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const device_entity_1 = require("./entities/device.entity");
const device_log_entity_1 = require("./entities/device-log.entity");
const redis_config_1 = require("../../config/redis.config");
let DeviceService = class DeviceService {
    constructor(deviceRepository, deviceLogRepository, redisService) {
        this.deviceRepository = deviceRepository;
        this.deviceLogRepository = deviceLogRepository;
        this.redisService = redisService;
    }
    async create(createDeviceDto) {
        const device = this.deviceRepository.create({
            ...createDeviceDto,
            status: 'offline',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return await this.deviceRepository.save(device);
    }
    async findAll(page = 1, limit = 10, merchantId, status) {
        const queryBuilder = this.deviceRepository
            .createQueryBuilder('device')
            .leftJoinAndSelect('device.merchant', 'merchant');
        if (merchantId) {
            queryBuilder.andWhere('device.merchantId = :merchantId', { merchantId });
        }
        if (status) {
            queryBuilder.andWhere('device.status = :status', { status });
        }
        queryBuilder
            .orderBy('device.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [devices, total] = await queryBuilder.getManyAndCount();
        return {
            devices,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const device = await this.deviceRepository.findOne({
            where: { id },
            relations: ['merchant'],
        });
        if (!device) {
            throw new common_1.NotFoundException('设备不存在');
        }
        return device;
    }
    async findByIccid(iccid) {
        const device = await this.deviceRepository.findOne({
            where: { iccid },
            relations: ['merchant'],
        });
        if (!device) {
            throw new common_1.NotFoundException('设备不存在');
        }
        return device;
    }
    async update(id, updateDeviceDto) {
        const device = await this.findOne(id);
        await this.deviceRepository.update(id, {
            ...updateDeviceDto,
            updatedAt: new Date(),
        });
        return await this.findOne(id);
    }
    async remove(id) {
        const device = await this.findOne(id);
        await this.deviceRepository.remove(device);
    }
    async handleCallback(deviceCallbackDto) {
        const { iccid, eventType, payload, timestamp } = deviceCallbackDto;
        const device = await this.findByIccid(iccid);
        if (!device) {
            throw new common_1.NotFoundException(`设备不存在: ${iccid}`);
        }
        const deviceLog = this.deviceLogRepository.create({
            devid: device.iccid,
            deviceId: device.id,
            eventType,
            payload: payload,
            timestamp: new Date(timestamp),
            processStatus: 'pending',
        });
        await this.deviceLogRepository.save(deviceLog);
        try {
            await this.processDeviceEvent(device, eventType, payload, deviceLog.id);
            await this.deviceLogRepository.update(deviceLog.id, {
                processStatus: 'processed',
            });
        }
        catch (error) {
            await this.deviceLogRepository.update(deviceLog.id, {
                processStatus: 'failed',
                errorMessage: error.message,
            });
            throw error;
        }
    }
    async processDeviceEvent(device, eventType, payload, logId) {
        switch (eventType) {
            case 'heartbeat':
                await this.handleHeartbeat(device, payload);
                break;
            case 'status_change':
                await this.handleStatusChange(device, payload);
                break;
            case 'wash_start':
                await this.handleWashStart(device, payload, logId);
                break;
            case 'wash_end':
                await this.handleWashEnd(device, payload, logId);
                break;
            case 'error':
                await this.handleDeviceError(device, payload);
                break;
            default:
                console.warn(`未知的设备事件类型: ${eventType}`);
        }
    }
    async handleHeartbeat(device, payload) {
        await this.deviceRepository.update(device.id, {
            status: 'online',
            lastOnlineAt: new Date(),
            updatedAt: new Date(),
        });
        await this.redisService.set(`device:${device.id}:online`, 'true', 30);
    }
    async handleStatusChange(device, payload) {
        const { status, location } = payload;
        const updateData = {
            updatedAt: new Date(),
        };
        if (status) {
            updateData.status = status;
            if (status === 'offline') {
                updateData.lastOfflineAt = new Date();
            }
            else if (status === 'online') {
                updateData.lastOnlineAt = new Date();
            }
        }
        if (location) {
            updateData.location = location;
            if (location.latitude && location.longitude) {
                updateData.latitude = location.latitude;
                updateData.longitude = location.longitude;
            }
        }
        await this.deviceRepository.update(device.id, updateData);
    }
    async handleWashStart(device, payload, logId) {
        const { orderNumber, washType, duration } = payload;
        await this.deviceLogRepository.update(logId, {
            orderNo: orderNumber,
            parsedData: { washType, duration },
        });
        await this.deviceRepository.update(device.id, {
            status: 'working',
            updatedAt: new Date(),
        });
        await this.redisService.set(`device:${device.id}:current_order`, orderNumber, duration * 60);
    }
    async handleWashEnd(device, payload, logId) {
        const { orderNumber, actualDuration, result } = payload;
        await this.deviceLogRepository.update(logId, {
            orderNo: orderNumber,
            parsedData: { actualDuration, result },
        });
        await this.deviceRepository.update(device.id, {
            status: 'online',
            updatedAt: new Date(),
        });
        await this.redisService.del(`device:${device.id}:current_order`);
    }
    async handleDeviceError(device, payload) {
        const { errorCode, errorMessage } = payload;
        await this.deviceRepository.update(device.id, {
            status: 'error',
            updatedAt: new Date(),
        });
        await this.redisService.set(`device:${device.id}:error`, JSON.stringify({ errorCode, errorMessage, timestamp: new Date() }), 3600);
    }
    async getDeviceLogs(deviceId, page = 1, limit = 10, eventType) {
        const queryBuilder = this.deviceLogRepository
            .createQueryBuilder('log')
            .where('log.deviceId = :deviceId', { deviceId });
        if (eventType) {
            queryBuilder.andWhere('log.eventType = :eventType', { eventType });
        }
        queryBuilder
            .orderBy('log.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [logs, total] = await queryBuilder.getManyAndCount();
        return {
            logs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
};
exports.DeviceService = DeviceService;
exports.DeviceService = DeviceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(device_entity_1.Device)),
    __param(1, (0, typeorm_1.InjectRepository)(device_log_entity_1.DeviceLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        redis_config_1.RedisService])
], DeviceService);
//# sourceMappingURL=device.service.js.map