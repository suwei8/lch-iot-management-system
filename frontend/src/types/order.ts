/**
 * 订单相关类型定义
 */

/**
 * 订单状态枚举
 */
export type OrderStatus = 
  | 'draft'      // 草稿
  | 'pending'    // 待支付
  | 'paid'       // 已支付
  | 'using'      // 使用中
  | 'completed'  // 已完成
  | 'cancelled'  // 已取消
  | 'refunded';  // 已退款

/**
 * 洗车类型枚举
 */
export type WashType = 
  | 'basic'      // 基础洗车
  | 'premium'    // 精洗
  | 'deluxe';    // 豪华洗车

/**
 * 支付方式枚举
 */
export type PaymentMethod = 
  | 'wechat'     // 微信支付
  | 'alipay'     // 支付宝
  | 'balance';   // 余额支付

/**
 * 订单接口
 */
export interface Order {
  /** 订单ID */
  id: number;
  
  /** 订单号 */
  orderNo: string;
  
  /** 用户ID */
  userId: number;
  
  /** 商户ID */
  merchantId: number;
  
  /** 设备ID */
  deviceId: number;
  
  /** 门店ID */
  storeId: number;
  
  /** 订单金额（分） */
  amount: number;
  
  /** 订单状态 */
  status: OrderStatus;
  
  /** 洗车类型 */
  washType: WashType;
  
  /** 洗车时长（分钟） */
  duration: number;
  
  /** 开始时间 */
  startTime?: string;
  
  /** 结束时间 */
  endTime?: string;
  
  /** 支付时间 */
  paidAt?: string;
  
  /** 支付方式 */
  paymentMethod?: PaymentMethod;
  
  /** 支付订单号 */
  paymentOrderNo?: string;
  
  /** 第三方订单号 */
  thirdPartyOrderNumber?: string;
  
  /** 订单备注 */
  remark?: string;
  
  /** 创建时间 */
  createdAt: string;
  
  /** 更新时间 */
  updatedAt: string;
  
  /** 用户信息 */
  user?: {
    id: number;
    phone: string;
    nickname: string;
    balance: number;
  };
  
  /** 商户信息 */
  merchant?: {
    id: number;
    name: string;
    code: string;
  };
  
  /** 设备信息 */
  device?: {
    id: number;
    deviceId: string;
    name: string;
    type: string;
    status: string;
  };
  
  /** 门店信息 */
  store?: {
    id: number;
    name: string;
    code: string;
    address: string;
  };
}

/**
 * 创建订单请求
 */
export interface CreateOrderRequest {
  /** 设备ID */
  deviceId: number;
  
  /** 洗车类型 */
  washType: WashType;
  
  /** 洗车时长（分钟） */
  duration: number;
  
  /** 订单金额 */
  amount: number;
  
  /** 备注 */
  remark?: string;
}

/**
 * 更新订单请求
 */
export interface UpdateOrderRequest {
  /** 订单状态 */
  status?: OrderStatus;
  
  /** 支付方式 */
  paymentMethod?: PaymentMethod;
  
  /** 第三方订单号 */
  thirdPartyOrderNumber?: string;
  
  /** 实际洗车时长（分钟） */
  duration?: number;
  
  /** 备注 */
  remark?: string;
  
  /** 退款金额 */
  refundAmount?: number;
  
  /** 退款原因 */
  refundReason?: string;
}

/**
 * 支付订单请求
 */
export interface PayOrderRequest {
  /** 支付方式 */
  paymentMethod: PaymentMethod;
}

/**
 * 订单查询参数
 */
export interface OrderQueryParams {
  /** 页码 */
  page?: number;
  
  /** 每页数量 */
  limit?: number;
  
  /** 搜索关键词 */
  search?: string;
  
  /** 商户ID */
  merchantId?: number;
  
  /** 门店ID */
  storeId?: number;
  
  /** 订单状态 */
  status?: OrderStatus;
  
  /** 用户ID */
  userId?: number;
  
  /** 开始日期 */
  startDate?: string;
  
  /** 结束日期 */
  endDate?: string;
}

/**
 * 订单统计数据
 */
export interface OrderStats {
  /** 总订单数 */
  totalOrders: number;
  
  /** 已完成订单数 */
  completedOrders: number;
  
  /** 总金额 */
  totalAmount: number;
  
  /** 今日订单数 */
  todayOrders: number;
  
  /** 今日收入 */
  todayRevenue: number;
  
  /** 本月订单数 */
  monthlyOrders: number;
  
  /** 本月收入 */
  monthlyRevenue: number;
}

/**
 * 订单状态选项
 */
export const ORDER_STATUS_OPTIONS = [
  { label: '草稿', value: 'draft', color: 'default' },
  { label: '待支付', value: 'pending', color: 'orange' },
  { label: '已支付', value: 'paid', color: 'blue' },
  { label: '使用中', value: 'using', color: 'processing' },
  { label: '已完成', value: 'completed', color: 'success' },
  { label: '已取消', value: 'cancelled', color: 'default' },
  { label: '已退款', value: 'refunded', color: 'warning' },
];

/**
 * 洗车类型选项
 */
export const WASH_TYPE_OPTIONS = [
  { label: '基础洗车', value: 'basic', price: 10 },
  { label: '精洗', value: 'premium', price: 20 },
  { label: '豪华洗车', value: 'deluxe', price: 30 },
];

/**
 * 支付方式选项
 */
export const PAYMENT_METHOD_OPTIONS = [
  { label: '微信支付', value: 'wechat' },
  { label: '支付宝', value: 'alipay' },
  { label: '余额支付', value: 'balance' },
];