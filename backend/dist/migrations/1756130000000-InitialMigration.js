"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1756130000000 = void 0;
class InitialMigration1756130000000 {
    constructor() {
        this.name = 'InitialMigration1756130000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`phone\` varchar(11) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        \`role\` enum('user', 'merchant', 'platform_admin') NOT NULL DEFAULT 'user',
        \`nickname\` varchar(50) NULL,
        \`avatar\` varchar(255) NULL,
        \`balance\` int NOT NULL DEFAULT '0',
        \`status\` enum('active', 'disabled') NOT NULL DEFAULT 'active',
        \`lastLoginAt\` datetime NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_a000cca60bcf04454e727699490\` (\`phone\`),
        INDEX \`idx_user_phone\` (\`phone\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
        await queryRunner.query(`
      CREATE TABLE \`merchants\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(100) NOT NULL,
        \`code\` varchar(50) NOT NULL,
        \`contact\` varchar(50) NOT NULL,
        \`phone\` varchar(20) NOT NULL,
        \`address\` varchar(255) NOT NULL,
        \`longitude\` decimal(10,7) NULL,
        \`latitude\` decimal(10,7) NULL,
        \`status\` enum('active', 'disabled') NOT NULL DEFAULT 'active',
        \`shareRatio\` decimal(5,2) NOT NULL DEFAULT '70.00',
        \`description\` text NULL,
        \`businessHours\` varchar(100) NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_b1b7c8b8b8b8b8b8b8b8b8b8b8\` (\`code\`),
        INDEX \`idx_merchant_code\` (\`code\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
        await queryRunner.query(`
      CREATE TABLE \`devices\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`devid\` varchar(50) NOT NULL,
        \`name\` varchar(100) NOT NULL,
        \`model\` varchar(50) NULL,
        \`status\` enum('online', 'offline', 'busy', 'maintenance') NOT NULL DEFAULT 'offline',
        \`iccid\` varchar(20) NULL,
        \`config\` json NULL,
        \`location\` varchar(255) NULL,
        \`longitude\` decimal(10,7) NULL,
        \`latitude\` decimal(10,7) NULL,
        \`lastOnlineAt\` datetime NULL,
        \`lastOfflineAt\` datetime NULL,
        \`version\` varchar(20) NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`merchantId\` int NOT NULL,
        UNIQUE INDEX \`IDX_c1c1c1c1c1c1c1c1c1c1c1c1c1\` (\`devid\`),
        INDEX \`idx_device_devid\` (\`devid\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
        await queryRunner.query(`
      CREATE TABLE \`orders\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`orderNo\` varchar(32) NOT NULL,
        \`amount\` int NOT NULL,
        \`status\` enum('draft', 'pending', 'paid', 'using', 'completed', 'cancelled', 'refunded') NOT NULL DEFAULT 'draft',
        \`washType\` enum('basic', 'premium', 'deluxe') NOT NULL DEFAULT 'basic',
        \`duration\` int NULL,
        \`startTime\` datetime NULL,
        \`endTime\` datetime NULL,
        \`paidAt\` datetime NULL,
        \`paymentMethod\` varchar(20) NULL,
        \`paymentOrderNo\` varchar(64) NULL,
        \`remark\` text NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`userId\` int NOT NULL,
        \`merchantId\` int NOT NULL,
        \`deviceId\` int NOT NULL,
        UNIQUE INDEX \`IDX_d1d1d1d1d1d1d1d1d1d1d1d1d1\` (\`orderNo\`),
        INDEX \`idx_order_no\` (\`orderNo\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
        await queryRunner.query(`
      CREATE TABLE \`device_logs\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`devid\` varchar(50) NOT NULL,
        \`eventType\` varchar(20) NOT NULL,
        \`payload\` json NOT NULL,
        \`parsedData\` json NULL,
        \`orderNo\` varchar(32) NULL,
        \`processStatus\` enum('pending', 'processed', 'failed') NOT NULL DEFAULT 'pending',
        \`errorMessage\` text NULL,
        \`timestamp\` datetime NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`deviceId\` int NULL,
        INDEX \`idx_device_log_devid\` (\`devid\`),
        INDEX \`idx_device_log_order_no\` (\`orderNo\`),
        INDEX \`idx_device_log_timestamp\` (\`timestamp\`),
        INDEX \`idx_device_log_devid_ts\` (\`devid\`, \`timestamp\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
        await queryRunner.query(`
      ALTER TABLE \`devices\` ADD CONSTRAINT \`FK_devices_merchant\` 
      FOREIGN KEY (\`merchantId\`) REFERENCES \`merchants\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_orders_user\` 
      FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_orders_merchant\` 
      FOREIGN KEY (\`merchantId\`) REFERENCES \`merchants\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_orders_device\` 
      FOREIGN KEY (\`deviceId\`) REFERENCES \`devices\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE \`device_logs\` ADD CONSTRAINT \`FK_device_logs_device\` 
      FOREIGN KEY (\`deviceId\`) REFERENCES \`devices\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`device_logs\` DROP FOREIGN KEY \`FK_device_logs_device\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_orders_device\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_orders_merchant\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_orders_user\``);
        await queryRunner.query(`ALTER TABLE \`devices\` DROP FOREIGN KEY \`FK_devices_merchant\``);
        await queryRunner.query(`DROP TABLE \`device_logs\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`devices\``);
        await queryRunner.query(`DROP TABLE \`merchants\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }
}
exports.InitialMigration1756130000000 = InitialMigration1756130000000;
//# sourceMappingURL=1756130000000-InitialMigration.js.map