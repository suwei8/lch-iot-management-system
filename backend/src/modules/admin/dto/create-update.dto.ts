import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDecimal,
  IsInt,
  Min,
  Max,
  Length,
  IsPhoneNumber,
  IsEmail,
  IsJSON,
  IsDateString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UserRole } from '../../../common/decorators/roles.decorator';

/**
 * 创建商户DTO
 */
export class CreateMerchantDto {
  /**
   * 商户名称
   */
  @IsString({ message: '商户名称必须是字符串' })
  @Length(2, 100, { message: '商户名称长度必须在2-100字符之间' })
  @Transform(({ value }) => value?.trim())
  name: string;

  /**
   * 商户编码
   */
  @IsString({ message: '商户编码必须是字符串' })
  @Length(2, 50, { message: '商户编码长度必须在2-50字符之间' })
  @Transform(({ value }) => value?.trim())
  code: string;

  /**
   * 联系人
   */
  @IsString({ message: '联系人必须是字符串' })
  @Length(2, 50, { message: '联系人长度必须在2-50字符之间' })
  @Transform(({ value }) => value?.trim())
  contact: string;

  /**
   * 联系电话
   */
  @IsString({ message: '联系电话必须是字符串' })
  @Length(11, 20, { message: '联系电话长度必须在11-20字符之间' })
  phone: string;

  /**
   * 商户地址
   */
  @IsString({ message: '商户地址必须是字符串' })
  @Length(5, 255, { message: '商户地址长度必须在5-255字符之间' })
  @Transform(({ value }) => value?.trim())
  address: string;

  /**
   * 经度
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '经度必须是数字' })
  @Min(-180, { message: '经度不能小于-180' })
  @Max(180, { message: '经度不能大于180' })
  longitude?: number;

  /**
   * 纬度
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '纬度必须是数字' })
  @Min(-90, { message: '纬度不能小于-90' })
  @Max(90, { message: '纬度不能大于90' })
  latitude?: number;

  /**
   * 分成比例
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '分成比例必须是数字' })
  @Min(0, { message: '分成比例不能小于0' })
  @Max(100, { message: '分成比例不能大于100' })
  shareRatio?: number;

  /**
   * 商户描述
   */
  @IsOptional()
  @IsString({ message: '商户描述必须是字符串' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  /**
   * 营业时间
   */
  @IsOptional()
  @IsString({ message: '营业时间必须是字符串' })
  @Transform(({ value }) => value?.trim())
  businessHours?: string;
}

/**
 * 更新商户DTO
 */
export class UpdateMerchantDto {
  /**
   * 商户名称
   */
  @IsOptional()
  @IsString({ message: '商户名称必须是字符串' })
  @Length(2, 100, { message: '商户名称长度必须在2-100字符之间' })
  @Transform(({ value }) => value?.trim())
  name?: string;

  /**
   * 联系人
   */
  @IsOptional()
  @IsString({ message: '联系人必须是字符串' })
  @Length(2, 50, { message: '联系人长度必须在2-50字符之间' })
  @Transform(({ value }) => value?.trim())
  contact?: string;

  /**
   * 联系电话
   */
  @IsOptional()
  @IsString({ message: '联系电话必须是字符串' })
  @Length(11, 20, { message: '联系电话长度必须在11-20字符之间' })
  phone?: string;

  /**
   * 商户地址
   */
  @IsOptional()
  @IsString({ message: '商户地址必须是字符串' })
  @Length(5, 255, { message: '商户地址长度必须在5-255字符之间' })
  @Transform(({ value }) => value?.trim())
  address?: string;

  /**
   * 经度
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '经度必须是数字' })
  @Min(-180, { message: '经度不能小于-180' })
  @Max(180, { message: '经度不能大于180' })
  longitude?: number;

  /**
   * 纬度
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '纬度必须是数字' })
  @Min(-90, { message: '纬度不能小于-90' })
  @Max(90, { message: '纬度不能大于90' })
  latitude?: number;

  /**
   * 商户状态
   */
  @IsOptional()
  @IsEnum(['active', 'disabled'], { message: '商户状态必须是active或disabled' })
  status?: string;

  /**
   * 分成比例
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '分成比例必须是数字' })
  @Min(0, { message: '分成比例不能小于0' })
  @Max(100, { message: '分成比例不能大于100' })
  shareRatio?: number;

  /**
   * 商户描述
   */
  @IsOptional()
  @IsString({ message: '商户描述必须是字符串' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  /**
   * 营业时间
   */
  @IsOptional()
  @IsString({ message: '营业时间必须是字符串' })
  @Transform(({ value }) => value?.trim())
  businessHours?: string;
}

/**
 * 创建门店DTO
 */
export class CreateStoreDto {
  /**
   * 门店名称
   */
  @IsString({ message: '门店名称必须是字符串' })
  @Length(2, 100, { message: '门店名称长度必须在2-100字符之间' })
  @Transform(({ value }) => value?.trim())
  name: string;

  /**
   * 门店编码
   */
  @IsString({ message: '门店编码必须是字符串' })
  @Length(2, 50, { message: '门店编码长度必须在2-50字符之间' })
  @Transform(({ value }) => value?.trim())
  code: string;

  /**
   * 门店地址
   */
  @IsString({ message: '门店地址必须是字符串' })
  @Length(5, 255, { message: '门店地址长度必须在5-255字符之间' })
  @Transform(({ value }) => value?.trim())
  address: string;

  /**
   * 联系人
   */
  @IsString({ message: '联系人必须是字符串' })
  @Length(2, 50, { message: '联系人长度必须在2-50字符之间' })
  @Transform(({ value }) => value?.trim())
  contact: string;

  /**
   * 联系电话
   */
  @IsString({ message: '联系电话必须是字符串' })
  @Length(11, 20, { message: '联系电话长度必须在11-20字符之间' })
  phone: string;

  /**
   * 商户ID
   */
  @Type(() => Number)
  @IsInt({ message: '商户ID必须是整数' })
  @Min(1, { message: '商户ID必须大于0' })
  merchantId: number;

  /**
   * 经度
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '经度必须是数字' })
  @Min(-180, { message: '经度不能小于-180' })
  @Max(180, { message: '经度不能大于180' })
  longitude?: number;

  /**
   * 纬度
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '纬度必须是数字' })
  @Min(-90, { message: '纬度不能小于-90' })
  @Max(90, { message: '纬度不能大于90' })
  latitude?: number;

  /**
   * 营业时间
   */
  @IsOptional()
  @IsString({ message: '营业时间必须是字符串' })
  @Transform(({ value }) => value?.trim())
  businessHours?: string;

  /**
   * 门店描述
   */
  @IsOptional()
  @IsString({ message: '门店描述必须是字符串' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  /**
   * 基础洗车价格（分）
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '基础洗车价格必须是整数' })
  @Min(1, { message: '基础洗车价格必须大于0' })
  basicPrice?: number;

  /**
   * 精洗价格（分）
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '精洗价格必须是整数' })
  @Min(1, { message: '精洗价格必须大于0' })
  premiumPrice?: number;

  /**
   * 豪华洗车价格（分）
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '豪华洗车价格必须是整数' })
  @Min(1, { message: '豪华洗车价格必须大于0' })
  deluxePrice?: number;
}

/**
 * 更新门店DTO
 */
export class UpdateStoreDto {
  /**
   * 门店名称
   */
  @IsOptional()
  @IsString({ message: '门店名称必须是字符串' })
  @Length(2, 100, { message: '门店名称长度必须在2-100字符之间' })
  @Transform(({ value }) => value?.trim())
  name?: string;

  /**
   * 门店地址
   */
  @IsOptional()
  @IsString({ message: '门店地址必须是字符串' })
  @Length(5, 255, { message: '门店地址长度必须在5-255字符之间' })
  @Transform(({ value }) => value?.trim())
  address?: string;

  /**
   * 联系人
   */
  @IsOptional()
  @IsString({ message: '联系人必须是字符串' })
  @Length(2, 50, { message: '联系人长度必须在2-50字符之间' })
  @Transform(({ value }) => value?.trim())
  contact?: string;

  /**
   * 联系电话
   */
  @IsOptional()
  @IsString({ message: '联系电话必须是字符串' })
  @Length(11, 20, { message: '联系电话长度必须在11-20字符之间' })
  phone?: string;

  /**
   * 经度
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '经度必须是数字' })
  @Min(-180, { message: '经度不能小于-180' })
  @Max(180, { message: '经度不能大于180' })
  longitude?: number;

  /**
   * 纬度
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '纬度必须是数字' })
  @Min(-90, { message: '纬度不能小于-90' })
  @Max(90, { message: '纬度不能大于90' })
  latitude?: number;

  /**
   * 门店状态
   */
  @IsOptional()
  @IsEnum(['active', 'disabled', 'maintenance'], {
    message: '门店状态必须是active、disabled或maintenance',
  })
  status?: string;

  /**
   * 营业时间
   */
  @IsOptional()
  @IsString({ message: '营业时间必须是字符串' })
  @Transform(({ value }) => value?.trim())
  businessHours?: string;

  /**
   * 门店描述
   */
  @IsOptional()
  @IsString({ message: '门店描述必须是字符串' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  /**
   * 基础洗车价格（分）
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '基础洗车价格必须是整数' })
  @Min(1, { message: '基础洗车价格必须大于0' })
  basicPrice?: number;

  /**
   * 精洗价格（分）
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '精洗价格必须是整数' })
  @Min(1, { message: '精洗价格必须大于0' })
  premiumPrice?: number;

  /**
   * 豪华洗车价格（分）
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '豪华洗车价格必须是整数' })
  @Min(1, { message: '豪华洗车价格必须大于0' })
  deluxePrice?: number;
}

/**
 * 创建设备DTO
 */
export class CreateDeviceDto {
  /**
   * 设备ID
   */
  @IsString({ message: '设备ID必须是字符串' })
  @Length(1, 50, { message: '设备ID长度必须在1-50字符之间' })
  @Transform(({ value }) => value?.trim())
  devid: string;

  /**
   * 设备名称
   */
  @IsString({ message: '设备名称必须是字符串' })
  @Length(2, 100, { message: '设备名称长度必须在2-100字符之间' })
  @Transform(({ value }) => value?.trim())
  name: string;

  /**
   * 门店ID
   */
  @Type(() => Number)
  @IsInt({ message: '门店ID必须是整数' })
  @Min(1, { message: '门店ID必须大于0' })
  storeId: number;

  /**
   * 设备型号
   */
  @IsOptional()
  @IsString({ message: '设备型号必须是字符串' })
  @Transform(({ value }) => value?.trim())
  model?: string;

  /**
   * ICCID
   */
  @IsOptional()
  @IsString({ message: 'ICCID必须是字符串' })
  @Transform(({ value }) => value?.trim())
  iccid?: string;

  /**
   * 设备位置
   */
  @IsOptional()
  @IsString({ message: '设备位置必须是字符串' })
  @Transform(({ value }) => value?.trim())
  location?: string;

  /**
   * 经度
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '经度必须是数字' })
  @Min(-180, { message: '经度不能小于-180' })
  @Max(180, { message: '经度不能大于180' })
  longitude?: number;

  /**
   * 纬度
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '纬度必须是数字' })
  @Min(-90, { message: '纬度不能小于-90' })
  @Max(90, { message: '纬度不能大于90' })
  latitude?: number;

  /**
   * 设备配置
   */
  @IsOptional()
  @IsJSON({ message: '设备配置必须是有效的JSON字符串' })
  config?: string;
}

/**
 * 更新设备DTO
 */
export class UpdateDeviceDto {
  /**
   * 设备名称
   */
  @IsOptional()
  @IsString({ message: '设备名称必须是字符串' })
  @Length(2, 100, { message: '设备名称长度必须在2-100字符之间' })
  @Transform(({ value }) => value?.trim())
  name?: string;

  /**
   * 设备型号
   */
  @IsOptional()
  @IsString({ message: '设备型号必须是字符串' })
  @Transform(({ value }) => value?.trim())
  model?: string;

  /**
   * 设备状态
   */
  @IsOptional()
  @IsEnum(['online', 'offline', 'busy', 'maintenance'], {
    message: '设备状态必须是online、offline、busy或maintenance',
  })
  status?: string;

  /**
   * ICCID
   */
  @IsOptional()
  @IsString({ message: 'ICCID必须是字符串' })
  @Transform(({ value }) => value?.trim())
  iccid?: string;

  /**
   * 设备位置
   */
  @IsOptional()
  @IsString({ message: '设备位置必须是字符串' })
  @Transform(({ value }) => value?.trim())
  location?: string;

  /**
   * 经度
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '经度必须是数字' })
  @Min(-180, { message: '经度不能小于-180' })
  @Max(180, { message: '经度不能大于180' })
  longitude?: number;

  /**
   * 纬度
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '纬度必须是数字' })
  @Min(-90, { message: '纬度不能小于-90' })
  @Max(90, { message: '纬度不能大于90' })
  latitude?: number;

  /**
   * 门店ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '门店ID必须是整数' })
  @Min(1, { message: '门店ID必须大于0' })
  storeId?: number;

  /**
   * 设备配置
   */
  @IsOptional()
  @IsJSON({ message: '设备配置必须是有效的JSON字符串' })
  config?: string;

  /**
   * 设备版本
   */
  @IsOptional()
  @IsString({ message: '设备版本必须是字符串' })
  @Transform(({ value }) => value?.trim())
  version?: string;
}

/**
 * 更新用户DTO
 */
export class UpdateUserDto {
  /**
   * 用户昵称
   */
  @IsOptional()
  @IsString({ message: '用户昵称必须是字符串' })
  @Length(1, 50, { message: '用户昵称长度必须在1-50字符之间' })
  @Transform(({ value }) => value?.trim())
  nickname?: string;

  /**
   * 用户角色
   */
  @IsOptional()
  @IsEnum(UserRole, { message: '用户角色无效' })
  role?: UserRole;

  /**
   * 用户状态
   */
  @IsOptional()
  @IsEnum(['active', 'disabled'], { message: '用户状态必须是active或disabled' })
  status?: string;

  /**
   * 账户余额（分）
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '账户余额必须是整数' })
  @Min(0, { message: '账户余额不能小于0' })
  balance?: number;

  /**
   * 门店ID（仅门店员工需要）
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '门店ID必须是整数' })
  @Min(1, { message: '门店ID必须大于0' })
  storeId?: number;

  /**
   * 员工角色（仅门店员工需要）
   */
  @IsOptional()
  @IsString({ message: '员工角色必须是字符串' })
  @Transform(({ value }) => value?.trim())
  staffRole?: string;
}

/**
 * 更新订单DTO
 */
export class UpdateOrderDto {
  /**
   * 订单状态
   */
  @IsOptional()
  @IsEnum(['draft', 'pending', 'paid', 'using', 'completed', 'cancelled', 'refunded'], {
    message: '订单状态无效',
  })
  status?: string;

  /**
   * 备注
   */
  @IsOptional()
  @IsString({ message: '备注必须是字符串' })
  @Transform(({ value }) => value?.trim())
  remark?: string;

  /**
   * 退款原因
   */
  @IsOptional()
  @IsString({ message: '退款原因必须是字符串' })
  @Transform(({ value }) => value?.trim())
  refundReason?: string;
}

/**
 * 更新库存DTO
 */
export class UpdateInventoryDto {
  /**
   * 当前库存量
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '当前库存量必须是数字' })
  @Min(0, { message: '当前库存量不能小于0' })
  currentStock?: number;

  /**
   * 最小阈值
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '最小阈值必须是数字' })
  @Min(0, { message: '最小阈值不能小于0' })
  minThreshold?: number;

  /**
   * 最大容量
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '最大容量必须是数字' })
  @Min(0, { message: '最大容量不能小于0' })
  maxCapacity?: number;

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
  @Transform(({ value }) => value?.trim())
  supplier?: string;

  /**
   * 库存状态
   */
  @IsOptional()
  @IsEnum(['normal', 'low', 'empty', 'expired'], {
    message: '库存状态必须是normal、low、empty或expired',
  })
  status?: string;

  /**
   * 备注
   */
  @IsOptional()
  @IsString({ message: '备注必须是字符串' })
  @Transform(({ value }) => value?.trim())
  remark?: string;

  /**
   * 操作类型（入库/出库）
   */
  @IsOptional()
  @IsEnum(['in', 'out'], { message: '操作类型必须是in或out' })
  operationType?: string;

  /**
   * 操作数量
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '操作数量必须是数字' })
  @Min(0.01, { message: '操作数量必须大于0' })
  operationAmount?: number;
}

/**
 * 确认告警DTO
 */
export class AcknowledgeAlertDto {
  /**
   * 处理方案
   */
  @IsString({ message: '处理方案必须是字符串' })
  @Length(1, 500, { message: '处理方案长度必须在1-500字符之间' })
  @Transform(({ value }) => value?.trim())
  resolution: string;

  /**
   * 备注
   */
  @IsOptional()
  @IsString({ message: '备注必须是字符串' })
  @Transform(({ value }) => value?.trim())
  remark?: string;
}

/**
 * 导出数据DTO
 */
export class ExportDataDto {
  /**
   * 导出类型
   */
  @IsString({ message: '导出类型必须是字符串' })
  @IsEnum(['orders', 'devices', 'stores', 'users', 'merchants'], {
    message: '导出类型必须是orders、devices、stores、users或merchants',
  })
  type: string;

  /**
   * 导出格式
   */
  @IsOptional()
  @IsString({ message: '导出格式必须是字符串' })
  @IsEnum(['excel', 'csv'], {
    message: '导出格式必须是excel或csv',
  })
  format?: string = 'excel';

  /**
   * 开始日期
   */
  @IsOptional()
  @IsDateString({}, { message: '开始日期格式无效' })
  startDate?: string;

  /**
   * 结束日期
   */
  @IsOptional()
  @IsDateString({}, { message: '结束日期格式无效' })
  endDate?: string;

  /**
   * 商户ID（可选筛选条件）
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '商户ID必须是整数' })
  merchantId?: number;

  /**
   * 门店ID（可选筛选条件）
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '门店ID必须是整数' })
  storeId?: number;
}