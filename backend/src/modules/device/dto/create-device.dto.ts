import { IsString, IsNotEmpty, IsOptional, IsNumber, IsObject, Length } from 'class-validator';

/**
 * 创建设备DTO
 */
export class CreateDeviceDto {
  /**
   * 设备名称
   */
  @IsString({ message: '设备名称必须是字符串' })
  @IsNotEmpty({ message: '设备名称不能为空' })
  @Length(1, 100, { message: '设备名称长度必须在1-100位之间' })
  name: string;

  /**
   * 设备型号
   */
  @IsString({ message: '设备型号必须是字符串' })
  @IsNotEmpty({ message: '设备型号不能为空' })
  @Length(1, 50, { message: '设备型号长度必须在1-50位之间' })
  model: string;

  /**
   * 设备ICCID
   */
  @IsString({ message: 'ICCID必须是字符串' })
  @IsNotEmpty({ message: 'ICCID不能为空' })
  @Length(19, 20, { message: 'ICCID长度必须在19-20位之间' })
  iccid: string;

  /**
   * 商户ID
   */
  @IsNumber({}, { message: '商户ID必须是数字' })
  merchantId: number;

  /**
   * 设备配置（JSON格式）
   */
  @IsOptional()
  @IsObject({ message: '设备配置必须是对象' })
  config?: object;

  /**
   * 设备位置描述
   */
  @IsOptional()
  @IsString({ message: '位置描述必须是字符串' })
  @Length(0, 200, { message: '位置描述长度不能超过200位' })
  location?: string;

  /**
   * 纬度
   */
  @IsOptional()
  @IsNumber({}, { message: '纬度必须是数字' })
  latitude?: number;

  /**
   * 经度
   */
  @IsOptional()
  @IsNumber({}, { message: '经度必须是数字' })
  longitude?: number;

  /**
   * 设备版本
   */
  @IsOptional()
  @IsString({ message: '设备版本必须是字符串' })
  @Length(0, 20, { message: '设备版本长度不能超过20位' })
  version?: string;
}