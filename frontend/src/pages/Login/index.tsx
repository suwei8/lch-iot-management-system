import React, { useState } from 'react';
import { Form, Input, Button, Card, Tabs, Spin } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { ApiService } from '@/utils/api';
import { LoginResponse } from '@/types';
import { useMessage } from '@/hooks/useMessage';
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
  const messageApi = useMessage();
  
  const state = location.state as LocationState;
  const from = state?.from?.pathname || (activeTab === 'admin' ? '/admin' : '/merchant');

  // 处理登录提交
  const handleLogin = async (values: { phone: string; password: string }) => {
    setLoading(true);
    
    try {
      const loginData = {
        phone: values.phone,
        password: values.password,
      };
      
      const response = await ApiService.post<LoginResponse>('/api/v1/auth/login', loginData);
      
      if (response.success) {
        // 保存登录状态
        login(response.data);
        
        messageApi.success('登录成功！');
        
        // 跳转到对应的后台页面
        const redirectPath = activeTab === 'admin' ? '/admin' : '/merchant';
        navigate(redirectPath, { replace: true });
      } else {
        messageApi.error(response.message || '登录失败');
      }
    } catch (error: any) {
      console.error('登录错误:', error);
      messageApi.error(error.message || '登录失败，请检查网络连接');
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
    admin: { phone: '13800138003', password: '123456' },
    merchant: { phone: '13800138001', password: '123456' },
  };
    
    setActiveTab(role);
    // 这里可以直接调用登录接口或者设置表单值
    handleLogin(demoAccounts[role]);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <Card className="login-card">
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
            items={[
              {
                key: 'admin',
                label: '管理员登录',
                children: (
                  <Form
                    name="admin-login"
                    onFinish={handleLogin}
                    autoComplete="off"
                    size="large"
                    initialValues={{
                      phone: '',
                      password: '',
                    }}
                  >
                    <Form.Item
                      name="phone"
                      rules={[
                        { required: true, message: '请输入手机号' },
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="请输入手机号"
                        autoComplete="tel"
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
                ),
              },
              {
                key: 'merchant',
                label: '商户登录',
                children: (
                  <Form
                    name="merchant-login"
                    onFinish={handleLogin}
                    autoComplete="off"
                    size="large"
                    initialValues={{
                      phone: '',
                      password: '',
                    }}
                  >
                    <Form.Item
                      name="phone"
                      rules={[
                        { required: true, message: '请输入手机号' },
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="请输入手机号"
                        autoComplete="tel"
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
                ),
              },
            ]}
          />
          
          <div className="login-footer">
            <p>© 2024 亮车惠IoT管理系统. All rights reserved.</p>
          </div>
        </Card>
      </div>
      
      {loading && (
        <div className="login-loading-overlay">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default LoginPage;