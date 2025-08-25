import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Permission, RolePermissions } from '../enums/permission.enum';

/**
 * 权限守卫
 * 验证用户是否具有访问特定资源的权限
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * 验证权限
   * @param context 执行上下文
   * @returns 是否有权限
   */
  canActivate(context: ExecutionContext): boolean {
    // 获取方法和类上的权限要求
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 如果没有权限要求，则允许访问
    if (!requiredPermissions) {
      return true;
    }

    // 获取用户信息
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }

    // 获取用户角色对应的权限
    const userPermissions = RolePermissions[user.role] || [];

    // 检查用户是否具有所需的权限
    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }
}