import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { UserModule } from '../user/user.module';
import { DeviceModule } from '../device/device.module';
import { RedisService } from '../../config/redis.config';

/**
 * 订单模块
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    UserModule,
    DeviceModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, RedisService],
  exports: [OrderService],
})
export class OrderModule {}