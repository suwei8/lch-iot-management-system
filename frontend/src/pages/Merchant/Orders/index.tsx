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
  Row,
  Col,
  Statistic,
  DatePicker,
  Tooltip,
  Badge
} from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  ShopOutlined,
  UserOutlined,
  MobileOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { 
  Order, 
  OrderQueryParams, 
  OrderStats,
  OrderStatus,
  ORDER_STATUS_OPTIONS,
  WASH_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  UpdateOrderRequest
} from '../../../types/order';
import { orderService } from '../../../services/orderService';
import { storeService } from '../../../services/storeService';
import { Store } from '../../../types';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

/**
 * 商户订单管理页面
 * 提供商户查看自己门店的订单列表、搜索筛选、详情查看等功能
 */
const MerchantOrders: React.FC = () => {
  // 状态管理
  const [orders, setOrders] = useState<Order[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedStore, setSelectedStore] = useState<number>();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    completedOrders: 0,
    totalAmount: 0,
    todayOrders: 0,
    todayRevenue: 0,
    monthlyOrders: 0,
    monthlyRevenue: 0
  });

  // 弹窗状态
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // 表单实例
  const [editForm] = Form.useForm();

  /**
   * 获取商户订单列表
   */
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: OrderQueryParams = {
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        status: (selectedStatus as OrderStatus) || undefined,
        storeId: selectedStore,
        startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: dateRange?.[1]?.format('YYYY-MM-DD')
      };

      const response = await orderService.getMerchantOrders(params);
      if (response.success) {
        setOrders(response.data.data);
        setTotal(response.data.total);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('获取订单列表失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取商户门店列表
   */
  const fetchStores = async () => {
    try {
      const response = await storeService.getStores({ limit: 100 });
      if (response.success) {
        setStores(response.data.stores);
      }
    } catch (error) {
      console.error('获取门店列表失败:', error);
    }
  };

  /**
   * 获取统计数据
   */
  const fetchStats = async () => {
    try {
      const response = await orderService.getOrderStats({
        storeId: selectedStore,
        dateRange: dateRange ? [dateRange[0].format('YYYY-MM-DD'), dateRange[1].format('YYYY-MM-DD')] : undefined
      });
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  /**
   * 查看订单详情
   */
  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailVisible(true);
  };

  /**
   * 编辑订单（仅限状态和备注）
   */
  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    editForm.setFieldsValue({
      status: order.status,
      duration: order.duration,
      remark: order.remark
    });
    setEditVisible(true);
  };

  /**
   * 提交编辑
   */
  const handleEditSubmit = async () => {
    if (!selectedOrder) return;

    try {
      const values = await editForm.validateFields();
      const response = await orderService.updateOrder(selectedOrder.id, values as UpdateOrderRequest);
      
      if (response.success) {
        message.success('更新订单成功');
        setEditVisible(false);
        fetchOrders();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('更新订单失败');
    }
  };

  /**
   * 导出订单
   */
  const handleExport = async () => {
    try {
      const response = await orderService.exportOrders({
        format: 'excel',
        status: selectedStatus || undefined,
        storeId: selectedStore,
        dateRange: dateRange ? [dateRange[0].format('YYYY-MM-DD'), dateRange[1].format('YYYY-MM-DD')] : undefined
      });
      
      if (response.success && response.data.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank');
        message.success('导出成功');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('导出失败');
    }
  };

  /**
   * 重置筛选条件
   */
  const handleReset = () => {
    setSearchText('');
    setSelectedStatus('');
    setSelectedStore(undefined);
    setDateRange(null);
    setCurrentPage(1);
  };

  /**
   * 获取状态标签
   */
  const getStatusTag = (status: string) => {
    const statusOption = ORDER_STATUS_OPTIONS.find(option => option.value === status);
    return (
      <Tag color={statusOption?.color || 'default'}>
        {statusOption?.label || status}
      </Tag>
    );
  };

  /**
   * 获取洗车类型标签
   */
  const getWashTypeTag = (washType: string) => {
    const washOption = WASH_TYPE_OPTIONS.find(option => option.value === washType);
    return (
      <Tag color="blue">
        {washOption?.label || washType}
      </Tag>
    );
  };

  /**
   * 格式化金额
   */
  const formatAmount = (amount: number) => {
    return `¥${(amount / 100).toFixed(2)}`;
  };

  // 表格列定义
  const columns: ColumnsType<Order> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
      render: (orderNo: string) => (
        <Tooltip title={orderNo}>
          <span style={{ fontFamily: 'monospace' }}>{orderNo}</span>
        </Tooltip>
      )
    },
    {
      title: '用户信息',
      key: 'user',
      width: 150,
      render: (_, record) => (
        <div>
          <div>
            <UserOutlined /> {record.user?.nickname || '未知用户'}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <MobileOutlined /> {record.user?.phone || '未知手机号'}
          </div>
        </div>
      )
    },
    {
      title: '门店',
      key: 'store',
      width: 120,
      render: (_, record) => (
        <div>
          <ShopOutlined /> {record.store?.name || '未知门店'}
        </div>
      )
    },
    {
      title: '洗车类型',
      dataIndex: 'washType',
      key: 'washType',
      width: 100,
      render: (washType: string) => getWashTypeTag(washType)
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 80,
      render: (duration: number) => (
        <span>
          <ClockCircleOutlined /> {duration}分钟
        </span>
      )
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount: number) => (
        <span style={{ color: '#f50', fontWeight: 'bold' }}>
          <DollarOutlined /> {formatAmount(amount)}
        </span>
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
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (createdAt: string) => dayjs(createdAt).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="编辑订单">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // 组件挂载时获取数据
  useEffect(() => {
    fetchStores();
  }, []);

  // 筛选条件变化时重新获取数据
  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [currentPage, pageSize, searchText, selectedStatus, selectedStore, dateRange]);

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总订单数"
              value={stats.totalOrders}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成订单"
              value={stats.completedOrders}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日订单"
              value={stats.todayOrders}
              prefix={<SyncOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日收入"
              value={stats.todayRevenue / 100}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容卡片 */}
      <Card>
        {/* 搜索和筛选区域 */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col span={8}>
            <Search
              placeholder="搜索订单号或用户手机号"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={fetchOrders}
              enterButton={<SearchOutlined />}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="订单状态"
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
              style={{ width: '100%' }}
            >
              {ORDER_STATUS_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  <Badge color={option.color} text={option.label} />
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="选择门店"
              value={selectedStore}
              onChange={setSelectedStore}
              allowClear
              showSearch
              optionFilterProp="children"
              style={{ width: '100%' }}
            >
              {stores.map(store => (
                <Option key={store.id} value={store.id}>
                  {store.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs] | null)}
              style={{ width: '100%' }}
              placeholder={['开始日期', '结束日期']}
            />
          </Col>
        </Row>

        {/* 操作按钮区域 */}
        <Row justify="space-between" style={{ marginBottom: '16px' }}>
          <Col>
            <Space>
              <Button onClick={handleReset}>
                重置筛选
              </Button>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<ExportOutlined />}
                onClick={handleExport}
              >
                导出订单
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 订单列表表格 */}
        <Table<Order>
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
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

      {/* 订单详情抽屉 */}
      <Drawer
        title="订单详情"
        width={600}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
      >
        {selectedOrder && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="订单号">
              <span style={{ fontFamily: 'monospace' }}>{selectedOrder.orderNo}</span>
            </Descriptions.Item>
            <Descriptions.Item label="订单状态">
              {getStatusTag(selectedOrder.status)}
            </Descriptions.Item>
            <Descriptions.Item label="用户信息">
              <div>
                <div>昵称：{selectedOrder.user?.nickname || '未知用户'}</div>
                <div>手机号：{selectedOrder.user?.phone || '未知手机号'}</div>
                <div>余额：¥{((selectedOrder.user?.balance || 0) / 100).toFixed(2)}</div>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="门店信息">
              <div>
                <div>门店名称：{selectedOrder.store?.name || '未知门店'}</div>
                <div>门店地址：{selectedOrder.store?.address || '未知地址'}</div>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="设备信息">
              <div>
                <div>设备名称：{selectedOrder.device?.name || '未知设备'}</div>
                <div>设备ID：{selectedOrder.device?.deviceId || '未知ID'}</div>
                <div>设备状态：{selectedOrder.device?.status || '未知状态'}</div>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="洗车类型">
              {getWashTypeTag(selectedOrder.washType)}
            </Descriptions.Item>
            <Descriptions.Item label="洗车时长">
              {selectedOrder.duration} 分钟
            </Descriptions.Item>
            <Descriptions.Item label="订单金额">
              <span style={{ color: '#f50', fontWeight: 'bold', fontSize: '16px' }}>
                {formatAmount(selectedOrder.amount)}
              </span>
            </Descriptions.Item>
            {selectedOrder.paymentMethod && (
              <Descriptions.Item label="支付方式">
                {PAYMENT_METHOD_OPTIONS.find(option => option.value === selectedOrder.paymentMethod)?.label || selectedOrder.paymentMethod}
              </Descriptions.Item>
            )}
            {selectedOrder.paidAt && (
              <Descriptions.Item label="支付时间">
                {dayjs(selectedOrder.paidAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            )}
            {selectedOrder.startTime && (
              <Descriptions.Item label="开始时间">
                {dayjs(selectedOrder.startTime).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            )}
            {selectedOrder.endTime && (
              <Descriptions.Item label="结束时间">
                {dayjs(selectedOrder.endTime).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="创建时间">
              {dayjs(selectedOrder.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {dayjs(selectedOrder.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            {selectedOrder.remark && (
              <Descriptions.Item label="备注">
                {selectedOrder.remark}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Drawer>

      {/* 编辑订单弹窗 */}
      <Modal
        title="编辑订单"
        open={editVisible}
        onOk={handleEditSubmit}
        onCancel={() => setEditVisible(false)}
        width={500}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="status"
            label="订单状态"
            rules={[{ required: true, message: '请选择订单状态' }]}
          >
            <Select placeholder="请选择订单状态">
              {ORDER_STATUS_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  <Badge color={option.color} text={option.label} />
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="duration"
            label="实际洗车时长（分钟）"
            rules={[{ type: 'number', min: 1, message: '时长必须大于0' }]}
          >
            <Input type="number" placeholder="请输入实际洗车时长" />
          </Form.Item>
          
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MerchantOrders;