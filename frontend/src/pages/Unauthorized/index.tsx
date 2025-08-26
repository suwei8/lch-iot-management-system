import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';

/**
 * 未授权访问页面
 * 显示403错误信息并提供退出登录功能
 */
const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  /**
   * 处理退出登录
   */
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  /**
   * 返回首页
   */
  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有权限访问此页面。"
        extra={
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button type="primary" onClick={handleGoHome}>
              返回首页
            </Button>
            <Button onClick={handleLogout}>
              退出登录
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default Unauthorized;