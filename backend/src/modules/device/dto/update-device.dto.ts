import { IsString, IsOptional, IsNumber, IsObject, Length, IsEnum } from 'class-validator';

/**
 * 更新设备DTO
 */
export class UpdateDeviceDto {
  /**
   * 设备名称
   */
  @IsOptional()
  @IsString({ message: '设备名称必须是字符串' })
  @Length(1, 100, { message: '设备名称长度必须在1-100位之间' })
  name?: string;

  /**
   * 设备型号
   */
  @IsOptional()
  @IsString({ message: '设备型号必须是字符串' })
  @Length(1, 50, { message: '设备型号长度必须在1-50位之间' })
  model?: string;

  /**
   * 设备状态
   */
  @IsOptional()
  @IsString({ message: '设备状态必须是字符串' })
  @IsEnum(['online', 'offline', 'working', 'error', 'maintenance'], {
    message: '设备状态必须是有效值',
  })
  status?: string;

  /**
   * 商户ID
   */
  @IsOptional()
  @IsNumber({}, { message: '商户ID必须是数字' })
  merchantId?: number;

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