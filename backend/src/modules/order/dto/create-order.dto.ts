import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 创建订单数据传输对象
 */
export class CreateOrderDto {
  /**
   * 设备ID
   */
  @IsNotEmpty({ message: '设备ID不能为空' })
  @IsNumber({}, { message: '设备ID必须是数字' })
  @Type(() => Number)
  deviceId: number;

  /**
   * 洗车类型
   */
  @IsNotEmpty({ message: '洗车类型不能为空' })
  @IsString({ message: '洗车类型必须是字符串' })
  washType: string;

  /**
   * 洗车时长（分钟）
   */
  @IsNotEmpty({ message: '洗车时长不能为空' })
  @IsNumber({}, { message: '洗车时长必须是数字' })
  @Min(1, { message: '洗车时长至少1分钟' })
  @Max(60, { message: '洗车时长最多60分钟' })
  @Type(() => Number)
  duration: number;

  /**
   * 订单金额
   */
  @IsNotEmpty({ message: '订单金额不能为空' })
  @IsNumber({}, { message: '订单金额必须是数字' })
  @Min(0.01, { message: '订单金额必须大于0' })
  @Type(() => Number)
  amount: number;

  /**
   * 备注
   */
  @IsOptional()
  @IsString({ message: '备注必须是字符串' })
  remark?: string;
}