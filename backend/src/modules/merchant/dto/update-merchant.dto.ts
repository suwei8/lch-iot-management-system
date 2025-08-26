import { PartialType } from '@nestjs/mapped-types';
import { CreateMerchantDto } from './create-merchant.dto';
import {
  IsOptional,
  IsEnum,
} from 'class-validator';

/**
 * 更新商户DTO
 */
export class UpdateMerchantDto extends PartialType(CreateMerchantDto) {
  /**
   * 商户状态
   */
  @IsOptional()
  @IsEnum(['active', 'disabled'])
  status?: string;
}