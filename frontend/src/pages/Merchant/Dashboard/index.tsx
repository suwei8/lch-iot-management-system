import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  List,
  Avatar,
  Tag,
  Space,
  Button,
  DatePicker,
  Alert,
  Spin,
  Empty,
} from 'antd';
import {
  DatabaseOutlined,
  LineChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  SettingOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Line, Column } from '@ant-design/plots';
import { useAuthStore, useDataStore } from '@/store';
import { ApiService } from '@/utils/api';
import { formatDate } from '@/utils/helpers';
import type { DashboardStats, Device, DataRecord } from '@/types';
import './index.css';

const { RangePicker } = DatePicker;

/**
 * 商户仪表板页面
 * 展示商户专属的设备状态、数据统计和业务指标
 */
const MerchantDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [recentData, setRecentData] = useState<DataRecord[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [chartData, setChartData] = useState<{
    deviceTrend: Array<{ status: string; count: number }>;
    dataTrend: Array<{ date: string; count: number }>;
  }>({
    deviceTrend: [],
    dataTrend: [],
  });
  const { user } = useAuthStore();

  // 加载商户仪表板数据
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 并行加载商户相关数据
      const [statsRes, devicesRes] = await Promise.all([
        ApiService.get<DashboardStats>('/api/v1/merchant/dashboard'),
        ApiService.get<Device[]>('/api/v1/devices?limit=10'),
      ]);
      
      // 模拟图表数据和告警数据，因为后端暂时没有对应接口
      const mockChartData = {
        dataTrend: [
          { date: '2024-01-01', count: 85 },
          { date: '2024-01-02', count: 92 },
          { date: '2024-01-03', count: 78 },
          { date: '2024-01-04', count: 105 },
          { date: '2024-01-05', count: 118 },
          { date: '2024-01-06', count: 125 },
          { date: '2024-01-07', count: 132 },
        ],
        deviceTrend: [
          { status: 'active', count: 8 },
          { status: 'inactive', count: 2 },
          { status: 'maintenance', count: 1 },
        ],
      };
      
      const mockAlerts = [
        {
          id: 1,
          deviceId: 'DEV001',
          message: '设备温度过高',
          level: 'warning',
          timestamp: new Date().toISOString(),
        },
      ];
      
      const mockDataRecords: DataRecord[] = [
        {
          id: 1,
          deviceId: 1,
          deviceName: '温度传感器001',
          dataType: '温度',
          value: '25.6',
          unit: '°C',
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          deviceId: 2,
          deviceName: '湿度传感器002',
          dataType: '湿度',
          value: '68.2',
          unit: '%',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          createdAt: new Date(Date.now() - 300000).toISOString(),
        },
      ];

      if (statsRes.success) setStats(statsRes.data);
      if (devicesRes.success) setDevices(devicesRes.data);
      
      // 使用模拟数据
      setRecentData(mockDataRecords);
      setAlerts(mockAlerts);
      setChartData(mockChartData);
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
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
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
    color: '#52c41a',
    point: {
      size: 3,
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: '数据量', value: `${datum.count} 条` };
      },
    },
  };

  // 设备状态分布图配置
  const deviceStatusConfig = {
    data: chartData.deviceTrend,
    xField: 'status',
    yField: 'count',
    color: ({ status }: any) => {
      return status === 'active' ? '#52c41a' : status === 'inactive' ? '#ff4d4f' : '#faad14';
    },
    label: {
      position: 'middle' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="merchant-dashboard">
      {/* 欢迎信息 */}
      <div className="welcome-section">
        <h2>欢迎回来，{user?.nickname}！</h2>
        <p>这里是您的设备管理中心，实时监控您的IoT设备状态和数据。</p>
      </div>

      {/* 告警信息 */}
      {alerts.length > 0 && (
        <Alert
          message="设备告警"
          description={`您有 ${alerts.length} 个设备需要关注`}
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          action={
            <Button size="small" type="text">
              查看详情
            </Button>
          }
          closable
          className="alert-banner"
        />
      )}

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总设备数"
              value={stats?.totalDevices || 0}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="台"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={stats?.onlineDevices || 0}
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix={
                <span className="device-rate">
                  ({((stats?.onlineDevices || 0) / (stats?.totalDevices || 1) * 100).toFixed(1)}%)
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
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix="条"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="告警数量"
              value={alerts.length}
              prefix={<WarningOutlined />}
              valueStyle={{ color: alerts.length > 0 ? '#ff4d4f' : '#52c41a' }}
              suffix="个"
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} className="charts-row">
        <Col xs={24} lg={16}>
          <Card title="数据趋势" extra={<RangePicker />}>
            {chartData.dataTrend.length > 0 ? (
              <Line {...dataTrendConfig} height={300} />
            ) : (
              <Empty description="暂无数据" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="设备状态分布">
            {chartData.deviceTrend.length > 0 ? (
              <Column {...deviceStatusConfig} height={300} />
            ) : (
              <Empty description="暂无设备" />
            )}
          </Card>
        </Col>
      </Row>

      {/* 详细信息区域 */}
      <Row gutter={[16, 16]} className="details-row">
        <Col xs={24} lg={16}>
          <Card title="设备状态" extra={<Button type="link">查看全部</Button>}>
            {devices.length > 0 ? (
              <Table
                dataSource={devices}
                columns={deviceColumns}
                pagination={false}
                size="small"
                rowKey="id"
              />
            ) : (
              <Empty description="暂无设备数据" />
            )}
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="最新数据" extra={<Button type="link">查看全部</Button>}>
            {recentData.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={recentData.slice(0, 5)}
                renderItem={(record) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar size="small" icon={<DatabaseOutlined />} />}
                      title={
                        <Space>
                          <span>{record.deviceName}</span>
                          <Tag>{record.dataType}</Tag>
                        </Space>
                      }
                      description={
                        <Space>
                          <span>值: {record.value}</span>
                          <span>{formatDate.datetime(record.timestamp, 'MM-DD HH:mm')}</span>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="暂无数据记录" />
            )}
          </Card>
        </Col>
      </Row>

      {/* 快捷操作 */}
      <Row gutter={[16, 16]} className="actions-row">
        <Col xs={24}>
          <Card title="快捷操作">
            <Space wrap>
              <Button type="primary" icon={<DatabaseOutlined />}>
                添加设备
              </Button>
              <Button icon={<LineChartOutlined />}>
                数据分析
              </Button>
              <Button icon={<SettingOutlined />}>
                设备配置
              </Button>
              <Button icon={<EyeOutlined />}>
                查看报表
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MerchantDashboard;