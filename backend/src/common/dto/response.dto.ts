import { ApiProperty } from '@nestjs/swagger';

/**
 * 通用API响应DTO
 */
export class ApiResponseDto<T = any> {
  /**
   * 响应状态码
   */
  @ApiProperty({ description: '响应状态码', example: 200 })
  code: number;

  /**
   * 响应消息
   */
  @ApiProperty({ description: '响应消息', example: '操作成功' })
  message: string;

  /**
   * 响应数据
   */
  @ApiProperty({ description: '响应数据' })
  data?: T;

  /**
   * 时间戳
   */
  @ApiProperty({ description: '时间戳', example: 1640995200000 })
  timestamp: number;

  constructor(code: number, message: string, data?: T) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.timestamp = Date.now();
  }

  /**
   * 创建成功响应
   */
  static success<T>(data?: T, message = '操作成功'): ApiResponseDto<T> {
    return new ApiResponseDto(200, message, data);
  }

  /**
   * 创建错误响应
   */
  static error(code: number, message: string): ApiResponseDto {
    return new ApiResponseDto(code, message);
  }
}

/**
 * 分页响应DTO
 */
export class PaginatedResponseDto<T = any> {
  /**
   * 数据列表
   */
  @ApiProperty({ description: '数据列表', isArray: true })
  items: T[];

  /**
   * 总数量
   */
  @ApiProperty({ description: '总数量', example: 100 })
  total: number;

  /**
   * 当前页码
   */
  @ApiProperty({ description: '当前页码', example: 1 })
  page: number;

  /**
   * 每页数量
   */
  @ApiProperty({ description: '每页数量', example: 10 })
  limit: number;

  /**
   * 总页数
   */
  @ApiProperty({ description: '总页数', example: 10 })
  totalPages: number;

  /**
   * 是否有下一页
   */
  @ApiProperty({ description: '是否有下一页', example: true })
  hasNext: boolean;

  /**
   * 是否有上一页
   */
  @ApiProperty({ description: '是否有上一页', example: false })
  hasPrev: boolean;

  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
    this.hasNext = page < this.totalPages;
    this.hasPrev = page > 1;
  }
}

/**
 * 统计数据响应DTO
 */
export class StatsResponseDto {
  /**
   * 统计标签
   */
  @ApiProperty({ description: '统计标签', example: '今日订单' })
  label: string;

  /**
   * 统计值
   */
  @ApiProperty({ description: '统计值', example: 100 })
  value: number;

  /**
   * 变化百分比
   */
  @ApiProperty({ description: '变化百分比', example: 15.5 })
  changePercent?: number;

  /**
   * 变化趋势
   */
  @ApiProperty({ description: '变化趋势', example: 'up', enum: ['up', 'down', 'stable'] })
  trend?: 'up' | 'down' | 'stable';

  /**
   * 额外信息
   */
  @ApiProperty({ description: '额外信息' })
  extra?: any;
}

/**
 * 图表数据响应DTO
 */
export class ChartDataResponseDto {
  /**
   * X轴标签
   */
  @ApiProperty({ description: 'X轴标签', example: ['1月', '2月', '3月'] })
  labels: string[];

  /**
   * 数据集
   */
  @ApiProperty({ description: '数据集' })
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

/**
 * 文件上传响应DTO
 */
export class FileUploadResponseDto {
  /**
   * 文件名
   */
  @ApiProperty({ description: '文件名', example: 'document.pdf' })
  filename: string;

  /**
   * 文件路径
   */
  @ApiProperty({ description: '文件路径', example: '/uploads/documents/document.pdf' })
  path: string;

  /**
   * 文件大小（字节）
   */
  @ApiProperty({ description: '文件大小（字节）', example: 1024000 })
  size: number;

  /**
   * 文件类型
   */
  @ApiProperty({ description: '文件类型', example: 'application/pdf' })
  mimetype: string;

  /**
   * 上传时间
   */
  @ApiProperty({ description: '上传时间', example: '2024-01-01T00:00:00.000Z' })
  uploadedAt: Date;
}

/**
 * 批量操作响应DTO
 */
export class BatchOperationResponseDto {
  /**
   * 成功数量
   */
  @ApiProperty({ description: '成功数量', example: 8 })
  successCount: number;

  /**
   * 失败数量
   */
  @ApiProperty({ description: '失败数量', example: 2 })
  failureCount: number;

  /**
   * 总数量
   */
  @ApiProperty({ description: '总数量', example: 10 })
  totalCount: number;

  /**
   * 失败详情
   */
  @ApiProperty({ description: '失败详情', example: [{ id: 1, error: '数据不存在' }] })
  failures?: { id: any; error: string }[];

  /**
   * 操作结果
   */
  @ApiProperty({ description: '操作结果', example: true })
  success: boolean;

  constructor(successCount: number, failureCount: number, failures?: { id: any; error: string }[]) {
    this.successCount = successCount;
    this.failureCount = failureCount;
    this.totalCount = successCount + failureCount;
    this.failures = failures;
    this.success = failureCount === 0;
  }
}