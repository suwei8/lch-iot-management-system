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
  UserOutlined,
  ShopOutlined,
  DatabaseOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  ProfileOutlined,
  HomeOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useAppStore } from '@/store';
import type { MenuProps } from 'antd';
import './index.css';

const { Header, Sider, Content } = Layout;

/**
 * 管理员后台布局组件
 * 提供侧边栏导航、顶部工具栏和内容区域
 */
const AdminLayout: React.FC = () => {
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
      key: '/admin',
      icon: <DashboardOutlined />,
      label: '仪表板',
    },
    {
      key: '/admin/merchants',
      icon: <ShopOutlined />,
      label: '商户管理',
    },
    {
      key: '/admin/stores',
      icon: <HomeOutlined />,
      label: '门店管理',
    },
    {
      key: '/admin/orders',
      icon: <FileTextOutlined />,
      label: '订单管理',
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: '/admin/devices',
      icon: <DatabaseOutlined />,
      label: '设备管理',
    },
    {
      key: '/admin/data',
      icon: <DatabaseOutlined />,
      label: '数据管理',
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
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
        navigate('/admin/profile');
        break;
      case 'settings':
        navigate('/admin/account-settings');
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
        href: '/admin',
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
      merchants: '商户管理',
      users: '用户管理',
      devices: '设备管理',
      data: '数据管理',
      settings: '系统设置',
      profile: '个人资料',
      'account-settings': '账户设置',
    };
    return titleMap[path] || path;
  };

  return (
    <Layout className="admin-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="admin-sider"
        width={240}
        collapsedWidth={80}
      >
        <div className="admin-logo">
          <div className="logo-icon">
            <DatabaseOutlined />
          </div>
          {!collapsed && (
            <div className="logo-text">
              <div className="logo-title">亮车惠IoT</div>
              <div className="logo-subtitle">管理后台</div>
            </div>
          )}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="admin-menu"
        />
      </Sider>
      
      <Layout className="admin-main">
        <Header className="admin-header" style={{ background: colorBgContainer }}>
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
              <Badge count={5} size="small">
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
                    icon={<UserOutlined />}
                    className="user-avatar"
                  />
                  <span className="user-name">{user?.nickname || '管理员'}</span>
                </div>
              </Dropdown>
            </Space>
          </div>
        </Header>
        
        <Content className="admin-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;