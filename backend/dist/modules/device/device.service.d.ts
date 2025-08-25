import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { DeviceLog } from './entities/device-log.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceCallbackDto } from './dto/device-callback.dto';
import { RedisService } from '../../config/redis.config';
export declare class DeviceService {
    private deviceRepository;
    private deviceLogRepository;
    private redisService;
    constructor(deviceRepository: Repository<Device>, deviceLogRepository: Repository<DeviceLog>, redisService: RedisService);
    create(createDeviceDto: CreateDeviceDto): Promise<Device>;
    findAll(page?: number, limit?: number, merchantId?: number, status?: string): Promise<{
        devices: Device[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Device>;
    findByIccid(iccid: string): Promise<Device>;
    update(id: number, updateDeviceDto: UpdateDeviceDto): Promise<Device>;
    remove(id: number): Promise<void>;
    handleCallback(deviceCallbackDto: DeviceCallbackDto): Promise<void>;
    private processDeviceEvent;
    private handleHeartbeat;
    private handleStatusChange;
    private handleWashStart;
    private handleWashEnd;
    private handleDeviceError;
    getDeviceLogs(deviceId: number, page?: number, limit?: number, eventType?: string): Promise<{
        logs: DeviceLog[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
