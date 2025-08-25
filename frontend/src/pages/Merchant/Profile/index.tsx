import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  Row,
  Col,
  Divider,
  message,
  Spin,
  Space,
  Typography,
  Tag,
  Descriptions,
  Modal,
  Switch,
  Select,
  DatePicker,
  InputNumber
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  UploadOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  BankOutlined,
  SafetyOutlined,
  SettingOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import { ApiService } from '../../../services/api';
import './index.css';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

/**
 * 商户信息管理页面组件
 * 提供商户基本信息查看和编辑功能
 */
const MerchantProfile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [merchantInfo, setMerchantInfo] = useState<any>(null);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<any>({});

  // 加载商户信息
  const loadMerchantInfo = async () => {
    try {
      setLoading(true);
      const response = await ApiService.get('/merchant/profile');
      if (response.success) {
        setMerchantInfo(response.data);
        setAvatarUrl(response.data.avatar || '');
        setNotificationSettings(response.data.notificationSettings || {});
        form.setFieldsValue({
          ...response.data,
          establishedDate: response.data.establishedDate ? new Date(response.data.establishedDate) : null
        });
      }
    } catch (error) {
      message.error('加载商户信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 保存商户信息
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const updateData = {
        ...values,
        avatar: avatarUrl,
        establishedDate: values.establishedDate?.toISOString(),
        notificationSettings
      };
      
      const response = await ApiService.put('/merchant/profile', updateData);
      if (response.success) {
        message.success('商户信息更新成功');
        setEditing(false);
        loadMerchantInfo();
      }
    } catch (error) {
      message.error('更新商户信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 修改密码
  const handlePasswordChange = async () => {
    try {
      const values = await passwordForm.validateFields();
      setLoading(true);
      
      const response = await ApiService.put('/merchant/password', {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      
      if (response.success) {
        message.success('密码修改成功');
        setPasswordModalVisible(false);
        passwordForm.resetFields();
      }
    } catch (error) {
      message.error('密码修改失败');
    } finally {
      setLoading(false);
    }
  };

  // 头像上传处理
  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    try {
      const response = await ApiService.post('/upload/avatar', formData);
      if (response.success) {
        setAvatarUrl(response.data.url);
        message.success('头像上传成功');
      }
    } catch (error) {
      message.error('头像上传失败');
    }
    
    return false; // 阻止默认上传行为
  };

  // 通知设置更新
  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: value
    });
  };

  useEffect(() => {
    loadMerchantInfo();
  }, []);

  if (loading && !merchantInfo) {
    return (
      <div className="merchant-profile">
        <div className="loading-container">
          <Spin size="large" />
          <p>加载商户信息中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="merchant-profile">
      {/* 页面头部 */}
      <div className="page-header">
        <div className="header-left">
          <Title level={2}>商户信息</Title>
          <Text type="secondary">管理您的商户基本信息和账户设置</Text>
        </div>
        <div className="header-right">
          <Space>
            <Button
              icon={<SafetyOutlined />}
              onClick={() => setPasswordModalVisible(true)}
            >
              修改密码
            </Button>
            {editing ? (
              <>
                <Button onClick={() => setEditing(false)}>取消</Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={loading}
                  onClick={handleSave}
                >
                  保存
                </Button>
              </>
            ) : (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setEditing(true)}
              >
                编辑信息
              </Button>
            )}
          </Space>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* 基本信息 */}
        <Col xs={24} lg={16}>
          <Card title="基本信息" className="info-card">
            <Form
              form={form}
              layout="vertical"
              disabled={!editing}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="商户名称"
                    name="name"
                    rules={[{ required: true, message: '请输入商户名称' }]}
                  >
                    <Input prefix={<BankOutlined />} placeholder="请输入商户名称" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="商户编码"
                    name="code"
                  >
                    <Input disabled placeholder="系统自动生成" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="联系人"
                    name="contactPerson"
                    rules={[{ required: true, message: '请输入联系人姓名' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="请输入联系人姓名" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="联系电话"
                    name="phone"
                    rules={[
                      { required: true, message: '请输入联系电话' },
                      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                    ]}
                  >
                    <Input prefix={<PhoneOutlined />} placeholder="请输入联系电话" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="邮箱地址"
                    name="email"
                    rules={[
                      { required: true, message: '请输入邮箱地址' },
                      { type: 'email', message: '请输入正确的邮箱格式' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="请输入邮箱地址" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="行业类型"
                    name="industry"
                  >
                    <Select placeholder="请选择行业类型">
                      <Option value="manufacturing">制造业</Option>
                      <Option value="agriculture">农业</Option>
                      <Option value="logistics">物流运输</Option>
                      <Option value="energy">能源电力</Option>
                      <Option value="healthcare">医疗健康</Option>
                      <Option value="education">教育培训</Option>
                      <Option value="retail">零售商贸</Option>
                      <Option value="finance">金融服务</Option>
                      <Option value="other">其他</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="成立时间"
                    name="establishedDate"
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder="请选择成立时间"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="员工规模"
                    name="employeeCount"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="请输入员工数量"
                      min={1}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="详细地址"
                name="address"
              >
                <Input prefix={<EnvironmentOutlined />} placeholder="请输入详细地址" />
              </Form.Item>

              <Form.Item
                label="商户描述"
                name="description"
              >
                <TextArea
                  rows={4}
                  placeholder="请输入商户描述信息"
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* 侧边信息 */}
        <Col xs={24} lg={8}>
          {/* 头像信息 */}
          <Card title="头像设置" className="avatar-card">
            <div className="avatar-section">
              <Avatar
                size={120}
                src={avatarUrl}
                icon={<UserOutlined />}
                className="merchant-avatar"
              />
              {editing && (
                <Upload
                  showUploadList={false}
                  beforeUpload={handleAvatarUpload}
                  accept="image/*"
                >
                  <Button
                    icon={<UploadOutlined />}
                    className="upload-btn"
                  >
                    更换头像
                  </Button>
                </Upload>
              )}
            </div>
          </Card>

          {/* 账户状态 */}
          <Card title="账户状态" className="status-card">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="账户状态">
                <Tag color={merchantInfo?.status === 'active' ? 'green' : 'red'}>
                  {merchantInfo?.status === 'active' ? '正常' : '禁用'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {merchantInfo?.createdAt ? new Date(merchantInfo.createdAt).toLocaleDateString() : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="最后登录">
                {merchantInfo?.lastLoginAt ? new Date(merchantInfo.lastLoginAt).toLocaleString() : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="设备数量">
                <Text strong>{merchantInfo?.deviceCount || 0}</Text> 台
              </Descriptions.Item>
              <Descriptions.Item label="数据量">
                <Text strong>{merchantInfo?.dataCount || 0}</Text> 条
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 通知设置 */}
          <Card title="通知设置" className="notification-card">
            <div className="notification-settings">
              <div className="setting-item">
                <div className="setting-label">
                  <Text>设备告警通知</Text>
                  <Text type="secondary" className="setting-desc">
                    设备异常时发送通知
                  </Text>
                </div>
                <Switch
                  checked={notificationSettings.deviceAlert}
                  onChange={(checked) => handleNotificationChange('deviceAlert', checked)}
                  disabled={!editing}
                />
              </div>
              
              <Divider />
              
              <div className="setting-item">
                <div className="setting-label">
                  <Text>数据异常通知</Text>
                  <Text type="secondary" className="setting-desc">
                    数据异常时发送通知
                  </Text>
                </div>
                <Switch
                  checked={notificationSettings.dataAlert}
                  onChange={(checked) => handleNotificationChange('dataAlert', checked)}
                  disabled={!editing}
                />
              </div>
              
              <Divider />
              
              <div className="setting-item">
                <div className="setting-label">
                  <Text>系统消息通知</Text>
                  <Text type="secondary" className="setting-desc">
                    系统更新和维护通知
                  </Text>
                </div>
                <Switch
                  checked={notificationSettings.systemMessage}
                  onChange={(checked) => handleNotificationChange('systemMessage', checked)}
                  disabled={!editing}
                />
              </div>
              
              <Divider />
              
              <div className="setting-item">
                <div className="setting-label">
                  <Text>邮件通知</Text>
                  <Text type="secondary" className="setting-desc">
                    通过邮件接收通知
                  </Text>
                </div>
                <Switch
                  checked={notificationSettings.emailNotification}
                  onChange={(checked) => handleNotificationChange('emailNotification', checked)}
                  disabled={!editing}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 修改密码模态框 */}
      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={[
          <Button key="cancel" onClick={() => setPasswordModalVisible(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handlePasswordChange}
          >
            确认修改
          </Button>
        ]}
        className="password-modal"
      >
        <Form
          form={passwordForm}
          layout="vertical"
        >
          <Form.Item
            label="当前密码"
            name="oldPassword"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password
              placeholder="请输入当前密码"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度至少6位' },
              { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/, message: '密码必须包含大小写字母和数字' }
            ]}
          >
            <Input.Password
              placeholder="请输入新密码"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          
          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                }
              })
            ]}
          >
            <Input.Password
              placeholder="请再次输入新密码"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MerchantProfile;