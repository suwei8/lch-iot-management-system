import { ApiService } from './api';
import { 
  Order, 
  CreateOrderRequest, 
  UpdateOrderRequest, 
  PayOrderRequest,
  OrderQueryParams,
  OrderStats
} from '../types/order';
import { ApiResponse, PaginatedResponse } from '../types/api';

/**
 * 订单服务类
 * 处理订单相关的API调用
 */
export class OrderService {
  private static instance: OrderService;

  private constructor() {}

  /**
   * 获取订单服务单例
   */
  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  /**
   * 获取订单列表（管理员）
   * @param params 查询参数
   */
  async getOrders(params?: OrderQueryParams): Promise<ApiResponse<PaginatedResponse<Order>>> {
    try {
      const response = await ApiService.get('/admin/orders', params);
      return {
        success: true,
        data: response.data,
        message: '获取订单列表成功',
        code: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: {
          data: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        message: error.response?.data?.message || '获取订单列表失败',
        code: error.response?.status || 500
      };
    }
  }

  /**
   * 获取商户订单列表
   * @param params 查询参数
   */
  async getMerchantOrders(params?: OrderQueryParams): Promise<ApiResponse<PaginatedResponse<Order>>> {
    try {
      const response = await ApiService.get('/merchant/orders', params);
      return {
        success: true,
        data: response.data,
        message: '获取订单列表成功',
        code: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: {
          data: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        message: error.response?.data?.message || '获取订单列表失败',
        code: error.response?.status || 500
      };
    }
  }

  /**
   * 根据ID获取订单详情
   * @param id 订单ID
   */
  async getOrderById(id: number): Promise<ApiResponse<Order>> {
    try {
      const response = await ApiService.get(`/orders/${id}`);
      return {
        success: true,
        data: response.data,
        message: '获取订单详情成功',
        code: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as Order,
        message: error.response?.data?.message || '获取订单详情失败',
        code: error.response?.status || 500
      };
    }
  }

  /**
   * 创建新订单
   * @param orderData 订单数据
   */
  async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<Order>> {
    try {
      const response = await ApiService.post('/orders', orderData);
      return {
        success: true,
        data: response.data,
        message: '创建订单成功',
        code: 201
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as Order,
        message: error.response?.data?.message || '创建订单失败',
        code: error.response?.status || 500
      };
    }
  }

  /**
   * 更新订单信息
   * @param id 订单ID
   * @param orderData 更新的订单数据
   */
  async updateOrder(id: number, orderData: UpdateOrderRequest): Promise<ApiResponse<Order>> {
    try {
      const response = await ApiService.patch(`/orders/${id}`, orderData);
      return {
        success: true,
        data: response.data,
        message: '更新订单成功',
        code: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as Order,
        message: error.response?.data?.message || '更新订单失败',
        code: error.response?.status || 500
      };
    }
  }

  /**
   * 支付订单
   * @param orderNo 订单号
   * @param paymentData 支付数据
   */
  async payOrder(orderNo: string, paymentData: PayOrderRequest): Promise<ApiResponse<Order>> {
    try {
      const response = await ApiService.post(`/orders/${orderNo}/pay`, paymentData);
      return {
        success: true,
        data: response.data,
        message: '支付订单成功',
        code: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as Order,
        message: error.response?.data?.message || '支付订单失败',
        code: error.response?.status || 500
      };
    }
  }

  /**
   * 取消订单
   * @param id 订单ID
   */
  async cancelOrder(id: number): Promise<ApiResponse<Order>> {
    try {
      const response = await ApiService.patch(`/orders/${id}`, { status: 'cancelled' });
      return {
        success: true,
        data: response.data,
        message: '取消订单成功',
        code: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as Order,
        message: error.response?.data?.message || '取消订单失败',
        code: error.response?.status || 500
      };
    }
  }

  /**
   * 退款订单
   * @param id 订单ID
   * @param refundData 退款数据
   */
  async refundOrder(id: number, refundData: { refundAmount: number; refundReason: string }): Promise<ApiResponse<Order>> {
    try {
      const response = await ApiService.patch(`/orders/${id}`, {
        status: 'refunded',
        ...refundData
      });
      return {
        success: true,
        data: response.data,
        message: '退款订单成功',
        code: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as Order,
        message: error.response?.data?.message || '退款订单失败',
        code: error.response?.status || 500
      };
    }
  }

  /**
   * 导出订单数据
   * @param params 导出参数
   */
  async exportOrders(params?: {
    format?: 'excel' | 'csv';
    status?: string;
    merchantId?: number;
    storeId?: number;
    dateRange?: [string, string];
  }): Promise<ApiResponse<{ downloadUrl: string }>> {
    try {
      const response = await ApiService.post('/admin/orders/export', params);
      return {
        success: true,
        data: response.data,
        message: '导出订单数据成功',
        code: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: { downloadUrl: '' },
        message: error.response?.data?.message || '导出订单数据失败',
        code: error.response?.status || 500
      };
    }
  }

  /**
   * 获取订单统计数据
   * @param params 统计参数
   */
  async getOrderStats(params?: {
    merchantId?: number;
    storeId?: number;
    dateRange?: [string, string];
  }): Promise<ApiResponse<OrderStats>> {
    try {
      const response = await ApiService.get('/admin/orders/stats', params);
      return {
        success: true,
        data: response.data,
        message: '获取订单统计成功',
        code: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: {
          totalOrders: 0,
          completedOrders: 0,
          totalAmount: 0,
          todayOrders: 0,
          todayRevenue: 0,
          monthlyOrders: 0,
          monthlyRevenue: 0
        },
        message: error.response?.data?.message || '获取订单统计失败',
        code: error.response?.status || 500
      };
    }
  }

  /**
   * 获取用户订单统计
   * @param userId 用户ID
   */
  async getUserOrderStats(userId: number): Promise<ApiResponse<OrderStats>> {
    try {
      const response = await ApiService.get(`/orders/user/${userId}/stats`);
      return {
        success: true,
        data: response.data,
        message: '获取用户订单统计成功',
        code: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: {
          totalOrders: 0,
          completedOrders: 0,
          totalAmount: 0,
          todayOrders: 0,
          todayRevenue: 0,
          monthlyOrders: 0,
          monthlyRevenue: 0
        },
        message: error.response?.data?.message || '获取用户订单统计失败',
        code: error.response?.status || 500
      };
    }
  }
}

// 导出订单服务实例
export const orderService = OrderService.getInstance();