import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

/**
 * 分页查询基础DTO
 */
export class PaginationDto {
  /**
   * 页码
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码不能小于1' })
  page?: number = 1;

  /**
   * 每页数量
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量不能小于1' })
  @Max(100, { message: '每页数量不能超过100' })
  limit?: number = 10;

  /**
   * 搜索关键词
   */
  @IsOptional()
  @IsString({ message: '搜索关键词必须是字符串' })
  @Transform(({ value }) => value?.trim())
  query?: string;
}

/**
 * 用户查询DTO
 */
export class UserQueryDto extends PaginationDto {
  /**
   * 用户角色
   */
  @IsOptional()
  @IsString({ message: '角色必须是字符串' })
  role?: string;

  /**
   * 用户状态
   */
  @IsOptional()
  @IsString({ message: '状态必须是字符串' })
  status?: string;

  /**
   * 搜索关键词
   */
  @IsOptional()
  @IsString({ message: '搜索关键词必须是字符串' })
  search?: string;
}

/**
 * 商户查询DTO
 */
export class MerchantQueryDto extends PaginationDto {
  /**
   * 商户状态
   */
  @IsOptional()
  @IsString({ message: '状态必须是字符串' })
  status?: string;

  /**
   * 搜索关键词
   */
  @IsOptional()
  @IsString({ message: '搜索关键词必须是字符串' })
  search?: string;
}

/**
 * 门店查询DTO
 */
export class StoreQueryDto extends PaginationDto {
  /**
   * 商户ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '商户ID必须是整数' })
  merchantId?: number;

  /**
   * 门店状态
   */
  @IsOptional()
  @IsString({ message: '状态必须是字符串' })
  status?: string;

  /**
   * 搜索关键词
   */
  @IsOptional()
  @IsString({ message: '搜索关键词必须是字符串' })
  search?: string;
}

/**
 * 设备查询DTO
 */
export class DeviceQueryDto extends PaginationDto {
  /**
   * 门店ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '门店ID必须是整数' })
  storeId?: number;

  /**
   * 设备状态
   */
  @IsOptional()
  @IsString({ message: '状态必须是字符串' })
  status?: string;

  /**
   * 搜索关键词
   */
  @IsOptional()
  @IsString({ message: '搜索关键词必须是字符串' })
  search?: string;
}

/**
 * 订单查询DTO
 */
export class OrderQueryDto extends PaginationDto {
  /**
   * 商户ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '商户ID必须是整数' })
  merchantId?: number;

  /**
   * 门店ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '门店ID必须是整数' })
  storeId?: number;

  /**
   * 订单状态
   */
  @IsOptional()
  @IsString({ message: '状态必须是字符串' })
  status?: string;

  /**
   * 搜索关键词
   */
  @IsOptional()
  @IsString({ message: '搜索关键词必须是字符串' })
  search?: string;
}

/**
 * 库存查询DTO
 */
export class InventoryQueryDto extends PaginationDto {
  /**
   * 门店ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '门店ID必须是整数' })
  storeId?: number;

  /**
   * 物料类型
   */
  @IsOptional()
  @IsString({ message: '物料类型必须是字符串' })
  type?: string;

  /**
   * 状态
   */
  @IsOptional()
  @IsString({ message: '状态必须是字符串' })
  status?: string;

  /**
   * 搜索关键词
   */
  @IsOptional()
  @IsString({ message: '搜索关键词必须是字符串' })
  search?: string;

  /**
   * 是否只显示低库存
   */
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  lowStock?: boolean;
}

/**
 * 告警查询DTO
 */
export class AlertQueryDto extends PaginationDto {
  /**
   * 门店ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '门店ID必须是整数' })
  storeId?: number;

  /**
   * 告警类型
   */
  @IsOptional()
  @IsString({ message: '告警类型必须是字符串' })
  type?: string;

  /**
   * 告警状态
   */
  @IsOptional()
  @IsString({ message: '状态必须是字符串' })
  status?: string;

  /**
   * 告警级别
   */
  @IsOptional()
  @IsString({ message: '级别必须是字符串' })
  level?: string;
}