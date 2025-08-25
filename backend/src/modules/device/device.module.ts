import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { Device } from './entities/device.entity';
import { DeviceLog } from './entities/device-log.entity';
import { RedisService } from '../../config/redis.config';

/**
 * 设备模块
 */
@Module({
  imports: [TypeOrmModule.forFeature([Device, DeviceLog])],
  controllers: [DeviceController],
  providers: [DeviceService, RedisService],
  exports: [DeviceService],
})
export class DeviceModule {}