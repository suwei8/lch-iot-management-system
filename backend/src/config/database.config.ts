import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../modules/user/entities/user.entity';
import { Merchant } from '../modules/merchant/entities/merchant.entity';
import { Device } from '../modules/device/entities/device.entity';
import { Order } from '../modules/order/entities/order.entity';
import { DeviceLog } from '../modules/device/entities/device-log.entity';

/**
 * 数据库配置
 */
export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Merchant, Device, Order, DeviceLog],
  synchronize: false, // 生产环境设为false，使用迁移
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true, // 自动运行迁移
  logging: process.env.NODE_ENV === 'development',
  timezone: '+08:00',
  charset: 'utf8mb4',
});

/**
 * TypeORM CLI配置（用于迁移）
 */
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
  timezone: '+08:00',
  charset: 'utf8mb4',
});