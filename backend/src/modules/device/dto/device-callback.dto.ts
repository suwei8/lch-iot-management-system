import { IsString, IsNotEmpty, IsObject, IsDateString, IsOptional } from 'class-validator';

/**
 * 设备回调DTO
 */
export class DeviceCallbackDto {
  /**
   * 设备ICCID
   */
  @IsString({ message: 'ICCID必须是字符串' })
  @IsNotEmpty({ message: 'ICCID不能为空' })
  iccid: string;

  /**
   * 事件类型
   */
  @IsString({ message: '事件类型必须是字符串' })
  @IsNotEmpty({ message: '事件类型不能为空' })
  eventType: string;

  /**
   * 事件数据载荷
   */
  @IsObject({ message: '事件数据必须是对象' })
  payload: object;

  /**
   * 事件时间戳
   */
  @IsDateString({}, { message: '时间戳格式不正确' })
  timestamp: string;

  /**
   * 签名（可选，用于验证数据完整性）
   */
  @IsOptional()
  @IsString({ message: '签名必须是字符串' })
  signature?: string;
}