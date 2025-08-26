import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useAuthStore } from '@/store';
import LoginPage from '@/pages/Login';
import AdminLayout from '@/layouts/AdminLayout';
import MerchantLayout from '@/layouts/MerchantLayout';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import AdminDashboard from '@/pages/Admin/Dashboard';
import AdminMerchants from '@/pages/Admin/Merchants';
import AdminStores from '@/pages/Admin/Stores';
import AdminDevices from '@/pages/Admin/Devices';
import AdminOrders from '@/pages/Admin/Orders';
import UserManagement from '@/pages/Admin/UserManagement';
import MerchantDashboard from '@/pages/Merchant/Dashboard';
import MerchantDevices from '@/pages/Merchant/Devices';
import MerchantOrders from '@/pages/Merchant/Orders';
import MerchantAnalytics from '@/pages/Merchant/Analytics';
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
    // 特殊处理：platform_admin 可以访问 admin 路由
    if (requiredRole === 'admin' && user?.role === 'platform_admin') {
      // 允许访问
    } else {
      return <Navigate to="/unauthorized" replace />;
    }
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
  if (user?.role === 'admin' || user?.role === 'platform_admin') {
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
                  user?.role === 'admin' || user?.role === 'platform_admin' ? (
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
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="merchants" element={<AdminMerchants />} />
              <Route path="stores" element={<AdminStores />} />
              <Route path="devices" element={<AdminDevices />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="data" element={<div>数据管理页面开发中...</div>} />
              <Route path="settings" element={<div>系统设置页面开发中...</div>} />
            </Route>
            
            {/* 商户后台路由 */}
            <Route
              path="/merchant"
              element={
                <ProtectedRoute requiredRole="merchant">
                  <MerchantLayout />
                </ProtectedRoute>
              }
            >
              {/* 商户仪表板 - 默认页面 */}
              <Route index element={<MerchantDashboard />} />
              <Route path="dashboard" element={<MerchantDashboard />} />
              
              {/* 设备管理 */}
              <Route path="devices" element={<MerchantDevices />} />
              
              {/* 订单管理 */}
              <Route path="orders" element={<MerchantOrders />} />
              
              {/* 数据分析 */}
              <Route path="data" element={<MerchantAnalytics />} />
              
              {/* 待开发的页面 - 临时显示开发中提示 */}
              <Route path="reports" element={<div style={{padding: '24px', textAlign: 'center'}}>报表中心开发中...</div>} />
              <Route path="profile" element={<div style={{padding: '24px', textAlign: 'center'}}>商户信息页面开发中...</div>} />
              <Route path="settings" element={<div style={{padding: '24px', textAlign: 'center'}}>账户设置页面开发中...</div>} />
            </Route>
            
            {/* 未授权页面 */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* 404页面 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;