import { SetMetadata } from '@nestjs/common';

/**
 * 角色装饰器 - 用于设置路由所需的角色
 * @param roles 允许访问的角色列表
 * @returns 装饰器函数
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);