import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Space,
  Tooltip,
  Popconfirm,
  message,
  Spin,
  Empty,
  Progress,
  Divider,
  Alert,
  Typography
} from 'antd';
import {
  PlusOutlined,
  DownloadOutlined,
  EyeOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
  SendOutlined
} from '@ant-design/icons';
import { ApiService } from '../../../utils/api';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

// 商户报表中心页面组件
const MerchantReports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [devices, setDevices] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  // 模态框状态
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  
  // 表单
  const [createForm] = Form.useForm();
  const [settingsForm] = Form.useForm();
  
  // 筛选条件
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: null as any
  });

  // 获取报表列表
  const fetchReports = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        pageSize,
        status: filters.status === 'all' ? undefined : filters.status,
        type: filters.type === 'all' ? undefined : filters.type
      };
      
      if (filters.dateRange && filters.dateRange.length === 2) {
        params.startDate = filters.dateRange[0].format('YYYY-MM-DD');
        params.endDate = filters.dateRange[1].format('YYYY-MM-DD');
      }
      
      const response = await ApiService.get('/merchant/reports', params);
      setReports(response.data || []);
      setPagination({
        current: page,
        pageSize,
        total: response.total || 0
      });
    } catch (error) {
      console.error('获取报表列表失败:', error);
      message.error('获取报表列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取报表模板
  const fetchTemplates = async () => {
    try {
      const response = await ApiService.get('/merchant/report-templates');
      setTemplates(response.data || []);
    } catch (error) {
      console.error('获取报表模板失败:', error);
    }
  };

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

  // 创建报表
  const handleCreateReport = async (values: any) => {
    try {
      const params = {
        ...values,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        deviceIds: values.devices || []
      };
      delete params.dateRange;
      delete params.devices;
      
      await ApiService.post('/merchant/reports', params);
      message.success('报表创建成功');
      setCreateModalVisible(false);
      createForm.resetFields();
      fetchReports();
    } catch (error) {
      console.error('创建报表失败:', error);
      message.error('创建报表失败');
    }
  };

  // 删除报表
  const handleDeleteReport = async (id: string) => {
    try {
      await ApiService.delete(`/merchant/reports/${id}`);
      message.success('删除成功');
      fetchReports();
    } catch (error) {
      console.error('删除报表失败:', error);
      message.error('删除报表失败');
    }
  };

  // 下载报表
  const handleDownloadReport = async (report: any) => {
    try {
      const filename = `${report.name}_${new Date().toISOString().split('T')[0]}.${report.format}`;
      await ApiService.download(`/merchant/reports/${report.id}/download`, filename, {});
      message.success('下载成功');
    } catch (error) {
      console.error('下载报表失败:', error);
      message.error('下载报表失败');
    }
  };

  // 预览报表
  const handlePreviewReport = async (report: any) => {
    try {
      setLoading(true);
      const response = await ApiService.get(`/merchant/reports/${report.id}/preview`);
      setPreviewData(response.data);
      setSelectedReport(report);
      setPreviewModalVisible(true);
    } catch (error) {
      console.error('预览报表失败:', error);
      message.error('预览报表失败');
    } finally {
      setLoading(false);
    }
  };

  // 重新生成报表
  const handleRegenerateReport = async (id: string) => {
    try {
      await ApiService.post(`/merchant/reports/${id}/regenerate`);
      message.success('报表重新生成中...');
      fetchReports();
    } catch (error) {
      console.error('重新生成报表失败:', error);
      message.error('重新生成报表失败');
    }
  };

  // 发送报表
  const handleSendReport = async (report: any) => {
    try {
      await ApiService.post(`/merchant/reports/${report.id}/send`);
      message.success('报表发送成功');
    } catch (error) {
      console.error('发送报表失败:', error);
      message.error('发送报表失败');
    }
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap = {
      pending: { color: 'processing', text: '生成中', icon: <ClockCircleOutlined /> },
      completed: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
      failed: { color: 'error', text: '生成失败', icon: <ExclamationCircleOutlined /> },
      cancelled: { color: 'default', text: '已取消', icon: <ExclamationCircleOutlined /> }
    };
    const config = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  // 获取类型图标
  const getTypeIcon = (type: string) => {
    const iconMap = {
      daily: <CalendarOutlined />,
      weekly: <CalendarOutlined />,
      monthly: <CalendarOutlined />,
      custom: <SettingOutlined />
    };
    return iconMap[type as keyof typeof iconMap] || <FileTextOutlined />;
  };

  // 获取格式图标
  const getFormatIcon = (format: string) => {
    const iconMap = {
      pdf: <FilePdfOutlined style={{ color: '#ff4d4f' }} />,
      excel: <FileExcelOutlined style={{ color: '#52c41a' }} />,
      csv: <FileTextOutlined style={{ color: '#1890ff' }} />
    };
    return iconMap[format as keyof typeof iconMap] || <FileTextOutlined />;
  };

  // 表格列定义
  const columns = [
    {
      title: '报表名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <div className="report-info">
          <div className="report-name">
            {getTypeIcon(record.type)}
            <span>{name}</span>
          </div>
          <div className="report-description">{record.description}</div>
        </div>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const typeMap = {
          daily: '日报',
          weekly: '周报',
          monthly: '月报',
          custom: '自定义'
        };
        return typeMap[type as keyof typeof typeMap] || type;
      }
    },
    {
      title: '格式',
      dataIndex: 'format',
      key: 'format',
      width: 80,
      render: (format: string) => (
        <Tooltip title={format.toUpperCase()}>
          {getFormatIcon(format)}
        </Tooltip>
      )
    },
    {
      title: '时间范围',
      dataIndex: 'dateRange',
      key: 'dateRange',
      width: 200,
      render: (dateRange: any, record: any) => (
        <div className="date-range">
          <div>{record.startDate} 至</div>
          <div>{record.endDate}</div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 120,
      render: (progress: number, record: any) => {
        if (record.status === 'completed') {
          return <Progress percent={100} size="small" status="success" />;
        } else if (record.status === 'failed') {
          return <Progress percent={progress || 0} size="small" status="exception" />;
        } else if (record.status === 'pending') {
          return <Progress percent={progress || 0} size="small" status="active" />;
        }
        return <Progress percent={0} size="small" />;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (time: string) => (
        <span className="text-gray">
          {new Date(time).toLocaleString()}
        </span>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: any, record: any) => (
        <Space size="small">
          {record.status === 'completed' && (
            <>
              <Tooltip title="预览">
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => handlePreviewReport(record)}
                />
              </Tooltip>
              <Tooltip title="下载">
                <Button
                  type="text"
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownloadReport(record)}
                />
              </Tooltip>
              <Tooltip title="发送">
                <Button
                  type="text"
                  size="small"
                  icon={<SendOutlined />}
                  onClick={() => handleSendReport(record)}
                />
              </Tooltip>
            </>
          )}
          {record.status === 'failed' && (
            <Tooltip title="重新生成">
              <Button
                type="text"
                size="small"
                icon={<ReloadOutlined />}
                onClick={() => handleRegenerateReport(record.id)}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="确定要删除这个报表吗？"
            onConfirm={() => handleDeleteReport(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 处理表格变化
  const handleTableChange = (paginationConfig: any) => {
    fetchReports(paginationConfig.current, paginationConfig.pageSize);
  };

  // 处理筛选变化
  const handleFilterChange = () => {
    fetchReports(1, pagination.pageSize);
  };

  useEffect(() => {
    fetchReports();
    fetchTemplates();
    fetchDevices();
  }, []);

  useEffect(() => {
    handleFilterChange();
  }, [filters]);

  return (
    <div className="merchant-reports">
      <Spin spinning={loading}>
        {/* 页面头部 */}
        <div className="page-header">
          <div className="header-left">
            <h2>报表中心</h2>
            <p>生成和管理各类数据报表</p>
          </div>
          <div className="header-right">
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchReports()}
              >
                刷新
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
              >
                创建报表
              </Button>
            </Space>
          </div>
        </div>

        {/* 筛选区域 */}
        <Card className="filter-section">
          <Row gutter={16}>
            <Col xs={24} sm={8} md={6}>
              <Select
                style={{ width: '100%' }}
                placeholder="报表状态"
                value={filters.status}
                onChange={(value) => setFilters({ ...filters, status: value })}
              >
                <Option value="all">全部状态</Option>
                <Option value="pending">生成中</Option>
                <Option value="completed">已完成</Option>
                <Option value="failed">生成失败</Option>
                <Option value="cancelled">已取消</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Select
                style={{ width: '100%' }}
                placeholder="报表类型"
                value={filters.type}
                onChange={(value) => setFilters({ ...filters, type: value })}
              >
                <Option value="all">全部类型</Option>
                <Option value="daily">日报</Option>
                <Option value="weekly">周报</Option>
                <Option value="monthly">月报</Option>
                <Option value="custom">自定义</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <RangePicker
                style={{ width: '100%' }}
                placeholder={['开始日期', '结束日期']}
                value={filters.dateRange}
                onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
              />
            </Col>
          </Row>
        </Card>

        {/* 报表列表 */}
        <Card className="table-card">
          <Table
            columns={columns}
            dataSource={reports}
            rowKey="id"
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
            }}
            onChange={handleTableChange}
            loading={loading}
          />
        </Card>

        {/* 创建报表模态框 */}
        <Modal
          title="创建报表"
          open={createModalVisible}
          onCancel={() => {
            setCreateModalVisible(false);
            createForm.resetFields();
          }}
          footer={null}
          width={600}
          className="create-modal"
        >
          <Form
            form={createForm}
            layout="vertical"
            onFinish={handleCreateReport}
          >
            <Form.Item
              name="name"
              label="报表名称"
              rules={[{ required: true, message: '请输入报表名称' }]}
            >
              <Input placeholder="请输入报表名称" />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="报表描述"
            >
              <TextArea
                placeholder="请输入报表描述"
                rows={3}
              />
            </Form.Item>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="报表类型"
                  rules={[{ required: true, message: '请选择报表类型' }]}
                >
                  <Select placeholder="请选择报表类型">
                    <Option value="daily">日报</Option>
                    <Option value="weekly">周报</Option>
                    <Option value="monthly">月报</Option>
                    <Option value="custom">自定义</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="format"
                  label="导出格式"
                  rules={[{ required: true, message: '请选择导出格式' }]}
                >
                  <Select placeholder="请选择导出格式">
                    <Option value="pdf">PDF</Option>
                    <Option value="excel">Excel</Option>
                    <Option value="csv">CSV</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="dateRange"
              label="时间范围"
              rules={[{ required: true, message: '请选择时间范围' }]}
            >
              <RangePicker
                style={{ width: '100%' }}
                placeholder={['开始日期', '结束日期']}
              />
            </Form.Item>
            
            <Form.Item
              name="devices"
              label="包含设备"
            >
              <Select
                mode="multiple"
                placeholder="选择设备（不选择则包含全部设备）"
                allowClear
              >
                {devices.map((device: any) => (
                  <Option key={device.id} value={device.id}>
                    {device.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item name="includeCharts" valuePropName="checked">
              <Checkbox>包含图表</Checkbox>
            </Form.Item>
            
            <Form.Item name="autoSend" valuePropName="checked">
              <Checkbox>生成完成后自动发送</Checkbox>
            </Form.Item>
            
            <Divider />
            
            <div className="modal-footer">
              <Space>
                <Button onClick={() => {
                  setCreateModalVisible(false);
                  createForm.resetFields();
                }}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  创建报表
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        {/* 预览模态框 */}
        <Modal
          title={`预览报表 - ${selectedReport?.name}`}
          open={previewModalVisible}
          onCancel={() => {
            setPreviewModalVisible(false);
            setSelectedReport(null);
            setPreviewData(null);
          }}
          footer={[
            <Button key="close" onClick={() => {
              setPreviewModalVisible(false);
              setSelectedReport(null);
              setPreviewData(null);
            }}>
              关闭
            </Button>,
            <Button
              key="download"
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => selectedReport && handleDownloadReport(selectedReport)}
            >
              下载
            </Button>
          ]}
          width={800}
          className="preview-modal"
        >
          {previewData ? (
            <div className="report-preview">
              <div className="preview-header">
                <h3>{previewData.title}</h3>
                <p className="preview-meta">
                  生成时间: {new Date(previewData.generatedAt).toLocaleString()}
                </p>
              </div>
              
              <div className="preview-content">
                {previewData.summary && (
                  <div className="preview-section">
                    <h4>报表摘要</h4>
                    <p>{previewData.summary}</p>
                  </div>
                )}
                
                {previewData.statistics && (
                  <div className="preview-section">
                    <h4>统计数据</h4>
                    <Row gutter={16}>
                      {Object.entries(previewData.statistics).map(([key, value]: [string, any]) => (
                        <Col span={8} key={key}>
                          <div className="stat-item">
                            <div className="stat-value">{value}</div>
                            <div className="stat-label">{key}</div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
                
                {previewData.charts && previewData.charts.length > 0 && (
                  <div className="preview-section">
                    <h4>图表</h4>
                    <p>报表包含 {previewData.charts.length} 个图表</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="preview-loading">
              <Spin size="large" />
              <p>加载预览数据中...</p>
            </div>
          )}
        </Modal>
      </Spin>
    </div>
  );
};

export default MerchantReports;