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
  Progress,
  Alert,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  ExportOutlined,
  WifiOutlined,
  DisconnectOutlined,
  SettingOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { ApiService } from '@/utils/api';
import { formatDate } from '@/utils/helpers';
import type { Device, Merchant, TableColumn } from '@/types';
import './index.css';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

/**
 * 管理员设备管理页面
 * 提供设备的增删改查、状态监控、配置管理等功能
 */
const AdminDevices: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [merchantFilter, setMerchantFilter] = useState<string>('');
  
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
    { label: '温度传感器', value: 'temperature', icon: '🌡️' },
    { label: '湿度传感器', value: 'humidity', icon: '💧' },
    { label: '压力传感器', value: 'pressure', icon: '📊' },
    { label: '流量计', value: 'flow', icon: '🌊' },
    { label: '电能表', value: 'power', icon: '⚡' },
    { label: '气体检测器', value: 'gas', icon: '💨' },
    { label: '振动传感器', value: 'vibration', icon: '📳' },
    { label: '光照传感器', value: 'light', icon: '💡' },
    { label: '其他', value: 'other', icon: '🔧' },
  ];

  // 设备状态选项
  const deviceStatuses = [
    { label: '在线', value: 'online', color: 'green', icon: <WifiOutlined /> },
    { label: '离线', value: 'offline', color: 'red', icon: <DisconnectOutlined /> },
    { label: '故障', value: 'error', color: 'red', icon: <WarningOutlined /> },
    { label: '维护中', value: 'maintenance', color: 'orange', icon: <SettingOutlined /> },
    { label: '未激活', value: 'inactive', color: 'gray', icon: <ClockCircleOutlined /> },
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
        merchantId: merchantFilter,
      };
      
      const response = await ApiService.get<{
        data: Device[];
        total: number;
        page: number;
        limit: number;
      }>('/admin/devices', params);
      
      if (response.success) {
        setDevices(response.data.data);
        setTotal(response.data.total);
      }
    } catch (error) {
      message.error('加载设备列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载商户列表
  const loadMerchants = async () => {
    try {
      const response = await ApiService.get<{
        data: Merchant[];
      }>('/admin/merchants', { limit: 1000 });
      
      if (response.success) {
        setMerchants(response.data.data);
      }
    } catch (error) {
      console.error('加载商户列表失败:', error);
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
    form.setFieldsValue({
      ...device,
      merchantId: device.merchant?.id,
    });
    setModalVisible(true);
  };

  // 查看设备详情
  const handleView = async (device: Device) => {
    try {
      const response = await ApiService.get<Device>(`/admin/devices/${device.id}`);
      if (response.success) {
        setSelectedDevice(response.data);
        setDrawerVisible(true);
      }
    } catch (error) {
      message.error('获取设备详情失败');
    }
  };

  // 删除设备
  const handleDelete = async (deviceId: string) => {
    try {
      const response = await ApiService.delete(`/admin/devices/${deviceId}`);
      if (response.success) {
        message.success('设备删除成功');
        loadDevices();
      }
    } catch (error) {
      message.error('删除设备失败');
    }
  };

  // 切换设备状态
  const handleStatusToggle = async (device: Device) => {
    try {
      const newStatus = device.status === 'online' ? 'offline' : 'online';
      const response = await ApiService.patch(`/admin/devices/${device.id}/status`, {
        status: newStatus,
      });
      
      if (response.success) {
        message.success(`设备已${newStatus === 'online' ? '上线' : '下线'}`);
        loadDevices();
      }
    } catch (error) {
      message.error('状态切换失败');
    }
  };

  // 重启设备
  const handleRestart = async (device: Device) => {
    try {
      const response = await ApiService.post(`/admin/devices/${device.id}/restart`);
      if (response.success) {
        message.success('设备重启指令已发送');
        loadDevices();
      }
    } catch (error) {
      message.error('设备重启失败');
    }
  };

  // 保存设备
  const handleSave = async (values: any) => {
    try {
      let response;
      if (modalType === 'add') {
        response = await ApiService.post('/admin/devices', values);
      } else {
        response = await ApiService.put(`/admin/devices/${editingDevice?.id}`, values);
      }
      
      if (response.success) {
        message.success(`设备${modalType === 'add' ? '添加' : '更新'}成功`);
        setModalVisible(false);
        loadDevices();
      }
    } catch (error) {
      message.error(`${modalType === 'add' ? '添加' : '更新'}设备失败`);
    }
  };

  // 导出设备列表
  const handleExport = async () => {
    try {
      const response = await ApiService.get('/admin/devices/export', {
        search: searchText,
        status: statusFilter,
        type: typeFilter,
        merchantId: merchantFilter,
      });
      
      if (response.success) {
        // 创建下载链接
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.download = `devices_${formatDate.date(new Date(), 'YYYY-MM-DD')}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
        message.success('导出成功');
      }
    } catch (error) {
      message.error('导出失败');
    }
  };

  // 获取设备状态颜色
  const getStatusColor = (status: string) => {
    const statusInfo = deviceStatuses.find(s => s.value === status);
    return statusInfo?.color || 'default';
  };

  // 获取设备类型信息
  const getDeviceTypeInfo = (type: string) => {
    return deviceTypes.find(t => t.value === type);
  };

  // 表格列配置
  const columns: any[] = [
    {
      title: '设备信息',
      key: 'info',
      width: 200,
      render: (_: any, record: Device) => {
        const typeInfo = getDeviceTypeInfo(record.type);
        return (
          <Space>
            <Avatar 
              size="small" 
              style={{ 
                backgroundColor: getStatusColor(record.status) === 'green' ? '#52c41a' : '#ff4d4f',
                fontSize: '12px'
              }}
            >
              {typeInfo?.icon || '🔧'}
            </Avatar>
            <div>
              <div className="device-name">{record.name}</div>
              <div className="device-code">SN: {record.id}</div>
            </div>
          </Space>
        );
      },
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const typeInfo = getDeviceTypeInfo(type);
        return (
          <Tag color="blue">
            {typeInfo?.icon} {typeInfo?.label || type}
          </Tag>
        );
      },
    },
    {
      title: '所属商户',
      key: 'merchant',
      width: 150,
      render: (_: any, record: Device) => (
        <Space direction="vertical" size={0}>
          <span className="merchant-name">{record.merchant?.name}</span>
          <span className="merchant-code">编号: {record.merchant?.code}</span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusInfo = deviceStatuses.find(s => s.value === status);
        return (
          <Badge 
            status={statusInfo?.color as any} 
            text={statusInfo?.label || status}
          />
        );
      },
    },
    {
      title: '信号强度',
      dataIndex: 'signalStrength',
      key: 'signalStrength',
      width: 120,
      render: (strength: number) => {
        let status: 'success' | 'normal' | 'exception' = 'success';
        let color = '#52c41a';
        
        if (strength < 30) {
          status = 'exception';
          color = '#ff4d4f';
        } else if (strength < 60) {
          status = 'normal';
          color = '#faad14';
        }
        
        return (
          <Tooltip title={`信号强度: ${strength}%`}>
            <Progress 
              percent={strength} 
              size="small" 
              status={status}
              strokeColor={color}
              showInfo={false}
              style={{ width: 80 }}
            />
          </Tooltip>
        );
      },
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 150,
      ellipsis: true,
      render: (location: string) => (
        <Tooltip title={location}>
          <Space>
            <EnvironmentOutlined />
            {location || '未设置'}
          </Space>
        </Tooltip>
      ),
    },
    {
      title: '最后上报',
      dataIndex: 'lastReportTime',
      key: 'lastReportTime',
      width: 150,
      render: (time: string) => {
        if (!time) return <span className="text-gray">从未上报</span>;
        
        const reportTime = new Date(time);
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - reportTime.getTime()) / (1000 * 60));
        
        let color = '#52c41a';
        let text = formatDate.datetime(time, 'MM-DD HH:mm');
        
        if (diffMinutes > 60) {
          color = '#ff4d4f';
          text = `${Math.floor(diffMinutes / 60)}小时前`;
        } else if (diffMinutes > 10) {
          color = '#faad14';
          text = `${diffMinutes}分钟前`;
        } else {
          text = '刚刚';
        }
        
        return (
          <Tooltip title={formatDate.datetime(time)}>
            <span style={{ color }}>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      fixed: 'right',
      render: (_: any, record: Device) => (
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
          <Tooltip title={record.status === 'online' ? '下线' : '上线'}>
            <Switch
              size="small"
              checked={record.status === 'online'}
              onChange={() => handleStatusToggle(record)}
            />
          </Tooltip>
          <Tooltip title="重启设备">
            <Button 
              type="link" 
              size="small" 
              icon={<SyncOutlined />}
              onClick={() => handleRestart(record)}
              disabled={record.status !== 'online'}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个设备吗？"
              description="删除后将无法恢复，且会丢失所有历史数据"
              onConfirm={() => handleDelete(record.id.toString())}
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
    loadMerchants();
  }, [currentPage, pageSize, searchText, statusFilter, typeFilter, merchantFilter]);

  return (
    <div className="admin-devices">
      <Card>
        {/* 页面头部 */}
        <div className="page-header">
          <div className="header-left">
            <h2>设备管理</h2>
            <p>管理系统中的所有IoT设备，包括设备状态监控、配置管理和数据分析</p>
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
            <Col xs={24} sm={12} md={6} lg={6}>
              <Search
                placeholder="搜索设备名称或序列号"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={loadDevices}
                enterButton={<SearchOutlined />}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={6} lg={6}>
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
            <Col xs={24} sm={12} md={6} lg={6}>
              <Select
                placeholder="设备类型"
                value={typeFilter}
                onChange={setTypeFilter}
                allowClear
                style={{ width: '100%' }}
              >
                {deviceTypes.map(type => (
                  <Option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Select
                placeholder="所属商户"
                value={merchantFilter}
                onChange={setMerchantFilter}
                allowClear
                style={{ width: '100%' }}
                showSearch
                filterOption={(input, option) =>
                  (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {merchants.map(merchant => (
                  <Option key={merchant.id} value={merchant.id}>
                    {merchant.name}
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
          scroll={{ x: 1600 }}
          size="middle"
        />
      </Card>

      {/* 添加/编辑设备模态框 */}
      <Modal
        title={modalType === 'add' ? '添加设备' : '编辑设备'}
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
                label="设备名称"
                rules={[{ required: true, message: '请输入设备名称' }]}
              >
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="serialNumber"
                label="设备序列号"
                rules={[{ required: true, message: '请输入设备序列号' }]}
              >
                <Input placeholder="请输入设备序列号" disabled={modalType === 'edit'} />
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
                      {type.icon} {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="merchantId"
                label="所属商户"
                rules={[{ required: true, message: '请选择所属商户' }]}
              >
                <Select 
                  placeholder="请选择所属商户"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {merchants.map(merchant => (
                    <Option key={merchant.id} value={merchant.id}>
                      {merchant.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="model"
                label="设备型号"
              >
                <Input placeholder="请输入设备型号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="version"
                label="固件版本"
              >
                <Input placeholder="请输入固件版本" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location"
                label="安装位置"
              >
                <Input placeholder="请输入安装位置" />
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
        width={700}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedDevice && (
          <div className="device-detail">
            {/* 设备状态告警 */}
            {selectedDevice.status === 'offline' && (
              <Alert
                message="设备故障"
                description="设备当前处于故障状态，请及时处理"
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            
            {selectedDevice.status === 'offline' && (
              <Alert
                message="设备离线"
                description="设备已离线超过10分钟，请检查网络连接"
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            
            <Descriptions title="基本信息" bordered column={2}>
              <Descriptions.Item label="设备名称" span={2}>
                {selectedDevice.name}
              </Descriptions.Item>
              <Descriptions.Item label="序列号">
                {selectedDevice.id}
              </Descriptions.Item>
              <Descriptions.Item label="设备类型">
                <Tag color="blue">
                  {getDeviceTypeInfo(selectedDevice.type)?.icon} {getDeviceTypeInfo(selectedDevice.type)?.label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="设备状态">
                <Badge 
                  status={getStatusColor(selectedDevice.status) as any}
                  text={deviceStatuses.find(s => s.value === selectedDevice.status)?.label}
                />
              </Descriptions.Item>
              <Descriptions.Item label="所属商户">
                {selectedDevice.merchant?.name}
              </Descriptions.Item>
              <Descriptions.Item label="设备型号">
                {selectedDevice.model || '未设置'}
              </Descriptions.Item>
              <Descriptions.Item label="固件版本">
                {'1.0.0'}
              </Descriptions.Item>
              <Descriptions.Item label="安装位置" span={2}>
                <Space>
                  <EnvironmentOutlined />
                  {selectedDevice.location || '未设置'}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="设备描述" span={2}>
                {'暂无描述'}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {formatDate.datetime(selectedDevice.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="最后上报">
                {selectedDevice.lastReportTime ? formatDate.datetime(selectedDevice.lastReportTime) : '从未上报'}
              </Descriptions.Item>
            </Descriptions>
            
            <div className="device-stats">
              <h3>设备统计</h3>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="信号强度"
                    value={selectedDevice.signalStrength || 0}
                    suffix="%"
                    valueStyle={{ color: (selectedDevice.signalStrength || 0) > 60 ? '#3f8600' : '#cf1322' }}
                  />
                </Col>
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
              </Row>
            </div>
            
            <div className="device-actions">
              <h3>设备操作</h3>
              <Space>
                <Button 
                  type="primary" 
                  icon={<SyncOutlined />}
                  onClick={() => handleRestart(selectedDevice)}
                  disabled={selectedDevice.status !== 'online'}
                >
                  重启设备
                </Button>
                <Button 
                  icon={<SettingOutlined />}
                  onClick={() => {
                    setDrawerVisible(false);
                    handleEdit(selectedDevice);
                  }}
                >
                  编辑配置
                </Button>
                <Button 
                  icon={<ThunderboltOutlined />}
                  disabled={selectedDevice.status !== 'online'}
                >
                  发送指令
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AdminDevices;