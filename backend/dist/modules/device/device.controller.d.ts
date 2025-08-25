import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceCallbackDto } from './dto/device-callback.dto';
export declare class DeviceController {
    private readonly deviceService;
    constructor(deviceService: DeviceService);
    create(createDeviceDto: CreateDeviceDto): Promise<import("./entities/device.entity").Device>;
    findAll(page?: number, limit?: number, merchantId?: number, status?: string): Promise<{
        devices: import("./entities/device.entity").Device[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<import("./entities/device.entity").Device>;
    update(id: number, updateDeviceDto: UpdateDeviceDto): Promise<import("./entities/device.entity").Device>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getDeviceLogs(id: number, page?: number, limit?: number, eventType?: string): Promise<{
        logs: import("./entities/device-log.entity").DeviceLog[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    handleCallback(deviceCallbackDto: DeviceCallbackDto): Promise<{
        message: string;
    }>;
}
