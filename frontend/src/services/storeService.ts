import { ApiService } from './api';
import { Store, CreateStoreRequest, UpdateStoreRequest, ApiResponse } from '../types';

/**
 * 门店服务类
 * 处理门店相关的API调用
 */
export class StoreService {
  private static instance: StoreService;

  private constructor() {}

  /**
   * 获取门店服务单例
   */
  public static getInstance(): StoreService {
    if (!StoreService.instance) {
      StoreService.instance = new StoreService();
    }
    return StoreService.instance;
  }

  /**
   * 获取门店列表
   * @param params 查询参数
   */
  async getStores(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    merchantId?: number;
  }): Promise<ApiResponse<{ stores: Store[]; total: number }>> {
    try {
      const response = await ApiService.get('/stores', { params });
      return {
        success: true,
        data: response.data,
        message: '获取门店列表成功',
        code: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: { stores: [], total: 0 },
        message: error.response?.data?.message || '获取门店列表失败',
        code: error.response?.status || 500
      };
    }
  }

  /**
   * 根据ID获取门店详情
   * @param id 门店ID
   */
  async getStoreById(id: number): Promise<ApiResponse<Store>> {
    try {
      const response = await ApiService.get(`/stores/${id}`);
      return {
        success: true,
        data: response.data,
        message: '获取门店详情成功',
        code: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as Store,
        message: error.response?.data?.message || '获取门店详情失败',
        code: error.response?.status || 500
      };
    }
  }

  /**
   * 创建新门店
   * @param storeData 门店数据
   */
  async createStore(storeData: CreateStoreRequest): Promise<ApiResponse<Store>> {
    try {
      const response = await ApiService.post('/stores', storeData);
      return {
        success: true,
        data: response.data,
        message: '创建门店成功',
        code: 201
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as Store,
        message: error.response?.data?.message || '创建门店失败',
        code: error.response?.status || 500
      };
    }
  }

  /**
   * 更新门店信息
   * @param id 门店ID
   * @param storeData 更新的门店数据
   */
  async updateStore(id: number, storeData: UpdateStoreRequest): Promise<ApiResponse<Store>> {
    try {
      const response = await ApiService.put(`/stores/${id}`, storeData);
      return {
        success: true,
        data: response.data,
        message: '更新门店成功',
        code: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as Store,
        message: error.response?.data?.message || '更新门店失败',
        code: error.response?.status || 500
      };
    }
  }

  /**
   * 删除门店
   * @param id 门店ID
   */
  async deleteStore(id: number): Promise<ApiResponse<void>> {
    try {
      await ApiService.delete(`/stores/${id}`);
      return {
        success: true,
        data: undefined,
        message: '删除门店成功',
        code: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: undefined,
        message: error.response?.data?.message || '删除门店失败',
        code: error.response?.status || 500
      };
    }
  }

  /**
   * 更新门店状态
   * @param id 门店ID
   * @param status 新状态
   */
  async updateStoreStatus(id: number, status: 'active' | 'inactive' | 'maintenance'): Promise<ApiResponse<Store>> {
    try {
      const response = await ApiService.patch(`/stores/${id}/status`, { status });
      return {
        success: true,
        data: response.data,
        message: '更新门店状态成功',
        code: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as Store,
        message: error.response?.data?.message || '更新门店状态失败',
        code: error.response?.status || 500
      };
    }
  }

  /**
   * 导出门店列表
   * @param params 导出参数
   */
  async exportStores(params?: {
    format?: 'excel' | 'csv';
    status?: string;
    merchantId?: number;
    dateRange?: [string, string];
  }): Promise<ApiResponse<{ downloadUrl: string }>> {
    try {
      const response = await ApiService.get('/stores/export', { params });
      return {
        success: true,
        data: response.data,
        message: '导出门店列表成功',
        code: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: { downloadUrl: '' },
        message: error.response?.data?.message || '导出门店列表失败',
        code: error.response?.status || 500
      };
    }
  }

  /**
   * 获取门店统计数据
   * @param storeId 门店ID
   */
  async getStoreStats(storeId: number): Promise<ApiResponse<{
    deviceCount: number;
    activeDeviceCount: number;
    todayOrders: number;
    monthlyRevenue: number;
  }>> {
    try {
      const response = await ApiService.get(`/stores/${storeId}/stats`);
      return {
        success: true,
        data: response.data,
        message: '获取门店统计成功',
        code: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: {
          deviceCount: 0,
          activeDeviceCount: 0,
          todayOrders: 0,
          monthlyRevenue: 0
        },
        message: error.response?.data?.message || '获取门店统计失败',
        code: error.response?.status || 500
      };
    }
  }
}

// 导出门店服务实例
export const storeService = StoreService.getInstance();