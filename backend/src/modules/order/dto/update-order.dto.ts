import { IsOptional, IsString, IsIn, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 更新订单数据传输对象
 */
export class UpdateOrderDto {
  /**
   * 订单状态
   */
  @IsOptional()
  @IsString({ message: '订单状态必须是字符串' })
  @IsIn(['pending', 'paid', 'in_progress', 'completed', 'cancelled', 'refunded'], {
    message: '订单状态必须是有效值',
  })
  status?: string;

  /**
   * 支付方式
   */
  @IsOptional()
  @IsString({ message: '支付方式必须是字符串' })
  paymentMethod?: string;

  /**
   * 第三方订单号
   */
  @IsOptional()
  @IsString({ message: '第三方订单号必须是字符串' })
  thirdPartyOrderNumber?: string;

  /**
   * 实际洗车时长（分钟）
   */
  @IsOptional()
  @IsNumber({}, { message: '洗车时长必须是数字' })
  @Min(1, { message: '洗车时长至少1分钟' })
  @Type(() => Number)
  duration?: number;

  /**
   * 备注
   */
  @IsOptional()
  @IsString({ message: '备注必须是字符串' })
  remark?: string;

  /**
   * 退款金额
   */
  @IsOptional()
  @IsNumber({}, { message: '退款金额必须是数字' })
  @Min(0, { message: '退款金额不能为负数' })
  @Type(() => Number)
  refundAmount?: number;

  /**
   * 退款原因
   */
  @IsOptional()
  @IsString({ message: '退款原因必须是字符串' })
  refundReason?: string;
}