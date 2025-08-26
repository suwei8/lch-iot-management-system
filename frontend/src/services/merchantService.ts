import { apiClient } from './apiClient';
import type { Merchant, CreateMerchantRequest, UpdateMerchantRequest } from '../types';
import type { ApiResponse, PaginatedResponse } from '../types/api';

/**
 * 商户服务类
 */
export class MerchantService {
  /**
   * 获取商户列表
   */
  async getMerchants(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
  }): Promise<ApiResponse<PaginatedResponse<Merchant>>> {
    try {
      const response = await apiClient.get('/admin/merchants', { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '获取商户列表失败',
        data: {
          data: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  }

  /**
   * 获取商户详情
   */
  async getMerchantById(id: number): Promise<ApiResponse<Merchant | null>> {
    try {
      const response = await apiClient.get(`/admin/merchants/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '获取商户详情失败',
        data: null,
      };
    }
  }

  /**
   * 创建商户
   */
  async createMerchant(merchantData: CreateMerchantRequest): Promise<ApiResponse<Merchant | null>> {
    try {
      const response = await apiClient.post('/admin/merchants', merchantData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '创建商户失败',
        data: null,
      };
    }
  }

  /**
   * 更新商户信息
   */
  async updateMerchant(id: number, merchantData: UpdateMerchantRequest): Promise<ApiResponse<Merchant | null>> {
    try {
      const response = await apiClient.put(`/admin/merchants/${id}`, merchantData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '更新商户信息失败',
        data: null,
      };
    }
  }

  /**
   * 删除商户
   */
  async deleteMerchant(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete(`/admin/merchants/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '删除商户失败',
        data: null,
      };
    }
  }

  /**
   * 批量删除商户
   */
  async batchDeleteMerchants(ids: number[]): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete('/admin/merchants/batch', {
        data: { ids },
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '批量删除商户失败',
        data: null,
      };
    }
  }

  /**
   * 更新商户状态
   */
  async updateMerchantStatus(id: number, status: 'active' | 'inactive' | 'pending'): Promise<ApiResponse<Merchant | null>> {
    try {
      const response = await apiClient.patch(`/admin/merchants/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '更新商户状态失败',
        data: null,
      };
    }
  }

  /**
   * 搜索商户
   */
  async searchMerchants(params: {
    keyword?: string;
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<Merchant>>> {
    try {
      const response = await apiClient.get('/admin/merchants/search', { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '搜索商户失败',
        data: {
          data: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  }

  /**
   * 获取商户统计信息
   */
  async getMerchantStatistics(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    pending: number;
    byType: Record<string, number>;
    recentRegistrations: number;
    todayRegistrations: number;
    monthRegistrations: number;
  }>> {
    try {
      const response = await apiClient.get('/admin/merchants/statistics');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '获取商户统计失败',
        data: {
          total: 0,
          active: 0,
          inactive: 0,
          pending: 0,
          byType: {},
          recentRegistrations: 0,
          todayRegistrations: 0,
          monthRegistrations: 0,
        },
      };
    }
  }

  /**
   * 审核商户
   */
  async approveMerchant(id: number, approved: boolean, reason?: string): Promise<ApiResponse<Merchant | null>> {
    try {
      const response = await apiClient.patch(`/admin/merchants/${id}/approve`, {
        approved,
        reason,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '审核商户失败',
        data: null,
      };
    }
  }

  /**
   * 导出商户数据
   */
  async exportMerchants(params?: {
    format?: 'excel' | 'csv';
    status?: string;
    type?: string;
    dateRange?: [string, string];
  }): Promise<ApiResponse<{ downloadUrl: string }>> {
    try {
      const response = await apiClient.post('/admin/merchants/export', params);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '导出商户数据失败',
        data: { downloadUrl: '' },
      };
    }
  }
}

// 导出商户服务实例
export const merchantService = new MerchantService();