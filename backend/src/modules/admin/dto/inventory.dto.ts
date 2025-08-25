import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsInt,
  Min,
  Max,
  Length,
  IsDateString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

/**
 * 创建库存DTO
 */
export class CreateInventoryDto {
  /**
   * 物料名称
   */
  @IsString({ message: '物料名称必须是字符串' })
  @Length(2, 100, { message: '物料名称长度必须在2-100字符之间' })
  @Transform(({ value }) => value?.trim())
  itemName: string;

  /**
   * 物料编码
   */
  @IsString({ message: '物料编码必须是字符串' })
  @Length(2, 50, { message: '物料编码长度必须在2-50字符之间' })
  @Transform(({ value }) => value?.trim())
  itemCode: string;

  /**
   * 物料类型
   */
  @IsString({ message: '物料类型必须是字符串' })
  @IsEnum(['detergent', 'wax', 'foam', 'water', 'electricity', 'other'], {
    message: '物料类型必须是detergent、wax、foam、water、electricity或other',
  })
  itemType: string;

  /**
   * 门店ID
   */
  @Type(() => Number)
  @IsInt({ message: '门店ID必须是整数' })
  @Min(1, { message: '门店ID必须大于0' })
  storeId: number;

  /**
   * 当前库存量
   */
  @Type(() => Number)
  @IsNumber({}, { message: '当前库存量必须是数字' })
  @Min(0, { message: '当前库存量不能小于0' })
  currentStock: number;

  /**
   * 最小阈值
   */
  @Type(() => Number)
  @IsNumber({}, { message: '最小阈值必须是数字' })
  @Min(0, { message: '最小阈值不能小于0' })
  minThreshold: number;

  /**
   * 最大容量
   */
  @Type(() => Number)
  @IsNumber({}, { message: '最大容量必须是数字' })
  @Min(0, { message: '最大容量不能小于0' })
  maxCapacity: number;

  /**
   * 计量单位
   */
  @IsString({ message: '计量单位必须是字符串' })
  @Length(1, 20, { message: '计量单位长度必须在1-20字符之间' })
  @Transform(({ value }) => value?.trim())
  unit: string;

  /**
   * 单价（分）
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '单价必须是整数' })
  @Min(0, { message: '单价不能小于0' })
  unitPrice?: number;

  /**
   * 供应商
   */
  @IsOptional()
  @IsString({ message: '供应商必须是字符串' })
  @Length(2, 100, { message: '供应商长度必须在2-100字符之间' })
  @Transform(({ value }) => value?.trim())
  supplier?: string;

  /**
   * 备注
   */
  @IsOptional()
  @IsString({ message: '备注必须是字符串' })
  @Transform(({ value }) => value?.trim())
  remark?: string;
}

/**
 * 库存操作DTO
 */
export class InventoryOperationDto {
  /**
   * 操作类型
   */
  @IsString({ message: '操作类型必须是字符串' })
  @IsEnum(['in', 'out'], { message: '操作类型必须是in或out' })
  operationType: string;

  /**
   * 操作数量
   */
  @Type(() => Number)
  @IsNumber({}, { message: '操作数量必须是数字' })
  @Min(0.01, { message: '操作数量必须大于0' })
  operationAmount: number;

  /**
   * 操作原因
   */
  @IsOptional()
  @IsString({ message: '操作原因必须是字符串' })
  @Transform(({ value }) => value?.trim())
  reason?: string;

  /**
   * 备注
   */
  @IsOptional()
  @IsString({ message: '备注必须是字符串' })
  @Transform(({ value }) => value?.trim())
  remark?: string;
}

/**
 * 批量库存操作DTO
 */
export class BatchInventoryOperationDto {
  /**
   * 库存ID列表
   */
  @Type(() => Number)
  @IsInt({ each: true, message: '库存ID必须是整数' })
  @Min(1, { each: true, message: '库存ID必须大于0' })
  inventoryIds: number[];

  /**
   * 操作类型
   */
  @IsString({ message: '操作类型必须是字符串' })
  @IsEnum(['in', 'out', 'adjust'], { message: '操作类型必须是in、out或adjust' })
  operationType: string;

  /**
   * 操作原因
   */
  @IsOptional()
  @IsString({ message: '操作原因必须是字符串' })
  @Transform(({ value }) => value?.trim())
  reason?: string;

  /**
   * 备注
   */
  @IsOptional()
  @IsString({ message: '备注必须是字符串' })
  @Transform(({ value }) => value?.trim())
  remark?: string;
}