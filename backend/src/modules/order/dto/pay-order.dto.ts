import { IsNotEmpty, IsString, IsIn } from 'class-validator';

/**
 * 支付订单数据传输对象
 */
export class PayOrderDto {
  /**
   * 支付方式
   */
  @IsNotEmpty({ message: '支付方式不能为空' })
  @IsString({ message: '支付方式必须是字符串' })
  @IsIn(['alipay', 'wechat', 'balance'], {
    message: '支付方式必须是支付宝、微信或余额支付',
  })
  paymentMethod: string;
}