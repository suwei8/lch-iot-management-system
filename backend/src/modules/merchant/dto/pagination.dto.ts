import {
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  IsBoolean,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

/**
 * 基础分页查询DTO
 */
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;
}

/**
 * 门店查询DTO
 */
export class StoreQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  district?: string;
}

/**
 * 设备查询DTO
 */
export class DeviceQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  storeId?: number;

  @IsOptional()
  @IsEnum(['online', 'offline', 'maintenance', 'error'])
  status?: string;

  @IsOptional()
  @IsString()
  model?: string;
}

/**
 * 订单查询DTO
 */
export class OrderQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  storeId?: number;

  @IsOptional()
  @IsEnum(['pending', 'processing', 'completed', 'cancelled', 'refunded'])
  status?: string;

  @IsOptional()
  @IsString()
  serviceType?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxAmount?: number;
}

/**
 * 库存查询DTO
 */
export class InventoryQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  storeId?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  lowStock?: boolean;

  @IsOptional()
  @IsString()
  category?: string;
}

/**
 * 告警查询DTO
 */
export class AlertQueryDto extends PaginationDto {
  /**
   * 告警类型
   */
  @IsOptional()
  @IsEnum(['low_stock', 'device_offline', 'device_error', 'system_error'])
  alertType?: string;

  /**
   * 告警级别
   */
  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'critical'])
  level?: string;

  /**
   * 门店ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  storeId?: number;

  /**
   * 确认状态
   */
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  acknowledged?: boolean;
}

/**
 * 员工查询DTO
 */
export class StaffQueryDto extends PaginationDto {
  /**
   * 员工角色
   */
  @IsOptional()
  @IsEnum(['store_manager', 'store_staff'])
  role?: string;

  /**
   * 员工状态
   */
  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: string;

  /**
   * 门店ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  storeId?: number;
}

/**
 * 用户查询DTO（员工管理）
 */
export class UserQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['store_manager', 'store_staff'])
  staffRole?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: string;
}

/**
 * 报表查询DTO
 */
export class ReportQueryDto extends PaginationDto {
  /**
   * 报表类型
   */
  @IsOptional()
  @IsEnum(['orders', 'revenue', 'devices', 'inventory', 'staff'])
  reportType?: string;

  /**
   * 开始日期
   */
  @IsOptional()
  @IsDateString()
  startDate?: string;

  /**
   * 结束日期
   */
  @IsOptional()
  @IsDateString()
  endDate?: string;

  /**
   * 门店ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  storeId?: number;

  @IsOptional()
  @IsEnum(['day', 'week', 'month', 'year'])
  groupBy?: string;
}