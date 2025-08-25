import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission, PERMISSIONS_KEY, hasPermission } from '../decorators/permissions.decorator';

/**
 * 权限守卫 - 用于验证用户的具体权限
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * 验证用户是否具有所需权限
   * @param context 执行上下文
   * @returns 是否允许访问
   */
  canActivate(context: ExecutionContext): boolean {
    // 获取路由处理器和类上的权限元数据
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 如果没有设置权限要求，则允许访问
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // 获取请求对象
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 如果用户未认证，拒绝访问
    if (!user) {
      throw new ForbiddenException('用户未认证');
    }

    // 检查用户是否具有所需的所有权限
    const hasAllPermissions = requiredPermissions.every((permission) =>
      hasPermission(user.role, permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException('权限不足，无法执行此操作');
    }

    return true;
  }
}