import React, { useState } from 'react';
import { Form, Input, Button, Card, Tabs, message, Spin } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { ApiService } from '@/utils/api';
import { LoginRequest, LoginResponse } from '@/types';
import './index.css';

const { TabPane } = Tabs;

interface LocationState {
  from?: {
    pathname: string;
  };
}

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'admin' | 'merchant'>('admin');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  
  const state = location.state as LocationState;
  const from = state?.from?.pathname || (activeTab === 'admin' ? '/admin' : '/merchant');

  // 处理登录提交
  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    
    try {
      const loginData: LoginRequest = {
        username: values.username,
        password: values.password,
        role: activeTab,
      };
      
      const response = await ApiService.post<LoginResponse>('/auth/login', loginData);
      
      if (response.success) {
        // 保存登录状态
        login(response.data);
        
        message.success('登录成功！');
        
        // 跳转到对应的后台页面
        const redirectPath = activeTab === 'admin' ? '/admin' : '/merchant';
        navigate(redirectPath, { replace: true });
      } else {
        message.error(response.message || '登录失败');
      }
    } catch (error: any) {
      console.error('登录错误:', error);
      message.error(error.message || '登录失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  // 处理Tab切换
  const handleTabChange = (key: string) => {
    setActiveTab(key as 'admin' | 'merchant');
  };

  // 演示账号登录
  const handleDemoLogin = (role: 'admin' | 'merchant') => {
    const demoAccounts = {
      admin: { username: 'admin', password: 'admin123' },
      merchant: { username: 'merchant', password: 'merchant123' },
    };
    
    setActiveTab(role);
    // 这里可以直接调用登录接口或者设置表单值
    handleLogin(demoAccounts[role]);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <Card className="login-card" bordered={false}>
          <div className="login-header">
            <div className="login-logo">
              <SafetyCertificateOutlined className="logo-icon" />
            </div>
            <h1 className="login-title">亮车惠IoT管理系统</h1>
            <p className="login-subtitle">智能设备管理平台</p>
          </div>
          
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            centered
            className="login-tabs"
          >
            <TabPane tab="管理员登录" key="admin">
              <Form
                name="admin-login"
                onFinish={handleLogin}
                autoComplete="off"
                size="large"
                initialValues={{
                  username: '',
                  password: '',
                }}
              >
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: '请输入用户名' },
                    { min: 3, message: '用户名至少3个字符' },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="请输入管理员用户名"
                    autoComplete="username"
                  />
                </Form.Item>
                
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6个字符' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请输入密码"
                    autoComplete="current-password"
                  />
                </Form.Item>
                
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    className="login-button"
                  >
                    {loading ? '登录中...' : '管理员登录'}
                  </Button>
                </Form.Item>
                
                <div className="demo-login">
                  <Button
                    type="link"
                    size="small"
                    onClick={() => handleDemoLogin('admin')}
                    disabled={loading}
                  >
                    使用演示账号登录
                  </Button>
                </div>
              </Form>
            </TabPane>
            
            <TabPane tab="商户登录" key="merchant">
              <Form
                name="merchant-login"
                onFinish={handleLogin}
                autoComplete="off"
                size="large"
                initialValues={{
                  username: '',
                  password: '',
                }}
              >
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: '请输入用户名' },
                    { min: 3, message: '用户名至少3个字符' },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="请输入商户用户名"
                    autoComplete="username"
                  />
                </Form.Item>
                
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6个字符' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请输入密码"
                    autoComplete="current-password"
                  />
                </Form.Item>
                
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    className="login-button"
                  >
                    {loading ? '登录中...' : '商户登录'}
                  </Button>
                </Form.Item>
                
                <div className="demo-login">
                  <Button
                    type="link"
                    size="small"
                    onClick={() => handleDemoLogin('merchant')}
                    disabled={loading}
                  >
                    使用演示账号登录
                  </Button>
                </div>
              </Form>
            </TabPane>
          </Tabs>
          
          <div className="login-footer">
            <p>© 2024 亮车惠IoT管理系统. All rights reserved.</p>
          </div>
        </Card>
      </div>
      
      {loading && (
        <div className="login-loading-overlay">
          <Spin size="large" tip="正在登录..." />
        </div>
      )}
    </div>
  );
};

export default LoginPage;