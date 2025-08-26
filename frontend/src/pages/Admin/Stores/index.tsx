import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  message,
  Tag,
  Drawer,
  Descriptions,
  Popconfirm,
  Row,
  Col,
  Statistic,
  DatePicker,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { Store, CreateStoreRequest, UpdateStoreRequest } from '../../../types';
import { storeService } from '../../../services/storeService';
import { merchantService } from '../../../services/merchantService';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

/**
 * 门店管理页面组件
 */
const AdminStores: React.FC = () => {
  // 状态管理
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [merchantFilter, setMerchantFilter] = useState<number | undefined>();
  
  // 模态框和抽屉状态
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [storeStats, setStoreStats] = useState<any>(null);
  
  // 表单和商户列表
  const [form] = Form.useForm();
  const [merchants, setMerchants] = useState<any[]>([]);

  /**
   * 加载门店列表
   */
  const loadStores = async () => {
    setLoading(true);
    try {
      const response = await storeService.getStores({
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        status: statusFilter || undefined,
        merchantId: merchantFilter
      });
      
      // 调试：输出接口返回数据
      console.log('门店列表API响应:', response);
      console.log('门店列表数据:', response.data);
      
      if (response.success) {
        setStores(response.data.stores || []);
        setTotal(response.data.total || 0);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('加载门店列表失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 加载商户列表
   */
  const loadMerchants = async () => {
    try {
      const response = await merchantService.getMerchants({ limit: 100 });
      if (response.success) {
        setMerchants(response.data.data);
      }
    } catch (error) {
      console.error('加载商户列表失败:', error);
    }
  };

  /**
   * 查看门店详情
   */
  const handleView = async (record: Store) => {
    try {
      const [storeResponse, statsResponse] = await Promise.all([
        storeService.getStoreById(record.id),
        storeService.getStoreStats(record.id)
      ]);
      
      if (storeResponse.success) {
        setSelectedStore(storeResponse.data);
        if (statsResponse.success) {
          setStoreStats(statsResponse.data);
        }
        setDrawerVisible(true);
      } else {
        message.error(storeResponse.message);
      }
    } catch (error) {
      message.error('获取门店详情失败');
    }
  };

  /**
   * 删除门店
   */
  const handleDelete = (record: Store) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除门店 "${record.name}" 吗？此操作不可恢复。`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await storeService.deleteStore(record.id);
          if (response.success) {
            message.success('删除门店成功');
            loadStores();
          } else {
            message.error(response.message);
          }
        } catch (error) {
          message.error('删除门店失败');
        }
      }
    });
  };

  /**
   * 切换门店状态
   */
  const handleStatusToggle = async (record: Store) => {
    const newStatus = record.status === 'active' ? 'inactive' : 'active';
    try {
      const response = await storeService.updateStoreStatus(record.id, newStatus);
      if (response.success) {
        message.success(`门店状态已更新为${newStatus === 'active' ? '启用' : '禁用'}`);
        loadStores();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('更新门店状态失败');
    }
  };

  /**
   * 保存门店（新增或编辑）
   */
  const handleSave = async (values: CreateStoreRequest | UpdateStoreRequest) => {
    try {
      let response;
      if (editingStore) {
        response = await storeService.updateStore(editingStore.id, values as UpdateStoreRequest);
      } else {
        response = await storeService.createStore(values as CreateStoreRequest);
      }
      
      if (response.success) {
        message.success(editingStore ? '更新门店成功' : '创建门店成功');
        setModalVisible(false);
        setEditingStore(null);
        form.resetFields();
        loadStores();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(editingStore ? '更新门店失败' : '创建门店失败');
    }
  };

  /**
   * 导出门店列表
   */
  const handleExport = async () => {
    try {
      const response = await storeService.exportStores({
        format: 'excel',
        status: statusFilter || undefined,
        merchantId: merchantFilter
      });
      
      if (response.success && response.data.downloadUrl) {
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.download = `stores_${dayjs().format('YYYY-MM-DD')}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        message.success('导出门店列表成功');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('导出门店列表失败');
    }
  };

  /**
   * 打开新增门店模态框
   */
  const handleAdd = () => {
    setEditingStore(null);
    form.resetFields();
    setModalVisible(true);
  };

  /**
   * 打开编辑门店模态框
   */
  const handleEdit = (record: Store) => {
    setEditingStore(record);
    form.setFieldsValue({
      ...record,
      merchantId: record.merchant?.id
    });
    setModalVisible(true);
  };

  /**
   * 搜索处理
   */
  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  /**
   * 状态筛选处理
   */
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  /**
   * 商户筛选处理
   */
  const handleMerchantFilter = (value: number) => {
    setMerchantFilter(value);
    setCurrentPage(1);
  };

  /**
   * 获取状态标签
   */
  const getStatusTag = (status: string) => {
    const statusConfig = {
      active: { color: 'green', text: '正常营业' },
      inactive: { color: 'red', text: '暂停营业' },
      maintenance: { color: 'orange', text: '维护中' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 表格列定义
  const columns: ColumnsType<Store> = [
    {
      title: '门店编码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (text) => <span style={{ fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: '门店名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <Space>
          <ShopOutlined />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: '所属商户',
      dataIndex: ['merchant', 'name'],
      key: 'merchantName',
      width: 150
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <Space>
            <EnvironmentOutlined />
            <span>{text}</span>
          </Space>
        </Tooltip>
      )
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 100,
      render: (text) => (
        <Space>
          <UserOutlined />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 120,
      render: (text) => (
        <Space>
          <PhoneOutlined />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: '设备数量',
      dataIndex: 'deviceCount',
      key: 'deviceCount',
      width: 100,
      align: 'center',
      render: (count) => (
        <Tag color="blue">{count || 0}</Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status) => getStatusTag(status)
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? '禁用' : '启用'}>
            <Popconfirm
              title={`确定要${record.status === 'active' ? '禁用' : '启用'}此门店吗？`}
              onConfirm={() => handleStatusToggle(record)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                type="text"
                icon={record.status === 'active' ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
                danger={record.status === 'active'}
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // 组件挂载时加载数据
  useEffect(() => {
    loadStores();
    loadMerchants();
  }, [currentPage, pageSize, searchText, statusFilter, merchantFilter]);

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col flex="auto">
              <Space size="middle">
                <Search
                  placeholder="搜索门店名称、编码或地址"
                  allowClear
                  style={{ width: 300 }}
                  onSearch={handleSearch}
                  enterButton={<SearchOutlined />}
                />
                <Select
                  placeholder="筛选状态"
                  allowClear
                  style={{ width: 120 }}
                  onChange={handleStatusFilter}
                  value={statusFilter || undefined}
                >
                  <Option value="active">正常营业</Option>
                  <Option value="inactive">暂停营业</Option>
                  <Option value="maintenance">维护中</Option>
                </Select>
                <Select
                  placeholder="筛选商户"
                  allowClear
                  style={{ width: 200 }}
                  onChange={handleMerchantFilter}
                  value={merchantFilter}
                  showSearch
                  optionFilterProp="children"
                >
                  {merchants.map(merchant => (
                    <Option key={merchant.id} value={merchant.id}>
                      {merchant.name}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                >
                  新增门店
                </Button>
                <Button
                  icon={<ExportOutlined />}
                  onClick={handleExport}
                >
                  导出
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={stores}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            current: currentPage,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            }
          }}
        />
      </Card>

      {/* 新增/编辑门店模态框 */}
      <Modal
        title={editingStore ? '编辑门店' : '新增门店'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingStore(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
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
                label="门店名称"
                rules={[{ required: true, message: '请输入门店名称' }]}
              >
                <Input placeholder="请输入门店名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="门店编码"
                rules={[{ required: true, message: '请输入门店编码' }]}
              >
                <Input placeholder="请输入门店编码" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="merchantId"
            label="所属商户"
            rules={[{ required: true, message: '请选择所属商户' }]}
          >
            <Select
              placeholder="请选择所属商户"
              showSearch
              optionFilterProp="children"
            >
              {merchants.map(merchant => (
                <Option key={merchant.id} value={merchant.id}>
                  {merchant.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="address"
            label="门店地址"
            rules={[{ required: true, message: '请输入门店地址' }]}
          >
            <Input.TextArea
              placeholder="请输入门店地址"
              rows={2}
            />
          </Form.Item>
          
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
                name="contactPhone"
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
          
          <Form.Item
            name="contactEmail"
            label="联系邮箱"
            rules={[
              { type: 'email', message: '请输入正确的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入联系邮箱（可选）" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="门店描述"
          >
            <Input.TextArea
              placeholder="请输入门店描述（可选）"
              rows={3}
            />
          </Form.Item>
          
          {editingStore && (
            <Form.Item
              name="status"
              label="门店状态"
            >
              <Select placeholder="请选择门店状态">
                <Option value="active">正常营业</Option>
                <Option value="inactive">暂停营业</Option>
                <Option value="maintenance">维护中</Option>
              </Select>
            </Form.Item>
          )}
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingStore(null);
                form.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {editingStore ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 门店详情抽屉 */}
      <Drawer
        title="门店详情"
        placement="right"
        width={600}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedStore(null);
          setStoreStats(null);
        }}
      >
        {selectedStore && (
          <div>
            {/* 统计卡片 */}
            {storeStats && (
              <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={12}>
                  <Card size="small">
                    <Statistic
                      title="设备总数"
                      value={storeStats.deviceCount}
                      prefix={<ToolOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small">
                    <Statistic
                      title="在线设备"
                      value={storeStats.activeDeviceCount}
                      prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    />
                  </Card>
                </Col>
                <Col span={12} style={{ marginTop: '16px' }}>
                  <Card size="small">
                    <Statistic
                      title="今日订单"
                      value={storeStats.todayOrders}
                    />
                  </Card>
                </Col>
                <Col span={12} style={{ marginTop: '16px' }}>
                  <Card size="small">
                    <Statistic
                      title="月度营收"
                      value={storeStats.monthlyRevenue}
                      precision={2}
                      prefix="¥"
                    />
                  </Card>
                </Col>
              </Row>
            )}
            
            {/* 基本信息 */}
            <Descriptions title="基本信息" bordered column={1}>
              <Descriptions.Item label="门店名称">{selectedStore.name}</Descriptions.Item>
              <Descriptions.Item label="门店编码">
                <span style={{ fontFamily: 'monospace' }}>{selectedStore.code}</span>
              </Descriptions.Item>
              <Descriptions.Item label="所属商户">{selectedStore.merchant?.name}</Descriptions.Item>
              <Descriptions.Item label="门店地址">{selectedStore.address}</Descriptions.Item>
              <Descriptions.Item label="联系人">{selectedStore.contactPerson}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{selectedStore.contactPhone}</Descriptions.Item>
              {selectedStore.contactEmail && (
                <Descriptions.Item label="联系邮箱">{selectedStore.contactEmail}</Descriptions.Item>
              )}
              <Descriptions.Item label="门店状态">
                {getStatusTag(selectedStore.status)}
              </Descriptions.Item>
              {selectedStore.description && (
                <Descriptions.Item label="门店描述">{selectedStore.description}</Descriptions.Item>
              )}
              <Descriptions.Item label="创建时间">
                {dayjs(selectedStore.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {dayjs(selectedStore.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AdminStores;