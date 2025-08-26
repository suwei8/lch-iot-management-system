import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Popconfirm,
  Card,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import { userService } from '../../../services/userService';
import { useMessage } from '../../../hooks/useMessage';
import type { User, UserRole, UserStatus } from '../../../types/user';

const { Option } = Select;

/**
 * 用户管理页面组件
 */
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const messageApi = useMessage();
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    merchants: 0,
    users: 0,
  });

  /**
   * 获取用户列表
   */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers();
      if (response.success) {
        // 确保data是数组格式
        const userData = Array.isArray(response.data) ? response.data : [];
        setUsers(userData);
        calculateStatistics(userData);
      } else {
        messageApi.error(response.message || '获取用户列表失败');
        setUsers([]); // 设置为空数组
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      messageApi.error('获取用户列表失败');
      setUsers([]); // 设置为空数组
    } finally {
      setLoading(false);
    }
  };

  /**
   * 计算统计数据
   */
  const calculateStatistics = (userList: User[]) => {
    const stats = {
      total: userList.length,
      active: userList.filter(user => user.status === 'active').length,
      inactive: userList.filter(user => user.status === 'inactive').length,
      admins: userList.filter(user => user.role === 'platform_admin' || user.role === 'admin').length,
      merchants: userList.filter(user => user.role === 'merchant').length,
      users: userList.filter(user => user.role === 'user').length,
    };
    setStatistics(stats);
  };

  /**
   * 打开编辑用户模态框
   */
  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      nickname: user.nickname,
      role: user.role,
      status: user.status,
      balance: user.balance,
    });
    setModalVisible(true);
  };

  /**
   * 打开新增用户模态框
   */
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  /**
   * 保存用户信息
   */
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        // 更新用户
        const response = await userService.updateUser(editingUser.id, values);
        if (response.success) {
          messageApi.success('用户信息更新成功');
          setModalVisible(false);
          fetchUsers();
        } else {
          messageApi.error(response.message || '更新用户信息失败');
        }
      } else {
        // 新增用户
        const response = await userService.createUser(values);
        if (response.success) {
          messageApi.success('用户创建成功');
          setModalVisible(false);
          fetchUsers();
        } else {
          messageApi.error(response.message || '创建用户失败');
        }
      }
    } catch (error) {
      console.error('保存用户信息失败:', error);
    }
  };

  /**
   * 删除用户
   */
  const handleDelete = async (userId: number) => {
    try {
      const response = await userService.deleteUser(userId);
      if (response.success) {
        messageApi.success('用户删除成功');
        fetchUsers();
      } else {
        messageApi.error(response.message || '删除用户失败');
      }
    } catch (error) {
      messageApi.error('删除用户失败');
    }
  };

  /**
   * 获取角色标签颜色
   */
  const getRoleTagColor = (role: UserRole) => {
    switch (role) {
      case 'platform_admin':
        return 'red';
      case 'admin':
        return 'orange';
      case 'merchant':
        return 'blue';
      case 'user':
        return 'green';
      default:
        return 'default';
    }
  };

  /**
   * 获取角色显示名称
   */
  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'platform_admin':
        return '平台管理员';
      case 'admin':
        return '管理员';
      case 'merchant':
        return '商户';
      case 'user':
        return '普通用户';
      default:
        return role;
    }
  };

  /**
   * 获取状态标签颜色
   */
  const getStatusTagColor = (status: UserStatus) => {
    return status === 'active' ? 'success' : 'error';
  };

  /**
   * 获取状态显示名称
   */
  const getStatusDisplayName = (status: UserStatus) => {
    return status === 'active' ? '正常' : '禁用';
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 120,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: UserRole) => (
        <Tag color={getRoleTagColor(role)}>
          {getRoleDisplayName(role)}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: UserStatus) => (
        <Tag color={getStatusTagColor(status)}>
          {getStatusDisplayName(status)}
        </Tag>
      ),
    },
    {
      title: '余额',
      dataIndex: 'balance',
      key: 'balance',
      width: 100,
      render: (balance: number) => `¥${balance.toFixed(2)}`,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: User) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="总用户数"
              value={statistics.total}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="正常用户"
              value={statistics.active}
              valueStyle={{ color: '#3f8600' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="禁用用户"
              value={statistics.inactive}
              valueStyle={{ color: '#cf1322' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="管理员"
              value={statistics.admins}
              valueStyle={{ color: '#722ed1' }}
              prefix={<CrownOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="商户"
              value={statistics.merchants}
              valueStyle={{ color: '#1890ff' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="普通用户"
              value={statistics.users}
              valueStyle={{ color: '#52c41a' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 操作按钮 */}
      <div style={{ marginBottom: '16px' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          新增用户
        </Button>
      </div>

      {/* 用户表格 */}
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      {/* 编辑/新增用户模态框 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'active',
            role: 'user',
            balance: 0,
          }}
        >
          {!editingUser && (
            <>
              <Form.Item
                label="手机号"
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
                ]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
              <Form.Item
                label="密码"
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6位' },
                ]}
              >
                <Input.Password placeholder="请输入密码" />
              </Form.Item>
            </>
          )}
          <Form.Item
            label="昵称"
            name="nickname"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="user">普通用户</Option>
              <Option value="merchant">商户</Option>
              <Option value="admin">管理员</Option>
              <Option value="platform_admin">平台管理员</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="active">正常</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="账户余额"
            name="balance"
            rules={[
              { required: true, message: '请输入账户余额' },
              { type: 'number', min: 0, message: '余额不能为负数' },
            ]}
          >
            <Input type="number" placeholder="请输入账户余额" step="0.01" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;