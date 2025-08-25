import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 添加门店、库存、告警、审计日志表，并为订单表补充store_id外键
 */
export class AddStoresInventoryAlertsAuditLogs1756135000000 implements MigrationInterface {
  name = 'AddStoresInventoryAlertsAuditLogs1756135000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 创建门店表
    await queryRunner.query(`
      CREATE TABLE \`stores\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(100) NOT NULL COMMENT '门店名称',
        \`code\` varchar(50) NOT NULL COMMENT '门店编码',
        \`address\` varchar(255) NOT NULL COMMENT '门店地址',
        \`longitude\` decimal(10,7) NULL COMMENT '经度',
        \`latitude\` decimal(10,7) NULL COMMENT '纬度',
        \`contact\` varchar(50) NOT NULL COMMENT '联系人',
        \`phone\` varchar(20) NOT NULL COMMENT '联系电话',
        \`status\` enum('active', 'disabled', 'maintenance') NOT NULL DEFAULT 'active' COMMENT '门店状态',
        \`businessHours\` varchar(100) NULL COMMENT '营业时间',
        \`description\` text NULL COMMENT '门店描述',
        \`basicPrice\` int NOT NULL DEFAULT '1000' COMMENT '基础洗车价格(分)',
        \`premiumPrice\` int NOT NULL DEFAULT '1500' COMMENT '精洗价格(分)',
        \`deluxePrice\` int NOT NULL DEFAULT '2000' COMMENT '豪华洗车价格(分)',
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`merchantId\` int NOT NULL,
        UNIQUE INDEX \`IDX_store_code\` (\`code\`),
        INDEX \`idx_store_merchant\` (\`merchantId\`),
        INDEX \`idx_store_status\` (\`status\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB COMMENT='门店表'
    `);

    // 创建库存表
    await queryRunner.query(`
      CREATE TABLE \`inventory\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(100) NOT NULL COMMENT '物料名称',
        \`type\` enum('detergent', 'wax', 'water', 'foam', 'other') NOT NULL COMMENT '物料类型',
        \`currentStock\` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '当前库存量',
        \`minThreshold\` decimal(10,2) NOT NULL DEFAULT '10.00' COMMENT '最小阈值',
        \`maxCapacity\` decimal(10,2) NOT NULL DEFAULT '100.00' COMMENT '最大容量',
        \`unit\` varchar(10) NOT NULL DEFAULT 'L' COMMENT '单位',
        \`unitPrice\` int NOT NULL DEFAULT '0' COMMENT '单价(分)',
        \`supplier\` varchar(100) NULL COMMENT '供应商',
        \`status\` enum('normal', 'low', 'empty', 'expired') NOT NULL DEFAULT 'normal' COMMENT '库存状态',
        \`lastRestockAt\` datetime NULL COMMENT '最后补货时间',
        \`remark\` text NULL COMMENT '备注',
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`storeId\` int NOT NULL,
        INDEX \`idx_inventory_store\` (\`storeId\`),
        INDEX \`idx_inventory_type\` (\`type\`),
        INDEX \`idx_inventory_status\` (\`status\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB COMMENT='库存表'
    `);

    // 创建告警表
    await queryRunner.query(`
      CREATE TABLE \`alerts\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`type\` enum('device_offline', 'low_inventory', 'device_error', 'maintenance_due', 'system_error', 'other') NOT NULL COMMENT '告警类型',
        \`level\` enum('info', 'warning', 'error', 'critical') NOT NULL DEFAULT 'warning' COMMENT '告警级别',
        \`title\` varchar(200) NOT NULL COMMENT '告警标题',
        \`content\` text NOT NULL COMMENT '告警内容',
        \`status\` enum('active', 'acknowledged', 'resolved') NOT NULL DEFAULT 'active' COMMENT '告警状态',
        \`relatedData\` json NULL COMMENT '相关数据',
        \`acknowledgedAt\` datetime NULL COMMENT '确认时间',
        \`resolvedAt\` datetime NULL COMMENT '解决时间',
        \`remark\` text NULL COMMENT '备注',
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`storeId\` int NULL,
        \`deviceId\` int NULL,
        \`acknowledgedBy\` int NULL,
        \`resolvedBy\` int NULL,
        INDEX \`idx_alert_store\` (\`storeId\`),
        INDEX \`idx_alert_device\` (\`deviceId\`),
        INDEX \`idx_alert_type\` (\`type\`),
        INDEX \`idx_alert_level\` (\`level\`),
        INDEX \`idx_alert_status\` (\`status\`),
        INDEX \`idx_alert_created\` (\`createdAt\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB COMMENT='告警表'
    `);

    // 创建审计日志表
    await queryRunner.query(`
      CREATE TABLE \`audit_logs\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`action\` varchar(50) NOT NULL COMMENT '操作类型',
        \`resourceType\` varchar(50) NOT NULL COMMENT '资源类型',
        \`resourceId\` varchar(50) NULL COMMENT '资源ID',
        \`description\` varchar(500) NOT NULL COMMENT '操作描述',
        \`beforeData\` json NULL COMMENT '操作前数据',
        \`afterData\` json NULL COMMENT '操作后数据',
        \`ipAddress\` varchar(45) NULL COMMENT 'IP地址',
        \`userAgent\` varchar(500) NULL COMMENT '用户代理',
        \`requestPath\` varchar(200) NULL COMMENT '请求路径',
        \`requestMethod\` varchar(10) NULL COMMENT '请求方法',
        \`result\` enum('success', 'failure') NOT NULL DEFAULT 'success' COMMENT '操作结果',
        \`errorMessage\` text NULL COMMENT '错误信息',
        \`duration\` int NULL COMMENT '操作耗时(毫秒)',
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`userId\` int NOT NULL,
        INDEX \`idx_audit_user\` (\`userId\`),
        INDEX \`idx_audit_action\` (\`action\`),
        INDEX \`idx_audit_resource\` (\`resourceType\`, \`resourceId\`),
        INDEX \`idx_audit_created\` (\`createdAt\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB COMMENT='审计日志表'
    `);

    // 为订单表添加store_id字段
    await queryRunner.query(`
      ALTER TABLE \`orders\` ADD COLUMN \`storeId\` int NULL COMMENT '门店ID'
    `);

    // 为订单表添加thirdPartyOrderNumber字段（如果不存在）
    await queryRunner.query(`
      ALTER TABLE \`orders\` ADD COLUMN \`thirdPartyOrderNumber\` varchar(64) NULL COMMENT '第三方订单号'
    `);

    // 为设备表添加store_id字段
    await queryRunner.query(`
      ALTER TABLE \`devices\` ADD COLUMN \`storeId\` int NULL COMMENT '门店ID'
    `);

    // 添加外键约束
    await queryRunner.query(`
      ALTER TABLE \`stores\` ADD CONSTRAINT \`FK_stores_merchant\` 
      FOREIGN KEY (\`merchantId\`) REFERENCES \`merchants\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`inventory\` ADD CONSTRAINT \`FK_inventory_store\` 
      FOREIGN KEY (\`storeId\`) REFERENCES \`stores\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`alerts\` ADD CONSTRAINT \`FK_alerts_store\` 
      FOREIGN KEY (\`storeId\`) REFERENCES \`stores\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`alerts\` ADD CONSTRAINT \`FK_alerts_device\` 
      FOREIGN KEY (\`deviceId\`) REFERENCES \`devices\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`alerts\` ADD CONSTRAINT \`FK_alerts_acknowledged_by\` 
      FOREIGN KEY (\`acknowledgedBy\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`alerts\` ADD CONSTRAINT \`FK_alerts_resolved_by\` 
      FOREIGN KEY (\`resolvedBy\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`audit_logs\` ADD CONSTRAINT \`FK_audit_logs_user\` 
      FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_orders_store\` 
      FOREIGN KEY (\`storeId\`) REFERENCES \`stores\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`devices\` ADD CONSTRAINT \`FK_devices_store\` 
      FOREIGN KEY (\`storeId\`) REFERENCES \`stores\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
    `);

    // 添加索引优化
    await queryRunner.query(`
      CREATE INDEX \`idx_orders_store_status_created\` ON \`orders\` (\`storeId\`, \`status\`, \`createdAt\`)
    `);

    await queryRunner.query(`
      CREATE INDEX \`idx_devices_store_status\` ON \`devices\` (\`storeId\`, \`status\`)
    `);

    await queryRunner.query(`
      CREATE INDEX \`idx_alerts_store_status_created\` ON \`alerts\` (\`storeId\`, \`status\`, \`createdAt\`)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 删除索引
    await queryRunner.query(`DROP INDEX \`idx_alerts_store_status_created\` ON \`alerts\``);
    await queryRunner.query(`DROP INDEX \`idx_devices_store_status\` ON \`devices\``);
    await queryRunner.query(`DROP INDEX \`idx_orders_store_status_created\` ON \`orders\``);

    // 删除外键约束
    await queryRunner.query(`ALTER TABLE \`devices\` DROP FOREIGN KEY \`FK_devices_store\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_orders_store\``);
    await queryRunner.query(`ALTER TABLE \`audit_logs\` DROP FOREIGN KEY \`FK_audit_logs_user\``);
    await queryRunner.query(`ALTER TABLE \`alerts\` DROP FOREIGN KEY \`FK_alerts_resolved_by\``);
    await queryRunner.query(`ALTER TABLE \`alerts\` DROP FOREIGN KEY \`FK_alerts_acknowledged_by\``);
    await queryRunner.query(`ALTER TABLE \`alerts\` DROP FOREIGN KEY \`FK_alerts_device\``);
    await queryRunner.query(`ALTER TABLE \`alerts\` DROP FOREIGN KEY \`FK_alerts_store\``);
    await queryRunner.query(`ALTER TABLE \`inventory\` DROP FOREIGN KEY \`FK_inventory_store\``);
    await queryRunner.query(`ALTER TABLE \`stores\` DROP FOREIGN KEY \`FK_stores_merchant\``);

    // 删除添加的字段
    await queryRunner.query(`ALTER TABLE \`devices\` DROP COLUMN \`storeId\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`thirdPartyOrderNumber\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`storeId\``);

    // 删除表
    await queryRunner.query(`DROP TABLE \`audit_logs\``);
    await queryRunner.query(`DROP TABLE \`alerts\``);
    await queryRunner.query(`DROP TABLE \`inventory\``);
    await queryRunner.query(`DROP TABLE \`stores\``);
  }
}