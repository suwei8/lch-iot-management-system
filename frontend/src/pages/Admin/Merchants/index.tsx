import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Drawer,
  Descriptions,
  Statistic,
  Row,
  Col,
  Avatar,
  Tooltip,
  Badge,
  Switch,
  DatePicker,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  ExportOutlined,
  UserOutlined,
  ShopOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { merchantService } from '@/services/merchantService';
import { formatDate } from '@/utils/helpers';
import type { Merchant, TableColumn } from '@/types';
import './index.css';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

/**
 * 管理员商户管理页面
 * 提供商户的增删改查、状态管理、统计分析等功能
 */
const AdminMerchants: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  
  // 模态框状态
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  
  // 详情抽屉状态
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  
  const [form] = Form.useForm();

  // 商户类型选项
  const merchantTypes = [
    { label: '企业客户', value: 'enterprise' },
    { label: '个人客户', value: 'individual' },
    { label: '政府机构', value: 'government' },
    { label: '教育机构', value: 'education' },
    { label: '医疗机构', value: 'healthcare' },
    { label: '其他', value: 'other' },
  ];

  // 商户状态选项
  const merchantStatuses = [
    { label: '正常', value: 'active', color: 'green' },
    { label: '禁用', value: 'inactive', color: 'red' },
    { label: '待审核', value: 'pending', color: 'orange' },
    { label: '已过期', value: 'expired', color: 'gray' },
  ];

  // 加载商户列表
  const loadMerchants = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchText,
        status: statusFilter,
        type: typeFilter,
      };
      
      const response = await merchantService.getMerchants(params);
      
      // 调试：输出接口返回数据
      console.log('商户列表API响应:', response);
      console.log('商户列表数据:', response.data);
      
      if (response.success) {
        // 后端返回的数据结构是 { data: { items: [...], total: number } }
        const merchantData = response.data.data || [];
        setMerchants(merchantData);
        setTotal(response.data.total || 0);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('加载商户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 添加商户
  const handleAdd = () => {
    setModalType('add');
    setEditingMerchant(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 编辑商户
  const handleEdit = (merchant: Merchant) => {
    setModalType('edit');
    setEditingMerchant(merchant);
    form.setFieldsValue(merchant);
    setModalVisible(true);
  };

  // 查看商户详情
  const handleView = async (merchant: Merchant) => {
    try {
      const response = await merchantService.getMerchantById(merchant.id);
      if (response.success && response.data) {
        setSelectedMerchant(response.data);
        setDrawerVisible(true);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('获取商户详情失败');
    }
  };

  // 删除商户
  const handleDelete = async (merchantId: number) => {
    try {
      const response = await merchantService.deleteMerchant(merchantId);
      if (response.success) {
        message.success('商户删除成功');
        loadMerchants();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('删除商户失败');
    }
  };

  // 切换商户状态
  const handleStatusToggle = async (merchant: Merchant) => {
    try {
      const newStatus = merchant.status === 'active' ? 'inactive' : 'active';
      const response = await merchantService.updateMerchantStatus(merchant.id, newStatus);
      
      if (response.success) {
        message.success(`商户已${newStatus === 'active' ? '启用' : '禁用'}`);
        loadMerchants();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('状态切换失败');
    }
  };

  // 保存商户
  const handleSave = async (values: any) => {
    try {
      let response;
      if (modalType === 'add') {
        response = await merchantService.createMerchant(values);
      } else {
        response = await merchantService.updateMerchant(editingMerchant!.id, values);
      }
      
      if (response.success) {
        message.success(`商户${modalType === 'add' ? '添加' : '更新'}成功`);
        setModalVisible(false);
        loadMerchants();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(`${modalType === 'add' ? '添加' : '更新'}商户失败`);
    }
  };

  // 导出商户列表
  const handleExport = async () => {
    try {
      const response = await merchantService.exportMerchants({
        status: statusFilter,
        type: typeFilter,
      });
      
      if (response.success && response.data) {
        // 直接使用下载链接
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.download = `merchants_${formatDate.date(new Date(), 'YYYY-MM-DD')}.xlsx`;
        link.click();
        message.success('导出成功');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('导出失败');
    }
  };

  // 表格列配置
  const columns: any[] = [
    {
      title: '商户信息',
      key: 'info',
      width: 200,
      render: (_: any, record: Merchant) => (
        <Space>
          <Avatar 
            size="small" 
            icon={<ShopOutlined />}
            style={{ backgroundColor: record.status === 'active' ? '#52c41a' : '#ff4d4f' }}
          />
          <div>
            <div className="merchant-name">{record.name}</div>
            <div className="merchant-code">编号: {record.code}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '商户类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const typeInfo = merchantTypes.find(t => t.value === type);
        return <Tag color="blue">{typeInfo?.label || type}</Tag>;
      },
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 120,
      render: (text: string, record: Merchant) => (
        <Space direction="vertical" size={0}>
          <span>{text}</span>
          <span className="contact-info">
            <PhoneOutlined /> {record.contactPhone}
          </span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusInfo = merchantStatuses.find(s => s.value === status);
        return (
          <Badge 
            status={statusInfo?.color as any} 
            text={statusInfo?.label || status}
          />
        );
      },
    },
    {
      title: '设备数量',
      dataIndex: 'deviceCount',
      key: 'deviceCount',
      width: 100,
      render: (count: number) => (
        <Tooltip title="设备总数">
          <Tag color="cyan">{count || 0} 台</Tag>
        </Tooltip>
      ),
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      ellipsis: true,
      render: (address: string) => (
        <Tooltip title={address}>
          <Space>
            <EnvironmentOutlined />
            {address}
          </Space>
        </Tooltip>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (time: string) => formatDate.date(time, 'YYYY-MM-DD'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_: any, record: Merchant) => (
        <Space>
          <Tooltip title="查看详情">
            <Button 
              type="link" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="link" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? '禁用' : '启用'}>
            <Switch
              size="small"
              checked={record.status === 'active'}
              onChange={() => handleStatusToggle(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个商户吗？"
              description="删除后将无法恢复，且会影响相关设备数据"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button 
                type="link" 
                size="small" 
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    loadMerchants();
  }, [currentPage, pageSize, searchText, statusFilter, typeFilter]);

  return (
    <div className="admin-merchants">
      <Card>
        {/* 页面头部 */}
        <div className="page-header">
          <div className="header-left">
            <h2>商户管理</h2>
            <p>管理系统中的所有商户，包括商户信息、状态和权限设置</p>
          </div>
          <div className="header-right">
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                添加商户
              </Button>
              <Button 
                icon={<ExportOutlined />}
                onClick={handleExport}
              >
                导出
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={loadMerchants}
              >
                刷新
              </Button>
            </Space>
          </div>
        </div>

        {/* 筛选区域 */}
        <div className="filter-section">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Search
                placeholder="搜索商户名称或编号"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={loadMerchants}
                enterButton={<SearchOutlined />}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="商户状态"
                value={statusFilter}
                onChange={setStatusFilter}
                allowClear
                style={{ width: '100%' }}
              >
                {merchantStatuses.map(status => (
                  <Option key={status.value} value={status.value}>
                    <Badge status={status.color as any} text={status.label} />
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="商户类型"
                value={typeFilter}
                onChange={setTypeFilter}
                allowClear
                style={{ width: '100%' }}
              >
                {merchantTypes.map(type => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>

        {/* 商户列表 */}
        <Table
          columns={columns}
          dataSource={merchants}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: (page, size) => {
              setCurrent(page);
              setPageSize(size || 10);
            },
          }}
          scroll={{ x: 1400 }}
          size="middle"
        />
      </Card>

      {/* 添加/编辑商户模态框 */}
      <Modal
        title={modalType === 'add' ? '添加商户' : '编辑商户'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="商户名称"
                rules={[{ required: true, message: '请输入商户名称' }]}
              >
                <Input placeholder="请输入商户名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="商户编号"
                rules={[{ required: true, message: '请输入商户编号' }]}
              >
                <Input placeholder="请输入商户编号" disabled={modalType === 'edit'} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="商户类型"
                rules={[{ required: true, message: '请选择商户类型' }]}
              >
                <Select placeholder="请选择商户类型">
                  {merchantTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="商户状态"
                rules={[{ required: true, message: '请选择商户状态' }]}
              >
                <Select placeholder="请选择商户状态">
                  {merchantStatuses.map(status => (
                    <Option key={status.value} value={status.value}>
                      <Badge status={status.color as any} text={status.label} />
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactPerson"
                label="联系人"
                rules={[{ required: true, message: '请输入联系人' }]}
              >
                <Input placeholder="请输入联系人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱地址"
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入正确的邮箱格式' }
                ]}
              >
                <Input placeholder="请输入邮箱地址" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="website"
                label="官网地址"
              >
                <Input placeholder="请输入官网地址" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="address"
            label="详细地址"
            rules={[{ required: true, message: '请输入详细地址' }]}
          >
            <Input placeholder="请输入详细地址" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="商户描述"
          >
            <Input.TextArea 
              placeholder="请输入商户描述" 
              rows={3}
            />
          </Form.Item>
          
          <Form.Item className="form-actions">
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {modalType === 'add' ? '添加' : '更新'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 商户详情抽屉 */}
      <Drawer
        title="商户详情"
        placement="right"
        width={700}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedMerchant && (
          <div className="merchant-detail">
            <Descriptions title="基本信息" bordered column={2}>
              <Descriptions.Item label="商户名称" span={2}>
                {selectedMerchant.name}
              </Descriptions.Item>
              <Descriptions.Item label="商户编号">
                {selectedMerchant.code}
              </Descriptions.Item>
              <Descriptions.Item label="商户类型">
                <Tag color="blue">
                  {merchantTypes.find(t => t.value === selectedMerchant.status)?.label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge 
                  status={merchantStatuses.find(s => s.value === selectedMerchant.status)?.color as any}
                  text={merchantStatuses.find(s => s.value === selectedMerchant.status)?.label}
                />
              </Descriptions.Item>
              <Descriptions.Item label="联系人">
                <Space>
                  <UserOutlined />
                  {selectedMerchant.contactPerson}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                <Space>
                  <PhoneOutlined />
                  {selectedMerchant.contactPhone}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="邮箱地址">
                <Space>
                  <MailOutlined />
                  {selectedMerchant.contactEmail}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="官网地址" span={2}>
                {selectedMerchant.website || '暂无'}
              </Descriptions.Item>
              <Descriptions.Item label="详细地址" span={2}>
                <Space>
                  <EnvironmentOutlined />
                  {selectedMerchant.address}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="商户描述" span={2}>
                {selectedMerchant.description || '暂无描述'}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {formatDate.datetime(selectedMerchant.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {formatDate.datetime(selectedMerchant.updatedAt)}
              </Descriptions.Item>
            </Descriptions>
            
            <div className="merchant-stats">
              <h3>商户统计</h3>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="设备总数"
                    value={selectedMerchant.deviceCount || 0}
                    suffix="台"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="在线设备"
                    value={selectedMerchant.activeDevices || 0}
                    suffix="台"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="今日数据量"
                    value={selectedMerchant.todayDataCount || 0}
                    suffix="条"
                  />
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AdminMerchants;