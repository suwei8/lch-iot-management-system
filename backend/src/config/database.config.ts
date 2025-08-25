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
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
  username: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || 'sw63828',
  database: process.env.MYSQL_DATABASE || 'lch_db',
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
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
  username: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || 'sw63828',
  database: process.env.MYSQL_DATABASE || 'lch_db',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
  timezone: '+08:00',
  charset: 'utf8mb4',
});