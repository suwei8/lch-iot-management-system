import { Device } from './device.entity';
export declare class DeviceLog {
    id: number;
    devid: string;
    eventType: string;
    payload: any;
    parsedData: any;
    orderNo: string;
    processStatus: string;
    errorMessage: string;
    timestamp: Date;
    createdAt: Date;
    deviceId: number;
    device: Device;
}
