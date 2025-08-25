import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useAuthStore } from '@/store';
import LoginPage from '@/pages/Login';
import AdminLayout from '@/layouts/AdminLayout';
import MerchantLayout from '@/layouts/MerchantLayout';
import NotFound from '@/pages/NotFound';
import './App.css';

// 路由守卫组件
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: 'admin' | 'merchant';
}> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // 未登录，跳转到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 角色权限检查
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// 登录重定向组件
const LoginRedirect: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // 根据用户角色重定向到对应的后台
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (user?.role === 'merchant') {
    return <Navigate to="/merchant" replace />;
  }

  return <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  // 应用初始化
  useEffect(() => {
    // 检查本地存储的认证信息
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      // 这里可以添加token验证逻辑
      console.log('检测到本地token，需要验证有效性');
    }
  }, [isAuthenticated]);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
        components: {
          Layout: {
            headerBg: '#fff',
            siderBg: '#001529',
          },
          Menu: {
            darkItemBg: '#001529',
            darkSubMenuItemBg: '#000c17',
            darkItemSelectedBg: '#1890ff',
          },
        },
      }}
    >
      <AntdApp>
        <div className="App">
          <Routes>
            {/* 登录页面 */}
            <Route path="/login" element={<LoginRedirect />} />
            
            {/* 根路径重定向 */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  user?.role === 'admin' ? (
                    <Navigate to="/admin" replace />
                  ) : (
                    <Navigate to="/merchant" replace />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            
            {/* 管理员后台路由 */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            />
            
            {/* 商户后台路由 */}
            <Route
              path="/merchant/*"
              element={
                <ProtectedRoute requiredRole="merchant">
                  <MerchantLayout />
                </ProtectedRoute>
              }
            />
            
            {/* 未授权页面 */}
            <Route
              path="/unauthorized"
              element={
                <div className="flex-center full-height">
                  <div className="text-center">
                    <h2>403 - 访问被拒绝</h2>
                    <p>您没有权限访问此页面</p>
                  </div>
                </div>
              }
            />
            
            {/* 404页面 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;