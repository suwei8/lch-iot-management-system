import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { UserRole } from '@/types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

/**
 * 路由守卫组件
 * 用于保护需要认证的页面，检查用户登录状态和权限
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // 检查是否已登录
  if (!isAuthenticated || !user) {
    // 保存当前路径，登录后可以重定向回来
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  // 检查角色权限
  if (requiredRole && user.role !== requiredRole) {
    // 特殊处理：platform_admin 可以访问 admin 路由
    if (requiredRole === 'admin' && user.role === 'platform_admin') {
      // 允许访问
    } else {
      // 根据用户角色重定向到对应的首页
      const defaultPath = user.role === 'admin' || user.role === 'platform_admin' ? '/admin' : '/merchant';
      return <Navigate to={defaultPath} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;