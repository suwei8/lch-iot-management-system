/**
 * 权限枚举
 * 定义系统中所有的权限常量
 */
export enum Permission {
  // 用户管理
  USER_READ = 'user:read',
  USER_WRITE = 'user:write',
  USER_DELETE = 'user:delete',

  // 商户管理
  MERCHANT_READ = 'merchant:read',
  MERCHANT_WRITE = 'merchant:write',
  MERCHANT_DELETE = 'merchant:delete',

  // 门店管理
  STORE_READ = 'store:read',
  STORE_WRITE = 'store:write',
  STORE_DELETE = 'store:delete',

  // 设备管理
  DEVICE_READ = 'device:read',
  DEVICE_WRITE = 'device:write',
  DEVICE_DELETE = 'device:delete',

  // 订单管理
  ORDER_READ = 'order:read',
  ORDER_WRITE = 'order:write',
  ORDER_DELETE = 'order:delete',

  // 库存管理
  INVENTORY_READ = 'inventory:read',
  INVENTORY_WRITE = 'inventory:write',
  INVENTORY_DELETE = 'inventory:delete',

  // 告警管理
  ALERT_READ = 'alert:read',
  ALERT_WRITE = 'alert:write',
  ALERT_DELETE = 'alert:delete',

  // 员工管理
  STAFF_READ = 'staff:read',
  STAFF_WRITE = 'staff:write',
  STAFF_DELETE = 'staff:delete',

  // 报表管理
  REPORT_READ = 'report:read',
  REPORT_EXPORT = 'report:export',

  // 系统管理
  SYSTEM_CONFIG = 'system:config',
  SYSTEM_BACKUP = 'system:backup',
  SYSTEM_RESTORE = 'system:restore',
  SYSTEM_MONITOR = 'system:monitor',

  // 管理员权限
  ADMIN_READ = 'admin:read',
  ADMIN_WRITE = 'admin:write',

  // 审计日志
  AUDIT_LOG_READ = 'audit_log:read',
  AUDIT_LOG_DELETE = 'audit_log:delete',
}

/**
 * 角色权限映射
 */
export const RolePermissions = {
  platform_admin: Object.values(Permission),
  merchant: [
    Permission.MERCHANT_READ,
    Permission.MERCHANT_WRITE,
    Permission.STORE_READ,
    Permission.STORE_WRITE,
    Permission.DEVICE_READ,
    Permission.DEVICE_WRITE,
    Permission.ORDER_READ,
    Permission.INVENTORY_READ,
    Permission.INVENTORY_WRITE,
    Permission.ALERT_READ,
    Permission.ALERT_WRITE,
    Permission.STAFF_READ,
    Permission.STAFF_WRITE,
    Permission.STAFF_DELETE,
    Permission.REPORT_READ,
    Permission.REPORT_EXPORT,
  ],
  store_manager: [
    Permission.STORE_READ,
    Permission.DEVICE_READ,
    Permission.ORDER_READ,
    Permission.ORDER_WRITE,
    Permission.INVENTORY_READ,
    Permission.INVENTORY_WRITE,
    Permission.ALERT_READ,
    Permission.ALERT_WRITE,
    Permission.STAFF_READ,
    Permission.STAFF_WRITE,
    Permission.REPORT_READ,
  ],
  store_staff: [
    Permission.STORE_READ,
    Permission.DEVICE_READ,
    Permission.ORDER_READ,
    Permission.INVENTORY_READ,
    Permission.ALERT_READ,
    Permission.REPORT_READ,
  ],
};