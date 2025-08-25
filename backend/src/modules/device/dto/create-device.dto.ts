import { IsString, IsNotEmpty, IsOptional, IsNumber, IsObject, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 创建设备DTO
 */
export class CreateDeviceDto {
  /**
   * 设备名称
   */
  @ApiProperty({
    description: '设备名称',
    example: '温湿度传感器-001',
    minLength: 1,
    maxLength: 100
  })
  @IsString({ message: '设备名称必须是字符串' })
  @IsNotEmpty({ message: '设备名称不能为空' })
  @Length(1, 100, { message: '设备名称长度必须在1-100位之间' })
  name: string;

  /**
   * 设备型号
   */
  @ApiProperty({
    description: '设备型号',
    example: 'DHT22-Pro',
    minLength: 1,
    maxLength: 50
  })
  @IsString({ message: '设备型号必须是字符串' })
  @IsNotEmpty({ message: '设备型号不能为空' })
  @Length(1, 50, { message: '设备型号长度必须在1-50位之间' })
  model: string;

  /**
   * 设备ICCID
   */
  @ApiProperty({
    description: '设备ICCID（SIM卡标识）',
    example: '89860318740800123456',
    minLength: 19,
    maxLength: 20
  })
  @IsString({ message: 'ICCID必须是字符串' })
  @IsNotEmpty({ message: 'ICCID不能为空' })
  @Length(19, 20, { message: 'ICCID长度必须在19-20位之间' })
  iccid: string;

  /**
   * 商户ID
   */
  @ApiProperty({
    description: '所属商户ID',
    example: 1
  })
  @IsNumber({}, { message: '商户ID必须是数字' })
  merchantId: number;

  /**
   * 设备配置（JSON格式）
   */
  @ApiPropertyOptional({
    description: '设备配置参数',
    example: {
      "sampleRate": 60,
      "threshold": {
        "temperature": { "min": -10, "max": 50 },
        "humidity": { "min": 0, "max": 100 }
      }
    }
  })
  @IsOptional()
  @IsObject({ message: '设备配置必须是对象' })
  config?: object;

  /**
   * 设备位置描述
   */
  @ApiPropertyOptional({
    description: '设备安装位置描述',
    example: '北京市朝阳区办公楼A座3层会议室',
    maxLength: 200
  })
  @IsOptional()
  @IsString({ message: '位置描述必须是字符串' })
  @Length(0, 200, { message: '位置描述长度不能超过200位' })
  location?: string;

  /**
   * 纬度
   */
  @ApiPropertyOptional({
    description: '设备安装位置纬度',
    example: 39.9042,
    minimum: -90,
    maximum: 90
  })
  @IsOptional()
  @IsNumber({}, { message: '纬度必须是数字' })
  latitude?: number;

  /**
   * 经度
   */
  @ApiPropertyOptional({
    description: '设备安装位置经度',
    example: 116.4074,
    minimum: -180,
    maximum: 180
  })
  @IsOptional()
  @IsNumber({}, { message: '经度必须是数字' })
  longitude?: number;

  /**
   * 设备版本
   */
  @ApiPropertyOptional({
    description: '设备固件版本',
    example: 'v1.2.3',
    maxLength: 20
  })
  @IsOptional()
  @IsString({ message: '设备版本必须是字符串' })
  @Length(0, 20, { message: '设备版本长度不能超过20位' })
  version?: string;
}