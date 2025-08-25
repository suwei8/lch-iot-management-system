import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserRole, ROLES_KEY } from '../../../common/decorators/roles.decorator';

/**
 * 角色守卫 - 用于验证用户角色权限和数据域隔离
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  /**
   * 验证用户是否具有所需角色
   * @param context 执行上下文
   * @returns 是否允许访问
   */
  canActivate(context: ExecutionContext): boolean {
    // 获取路由处理器和类上的角色元数据
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果没有设置角色要求，则允许访问
    if (!requiredRoles) {
      return true;
    }

    // 获取请求对象
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 如果用户未认证，拒绝访问
    if (!user) {
      throw new ForbiddenException('用户未认证');
    }

    // 检查用户角色是否匹配所需角色
    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) {
      throw new ForbiddenException('权限不足');
    }

    // 数据域隔离验证
    this.validateDataScope(request, user);

    return true;
  }

  /**
   * 验证数据域权限
   * @param request 请求对象
   * @param user 用户信息
   */
  private validateDataScope(request: any, user: any): void {
    const { method, params, body } = request;
    const userRole = user.role as UserRole;

    // 平台管理员可以访问所有数据
    if (userRole === UserRole.PLATFORM_ADMIN) {
      return;
    }

    // 商户只能访问自己的数据
    if (userRole === UserRole.MERCHANT) {
      const merchantId = params.merchantId || body.merchantId || user.merchantId;
      if (merchantId && merchantId !== user.merchantId) {
        throw new ForbiddenException('无权访问其他商户数据');
      }
    }

    // 门店管理员只能访问自己门店的数据
    if (userRole === UserRole.STORE_MANAGER) {
      const storeId = params.storeId || body.storeId || user.storeId;
      if (storeId && storeId !== user.storeId) {
        throw new ForbiddenException('无权访问其他门店数据');
      }
    }

    // 门店员工只能访问自己门店的数据
    if (userRole === UserRole.STORE_STAFF) {
      const storeId = params.storeId || body.storeId || user.storeId;
      if (storeId && storeId !== user.storeId) {
        throw new ForbiddenException('无权访问其他门店数据');
      }
      
      // 门店员工不能执行管理操作
      if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        const allowedPaths = ['/profile', '/password'];
        const isAllowed = allowedPaths.some(path => request.url.includes(path));
        if (!isAllowed) {
          throw new ForbiddenException('门店员工无权执行此操作');
        }
      }
    }
  }
}