import { SetMetadata } from '@nestjs/common';

/**
 * 权限枚举
 */
export enum Permission {
  // 用户管理权限
  USER_READ = 'user:read',
  USER_WRITE = 'user:write',
  USER_DELETE = 'user:delete',

  // 商户管理权限
  MERCHANT_READ = 'merchant:read',
  MERCHANT_WRITE = 'merchant:write',
  MERCHANT_DELETE = 'merchant:delete',

  // 门店管理权限
  STORE_READ = 'store:read',
  STORE_WRITE = 'store:write',
  STORE_DELETE = 'store:delete',

  // 设备管理权限
  DEVICE_READ = 'device:read',
  DEVICE_WRITE = 'device:write',
  DEVICE_DELETE = 'device:delete',
  DEVICE_CONTROL = 'device:control',

  // 订单管理权限
  ORDER_READ = 'order:read',
  ORDER_WRITE = 'order:write',
  ORDER_REFUND = 'order:refund',

  // 库存管理权限
  INVENTORY_READ = 'inventory:read',
  INVENTORY_WRITE = 'inventory:write',

  // 告警管理权限
  ALERT_READ = 'alert:read',
  ALERT_WRITE = 'alert:write',

  // 系统管理权限
  SYSTEM_READ = 'system:read',
  SYSTEM_WRITE = 'system:write',
  SYSTEM_EXPORT = 'system:export',

  // 审计日志权限
  AUDIT_READ = 'audit:read',
}

/**
 * 角色权限映射
 */
export const ROLE_PERMISSIONS = {
  platform_admin: [
    // 平台管理员拥有所有权限
    ...Object.values(Permission),
  ],
  merchant: [
    // 商户权限
    Permission.MERCHANT_READ,
    Permission.STORE_READ,
    Permission.STORE_WRITE,
    Permission.STORE_DELETE,
    Permission.DEVICE_READ,
    Permission.DEVICE_WRITE,
    Permission.DEVICE_CONTROL,
    Permission.ORDER_READ,
    Permission.ORDER_WRITE,
    Permission.ORDER_REFUND,
    Permission.INVENTORY_READ,
    Permission.INVENTORY_WRITE,
    Permission.ALERT_READ,
    Permission.ALERT_WRITE,
    Permission.USER_READ,
    Permission.USER_WRITE,
    Permission.AUDIT_READ,
  ],
  store_manager: [
    // 门店管理员权限
    Permission.STORE_READ,
    Permission.DEVICE_READ,
    Permission.DEVICE_WRITE,
    Permission.DEVICE_CONTROL,
    Permission.ORDER_READ,
    Permission.ORDER_WRITE,
    Permission.INVENTORY_READ,
    Permission.INVENTORY_WRITE,
    Permission.ALERT_READ,
    Permission.ALERT_WRITE,
    Permission.USER_READ,
    Permission.USER_WRITE,
  ],
  store_staff: [
    // 门店员工权限
    Permission.STORE_READ,
    Permission.DEVICE_READ,
    Permission.DEVICE_CONTROL,
    Permission.ORDER_READ,
    Permission.INVENTORY_READ,
    Permission.ALERT_READ,
  ],
  user: [
    // 普通用户权限
    Permission.ORDER_READ,
  ],
};

/**
 * 权限装饰器键
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * 权限装饰器
 * @param permissions 所需权限列表
 */
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * 检查用户是否具有指定权限
 * @param userRole 用户角色
 * @param permission 权限
 * @returns 是否具有权限
 */
export function hasPermission(userRole: string, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
}

/**
 * 获取用户角色的所有权限
 * @param userRole 用户角色
 * @returns 权限列表
 */
export function getUserPermissions(userRole: string): Permission[] {
  return ROLE_PERMISSIONS[userRole] || [];
}