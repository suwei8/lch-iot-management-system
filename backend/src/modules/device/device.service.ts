import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { DeviceLog } from './entities/device-log.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceCallbackDto } from './dto/device-callback.dto';
import { RedisService } from '../../config/redis.config';

/**
 * 设备服务
 */
@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
    @InjectRepository(DeviceLog)
    private deviceLogRepository: Repository<DeviceLog>,
    private redisService: RedisService,
  ) {}

  /**
   * 创建设备
   * @param createDeviceDto 创建设备数据
   */
  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const device = this.deviceRepository.create({
      ...createDeviceDto,
      status: 'offline',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.deviceRepository.save(device);
  }

  /**
   * 获取设备列表
   * @param page 页码
   * @param limit 每页数量
   * @param merchantId 商户ID筛选
   * @param status 状态筛选
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    merchantId?: number,
    status?: string,
  ) {
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

  /**
   * 根据ID获取设备
   * @param id 设备ID
   */
  async findOne(id: number): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: { id },
      relations: ['merchant'],
    });

    if (!device) {
      throw new NotFoundException('设备不存在');
    }

    return device;
  }

  /**
   * 根据ICCID获取设备
   * @param iccid 设备ICCID
   */
  async findByIccid(iccid: string): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: { iccid },
      relations: ['merchant'],
    });

    if (!device) {
      throw new NotFoundException('设备不存在');
    }

    return device;
  }

  /**
   * 更新设备
   * @param id 设备ID
   * @param updateDeviceDto 更新数据
   */
  async update(id: number, updateDeviceDto: UpdateDeviceDto): Promise<Device> {
    const device = await this.findOne(id);
    
    await this.deviceRepository.update(id, {
      ...updateDeviceDto,
      updatedAt: new Date(),
    });

    return await this.findOne(id);
  }

  /**
   * 删除设备
   * @param id 设备ID
   */
  async remove(id: number): Promise<void> {
    const device = await this.findOne(id);
    await this.deviceRepository.remove(device);
  }

  /**
   * 处理设备回调数据
   * @param deviceCallbackDto 设备回调数据
   */
  async handleCallback(deviceCallbackDto: DeviceCallbackDto): Promise<void> {
    const { iccid, eventType, payload, timestamp } = deviceCallbackDto;

    // 查找设备
    const device = await this.findByIccid(iccid);
    if (!device) {
      throw new NotFoundException(`设备不存在: ${iccid}`);
    }

    // 记录设备日志
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
      // 根据事件类型处理不同逻辑
      await this.processDeviceEvent(device, eventType, payload, deviceLog.id);
      
      // 更新日志状态为成功
      await this.deviceLogRepository.update(deviceLog.id, {
        processStatus: 'processed',
      });
    } catch (error) {
      // 更新日志状态为失败
      await this.deviceLogRepository.update(deviceLog.id, {
        processStatus: 'failed',
        errorMessage: error.message,
      });
      throw error;
    }
  }

  /**
   * 处理设备事件
   * @param device 设备信息
   * @param eventType 事件类型
   * @param payload 事件数据
   * @param logId 日志ID
   */
  private async processDeviceEvent(
    device: Device,
    eventType: string,
    payload: any,
    logId: number,
  ): Promise<void> {
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

  /**
   * 处理心跳事件
   * @param device 设备信息
   * @param payload 事件数据
   */
  private async handleHeartbeat(device: Device, payload: any): Promise<void> {
    // 更新设备在线状态和最后在线时间
    await this.deviceRepository.update(device.id, {
      status: 'online',
      lastOnlineAt: new Date(),
      updatedAt: new Date(),
    });

    // 在Redis中设置设备在线状态，30秒过期
    await this.redisService.set(
      `device:${device.id}:online`,
      'true',
      30,
    );
  }

  /**
   * 处理状态变更事件
   * @param device 设备信息
   * @param payload 事件数据
   */
  private async handleStatusChange(device: Device, payload: any): Promise<void> {
    const { status, location } = payload;

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (status) {
      updateData.status = status;
      if (status === 'offline') {
        updateData.lastOfflineAt = new Date();
      } else if (status === 'online') {
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

  /**
   * 处理洗车开始事件
   * @param device 设备信息
   * @param payload 事件数据
   * @param logId 日志ID
   */
  private async handleWashStart(device: Device, payload: any, logId: number): Promise<void> {
    const { orderNumber, washType, duration } = payload;

    // 更新设备日志中的订单号
    await this.deviceLogRepository.update(logId, {
      orderNo: orderNumber,
      parsedData: { washType, duration },
    });

    // 更新设备状态为工作中
    await this.deviceRepository.update(device.id, {
      status: 'working',
      updatedAt: new Date(),
    });

    // 在Redis中记录当前工作订单
    await this.redisService.set(
      `device:${device.id}:current_order`,
      orderNumber,
      duration * 60, // 转换为秒
    );
  }

  /**
   * 处理洗车结束事件
   * @param device 设备信息
   * @param payload 事件数据
   * @param logId 日志ID
   */
  private async handleWashEnd(device: Device, payload: any, logId: number): Promise<void> {
    const { orderNumber, actualDuration, result } = payload;

    // 更新设备日志
    await this.deviceLogRepository.update(logId, {
      orderNo: orderNumber,
      parsedData: { actualDuration, result },
    });

    // 更新设备状态为在线
    await this.deviceRepository.update(device.id, {
      status: 'online',
      updatedAt: new Date(),
    });

    // 清除Redis中的当前工作订单
    await this.redisService.del(`device:${device.id}:current_order`);
  }

  /**
   * 处理设备错误事件
   * @param device 设备信息
   * @param payload 事件数据
   */
  private async handleDeviceError(device: Device, payload: any): Promise<void> {
    const { errorCode, errorMessage } = payload;

    // 更新设备状态为故障
    await this.deviceRepository.update(device.id, {
      status: 'error',
      updatedAt: new Date(),
    });

    // 在Redis中记录设备错误信息
    await this.redisService.set(
      `device:${device.id}:error`,
      JSON.stringify({ errorCode, errorMessage, timestamp: new Date() }),
      3600, // 1小时过期
    );
  }

  /**
   * 获取设备日志
   * @param deviceId 设备ID
   * @param page 页码
   * @param limit 每页数量
   * @param eventType 事件类型筛选
   */
  async getDeviceLogs(
    deviceId: number,
    page: number = 1,
    limit: number = 10,
    eventType?: string,
  ) {
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
}