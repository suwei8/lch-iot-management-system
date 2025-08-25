import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Select,
  Table,
  Tag,
  Progress,
  Spin,
  Alert,
  Button,
  Space,
  Tooltip,
  Empty,
  message,
  Divider
} from 'antd';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  DownloadOutlined,
  ReloadOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { ApiService } from '../../../utils/api';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 商户数据分析页面组件
const MerchantAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<any>(null);
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [chartType, setChartType] = useState<string>('line');
  const [timeGranularity, setTimeGranularity] = useState<string>('day');
  const [dataType, setDataType] = useState<string>('all');
  
  // 统计数据
  const [statistics, setStatistics] = useState({
    totalData: 0,
    todayData: 0,
    avgDataPerHour: 0,
    dataGrowthRate: 0,
    totalDevices: 0,
    onlineDevices: 0,
    offlineDevices: 0,
    errorDevices: 0,
    dataQualityScore: 0,
    alertCount: 0
  });
  
  // 图表数据
  const [chartData, setChartData] = useState({
    dataVolume: [],
    deviceStatus: [],
    dataTypeDistribution: [],
    hourlyTrend: []
  });
  
  // 表格数据
  const [tableData, setTableData] = useState({
    deviceRanking: [],
    recentAlerts: [],
    dataQuality: []
  });
  
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // 获取设备列表
  const fetchDevices = async () => {
    try {
      const response = await ApiService.get('/merchant/devices', {
        page: 1,
        pageSize: 1000,
        status: 'all'
      });
      setDevices(response.data || []);
    } catch (error) {
      console.error('获取设备列表失败:', error);
    }
  };

  // 获取告警信息
  const fetchAlerts = async () => {
    try {
      const response = await ApiService.get('/merchant/alerts', {
        page: 1,
        pageSize: 5,
        status: 'active'
      });
      setAlerts(response.data || []);
    } catch (error) {
      console.error('获取告警信息失败:', error);
    }
  };

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const params: any = {
        deviceId: selectedDevice === 'all' ? undefined : selectedDevice,
        dataType: dataType === 'all' ? undefined : dataType
      };
      
      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      }
      
      const response = await ApiService.get('/merchant/analytics/statistics', params);
      setStatistics(response.data || {});
    } catch (error) {
      console.error('获取统计数据失败:', error);
      message.error('获取统计数据失败');
    }
  };

  // 获取图表数据
  const fetchChartData = async () => {
    try {
      const params: any = {
        deviceId: selectedDevice === 'all' ? undefined : selectedDevice,
        dataType: dataType === 'all' ? undefined : dataType,
        granularity: timeGranularity
      };
      
      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      }
      
      const response = await ApiService.get('/merchant/analytics/charts', params);
      setChartData(response.data || {});
    } catch (error) {
      console.error('获取图表数据失败:', error);
      message.error('获取图表数据失败');
    }
  };

  // 获取表格数据
  const fetchTableData = async () => {
    try {
      const params: any = {
        deviceId: selectedDevice === 'all' ? undefined : selectedDevice,
        dataType: dataType === 'all' ? undefined : dataType
      };
      
      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      }
      
      const response = await ApiService.get('/merchant/analytics/tables', params);
      setTableData(response.data || {});
    } catch (error) {
      console.error('获取表格数据失败:', error);
      message.error('获取表格数据失败');
    }
  };

  // 加载所有数据
  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStatistics(),
        fetchChartData(),
        fetchTableData(),
        fetchAlerts()
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 导出数据
  const handleExport = async () => {
    try {
      const params: any = {
        deviceId: selectedDevice === 'all' ? undefined : selectedDevice,
        dataType: dataType === 'all' ? undefined : dataType,
        format: 'excel'
      };
      
      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      }
      
      await ApiService.download('/merchant/analytics/export', params, '数据分析报告.xlsx');
      message.success('导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败');
    }
  };

  // 获取趋势图标
  const getTrendIcon = (rate: number) => {
    if (rate > 0) {
      return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
    } else if (rate < 0) {
      return <ArrowDownOutlined style={{ color: '#ff4d4f' }} />;
    } else {
      return <MinusOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  // 获取趋势颜色
  const getTrendColor = (rate: number) => {
    if (rate > 0) return '#52c41a';
    if (rate < 0) return '#ff4d4f';
    return '#8c8c8c';
  };

  // 获取设备状态颜色
  const getDeviceStatusColor = (status: string) => {
    const statusMap = {
      online: '#52c41a',
      offline: '#8c8c8c',
      error: '#ff4d4f',
      warning: '#fa8c16'
    };
    return statusMap[status as keyof typeof statusMap] || '#8c8c8c';
  };

  // 渲染主图表
  const renderMainChart = () => {
    const data = chartData.dataVolume || [];
    
    if (!data.length) {
      return <Empty description="暂无数据" />;
    }
    
    const commonProps = {
      width: '100%',
      height: 300,
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };
    
    switch (chartType) {
      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#1890ff"
                fill="#1890ff"
                fillOpacity={0.3}
                name="数据量"
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="count" fill="#1890ff" name="数据量" />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#1890ff"
                strokeWidth={2}
                name="数据量"
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  // 设备排行表格列
  const deviceColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
      render: (rank: number) => (
        <Tag color={rank <= 3 ? 'gold' : 'default'}>{rank}</Tag>
      )
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
      render: (name: string, record: any) => (
        <div>
          <div className="device-name">{name}</div>
          <div className="device-code">{record.deviceCode}</div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          online: { color: 'success', text: '在线' },
          offline: { color: 'default', text: '离线' },
          error: { color: 'error', text: '异常' },
          warning: { color: 'warning', text: '告警' }
        };
        const config = statusMap[status as keyof typeof statusMap] || statusMap.offline;
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '数据量',
      dataIndex: 'dataCount',
      key: 'dataCount',
      render: (count: number) => count?.toLocaleString() || 0
    },
    {
      title: '活跃度',
      dataIndex: 'activityRate',
      key: 'activityRate',
      render: (rate: number) => (
        <Progress
          percent={rate || 0}
          size="small"
          status={rate >= 80 ? 'success' : rate >= 60 ? 'normal' : 'exception'}
        />
      )
    }
  ];

  // 告警表格列
  const alertColumns = [
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (time: string) => (
        <div className="alert-time">
          {new Date(time).toLocaleString()}
        </div>
      )
    },
    {
      title: '设备',
      dataIndex: 'deviceName',
      key: 'deviceName'
    },
    {
      title: '告警类型',
      dataIndex: 'alertType',
      key: 'alertType',
      render: (type: string) => {
        const typeMap = {
          offline: { color: 'default', text: '设备离线' },
          error: { color: 'error', text: '数据异常' },
          warning: { color: 'warning', text: '性能告警' },
          threshold: { color: 'orange', text: '阈值告警' }
        };
        const config = typeMap[type as keyof typeof typeMap] || typeMap.error;
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          active: { color: 'error', text: '活跃', icon: <AlertOutlined /> },
          resolved: { color: 'success', text: '已解决', icon: <CheckCircleOutlined /> },
          pending: { color: 'processing', text: '处理中', icon: <ClockCircleOutlined /> }
        };
        const config = statusMap[status as keyof typeof statusMap] || statusMap.active;
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    }
  ];

  // 数据质量表格列
  const qualityColumns = [
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType'
    },
    {
      title: '总量',
      dataIndex: 'totalCount',
      key: 'totalCount',
      render: (count: number) => count?.toLocaleString() || 0
    },
    {
      title: '有效数据',
      dataIndex: 'validCount',
      key: 'validCount',
      render: (count: number) => count?.toLocaleString() || 0
    },
    {
      title: '质量评分',
      dataIndex: 'qualityScore',
      key: 'qualityScore',
      render: (score: number) => (
        <Progress
          percent={score || 0}
          size="small"
          status={score >= 90 ? 'success' : score >= 70 ? 'normal' : 'exception'}
        />
      )
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
      render: (time: string) => (
        <span className="text-gray">
          {time ? new Date(time).toLocaleString() : '-'}
        </span>
      )
    }
  ];

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    loadData();
  }, [dateRange, selectedDevice, timeGranularity, dataType]);

  return (
    <div className="merchant-analytics">
      <Spin spinning={loading}>
        {/* 页面头部 */}
        <div className="page-header">
          <div className="header-left">
            <h2>数据分析</h2>
            <p>查看设备数据统计和分析报告</p>
          </div>
          <div className="header-right">
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadData}
                loading={loading}
              >
                刷新
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                导出报告
              </Button>
            </Space>
          </div>
        </div>

        {/* 告警横幅 */}
        {alerts.length > 0 && (
          <Alert
            message={`当前有 ${alerts.length} 个活跃告警`}
            description={alerts.map((alert: any) => alert.description).join('；')}
            type="warning"
            showIcon
            closable
            className="alert-banner"
          />
        )}

        {/* 筛选区域 */}
        <Card className="filter-section">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <RangePicker
                style={{ width: '100%' }}
                placeholder={['开始日期', '结束日期']}
                value={dateRange}
                onChange={setDateRange}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                style={{ width: '100%' }}
                placeholder="选择设备"
                value={selectedDevice}
                onChange={setSelectedDevice}
              >
                <Option value="all">全部设备</Option>
                {devices.map((device: any) => (
                  <Option key={device.id} value={device.id}>
                    {device.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                style={{ width: '100%' }}
                placeholder="数据类型"
                value={dataType}
                onChange={setDataType}
              >
                <Option value="all">全部类型</Option>
                <Option value="temperature">温度</Option>
                <Option value="humidity">湿度</Option>
                <Option value="pressure">压力</Option>
                <Option value="location">位置</Option>
                <Option value="status">状态</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                style={{ width: '100%' }}
                placeholder="时间粒度"
                value={timeGranularity}
                onChange={setTimeGranularity}
              >
                <Option value="hour">小时</Option>
                <Option value="day">天</Option>
                <Option value="week">周</Option>
                <Option value="month">月</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]} className="statistics-section">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总数据量"
                value={statistics.totalData}
                formatter={(value) => value?.toLocaleString() || 0}
                prefix={<BarChartOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
              <div className="trend">
                {getTrendIcon(statistics.dataGrowthRate)}
                <span style={{ color: getTrendColor(statistics.dataGrowthRate) }}>
                  {statistics.dataGrowthRate?.toFixed(1) || 0}%
                </span>
                <span className="trend-text">较昨日</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="今日数据"
                value={statistics.todayData}
                formatter={(value) => value?.toLocaleString() || 0}
                prefix={<ArrowUpOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
              <div className="trend">
                <span className="trend-text">平均每小时: {statistics.avgDataPerHour || 0}</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="在线设备"
                value={statistics.onlineDevices}
                suffix={`/ ${statistics.totalDevices}`}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
              <div className="trend">
                <span className="trend-text">
                  在线率: {((statistics.onlineDevices / statistics.totalDevices) * 100 || 0).toFixed(1)}%
                </span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="数据质量"
                value={statistics.dataQualityScore}
                precision={1}
                suffix="%"
                prefix={<PieChartOutlined />}
                valueStyle={{ 
                  color: statistics.dataQualityScore >= 90 ? '#52c41a' : 
                         statistics.dataQualityScore >= 70 ? '#fa8c16' : '#ff4d4f'
                }}
              />
              <div className="trend">
                <span className="trend-text">告警数量: {statistics.alertCount || 0}</span>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 图表区域 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card 
              title="数据趋势" 
              className="chart-card"
              extra={
                <Space>
                  <Select
                    size="small"
                    value={chartType}
                    onChange={setChartType}
                    style={{ width: 100 }}
                  >
                    <Option value="line">折线图</Option>
                    <Option value="area">面积图</Option>
                    <Option value="bar">柱状图</Option>
                  </Select>
                </Space>
              }
            >
              {renderMainChart()}
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="设备状态分布" className="chart-card">
              {chartData.deviceStatus?.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.deviceStatus}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {chartData.deviceStatus.map((entry: any, index: number) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={getDeviceStatusColor(entry.name)} 
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="暂无数据" />
              )}
            </Card>
          </Col>
        </Row>

        {/* 表格区域 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="设备数据排行" className="table-card">
              <Table
                columns={deviceColumns}
                dataSource={tableData.deviceRanking}
                pagination={false}
                size="small"
                rowKey="id"
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="最新告警" className="table-card">
              <Table
                columns={alertColumns}
                dataSource={tableData.recentAlerts}
                pagination={false}
                size="small"
                rowKey="id"
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card title="数据质量分析" className="table-card">
              <Table
                columns={qualityColumns}
                dataSource={tableData.dataQuality}
                pagination={false}
                size="small"
                rowKey="dataType"
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default MerchantAnalytics;