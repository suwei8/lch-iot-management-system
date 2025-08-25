import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { Merchant } from './entities/merchant.entity';
import { User } from '../user/entities/user.entity';
import { Device } from '../device/entities/device.entity';
import { Order } from '../order/entities/order.entity';
import { Store } from '../store/entities/store.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Alert } from '../alert/entities/alert.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { DeviceLog } from '../device/entities/device-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Merchant,
      User,
      Device,
      Order,
      Store,
      Inventory,
      Alert,
      AuditLog,
      DeviceLog,
    ]),
  ],
  controllers: [MerchantController],
  providers: [MerchantService],
  exports: [MerchantService],
})
export class MerchantModule {}