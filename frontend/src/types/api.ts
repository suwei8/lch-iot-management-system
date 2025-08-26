/**
 * API响应基础接口
 */
export interface ApiResponse<T = any> {
  /** 请求是否成功 */
  success: boolean;
  
  /** 响应消息 */
  message: string;
  
  /** 响应数据 */
  data: T;
  
  /** 响应代码 */
  code?: number;
  
  /** 时间戳 */
  timestamp?: string;
}

/**
 * 分页响应接口
 */
export interface PaginatedResponse<T = any> {
  /** 数据列表 */
  data: T[];
  
  /** 总数量 */
  total: number;
  
  /** 当前页码 */
  page: number;
  
  /** 每页数量 */
  limit: number;
  
  /** 总页数 */
  totalPages: number;
  
  /** 是否有下一页 */
  hasNext?: boolean;
  
  /** 是否有上一页 */
  hasPrev?: boolean;
}

/**
 * API错误响应接口
 */
export interface ApiError {
  /** 错误代码 */
  code: number;
  
  /** 错误消息 */
  message: string;
  
  /** 错误详情 */
  details?: any;
  
  /** 时间戳 */
  timestamp: string;
}

/**
 * 请求配置接口
 */
export interface RequestConfig {
  /** 请求头 */
  headers?: Record<string, string>;
  
  /** 请求参数 */
  params?: Record<string, any>;
  
  /** 请求体 */
  data?: any;
  
  /** 超时时间（毫秒） */
  timeout?: number;
  
  /** 是否需要认证 */
  requireAuth?: boolean;
}

/**
 * 上传文件响应接口
 */
export interface UploadResponse {
  /** 文件URL */
  url: string;
  
  /** 文件名 */
  filename: string;
  
  /** 文件大小 */
  size: number;
  
  /** 文件类型 */
  mimetype: string;
}

/**
 * 统计数据接口
 */
export interface StatisticsData {
  /** 标签 */
  label: string;
  
  /** 数值 */
  value: number;
  
  /** 百分比 */
  percentage?: number;
  
  /** 趋势（上升/下降） */
  trend?: 'up' | 'down' | 'stable';
  
  /** 变化值 */
  change?: number;
}

/**
 * 图表数据接口
 */
export interface ChartData {
  /** X轴标签 */
  label: string;
  
  /** Y轴数值 */
  value: number;
  
  /** 额外数据 */
  extra?: Record<string, any>;
}

/**
 * 导出任务接口
 */
export interface ExportTask {
  /** 任务ID */
  id: string;
  
  /** 任务名称 */
  name: string;
  
  /** 任务状态 */
  status: 'pending' | 'processing' | 'completed' | 'failed';
  
  /** 进度百分比 */
  progress: number;
  
  /** 下载链接 */
  downloadUrl?: string;
  
  /** 创建时间 */
  createdAt: string;
  
  /** 完成时间 */
  completedAt?: string;
}