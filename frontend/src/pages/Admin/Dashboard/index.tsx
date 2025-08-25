import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Progress,
  List,
  Avatar,
  Tag,
  Space,
  Button,
  DatePicker,
  Select,
  Spin,
} from 'antd';
import {
  UserOutlined,
  ShopOutlined,
  DatabaseOutlined,
  LineChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/plots';
import { useDataStore } from '@/store';
import { ApiService } from '@/utils/api';
import { formatDate } from '@/utils/helpers';
import type { DashboardStats, Merchant, Device, DataRecord } from '@/types';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

/**
 * 管理员仪表板页面
 * 展示系统整体运行状况、关键指标和数据统计
 */
const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMerchants, setRecentMerchants] = useState<Merchant[]>([]);
  const [activeDevices, setActiveDevices] = useState<Device[]>([]);
  const [recentData, setRecentData] = useState<DataRecord[]>([]);
  const [chartData, setChartData] = useState({
    deviceTrend: [],
    dataTrend: [],
    merchantDistribution: [],
  });

  // 加载仪表板数据
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 并行加载所有数据
      const [statsRes, merchantsRes, devicesRes, dataRes, chartRes] = await Promise.all([
        ApiService.get<DashboardStats>('/admin/dashboard/stats'),
        ApiService.get<Merchant[]>('/admin/merchants?limit=5&sort=createdAt:desc'),
        ApiService.get<Device[]>('/admin/devices?status=active&limit=10'),
        ApiService.get<DataRecord[]>('/admin/data?limit=10&sort=timestamp:desc'),
        ApiService.get('/admin/dashboard/charts'),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (merchantsRes.success) setRecentMerchants(merchantsRes.data);
      if (devicesRes.success) setActiveDevices(devicesRes.data);
      if (dataRes.success) setRecentData(dataRes.data);
      if (chartRes.success) setChartData(chartRes.data);
    } catch (error) {
      console.error('加载仪表板数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // 设备状态表格列配置
  const deviceColumns = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Device) => (
        <Space>
          <Avatar size="small" icon={<DatabaseOutlined />} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '商户',
      dataIndex: 'merchantName',
      key: 'merchantName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : status === 'inactive' ? 'red' : 'orange'}>
          {status === 'active' ? '在线' : status === 'inactive' ? '离线' : '维护中'}
        </Tag>
      ),
    },
    {
      title: '最后上报',
      dataIndex: 'lastReportTime',
      key: 'lastReportTime',
      render: (time: string) => formatDate.datetime(time, 'MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Device) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>
            查看
          </Button>
          <Button type="link" size="small" icon={<SettingOutlined />}>
            设置
          </Button>
        </Space>
      ),
    },
  ];

  // 数据趋势图配置
  const dataTrendConfig = {
    data: chartData.dataTrend,
    xField: 'date',
    yField: 'count',
    smooth: true,
    color: '#1890ff',
    point: {
      size: 3,
      shape: 'circle',
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: '数据量', value: `${datum.count} 条` };
      },
    },
  };

  // 设备分布图配置
  const deviceDistributionConfig = {
    data: chartData.merchantDistribution,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spin size="large" tip="加载仪表板数据..." />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总商户数"
              value={stats?.totalMerchants || 0}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix={
                <span className="stat-trend">
                  <ArrowUpOutlined style={{ color: '#52c41a' }} />
                  {5.2}%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总设备数"
              value={stats?.totalDevices || 0}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={
                <span className="stat-trend">
                  <ArrowUpOutlined style={{ color: '#52c41a' }} />
                  {8.7}%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={stats?.activeDevices || 0}
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix={
                <span className="device-rate">
                  ({((stats?.activeDevices || 0) / (stats?.totalDevices || 1) * 100).toFixed(1)}%)
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日数据量"
              value={stats?.todayDataCount || 0}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix="条"
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} className="charts-row">
        <Col xs={24} lg={16}>
          <Card title="数据趋势" extra={<RangePicker />}>
            <Line {...dataTrendConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="设备分布">
            <Pie {...deviceDistributionConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* 详细信息区域 */}
      <Row gutter={[16, 16]} className="details-row">
        <Col xs={24} lg={12}>
          <Card title="最新商户" extra={<Button type="link">查看全部</Button>}>
            <List
              itemLayout="horizontal"
              dataSource={recentMerchants}
              renderItem={(merchant) => (
                <List.Item
                  actions={[
                    <Button type="link" size="small">
                      查看
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<ShopOutlined />} />}
                    title={merchant.name}
                    description={
                      <Space>
                        <span>设备: {merchant.deviceCount || 0}台</span>
                        <span>状态: 
                          <Tag color={merchant.status === 'active' ? 'green' : 'red'}>
                            {merchant.status === 'active' ? '正常' : '停用'}
                          </Tag>
                        </span>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="设备状态" extra={<Button type="link">查看全部</Button>}>
            <Table
              dataSource={activeDevices}
              columns={deviceColumns}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      {/* 系统状态 */}
      <Row gutter={[16, 16]} className="system-row">
        <Col xs={24}>
          <Card title="系统状态">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <div className="system-metric">
                  <div className="metric-title">CPU使用率</div>
                  <Progress
                    percent={stats?.systemStats?.cpuUsage || 0}
                    status={(stats?.systemStats?.cpuUsage || 0) > 80 ? 'exception' : 'active'}
                    strokeColor={(stats?.systemStats?.cpuUsage || 0) > 80 ? '#ff4d4f' : '#1890ff'}
                  />
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className="system-metric">
                  <div className="metric-title">内存使用率</div>
                  <Progress
                    percent={stats?.systemStats?.memoryUsage || 0}
                    status={(stats?.systemStats?.memoryUsage || 0) > 80 ? 'exception' : 'active'}
                    strokeColor={(stats?.systemStats?.memoryUsage || 0) > 80 ? '#ff4d4f' : '#52c41a'}
                  />
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className="system-metric">
                  <div className="metric-title">磁盘使用率</div>
                  <Progress
                    percent={stats?.systemStats?.diskUsage || 0}
                    status={(stats?.systemStats?.diskUsage || 0) > 80 ? 'exception' : 'active'}
                    strokeColor={(stats?.systemStats?.diskUsage || 0) > 80 ? '#ff4d4f' : '#faad14'}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;