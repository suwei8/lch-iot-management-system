import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse, ApiError } from '../types/api';

/**
 * API客户端类
 */
class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    // 创建axios实例
    this.instance = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/api/v1`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 设置请求拦截器
    this.setupRequestInterceptor();
    
    // 设置响应拦截器
    this.setupResponseInterceptor();
  }

  /**
   * 设置请求拦截器
   */
  private setupRequestInterceptor() {
    this.instance.interceptors.request.use(
      (config) => {
        // 添加认证token
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => {
        console.error('请求拦截器错误:', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * 设置响应拦截器
   */
  private setupResponseInterceptor() {
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        // 处理HTTP错误
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * 处理API错误
   */
  private handleError(error: any) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          console.error('登录已过期，请重新登录');
          break;
          
        case 403:
          console.error('没有权限访问此资源');
          break;
          
        case 404:
          console.error('请求的资源不存在');
          break;
          
        case 422:
          // 表单验证错误
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach((err: any) => {
              console.error(err.message || '表单验证失败');
            });
          } else {
            console.error(data.message || '请求参数错误');
          }
          break;
          
        case 429:
          console.error('请求过于频繁，请稍后再试');
          break;
          
        case 500:
          console.error('服务器内部错误');
          break;
          
        default:
          console.error(data.message || `请求失败 (${status})`);
      }
    } else if (error.request) {
      // 网络错误
      console.error('网络连接失败，请检查网络设置');
    } else {
      // 其他错误
      console.error('请求发生未知错误');
    }
    
    console.error('API错误:', error);
  }

  /**
   * GET请求
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.get(url, config);
  }

  /**
   * POST请求
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.post(url, data, config);
  }

  /**
   * PUT请求
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.put(url, data, config);
  }

  /**
   * PATCH请求
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.patch(url, data, config);
  }

  /**
   * DELETE请求
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.delete(url, config);
  }

  /**
   * 上传文件
   */
  async upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<AxiosResponse<ApiResponse<T>>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  /**
   * 下载文件
   */
  async download(url: string, filename?: string): Promise<void> {
    try {
      const response = await this.instance.get(url, {
        responseType: 'blob',
      });

      // 创建下载链接
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('文件下载失败:', error);
      throw error;
    }
  }

  /**
   * 设置认证token
   */
  setAuthToken(token: string) {
    localStorage.setItem('token', token);
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * 清除认证token
   */
  clearAuthToken() {
    localStorage.removeItem('token');
    delete this.instance.defaults.headers.common['Authorization'];
  }

  /**
   * 获取当前认证token
   */
  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }
}

// 导出API客户端实例
export const apiClient = new ApiClient();

// 导出类型
export type { ApiResponse, ApiError };