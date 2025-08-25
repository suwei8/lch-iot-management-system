import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsEmail,
  IsPhoneNumber,
  MinLength,
  MaxLength,
  IsDecimal,
  Min,
  Max,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

/**
 * 更新商户资料DTO
 */
export class UpdateMerchantProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('CN')
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  district?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  businessLicense?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  legalPerson?: string;
}

/**
 * 创建门店DTO
 */
export class CreateStoreDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsString()
  @MaxLength(200)
  address: string;

  @IsString()
  @MaxLength(50)
  city: string;

  @IsString()
  @MaxLength(50)
  district: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @IsOptional()
  @IsPhoneNumber('CN')
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  manager?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  businessHours?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 6 })
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 6 })
  longitude?: number;
}

/**
 * 更新门店DTO
 */
export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  district?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @IsOptional()
  @IsPhoneNumber('CN')
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  manager?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  businessHours?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 6 })
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 6 })
  longitude?: number;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: string;
}

/**
 * 创建设备DTO
 */
export class CreateDeviceDto {
  @IsString()
  @MaxLength(50)
  devid: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(50)
  model: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @Type(() => Number)
  @IsNumber()
  storeId: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  serialNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  firmwareVersion?: string;
}

/**
 * 更新设备DTO
 */
export class UpdateDeviceDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  storeId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  serialNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  firmwareVersion?: string;

  @IsOptional()
  @IsEnum(['online', 'offline', 'maintenance', 'error'])
  status?: string;
}

/**
 * 创建员工DTO
 */
export class CreateStaffDto {
  @IsPhoneNumber('CN')
  phone: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nickname?: string;

  @IsEnum(['store_manager', 'store_staff'])
  staffRole: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

/**
 * 更新员工DTO
 */
export class UpdateStaffDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nickname?: string;

  @IsOptional()
  @IsEnum(['store_manager', 'store_staff'])
  staffRole?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: string;
}

/**
 * 更新库存DTO
 */
export class UpdateInventoryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  itemName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  itemCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  currentStock?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minStock?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxStock?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

/**
 * 确认告警DTO
 */
export class AcknowledgeAlertDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  resolution?: string;
}

/**
 * 报表查询DTO
 */
export class ReportQueryDto {
  /**
   * 报表类型
   */
  @IsString({ message: '报表类型必须是字符串' })
  @IsEnum(['orders', 'revenue', 'devices', 'inventory', 'staff'], {
    message: '报表类型必须是orders、revenue、devices、inventory或staff',
  })
  reportType: string;

  /**
   * 开始日期
   */
  @IsDateString({}, { message: '开始日期格式无效' })
  startDate: string;

  /**
   * 结束日期
   */
  @IsDateString({}, { message: '结束日期格式无效' })
  endDate: string;

  /**
   * 门店ID（可选，不指定则查询所有门店）
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  storeId?: number;

  /**
   * 时间维度
   */
  @IsOptional()
  @IsEnum(['daily', 'weekly', 'monthly'])
  timeDimension?: string;
}

/**
 * 库存操作DTO
 */
export class InventoryOperationDto {
  /**
   * 操作类型
   */
  @IsEnum(['in', 'out'])
  operationType: string;

  /**
   * 操作数量
   */
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  operationAmount: number;

  /**
   * 操作原因
   */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  reason?: string;

  /**
   * 备注
   */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;
}

/**
 * 重置员工密码DTO
 */
export class ResetStaffPasswordDto {
  /**
   * 新密码
   */
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  newPassword: string;
}

/**
 * 批量操作员工DTO
 */
export class BatchStaffOperationDto {
  /**
   * 员工ID列表
   */
  @Type(() => Number)
  @IsNumber({}, { each: true })
  staffIds: number[];

  /**
   * 操作类型
   */
  @IsEnum(['activate', 'deactivate', 'delete'])
  operation: string;
}