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
  Popconfirm,
  Drawer,
  Descriptions,
  Statistic,
  Row,
  Col,
  Avatar,
  Tooltip,
  Badge,
  DatePicker,
  Switch,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
  ReloadOutlined,
  SearchOutlined,
  ExportOutlined,
  DatabaseOutlined,
  WifiOutlined,
  DisconnectOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { ApiService } from '@/utils/api';
import { formatDate } from '@/utils/helpers';
import { useMessage } from '@/hooks/useMessage';
import type { Device, TableColumn } from '@/types';
import './index.css';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

/**
 * 商户设备管理页面
 * 提供设备的增删改查、状态监控、配置管理等功能
 */
const MerchantDevices: React.FC = () => {
  const messageApi = useMessage();
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  
  // 模态框状态
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  
  // 详情抽屉状态
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  
  const [form] = Form.useForm();

  // 设备类型选项
  const deviceTypes = [
    { label: '温度传感器', value: 'temperature' },
    { label: '湿度传感器', value: 'humidity' },
    { label: '压力传感器', value: 'pressure' },
    { label: '流量计', value: 'flow' },
    { label: '电表', value: 'electricity' },
    { label: '水表', value: 'water' },
    { label: '气表', value: 'gas' },
    { label: '其他', value: 'other' },
  ];

  // 设备状态选项
  const deviceStatuses = [
    { label: '在线', value: 'active', color: 'green' },
    { label: '离线', value: 'inactive', color: 'red' },
    { label: '维护中', value: 'maintenance', color: 'orange' },
  ];

  // 加载设备列表
  const loadDevices = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchText,
        status: statusFilter,
        type: typeFilter,
      };
      
      const response = await ApiService.get<{
        data: Device[];
        total: number;
        page: number;
        limit: number;
      }>('/merchant/devices', params);
      
      // 调试：输出接口返回数据
      console.log('商户设备列表API响应:', response);
      console.log('商户设备列表数据:', response.data);
      
      if (response.success) {
        setDevices(response.data.data || response.data || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      messageApi.error('加载设备列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 添加设备
  const handleAdd = () => {
    setModalType('add');
    setEditingDevice(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 编辑设备
  const handleEdit = (device: Device) => {
    setModalType('edit');
    setEditingDevice(device);
    form.setFieldsValue(device);
    setModalVisible(true);
  };

  // 查看设备详情
  const handleView = async (device: Device) => {
    try {
      const response = await ApiService.get<Device>(`/merchant/devices/${device.id}`);
      if (response.success) {
        setSelectedDevice(response.data);
        setDrawerVisible(true);
      }
    } catch (error) {
      messageApi.error('获取设备详情失败');
    }
  };

  // 删除设备
  const handleDelete = async (deviceId: string) => {
    try {
      const response = await ApiService.delete(`/merchant/devices/${deviceId}`);
      if (response.success) {
        messageApi.success('设备删除成功');
        loadDevices();
      }
    } catch (error) {
      messageApi.error('删除设备失败');
    }
  };

  // 切换设备状态
  const handleStatusToggle = async (device: Device) => {
    try {
      const newStatus = device.status === 'online' ? 'offline' : 'online';
      const response = await ApiService.patch(`/merchant/devices/${device.id}/status`, {
        status: newStatus,
      });
      
      if (response.success) {
        messageApi.success(`设备已${newStatus === 'online' ? '启用' : '禁用'}`);
        loadDevices();
      }
    } catch (error) {
      messageApi.error('状态切换失败');
    }
  };

  // 保存设备
  const handleSave = async (values: any) => {
    try {
      let response;
      if (modalType === 'add') {
        response = await ApiService.post('/merchant/devices', values);
      } else {
        response = await ApiService.put(`/merchant/devices/${editingDevice?.id}`, values);
      }
      
      if (response.success) {
        messageApi.success(`设备${modalType === 'add' ? '添加' : '更新'}成功`);
        setModalVisible(false);
        loadDevices();
      }
    } catch (error) {
      messageApi.error(`${modalType === 'add' ? '添加' : '更新'}设备失败`);
    }
  };

  // 导出设备列表
  const handleExport = async () => {
    try {
      const response = await ApiService.get('/merchant/devices/export', {
        search: searchText,
        status: statusFilter,
        type: typeFilter,
      });
      
      if (response.success) {
        // 创建下载链接
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.download = `devices_${formatDate.date(new Date())}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
        messageApi.success('导出成功');
      }
    } catch (error) {
      messageApi.error('导出失败');
    }
  };

  // 表格列配置
  const columns: any[] = [
    {
      title: '设备信息',
      key: 'info',
      width: 200,
      render: (_: any, record: any) => (
        <Space>
          <Avatar 
            size="small" 
            icon={<DatabaseOutlined />}
            style={{ backgroundColor: record.status === 'active' ? '#52c41a' : '#ff4d4f' }}
          />
          <div>
            <div className="device-name">{record.name}</div>
            <div className="device-id">ID: {record.deviceId}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const typeInfo = deviceTypes.find(t => t.value === type);
        return <Tag>{typeInfo?.label || type}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusInfo = deviceStatuses.find(s => s.value === status);
        const icon = status === 'active' ? <WifiOutlined /> : 
                    status === 'inactive' ? <DisconnectOutlined /> : <ToolOutlined />;
        return (
          <Badge 
            status={statusInfo?.color as any} 
            text={
              <Space>
                {icon}
                {statusInfo?.label || status}
              </Space>
            }
          />
        );
      },
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 150,
      ellipsis: true,
    },
    {
      title: '最后上报',
      dataIndex: 'lastReportTime',
      key: 'lastReportTime',
      width: 150,
      render: (time: string) => (
        <Tooltip title={formatDate.datetime(time)}>
          {formatDate.datetime(time, 'MM-DD HH:mm')}
        </Tooltip>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (time: string) => formatDate.date(time),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_: any, record: any) => (
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
          <Tooltip title={record.status === 'online' ? '禁用' : '启用'}>
            <Switch
              size="small"
              checked={record.status === 'online'}
              onChange={() => handleStatusToggle(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个设备吗？"
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
    loadDevices();
  }, [currentPage, pageSize, searchText, statusFilter, typeFilter]);

  return (
    <div className="merchant-devices">
      <Card>
        {/* 页面头部 */}
        <div className="page-header">
          <div className="header-left">
            <h2>设备管理</h2>
            <p>管理您的IoT设备，监控设备状态和数据上报</p>
          </div>
          <div className="header-right">
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                添加设备
              </Button>
              <Button 
                icon={<ExportOutlined />}
                onClick={handleExport}
              >
                导出
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={loadDevices}
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
                placeholder="搜索设备名称或ID"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={loadDevices}
                enterButton={<SearchOutlined />}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="设备状态"
                value={statusFilter}
                onChange={setStatusFilter}
                allowClear
                style={{ width: '100%' }}
              >
                {deviceStatuses.map(status => (
                  <Option key={status.value} value={status.value}>
                    <Badge status={status.color as any} text={status.label} />
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="设备类型"
                value={typeFilter}
                onChange={setTypeFilter}
                allowClear
                style={{ width: '100%' }}
              >
                {deviceTypes.map(type => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>

        {/* 设备列表 */}
        <Table
          columns={columns}
          dataSource={devices}
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
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>

      {/* 添加/编辑设备模态框 */}
      <Modal
        title={modalType === 'add' ? '添加设备' : '编辑设备'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
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
                label="设备名称"
                rules={[{ required: true, message: '请输入设备名称' }]}
              >
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deviceId"
                label="设备ID"
                rules={[{ required: true, message: '请输入设备ID' }]}
              >
                <Input placeholder="请输入设备ID" disabled={modalType === 'edit'} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="设备类型"
                rules={[{ required: true, message: '请选择设备类型' }]}
              >
                <Select placeholder="请选择设备类型">
                  {deviceTypes.map(type => (
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
                label="设备状态"
                rules={[{ required: true, message: '请选择设备状态' }]}
              >
                <Select placeholder="请选择设备状态">
                  {deviceStatuses.map(status => (
                    <Option key={status.value} value={status.value}>
                      <Badge status={status.color as any} text={status.label} />
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="location"
            label="设备位置"
            rules={[{ required: true, message: '请输入设备位置' }]}
          >
            <Input placeholder="请输入设备位置" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="设备描述"
          >
            <Input.TextArea 
              placeholder="请输入设备描述" 
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

      {/* 设备详情抽屉 */}
      <Drawer
        title="设备详情"
        placement="right"
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedDevice && (
          <div className="device-detail">
            <Descriptions title="基本信息" bordered column={1}>
              <Descriptions.Item label="设备名称">
                {selectedDevice.name}
              </Descriptions.Item>
              <Descriptions.Item label="设备ID">
                {selectedDevice.deviceId}
              </Descriptions.Item>
              <Descriptions.Item label="设备类型">
                <Tag>{deviceTypes.find(t => t.value === selectedDevice.type)?.label}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge 
                  status={deviceStatuses.find(s => s.value === selectedDevice.status)?.color as any}
                  text={deviceStatuses.find(s => s.value === selectedDevice.status)?.label}
                />
              </Descriptions.Item>
              <Descriptions.Item label="位置">
                {selectedDevice.location}
              </Descriptions.Item>
              <Descriptions.Item label="描述">
                {(selectedDevice as any).description || '暂无描述'}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {formatDate.datetime(selectedDevice.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="最后上报">
                {selectedDevice.lastReportTime ? formatDate.datetime(selectedDevice.lastReportTime) : '暂无数据'}
              </Descriptions.Item>
            </Descriptions>
            
            <div className="device-stats">
              <h3>设备统计</h3>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="今日数据量"
                    value={selectedDevice.todayDataCount || 0}
                    suffix="条"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="总数据量"
                    value={selectedDevice.totalDataCount || 0}
                    suffix="条"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="在线时长"
                    value={selectedDevice.onlineHours || 0}
                    suffix="小时"
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

export default MerchantDevices;