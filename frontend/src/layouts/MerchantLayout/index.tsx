import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Avatar,
  Badge,
  Space,
  Breadcrumb,
  theme,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  ProfileOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useAppStore } from '@/store';
import type { MenuProps } from 'antd';
import './index.css';

const { Header, Sider, Content } = Layout;

/**
 * 商户后台布局组件
 * 提供商户专用的侧边栏导航、顶部工具栏和内容区域
 */
const MerchantLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { collapsed, setCollapsed } = useAppStore();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // 侧边栏菜单项
  const menuItems: MenuProps['items'] = [
    {
      key: '/merchant',
      icon: <DashboardOutlined />,
      label: '仪表板',
    },
    {
      key: '/merchant/devices',
      icon: <DatabaseOutlined />,
      label: '我的设备',
    },
    {
      key: '/merchant/data',
      icon: <BarChartOutlined />,
      label: '数据分析',
    },
    {
      key: '/merchant/reports',
      icon: <BarChartOutlined />,
      label: '报表中心',
    },
    {
      key: '/merchant/profile',
      icon: <ShopOutlined />,
      label: '商户信息',
    },
    {
      key: '/merchant/settings',
      icon: <SettingOutlined />,
      label: '账户设置',
    },
  ];

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账户设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  // 处理菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  // 处理用户菜单点击
  const handleUserMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        navigate('/merchant/profile');
        break;
      case 'settings':
        navigate('/merchant/settings');
        break;
      case 'logout':
        logout();
        navigate('/login');
        break;
    }
  };

  // 生成面包屑
  const generateBreadcrumb = () => {
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const breadcrumbItems = [
      {
        title: '首页',
        href: '/merchant',
      },
    ];

    pathSnippets.slice(1).forEach((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 2).join('/')}`;
      const title = getPageTitle(snippet);
      breadcrumbItems.push({
        title,
        href: url,
      });
    });

    return breadcrumbItems;
  };

  // 获取页面标题
  const getPageTitle = (path: string): string => {
    const titleMap: Record<string, string> = {
      devices: '我的设备',
      data: '数据分析',
      reports: '报表中心',
      profile: '商户信息',
      settings: '账户设置',
    };
    return titleMap[path] || path;
  };

  return (
    <Layout className="merchant-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="merchant-sider"
        width={240}
        collapsedWidth={80}
      >
        <div className="merchant-logo">
          <div className="logo-icon">
            <ShopOutlined />
          </div>
          {!collapsed && (
            <div className="logo-text">
              <div className="logo-title">亮车惠IoT</div>
              <div className="logo-subtitle">商户后台</div>
            </div>
          )}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="merchant-menu"
        />
      </Sider>
      
      <Layout className="merchant-main">
        <Header className="merchant-header" style={{ background: colorBgContainer }}>
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="trigger-btn"
            />
            
            <Breadcrumb
              items={generateBreadcrumb()}
              className="breadcrumb"
            />
          </div>
          
          <div className="header-right">
            <Space size="middle">
              <Badge count={3} size="small">
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  className="notification-btn"
                />
              </Badge>
              
              <Dropdown
                menu={{
                  items: userMenuItems,
                  onClick: handleUserMenuClick,
                }}
                placement="bottomRight"
                arrow
              >
                <div className="user-info">
                  <Avatar
                    size="small"
                    icon={<ShopOutlined />}
                    className="user-avatar"
                  />
                  <span className="user-name">{user?.username || '商户'}</span>
                </div>
              </Dropdown>
            </Space>
          </div>
        </Header>
        
        <Content className="merchant-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MerchantLayout;