import { SetMetadata } from '@nestjs/common';
import { Permission } from '../enums/permission.enum';

/**
 * 权限装饰器的元数据键
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * 权限装饰器
 * 用于标记方法需要的权限
 * @param permissions 权限列表
 */
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);