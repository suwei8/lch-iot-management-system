import { apiClient } from './apiClient';
import type { User, CreateUserDto, UpdateUserDto } from '../types/user';
import type { ApiResponse } from '../types/api';

/**
 * 用户服务类
 */
export class UserService {
  /**
   * 获取用户列表
   */
  async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await apiClient.get('/admin/users');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '获取用户列表失败',
        data: [],
      };
    }
  }

  /**
   * 获取用户详情
   */
  async getUserById(id: number): Promise<ApiResponse<User | null>> {
    try {
      const response = await apiClient.get(`/admin/users/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '获取用户详情失败',
        data: null,
      };
    }
  }

  /**
   * 创建用户
   */
  async createUser(userData: CreateUserDto): Promise<ApiResponse<User | null>> {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '创建用户失败',
        data: null,
      };
    }
  }

  /**
   * 更新用户信息
   */
  async updateUser(id: number, userData: UpdateUserDto): Promise<ApiResponse<User | null>> {
    try {
      const response = await apiClient.put(`/admin/users/${id}`, userData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '更新用户信息失败',
        data: null,
      };
    }
  }

  /**
   * 删除用户
   */
  async deleteUser(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '删除用户失败',
        data: null,
      };
    }
  }

  /**
   * 批量删除用户
   */
  async batchDeleteUsers(ids: number[]): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete('/admin/users/batch', {
        data: { ids },
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '批量删除用户失败',
        data: null,
      };
    }
  }

  /**
   * 更新用户状态
   */
  async updateUserStatus(id: number, status: 'active' | 'inactive'): Promise<ApiResponse<User | null>> {
    try {
      const response = await apiClient.patch(`/admin/users/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '更新用户状态失败',
        data: null,
      };
    }
  }

  /**
   * 重置用户密码
   */
  async resetUserPassword(id: number, newPassword: string): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.patch(`/admin/users/${id}/password`, {
        password: newPassword,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '重置密码失败',
        data: null,
      };
    }
  }

  /**
   * 搜索用户
   */
  async searchUsers(params: {
    keyword?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ users: User[]; total: number }>> {
    try {
      const response = await apiClient.get('/admin/users/search', { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '搜索用户失败',
        data: { users: [], total: 0 },
      };
    }
  }

  /**
   * 获取用户统计信息
   */
  async getUserStatistics(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<string, number>;
    recentRegistrations: number;
  }>> {
    try {
      const response = await apiClient.get('/admin/users/statistics');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '获取用户统计失败',
        data: {
          total: 0,
          active: 0,
          inactive: 0,
          byRole: {},
          recentRegistrations: 0,
        },
      };
    }
  }
}

// 导出用户服务实例
export const userService = new UserService();