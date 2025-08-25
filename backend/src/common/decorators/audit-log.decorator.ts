import { SetMetadata } from '@nestjs/common';

export const AUDIT_LOG_KEY = 'audit_log';

/**
 * 审计日志装饰器配置接口
 */
export interface AuditLogConfig {
  /**
   * 操作类型
   */
  action: string;

  /**
   * 资源类型
   */
  resource: string;

  /**
   * 操作描述
   */
  description?: string;
}

/**
 * 审计日志装饰器
 * 用于标记需要记录审计日志的操作
 * 
 * @param config 审计日志配置
 * 
 * @example
 * ```typescript
 * @AuditLog({
 *   action: 'CREATE',
 *   resource: 'USER',
 *   description: '创建用户'
 * })
 * async createUser(dto: CreateUserDto) {
 *   // 业务逻辑
 * }
 * ```
 */
export const AuditLog = (config: AuditLogConfig) => SetMetadata(AUDIT_LOG_KEY, config);

/**
 * 预定义的操作类型常量
 */
export const AuditAction = {
  // 基础CRUD操作
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  
  // 批量操作
  BATCH_CREATE: 'BATCH_CREATE',
  BATCH_UPDATE: 'BATCH_UPDATE',
  BATCH_DELETE: 'BATCH_DELETE',
  
  // 状态变更
  ACTIVATE: 'ACTIVATE',
  DEACTIVATE: 'DEACTIVATE',
  ENABLE: 'ENABLE',
  DISABLE: 'DISABLE',
  
  // 认证授权
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REGISTER: 'REGISTER',
  RESET_PASSWORD: 'RESET_PASSWORD',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  
  // 权限管理
  GRANT_PERMISSION: 'GRANT_PERMISSION',
  REVOKE_PERMISSION: 'REVOKE_PERMISSION',
  ASSIGN_ROLE: 'ASSIGN_ROLE',
  REMOVE_ROLE: 'REMOVE_ROLE',
  
  // 系统管理
  BACKUP: 'BACKUP',
  RESTORE: 'RESTORE',
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
  SYNC: 'SYNC',
  
  // 业务操作
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  SUBMIT: 'SUBMIT',
  CANCEL: 'CANCEL',
  CONFIRM: 'CONFIRM',
  
  // 库存操作
  STOCK_IN: 'STOCK_IN',
  STOCK_OUT: 'STOCK_OUT',
  STOCK_ADJUST: 'STOCK_ADJUST',
  
  // 告警操作
  ACKNOWLEDGE_ALERT: 'ACKNOWLEDGE_ALERT',
  RESOLVE_ALERT: 'RESOLVE_ALERT',
  
  // 设备操作
  BIND_DEVICE: 'BIND_DEVICE',
  UNBIND_DEVICE: 'UNBIND_DEVICE',
  RESET_DEVICE: 'RESET_DEVICE',
} as const;

/**
 * 预定义的资源类型常量
 */
export const AuditResource = {
  // 用户管理
  USER: 'USER',
  ROLE: 'ROLE',
  PERMISSION: 'PERMISSION',
  
  // 商户管理
  MERCHANT: 'MERCHANT',
  STORE: 'STORE',
  STAFF: 'STAFF',
  
  // 设备管理
  DEVICE: 'DEVICE',
  DEVICE_TYPE: 'DEVICE_TYPE',
  
  // 订单管理
  ORDER: 'ORDER',
  ORDER_ITEM: 'ORDER_ITEM',
  
  // 库存管理
  INVENTORY: 'INVENTORY',
  MATERIAL: 'MATERIAL',
  
  // 告警管理
  ALERT: 'ALERT',
  ALERT_RULE: 'ALERT_RULE',
  
  // 系统管理
  SYSTEM_CONFIG: 'SYSTEM_CONFIG',
  AUDIT_LOG: 'AUDIT_LOG',
  BACKUP: 'BACKUP',
  
  // 报表统计
  REPORT: 'REPORT',
  DASHBOARD: 'DASHBOARD',
} as const;

/**
 * 常用审计日志装饰器组合
 */
export const AuditLogDecorators = {
  // 用户管理
  CreateUser: () => AuditLog({ action: AuditAction.CREATE, resource: AuditResource.USER, description: '创建用户' }),
  UpdateUser: () => AuditLog({ action: AuditAction.UPDATE, resource: AuditResource.USER, description: '更新用户' }),
  DeleteUser: () => AuditLog({ action: AuditAction.DELETE, resource: AuditResource.USER, description: '删除用户' }),
  
  // 商户管理
  CreateMerchant: () => AuditLog({ action: AuditAction.CREATE, resource: AuditResource.MERCHANT, description: '创建商户' }),
  UpdateMerchant: () => AuditLog({ action: AuditAction.UPDATE, resource: AuditResource.MERCHANT, description: '更新商户' }),
  DeleteMerchant: () => AuditLog({ action: AuditAction.DELETE, resource: AuditResource.MERCHANT, description: '删除商户' }),
  
  // 门店管理
  CreateStore: () => AuditLog({ action: AuditAction.CREATE, resource: AuditResource.STORE, description: '创建门店' }),
  UpdateStore: () => AuditLog({ action: AuditAction.UPDATE, resource: AuditResource.STORE, description: '更新门店' }),
  DeleteStore: () => AuditLog({ action: AuditAction.DELETE, resource: AuditResource.STORE, description: '删除门店' }),
  
  // 设备管理
  CreateDevice: () => AuditLog({ action: AuditAction.CREATE, resource: AuditResource.DEVICE, description: '创建设备' }),
  UpdateDevice: () => AuditLog({ action: AuditAction.UPDATE, resource: AuditResource.DEVICE, description: '更新设备' }),
  DeleteDevice: () => AuditLog({ action: AuditAction.DELETE, resource: AuditResource.DEVICE, description: '删除设备' }),
  BindDevice: () => AuditLog({ action: AuditAction.BIND_DEVICE, resource: AuditResource.DEVICE, description: '绑定设备' }),
  UnbindDevice: () => AuditLog({ action: AuditAction.UNBIND_DEVICE, resource: AuditResource.DEVICE, description: '解绑设备' }),
  
  // 订单管理
  UpdateOrder: () => AuditLog({ action: AuditAction.UPDATE, resource: AuditResource.ORDER, description: '更新订单' }),

  // 库存管理
  CreateInventory: () => AuditLog({ action: AuditAction.CREATE, resource: AuditResource.INVENTORY, description: '创建库存' }),
  UpdateInventory: () => AuditLog({ action: AuditAction.UPDATE, resource: AuditResource.INVENTORY, description: '更新库存' }),
  StockIn: () => AuditLog({ action: AuditAction.STOCK_IN, resource: AuditResource.INVENTORY, description: '库存入库' }),
  StockOut: () => AuditLog({ action: AuditAction.STOCK_OUT, resource: AuditResource.INVENTORY, description: '库存出库' }),
  
  // 告警管理
  AcknowledgeAlert: () => AuditLog({ action: AuditAction.ACKNOWLEDGE_ALERT, resource: AuditResource.ALERT, description: '确认告警' }),
  ResolveAlert: () => AuditLog({ action: AuditAction.RESOLVE_ALERT, resource: AuditResource.ALERT, description: '解决告警' }),
  
  // 认证授权
  Login: () => AuditLog({ action: AuditAction.LOGIN, resource: AuditResource.USER, description: '用户登录' }),
  Logout: () => AuditLog({ action: AuditAction.LOGOUT, resource: AuditResource.USER, description: '用户登出' }),
  Register: () => AuditLog({ action: AuditAction.REGISTER, resource: AuditResource.USER, description: '用户注册' }),
  ChangePassword: () => AuditLog({ action: AuditAction.CHANGE_PASSWORD, resource: AuditResource.USER, description: '修改密码' }),
  
  // 系统管理
  ExportData: () => AuditLog({ action: AuditAction.EXPORT, resource: AuditResource.SYSTEM_CONFIG, description: '导出数据' }),
  ImportData: () => AuditLog({ action: AuditAction.IMPORT, resource: AuditResource.SYSTEM_CONFIG, description: '导入数据' }),
  SystemBackup: () => AuditLog({ action: AuditAction.BACKUP, resource: AuditResource.BACKUP, description: '系统备份' }),
  SystemRestore: () => AuditLog({ action: AuditAction.RESTORE, resource: AuditResource.BACKUP, description: '系统恢复' }),
};

/**
 * 类型定义
 */
export type AuditActionType = typeof AuditAction[keyof typeof AuditAction];
export type AuditResourceType = typeof AuditResource[keyof typeof AuditResource];