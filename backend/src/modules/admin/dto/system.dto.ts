import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  Length,
  IsDateString,
  IsEmail,
  IsUrl,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

/**
 * 系统配置DTO
 */
export class SystemConfigDto {
  /**
   * 配置键
   */
  @IsString({ message: '配置键必须是字符串' })
  @Length(2, 100, { message: '配置键长度必须在2-100字符之间' })
  @Transform(({ value }) => value?.trim())
  key: string;

  /**
   * 配置值
   */
  @IsString({ message: '配置值必须是字符串' })
  @Transform(({ value }) => value?.trim())
  value: string;

  /**
   * 配置描述
   */
  @IsOptional()
  @IsString({ message: '配置描述必须是字符串' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  /**
   * 配置分组
   */
  @IsOptional()
  @IsString({ message: '配置分组必须是字符串' })
  @IsEnum(['system', 'payment', 'notification', 'security', 'business'], {
    message: '配置分组必须是system、payment、notification、security或business',
  })
  group?: string;

  /**
   * 是否敏感配置
   */
  @IsOptional()
  @IsBoolean({ message: '是否敏感配置必须是布尔值' })
  isSensitive?: boolean;
}

/**
 * 批量更新系统配置DTO
 */
export class BatchUpdateSystemConfigDto {
  /**
   * 配置项列表
   */
  configs: SystemConfigDto[];
}

/**
 * 系统备份DTO
 */
export class SystemBackupDto {
  /**
   * 备份类型
   */
  @IsString({ message: '备份类型必须是字符串' })
  @IsEnum(['full', 'incremental', 'config_only', 'data_only'], {
    message: '备份类型必须是full、incremental、config_only或data_only',
  })
  backupType: string;

  /**
   * 备份描述
   */
  @IsOptional()
  @IsString({ message: '备份描述必须是字符串' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  /**
   * 是否压缩
   */
  @IsOptional()
  @IsBoolean({ message: '是否压缩必须是布尔值' })
  compress?: boolean;

  /**
   * 包含表列表
   */
  @IsOptional()
  @IsString({ each: true, message: '表名必须是字符串' })
  includeTables?: string[];

  /**
   * 排除表列表
   */
  @IsOptional()
  @IsString({ each: true, message: '表名必须是字符串' })
  excludeTables?: string[];
}

/**
 * 系统恢复DTO
 */
export class SystemRestoreDto {
  /**
   * 备份文件路径
   */
  @IsString({ message: '备份文件路径必须是字符串' })
  @Transform(({ value }) => value?.trim())
  backupFilePath: string;

  /**
   * 恢复类型
   */
  @IsString({ message: '恢复类型必须是字符串' })
  @IsEnum(['full', 'config_only', 'data_only', 'selective'], {
    message: '恢复类型必须是full、config_only、data_only或selective',
  })
  restoreType: string;

  /**
   * 是否覆盖现有数据
   */
  @IsOptional()
  @IsBoolean({ message: '是否覆盖现有数据必须是布尔值' })
  overwrite?: boolean;

  /**
   * 包含表列表（选择性恢复时使用）
   */
  @IsOptional()
  @IsString({ each: true, message: '表名必须是字符串' })
  includeTables?: string[];
}

/**
 * 系统监控查询DTO
 */
export class SystemMonitorQueryDto {
  /**
   * 监控类型
   */
  @IsOptional()
  @IsString({ message: '监控类型必须是字符串' })
  @IsEnum(['cpu', 'memory', 'disk', 'network', 'database', 'redis'], {
    message: '监控类型必须是cpu、memory、disk、network、database或redis',
  })
  type?: string;

  /**
   * 时间范围
   */
  @IsOptional()
  @IsString({ message: '时间范围必须是字符串' })
  @IsEnum(['1h', '6h', '24h', '7d', '30d'], {
    message: '时间范围必须是1h、6h、24h、7d或30d',
  })
  timeRange?: string;

  /**
   * 开始时间
   */
  @IsOptional()
  @IsDateString({}, { message: '开始时间格式无效' })
  startTime?: string;

  /**
   * 结束时间
   */
  @IsOptional()
  @IsDateString({}, { message: '结束时间格式无效' })
  endTime?: string;
}

/**
 * 报表查询DTO
 */
export class ReportQueryDto {
  /**
   * 报表类型
   */
  @IsString({ message: '报表类型必须是字符串' })
  @IsEnum([
    'revenue', 'orders', 'devices', 'users', 'merchants',
    'inventory', 'alerts', 'performance'
  ], {
    message: '报表类型必须是revenue、orders、devices、users、merchants、inventory、alerts或performance',
  })
  reportType: string;

  /**
   * 时间维度
   */
  @IsOptional()
  @IsString({ message: '时间维度必须是字符串' })
  @IsEnum(['hourly', 'daily', 'weekly', 'monthly', 'yearly'], {
    message: '时间维度必须是hourly、daily、weekly、monthly或yearly',
  })
  timeDimension?: string;

  /**
   * 开始日期
   */
  @IsDateString({}, { message: '开始日期格式无效' })
  startDate: string;

  /**
   * 结束日期
   */
  @IsDateString({}, { message: '结束日期格式无效' })
  endDate: string;

  /**
   * 商户ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '商户ID必须是整数' })
  @Min(1, { message: '商户ID必须大于0' })
  merchantId?: number;

  /**
   * 门店ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '门店ID必须是整数' })
  @Min(1, { message: '门店ID必须大于0' })
  storeId?: number;

  /**
   * 设备ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '设备ID必须是整数' })
  @Min(1, { message: '设备ID必须大于0' })
  deviceId?: number;

  /**
   * 分组字段
   */
  @IsOptional()
  @IsString({ each: true, message: '分组字段必须是字符串' })
  groupBy?: string[];

  /**
   * 排序字段
   */
  @IsOptional()
  @IsString({ message: '排序字段必须是字符串' })
  orderBy?: string;

  /**
   * 排序方向
   */
  @IsOptional()
  @IsString({ message: '排序方向必须是字符串' })
  @IsEnum(['ASC', 'DESC'], { message: '排序方向必须是ASC或DESC' })
  orderDirection?: string;

  /**
   * 导出格式
   */
  @IsOptional()
  @IsString({ message: '导出格式必须是字符串' })
  @IsEnum(['json', 'csv', 'excel', 'pdf'], {
    message: '导出格式必须是json、csv、excel或pdf',
  })
  exportFormat?: string;
}

/**
 * 系统通知DTO
 */
export class SystemNotificationDto {
  /**
   * 通知类型
   */
  @IsString({ message: '通知类型必须是字符串' })
  @IsEnum(['system', 'maintenance', 'security', 'business'], {
    message: '通知类型必须是system、maintenance、security或business',
  })
  type: string;

  /**
   * 通知级别
   */
  @IsString({ message: '通知级别必须是字符串' })
  @IsEnum(['info', 'warning', 'error', 'success'], {
    message: '通知级别必须是info、warning、error或success',
  })
  level: string;

  /**
   * 通知标题
   */
  @IsString({ message: '通知标题必须是字符串' })
  @Length(2, 200, { message: '通知标题长度必须在2-200字符之间' })
  @Transform(({ value }) => value?.trim())
  title: string;

  /**
   * 通知内容
   */
  @IsString({ message: '通知内容必须是字符串' })
  @Transform(({ value }) => value?.trim())
  content: string;

  /**
   * 目标用户角色
   */
  @IsOptional()
  @IsString({ each: true, message: '用户角色必须是字符串' })
  targetRoles?: string[];

  /**
   * 目标用户ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ each: true, message: '用户ID必须是整数' })
  @Min(1, { each: true, message: '用户ID必须大于0' })
  targetUserIds?: number[];

  /**
   * 是否立即发送
   */
  @IsOptional()
  @IsBoolean({ message: '是否立即发送必须是布尔值' })
  sendImmediately?: boolean;

  /**
   * 计划发送时间
   */
  @IsOptional()
  @IsDateString({}, { message: '计划发送时间格式无效' })
  scheduledAt?: string;
}