import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, ROLES_KEY } from '../decorators/roles.decorator';

/**
 * 角色守卫
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 获取路由所需的角色
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果没有设置角色要求，则允许访问
    if (!requiredRoles) {
      return true;
    }

    // 获取用户信息
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }

    // 检查用户角色是否匹配
    return requiredRoles.some((role) => user.role === role);
  }
}