import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsPhoneNumber,
  MaxLength,
  IsDecimal,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 创建商户DTO
 */
export class CreateMerchantDto {
  /**
   * 商户名称
   */
  @IsString()
  @MaxLength(100)
  name: string;

  /**
   * 商户编码（唯一）
   */
  @IsString()
  @MaxLength(50)
  code: string;

  /**
   * 联系人
   */
  @IsString()
  @MaxLength(50)
  contact: string;

  /**
   * 联系电话
   */
  @IsPhoneNumber('CN')
  phone: string;

  /**
   * 商户地址
   */
  @IsString()
  @MaxLength(255)
  address: string;

  /**
   * 经度
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 7 })
  @Min(-180)
  @Max(180)
  longitude?: number;

  /**
   * 纬度
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 7 })
  @Min(-90)
  @Max(90)
  latitude?: number;

  /**
   * 分成比例
   */
  @IsOptional()
  @Type(() => Number)
  @IsDecimal({ decimal_digits: '2' })
  @Min(0)
  @Max(100)
  shareRatio?: number;

  /**
   * 商户描述
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * 营业时间
   */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  businessHours?: string;
}