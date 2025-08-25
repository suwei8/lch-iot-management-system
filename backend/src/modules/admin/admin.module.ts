import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../user/entities/user.entity';
import { Device } from '../device/entities/device.entity';
import { Order } from '../order/entities/order.entity';
import { Merchant } from '../merchant/entities/merchant.entity';
import { Store } from '../store/entities/store.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Alert } from '../alert/entities/alert.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { DeviceLog } from '../device/entities/device-log.entity';
import { RedisService } from '../../config/redis.config';
import { AuditLogModule } from './audit-log.module';

/**
 * 管理员模块
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Device,
      Order,
      Merchant,
      Store,
      Inventory,
      Alert,
      AuditLog,
      DeviceLog,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    AuditLogModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, RedisService],
  exports: [AdminService],
})
export class AdminModule {}