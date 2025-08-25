"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = exports.databaseConfig = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../modules/user/entities/user.entity");
const merchant_entity_1 = require("../modules/merchant/entities/merchant.entity");
const device_entity_1 = require("../modules/device/entities/device.entity");
const order_entity_1 = require("../modules/order/entities/order.entity");
const device_log_entity_1 = require("../modules/device/entities/device-log.entity");
const databaseConfig = () => ({
    type: 'mysql',
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
    username: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || 'sw63828',
    database: process.env.MYSQL_DATABASE || 'lch_db',
    entities: [user_entity_1.User, merchant_entity_1.Merchant, device_entity_1.Device, order_entity_1.Order, device_log_entity_1.DeviceLog],
    synchronize: false,
    migrations: ['dist/migrations/*.js'],
    migrationsRun: true,
    logging: process.env.NODE_ENV === 'development',
    timezone: '+08:00',
    charset: 'utf8mb4',
});
exports.databaseConfig = databaseConfig;
exports.AppDataSource = new typeorm_1.DataSource({
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
//# sourceMappingURL=database.config.js.map