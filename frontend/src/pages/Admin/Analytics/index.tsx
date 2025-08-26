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
  message
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
  MinusOutlined
} from '@ant-design/icons';
import { ApiService } from '../../../utils/api';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 数据分析页面组件
const AdminAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<any>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<string>('all');
  const [chartType, setChartType] = useState<string>('line');
  const [timeGranularity, setTimeGranularity] = useState<string>('day');
  
  // 统计数据
  const [statistics, setStatistics] = useState({
    totalData: 0,
    todayData: 0,
    avgDataPerDevice: 0,
    dataGrowthRate: 0,
    totalDevices: 0,
    activeDevices: 0,
    totalMerchants: 0,
    activeMerchants: 0
  });
  
  // 图表数据
  const [chartData, setChartData] = useState({
    dataVolume: [],
    deviceActivity: [],
    merchantDistribution: [],
    dataTypeDistribution: []
  });
  
  // 表格数据
  const [tableData, setTableData] = useState({
    topMerchants: [],
    topDevices: [],
    dataQuality: []
  });
  
  const [merchants, setMerchants] = useState([]);

  // 获取商户列表
  const fetchMerchants = async () => {
    try {
      const response = await ApiService.get('/admin/merchants', {
        page: 1,
        limit: 100,
        status: 'active'
      });
      setMerchants(response.data || []);
    } catch (error) {
      console.error('获取商户列表失败:', error);
    }
  };

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const params: any = {
        merchantId: selectedMerchant === 'all' ? undefined : selectedMerchant
      };
      
      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      }
      
      const response = await ApiService.get('/admin/analytics/statistics', params);
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
        merchantId: selectedMerchant === 'all' ? undefined : selectedMerchant,
        granularity: timeGranularity
      };
      
      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      }
      
      const response = await ApiService.get('/admin/analytics/charts', params);
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
        merchantId: selectedMerchant === 'all' ? undefined : selectedMerchant
      };
      
      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      }
      
      const response = await ApiService.get('/admin/analytics/tables', params);
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
        fetchTableData()
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 导出数据
  const handleExport = async () => {
    try {
      const params: any = {
        merchantId: selectedMerchant === 'all' ? undefined : selectedMerchant,
        format: 'excel'
      };
      
      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      }
      
      await ApiService.download('/admin/analytics/export', params, '数据分析报告.xlsx');
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

  // 渲染图表
  const renderChart = () => {
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
              <XAxis dataKey="date" />
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
              <XAxis dataKey="date" />
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
              <XAxis dataKey="date" />
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

  // 商户排行表格列
  const merchantColumns = [
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
      title: '商户名称',
      dataIndex: 'merchantName',
      key: 'merchantName'
    },
    {
      title: '数据量',
      dataIndex: 'dataCount',
      key: 'dataCount',
      render: (count: number) => count?.toLocaleString() || 0
    },
    {
      title: '设备数',
      dataIndex: 'deviceCount',
      key: 'deviceCount'
    },
    {
      title: '增长率',
      dataIndex: 'growthRate',
      key: 'growthRate',
      render: (rate: number) => (
        <span style={{ color: getTrendColor(rate) }}>
          {getTrendIcon(rate)} {rate?.toFixed(1) || 0}%
        </span>
      )
    }
  ];

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
      key: 'deviceName'
    },
    {
      title: '商户',
      dataIndex: 'merchantName',
      key: 'merchantName'
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          excellent: { color: 'success', text: '优秀' },
          good: { color: 'processing', text: '良好' },
          warning: { color: 'warning', text: '警告' },
          error: { color: 'error', text: '异常' }
        };
        const config = statusMap[status as keyof typeof statusMap] || statusMap.error;
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    }
  ];

  useEffect(() => {
    fetchMerchants();
  }, []);

  useEffect(() => {
    loadData();
  }, [dateRange, selectedMerchant, timeGranularity]);

  return (
    <div className="admin-analytics">
      <Spin spinning={loading}>
        {/* 页面头部 */}
        <div className="page-header">
          <div className="header-left">
            <h2>数据分析</h2>
            <p>查看系统数据统计和分析报告</p>
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
                placeholder="选择商户"
                value={selectedMerchant}
                onChange={setSelectedMerchant}
              >
                <Option value="all">全部商户</Option>
                {merchants.map((merchant: any) => (
                  <Option key={merchant.id} value={merchant.id}>
                    {merchant.name}
                  </Option>
                ))}
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
            <Col xs={24} sm={12} md={6}>
              <Select
                style={{ width: '100%' }}
                placeholder="图表类型"
                value={chartType}
                onChange={setChartType}
              >
                <Option value="line">
                  <LineChartOutlined /> 折线图
                </Option>
                <Option value="area">
                  <BarChartOutlined /> 面积图
                </Option>
                <Option value="bar">
                  <PieChartOutlined /> 柱状图
                </Option>
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
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="设备平均数据量"
                value={statistics.avgDataPerDevice}
                precision={1}
                prefix={<LineChartOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="活跃设备率"
                value={(statistics.activeDevices / statistics.totalDevices * 100) || 0}
                precision={1}
                suffix="%"
                prefix={<PieChartOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 图表区域 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="数据趋势" className="chart-card">
              {renderChart()}
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="数据类型分布" className="chart-card">
              {chartData.dataTypeDistribution?.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.dataTypeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {chartData.dataTypeDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96'][index % 5]} />
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
            <Card title="商户数据排行" className="table-card">
              <Table
                columns={merchantColumns}
                dataSource={tableData.topMerchants}
                pagination={false}
                size="small"
                rowKey="id"
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="设备数据排行" className="table-card">
              <Table
                columns={deviceColumns}
                dataSource={tableData.topDevices}
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

export default AdminAnalytics;