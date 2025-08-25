import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Length,
  IsDateString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

/**
 * 创建告警DTO
 */
export class CreateAlertDto {
  /**
   * 告警类型
   */
  @IsString({ message: '告警类型必须是字符串' })
  @IsEnum(['low_inventory', 'device_offline', 'device_error', 'system_error', 'maintenance'], {
    message: '告警类型必须是low_inventory、device_offline、device_error、system_error或maintenance',
  })
  alertType: string;

  /**
   * 告警级别
   */
  @IsString({ message: '告警级别必须是字符串' })
  @IsEnum(['low', 'medium', 'high', 'critical'], {
    message: '告警级别必须是low、medium、high或critical',
  })
  level: string;

  /**
   * 告警标题
   */
  @IsString({ message: '告警标题必须是字符串' })
  @Length(2, 200, { message: '告警标题长度必须在2-200字符之间' })
  @Transform(({ value }) => value?.trim())
  title: string;

  /**
   * 告警内容
   */
  @IsString({ message: '告警内容必须是字符串' })
  @Transform(({ value }) => value?.trim())
  content: string;

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
   * 库存ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '库存ID必须是整数' })
  @Min(1, { message: '库存ID必须大于0' })
  inventoryId?: number;

  /**
   * 相关数据（JSON格式）
   */
  @IsOptional()
  @IsString({ message: '相关数据必须是字符串' })
  relatedData?: string;
}

/**
 * 批量确认告警DTO
 */
export class BatchAcknowledgeAlertDto {
  /**
   * 告警ID列表
   */
  @Type(() => Number)
  @IsInt({ each: true, message: '告警ID必须是整数' })
  @Min(1, { each: true, message: '告警ID必须大于0' })
  alertIds: number[];

  /**
   * 处理备注
   */
  @IsOptional()
  @IsString({ message: '处理备注必须是字符串' })
  @Transform(({ value }) => value?.trim())
  remark?: string;
}

/**
 * 告警统计查询DTO
 */
export class AlertStatsQueryDto {
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
   * 门店ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '门店ID必须是整数' })
  @Min(1, { message: '门店ID必须大于0' })
  storeId?: number;

  /**
   * 商户ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '商户ID必须是整数' })
  @Min(1, { message: '商户ID必须大于0' })
  merchantId?: number;

  /**
   * 告警类型
   */
  @IsOptional()
  @IsString({ message: '告警类型必须是字符串' })
  @IsEnum(['low_inventory', 'device_offline', 'device_error', 'system_error', 'maintenance'], {
    message: '告警类型必须是low_inventory、device_offline、device_error、system_error或maintenance',
  })
  alertType?: string;

  /**
   * 告警级别
   */
  @IsOptional()
  @IsString({ message: '告警级别必须是字符串' })
  @IsEnum(['low', 'medium', 'high', 'critical'], {
    message: '告警级别必须是low、medium、high或critical',
  })
  level?: string;
}