import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Length,
  IsDateString,
  IsIP,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

/**
 * 创建审计日志DTO
 */
export class CreateAuditLogDto {
  /**
   * 操作类型
   */
  @IsString({ message: '操作类型必须是字符串' })
  @IsEnum([
    'create', 'update', 'delete', 'login', 'logout',
    'export', 'import', 'backup', 'restore', 'config_change'
  ], {
    message: '操作类型必须是create、update、delete、login、logout、export、import、backup、restore或config_change',
  })
  action: string;

  /**
   * 资源类型
   */
  @IsString({ message: '资源类型必须是字符串' })
  @IsEnum([
    'user', 'merchant', 'store', 'device', 'order',
    'inventory', 'alert', 'system', 'auth'
  ], {
    message: '资源类型必须是user、merchant、store、device、order、inventory、alert、system或auth',
  })
  resourceType: string;

  /**
   * 资源ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '资源ID必须是整数' })
  @Min(1, { message: '资源ID必须大于0' })
  resourceId?: number;

  /**
   * 操作描述
   */
  @IsString({ message: '操作描述必须是字符串' })
  @Length(2, 500, { message: '操作描述长度必须在2-500字符之间' })
  @Transform(({ value }) => value?.trim())
  description: string;

  /**
   * 用户ID
   */
  @Type(() => Number)
  @IsInt({ message: '用户ID必须是整数' })
  @Min(1, { message: '用户ID必须大于0' })
  userId: number;

  /**
   * 用户角色
   */
  @IsString({ message: '用户角色必须是字符串' })
  @Length(2, 50, { message: '用户角色长度必须在2-50字符之间' })
  userRole: string;

  /**
   * IP地址
   */
  @IsOptional()
  @IsIP(undefined, { message: 'IP地址格式无效' })
  ipAddress?: string;

  /**
   * 用户代理
   */
  @IsOptional()
  @IsString({ message: '用户代理必须是字符串' })
  @Transform(({ value }) => value?.trim())
  userAgent?: string;

  /**
   * 操作前数据（JSON格式）
   */
  @IsOptional()
  @IsString({ message: '操作前数据必须是字符串' })
  beforeData?: string;

  /**
   * 操作后数据（JSON格式）
   */
  @IsOptional()
  @IsString({ message: '操作后数据必须是字符串' })
  afterData?: string;

  /**
   * 操作状态
   */
  @IsOptional()
  @IsString({ message: '操作状态必须是字符串' })
  @IsEnum(['success', 'failed', 'pending'], {
    message: '操作状态必须是success、failed或pending',
  })
  status?: string;

  /**
   * 错误信息
   */
  @IsOptional()
  @IsString({ message: '错误信息必须是字符串' })
  @Transform(({ value }) => value?.trim())
  errorMessage?: string;

  /**
   * 请求数据
   */
  @IsOptional()
  @IsString({ message: '请求数据必须是字符串' })
  requestData?: string;

  /**
   * 响应数据
   */
  @IsOptional()
  @IsString({ message: '响应数据必须是字符串' })
  responseData?: string;
}

/**
 * 审计日志查询DTO
 */
export class AuditLogQueryDto {
  /**
   * 页码
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码必须大于0' })
  page?: number = 1;

  /**
   * 每页数量
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量必须大于0' })
  limit?: number = 20;

  /**
   * 搜索关键词
   */
  @IsOptional()
  @IsString({ message: '搜索关键词必须是字符串' })
  @Transform(({ value }) => value?.trim())
  query?: string;

  /**
   * 操作类型
   */
  @IsOptional()
  @IsString({ message: '操作类型必须是字符串' })
  @IsEnum([
    'create', 'update', 'delete', 'login', 'logout',
    'export', 'import', 'backup', 'restore', 'config_change'
  ], {
    message: '操作类型必须是create、update、delete、login、logout、export、import、backup、restore或config_change',
  })
  action?: string;

  /**
   * 资源类型
   */
  @IsOptional()
  @IsString({ message: '资源类型必须是字符串' })
  @IsEnum([
    'user', 'merchant', 'store', 'device', 'order',
    'inventory', 'alert', 'system', 'auth'
  ], {
    message: '资源类型必须是user、merchant、store、device、order、inventory、alert、system或auth',
  })
  resourceType?: string;

  /**
   * 用户ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '用户ID必须是整数' })
  @Min(1, { message: '用户ID必须大于0' })
  userId?: number;

  /**
   * 用户角色
   */
  @IsOptional()
  @IsString({ message: '用户角色必须是字符串' })
  userRole?: string;

  /**
   * 操作状态
   */
  @IsOptional()
  @IsString({ message: '操作状态必须是字符串' })
  @IsEnum(['success', 'failed', 'pending'], {
    message: '操作状态必须是success、failed或pending',
  })
  status?: string;

  /**
   * 开始日期
   */
  @IsOptional()
  @IsDateString({}, { message: '开始日期格式无效' })
  startDate?: string;

  /**
   * 结束日期
   */
  @IsOptional()
  @IsDateString({}, { message: '结束日期格式无效' })
  endDate?: string;

  /**
   * IP地址
   */
  @IsOptional()
  @IsIP(undefined, { message: 'IP地址格式无效' })
  ipAddress?: string;

  /**
   * 资源
   */
  @IsOptional()
  @IsString({ message: '资源必须是字符串' })
  resource?: string;
}

/**
 * 审计日志统计查询DTO
 */
export class AuditLogStatsQueryDto {
  /**
   * 开始日期
   */
  @IsOptional()
  @IsDateString({}, { message: '开始日期格式无效' })
  startDate?: string;

  /**
   * 结束日期
   */
  @IsOptional()
  @IsDateString({}, { message: '结束日期格式无效' })
  endDate?: string;

  /**
   * 统计维度
   */
  @IsOptional()
  @IsString({ message: '统计维度必须是字符串' })
  @IsEnum(['action', 'resourceType', 'userRole', 'status', 'hourly', 'daily'], {
    message: '统计维度必须是action、resourceType、userRole、status、hourly或daily',
  })
  dimension?: string;

  /**
   * 用户ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '用户ID必须是整数' })
  @Min(1, { message: '用户ID必须大于0' })
  userId?: number;

  /**
   * 用户角色
   */
  @IsOptional()
  @IsString({ message: '用户角色必须是字符串' })
  userRole?: string;
}