import { SetMetadata } from '@nestjs/common';

/**
 * 用户角色枚举
 */
export enum UserRole {
  USER = 'user',
  MERCHANT = 'merchant',
  STORE_MANAGER = 'store_manager',
  STORE_STAFF = 'store_staff',
  PLATFORM_ADMIN = 'platform_admin',
}

/**
 * 角色装饰器键
 */
export const ROLES_KEY = 'roles';

/**
 * 角色装饰器
 * @param roles 允许访问的角色列表
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);