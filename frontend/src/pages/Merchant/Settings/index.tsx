import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Row,
  Col,
  Divider,
  message,
  Spin,
  Space,
  Typography,
  Modal,
  List,
  Avatar,
  Badge,
  Tabs,
  Alert,
  InputNumber,
  TimePicker,
  Checkbox,
  Radio,
  Slider
} from 'antd';
import {
  SettingOutlined,
  BellOutlined,
  SafetyOutlined,
  ApiOutlined,
  KeyOutlined,
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  CopyOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { ApiService } from '../../../services/api';
import './index.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { confirm } = Modal;

/**
 * 商户账户设置页面组件
 * 提供系统设置、通知设置、安全设置、API管理等功能
 */
const MerchantSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>({});
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loginLogs, setLoginLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('general');
  const [form] = Form.useForm();
  const [apiForm] = Form.useForm();
  const [apiModalVisible, setApiModalVisible] = useState(false);
  const [editingApiKey, setEditingApiKey] = useState<any>(null);

  // 加载设置信息
  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await ApiService.get('/merchant/settings');
      if (response.success) {
        setSettings(response.data);
        form.setFieldsValue(response.data);
      }
    } catch (error) {
      message.error('加载设置信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载API密钥列表
  const loadApiKeys = async () => {
    try {
      const response = await ApiService.get('/merchant/api-keys');
      if (response.success) {
        setApiKeys(response.data);
      }
    } catch (error) {
      message.error('加载API密钥失败');
    }
  };

  // 加载登录日志
  const loadLoginLogs = async () => {
    try {
      const response = await ApiService.get('/merchant/login-logs');
      if (response.success) {
        setLoginLogs(response.data);
      }
    } catch (error) {
      message.error('加载登录日志失败');
    }
  };

  // 保存设置
  const handleSaveSettings = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const response = await ApiService.put('/merchant/settings', values);
      if (response.success) {
        message.success('设置保存成功');
        setSettings({ ...settings, ...values });
      }
    } catch (error) {
      message.error('保存设置失败');
    } finally {
      setLoading(false);
    }
  };

  // 创建API密钥
  const handleCreateApiKey = async () => {
    try {
      const values = await apiForm.validateFields();
      setLoading(true);
      
      const response = await ApiService.post('/merchant/api-keys', values);
      if (response.success) {
        message.success('API密钥创建成功');
        setApiModalVisible(false);
        apiForm.resetFields();
        loadApiKeys();
      }
    } catch (error) {
      message.error('创建API密钥失败');
    } finally {
      setLoading(false);
    }
  };

  // 更新API密钥
  const handleUpdateApiKey = async () => {
    try {
      const values = await apiForm.validateFields();
      setLoading(true);
      
      const response = await ApiService.put(`/merchant/api-keys/${editingApiKey.id}`, values);
      if (response.success) {
        message.success('API密钥更新成功');
        setApiModalVisible(false);
        setEditingApiKey(null);
        apiForm.resetFields();
        loadApiKeys();
      }
    } catch (error) {
      message.error('更新API密钥失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除API密钥
  const handleDeleteApiKey = (apiKey: any) => {
    confirm({
      title: '确认删除',
      content: `确定要删除API密钥 "${apiKey.name}" 吗？此操作不可恢复。`,
      icon: <ExclamationCircleOutlined />,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await ApiService.delete(`/merchant/api-keys/${apiKey.id}`);
          if (response.success) {
            message.success('API密钥删除成功');
            loadApiKeys();
          }
        } catch (error) {
          message.error('删除API密钥失败');
        }
      }
    });
  };

  // 重新生成API密钥
  const handleRegenerateApiKey = (apiKey: any) => {
    confirm({
      title: '确认重新生成',
      content: `确定要重新生成API密钥 "${apiKey.name}" 吗？旧密钥将立即失效。`,
      icon: <ExclamationCircleOutlined />,
      okText: '确认重新生成',
      okType: 'primary',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await ApiService.post(`/merchant/api-keys/${apiKey.id}/regenerate`);
          if (response.success) {
            message.success('API密钥重新生成成功');
            loadApiKeys();
          }
        } catch (error) {
          message.error('重新生成API密钥失败');
        }
      }
    });
  };

  // 复制API密钥
  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      message.success('API密钥已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  // 编辑API密钥
  const handleEditApiKey = (apiKey: any) => {
    setEditingApiKey(apiKey);
    apiForm.setFieldsValue(apiKey);
    setApiModalVisible(true);
  };

  // 切换API密钥状态
  const handleToggleApiKeyStatus = async (apiKey: any) => {
    try {
      const response = await ApiService.put(`/merchant/api-keys/${apiKey.id}/status`, {
        status: apiKey.status === 'active' ? 'inactive' : 'active'
      });
      if (response.success) {
        message.success(`API密钥已${apiKey.status === 'active' ? '禁用' : '启用'}`);
        loadApiKeys();
      }
    } catch (error) {
      message.error('状态切换失败');
    }
  };

  useEffect(() => {
    loadSettings();
    loadApiKeys();
    loadLoginLogs();
  }, []);

  if (loading && !settings.id) {
    return (
      <div className="merchant-settings">
        <div className="loading-container">
          <Spin size="large" />
          <p>加载设置信息中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="merchant-settings">
      {/* 页面头部 */}
      <div className="page-header">
        <div className="header-left">
          <Title level={2}>账户设置</Title>
          <Text type="secondary">管理您的账户设置、通知偏好和安全选项</Text>
        </div>
        <div className="header-right">
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            loading={loading}
            onClick={handleSaveSettings}
          >
            保存设置
          </Button>
        </div>
      </div>

      {/* 设置选项卡 */}
      <Card className="settings-card">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          className="settings-tabs"
        >
          {/* 通用设置 */}
          <TabPane tab={<span><SettingOutlined />通用设置</span>} key="general">
            <Form
              form={form}
              layout="vertical"
              className="settings-form"
            >
              <Row gutter={[24, 0]}>
                <Col xs={24} lg={12}>
                  <Card title="基本设置" size="small" className="sub-card">
                    <Form.Item
                      label="时区设置"
                      name="timezone"
                    >
                      <Select placeholder="请选择时区">
                        <Option value="Asia/Shanghai">中国标准时间 (UTC+8)</Option>
                        <Option value="UTC">协调世界时 (UTC+0)</Option>
                        <Option value="America/New_York">美国东部时间 (UTC-5)</Option>
                        <Option value="Europe/London">英国时间 (UTC+0)</Option>
                      </Select>
                    </Form.Item>
                    
                    <Form.Item
                      label="语言设置"
                      name="language"
                    >
                      <Select placeholder="请选择语言">
                        <Option value="zh-CN">简体中文</Option>
                        <Option value="en-US">English</Option>
                        <Option value="ja-JP">日本語</Option>
                      </Select>
                    </Form.Item>
                    
                    <Form.Item
                      label="数据刷新间隔"
                      name="refreshInterval"
                    >
                      <Select placeholder="请选择刷新间隔">
                        <Option value={5}>5秒</Option>
                        <Option value={10}>10秒</Option>
                        <Option value={30}>30秒</Option>
                        <Option value={60}>1分钟</Option>
                        <Option value={300}>5分钟</Option>
                      </Select>
                    </Form.Item>
                    
                    <Form.Item
                      label="主题模式"
                      name="theme"
                    >
                      <Radio.Group>
                        <Radio value="light">浅色模式</Radio>
                        <Radio value="dark">深色模式</Radio>
                        <Radio value="auto">跟随系统</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Card>
                </Col>
                
                <Col xs={24} lg={12}>
                  <Card title="显示设置" size="small" className="sub-card">
                    <Form.Item
                      label="每页显示数量"
                      name="pageSize"
                    >
                      <InputNumber
                        min={10}
                        max={100}
                        step={10}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                    
                    <Form.Item
                      label="图表动画"
                      name="chartAnimation"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    
                    <Form.Item
                      label="显示网格线"
                      name="showGridLines"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    
                    <Form.Item
                      label="自动保存"
                      name="autoSave"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Card>
                </Col>
              </Row>
            </Form>
          </TabPane>

          {/* 通知设置 */}
          <TabPane tab={<span><BellOutlined />通知设置</span>} key="notifications">
            <Form
              form={form}
              layout="vertical"
              className="settings-form"
            >
              <Row gutter={[24, 0]}>
                <Col xs={24} lg={12}>
                  <Card title="通知类型" size="small" className="sub-card">
                    <div className="notification-item">
                      <div className="notification-info">
                        <Text strong>设备告警通知</Text>
                        <Text type="secondary" className="notification-desc">
                          设备异常、离线等告警信息
                        </Text>
                      </div>
                      <Form.Item
                        name={['notifications', 'deviceAlert']}
                        valuePropName="checked"
                        noStyle
                      >
                        <Switch />
                      </Form.Item>
                    </div>
                    
                    <Divider />
                    
                    <div className="notification-item">
                      <div className="notification-info">
                        <Text strong>数据异常通知</Text>
                        <Text type="secondary" className="notification-desc">
                          数据超出阈值、数据丢失等异常
                        </Text>
                      </div>
                      <Form.Item
                        name={['notifications', 'dataAlert']}
                        valuePropName="checked"
                        noStyle
                      >
                        <Switch />
                      </Form.Item>
                    </div>
                    
                    <Divider />
                    
                    <div className="notification-item">
                      <div className="notification-info">
                        <Text strong>系统消息</Text>
                        <Text type="secondary" className="notification-desc">
                          系统更新、维护通知等
                        </Text>
                      </div>
                      <Form.Item
                        name={['notifications', 'systemMessage']}
                        valuePropName="checked"
                        noStyle
                      >
                        <Switch />
                      </Form.Item>
                    </div>
                    
                    <Divider />
                    
                    <div className="notification-item">
                      <div className="notification-info">
                        <Text strong>营销消息</Text>
                        <Text type="secondary" className="notification-desc">
                          产品更新、活动推广等信息
                        </Text>
                      </div>
                      <Form.Item
                        name={['notifications', 'marketing']}
                        valuePropName="checked"
                        noStyle
                      >
                        <Switch />
                      </Form.Item>
                    </div>
                  </Card>
                </Col>
                
                <Col xs={24} lg={12}>
                  <Card title="通知方式" size="small" className="sub-card">
                    <Form.Item
                      label="邮件通知"
                      name={['notifications', 'email']}
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    
                    <Form.Item
                      label="短信通知"
                      name={['notifications', 'sms']}
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    
                    <Form.Item
                      label="免打扰时间"
                      name={['notifications', 'quietHours']}
                    >
                      <TimePicker.RangePicker
                        format="HH:mm"
                        placeholder={['开始时间', '结束时间']}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                    
                    <Form.Item
                      label="通知频率限制"
                      name={['notifications', 'frequency']}
                    >
                      <Select placeholder="请选择通知频率">
                        <Option value="realtime">实时通知</Option>
                        <Option value="5min">5分钟汇总</Option>
                        <Option value="15min">15分钟汇总</Option>
                        <Option value="1hour">1小时汇总</Option>
                        <Option value="daily">每日汇总</Option>
                      </Select>
                    </Form.Item>
                  </Card>
                </Col>
              </Row>
            </Form>
          </TabPane>

          {/* 安全设置 */}
          <TabPane tab={<span><SafetyOutlined />安全设置</span>} key="security">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="登录安全" size="small" className="sub-card">
                  <Form
                    form={form}
                    layout="vertical"
                  >
                    <Form.Item
                      label="双因素认证"
                      name={['security', 'twoFactor']}
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    
                    <Form.Item
                      label="登录IP限制"
                      name={['security', 'ipRestriction']}
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    
                    <Form.Item
                      label="允许的IP地址"
                      name={['security', 'allowedIps']}
                    >
                      <TextArea
                        rows={4}
                        placeholder="每行一个IP地址或IP段，例如：\n192.168.1.100\n192.168.1.0/24"
                      />
                    </Form.Item>
                    
                    <Form.Item
                      label="会话超时时间"
                      name={['security', 'sessionTimeout']}
                    >
                      <Select placeholder="请选择会话超时时间">
                        <Option value={30}>30分钟</Option>
                        <Option value={60}>1小时</Option>
                        <Option value={240}>4小时</Option>
                        <Option value={480}>8小时</Option>
                        <Option value={1440}>24小时</Option>
                      </Select>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
              
              <Col xs={24} lg={12}>
                <Card title="登录日志" size="small" className="sub-card">
                  <List
                    dataSource={loginLogs.slice(0, 5)}
                    renderItem={(log: any) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              icon={log.success ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                              style={{
                                backgroundColor: log.success ? '#52c41a' : '#ff4d4f'
                              }}
                            />
                          }
                          title={
                            <div className="log-title">
                              <Text>{log.success ? '登录成功' : '登录失败'}</Text>
                              <Text type="secondary" className="log-time">
                                {new Date(log.createdAt).toLocaleString()}
                              </Text>
                            </div>
                          }
                          description={
                            <div className="log-details">
                              <Text type="secondary">IP: {log.ip}</Text>
                              <Text type="secondary">设备: {log.userAgent}</Text>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                  {loginLogs.length > 5 && (
                    <div className="view-more">
                      <Button type="link" size="small">
                        查看更多登录记录
                      </Button>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* API管理 */}
          <TabPane tab={<span><ApiOutlined />API管理</span>} key="api">
            <div className="api-management">
              <div className="api-header">
                <div className="api-info">
                  <Title level={4}>API密钥管理</Title>
                  <Text type="secondary">管理您的API访问密钥，用于第三方系统集成</Text>
                </div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingApiKey(null);
                    apiForm.resetFields();
                    setApiModalVisible(true);
                  }}
                >
                  创建API密钥
                </Button>
              </div>
              
              <Alert
                message="安全提示"
                description="请妥善保管您的API密钥，不要在公开场所或代码中暴露密钥信息。如发现密钥泄露，请立即重新生成。"
                type="warning"
                showIcon
                className="security-alert"
              />
              
              <List
                dataSource={apiKeys}
                renderItem={(apiKey: any) => (
                  <List.Item
                    actions={[
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditApiKey(apiKey)}
                      >
                        编辑
                      </Button>,
                      <Button
                        type="text"
                        icon={<CopyOutlined />}
                        onClick={() => handleCopyApiKey(apiKey.key)}
                      >
                        复制
                      </Button>,
                      <Button
                        type="text"
                        icon={<ReloadOutlined />}
                        onClick={() => handleRegenerateApiKey(apiKey)}
                      >
                        重新生成
                      </Button>,
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteApiKey(apiKey)}
                      >
                        删除
                      </Button>
                    ]}
                    className="api-key-item"
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar icon={<KeyOutlined />} className="api-avatar" />
                      }
                      title={
                        <div className="api-title">
                          <Text strong>{apiKey.name}</Text>
                          <div className="api-badges">
                            <Badge
                              status={apiKey.status === 'active' ? 'success' : 'default'}
                              text={apiKey.status === 'active' ? '活跃' : '禁用'}
                            />
                            <Switch
                              size="small"
                              checked={apiKey.status === 'active'}
                              onChange={() => handleToggleApiKeyStatus(apiKey)}
                            />
                          </div>
                        </div>
                      }
                      description={
                        <div className="api-description">
                          <Paragraph
                            copyable={{
                              text: apiKey.key,
                              tooltips: ['复制密钥', '已复制']
                            }}
                            className="api-key"
                          >
                            {apiKey.key.substring(0, 20)}...{apiKey.key.substring(apiKey.key.length - 8)}
                          </Paragraph>
                          <div className="api-meta">
                            <Text type="secondary">权限: {apiKey.permissions?.join(', ')}</Text>
                            <Text type="secondary">创建时间: {new Date(apiKey.createdAt).toLocaleDateString()}</Text>
                            <Text type="secondary">最后使用: {apiKey.lastUsedAt ? new Date(apiKey.lastUsedAt).toLocaleString() : '从未使用'}</Text>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* API密钥创建/编辑模态框 */}
      <Modal
        title={editingApiKey ? '编辑API密钥' : '创建API密钥'}
        open={apiModalVisible}
        onCancel={() => {
          setApiModalVisible(false);
          setEditingApiKey(null);
          apiForm.resetFields();
        }}
        footer={[
          <Button key="cancel" onClick={() => setApiModalVisible(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={editingApiKey ? handleUpdateApiKey : handleCreateApiKey}
          >
            {editingApiKey ? '更新' : '创建'}
          </Button>
        ]}
        className="api-modal"
      >
        <Form
          form={apiForm}
          layout="vertical"
        >
          <Form.Item
            label="密钥名称"
            name="name"
            rules={[{ required: true, message: '请输入密钥名称' }]}
          >
            <Input placeholder="请输入密钥名称" />
          </Form.Item>
          
          <Form.Item
            label="描述"
            name="description"
          >
            <TextArea
              rows={3}
              placeholder="请输入密钥描述（可选）"
            />
          </Form.Item>
          
          <Form.Item
            label="权限"
            name="permissions"
            rules={[{ required: true, message: '请选择权限' }]}
          >
            <Checkbox.Group>
              <Row>
                <Col span={12}>
                  <Checkbox value="device:read">设备读取</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="device:write">设备写入</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="data:read">数据读取</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="data:write">数据写入</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="analytics:read">分析读取</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="reports:read">报表读取</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
          
          <Form.Item
            label="过期时间"
            name="expiresAt"
          >
            <Select placeholder="请选择过期时间">
              <Option value={null}>永不过期</Option>
              <Option value={30}>30天</Option>
              <Option value={90}>90天</Option>
              <Option value={180}>180天</Option>
              <Option value={365}>1年</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MerchantSettings;