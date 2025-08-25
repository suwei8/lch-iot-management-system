import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsEmail,
  IsPhoneNumber,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsBoolean,
  IsDateString,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsUUID,
  Matches,
  IsUrl,
  IsJSON,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * ID验证DTO
 */
export class IdDto {
  /**
   * ID
   */
  @ApiProperty({ description: 'ID', example: 1 })
  @Type(() => Number)
  @IsNumber({}, { message: 'ID必须是数字' })
  @Min(1, { message: 'ID必须大于0' })
  id: number;
}

/**
 * 批量ID验证DTO
 */
export class BatchIdDto {
  /**
   * ID列表
   */
  @ApiProperty({ description: 'ID列表', example: [1, 2, 3] })
  @IsArray({ message: 'IDs必须是数组' })
  @ArrayMinSize(1, { message: '至少选择一个项目' })
  @ArrayMaxSize(100, { message: '最多选择100个项目' })
  @Type(() => Number)
  @IsNumber({}, { each: true, message: '每个ID必须是数字' })
  @Min(1, { each: true, message: '每个ID必须大于0' })
  ids: number[];
}

/**
 * 状态更新DTO
 */
export class StatusUpdateDto {
  /**
   * 状态
   */
  @ApiProperty({ description: '状态', example: 'active' })
  @IsString({ message: '状态必须是字符串' })
  @IsEnum(['active', 'inactive'], { message: '状态必须是active或inactive' })
  status: string;

  /**
   * 备注
   */
  @ApiProperty({ description: '备注', example: '状态更新原因', required: false })
  @IsOptional()
  @IsString({ message: '备注必须是字符串' })
  @MaxLength(500, { message: '备注最多500个字符' })
  remark?: string;
}

/**
 * 排序DTO
 */
export class SortDto {
  /**
   * 排序字段
   */
  @ApiProperty({ description: '排序字段', example: 'createdAt' })
  @IsOptional()
  @IsString({ message: '排序字段必须是字符串' })
  sortBy?: string;

  /**
   * 排序方向
   */
  @ApiProperty({ description: '排序方向', example: 'DESC', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: '排序方向必须是ASC或DESC' })
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * 日期范围DTO
 */
export class DateRangeDto {
  /**
   * 开始日期
   */
  @ApiProperty({ description: '开始日期', example: '2024-01-01' })
  @IsDateString({}, { message: '开始日期格式无效' })
  startDate: string;

  /**
   * 结束日期
   */
  @ApiProperty({ description: '结束日期', example: '2024-12-31' })
  @IsDateString({}, { message: '结束日期格式无效' })
  endDate: string;
}

/**
 * 搜索DTO
 */
export class SearchDto {
  /**
   * 搜索关键词
   */
  @ApiProperty({ description: '搜索关键词', example: '关键词', required: false })
  @IsOptional()
  @IsString({ message: '搜索关键词必须是字符串' })
  @MaxLength(100, { message: '搜索关键词最多100个字符' })
  keyword?: string;

  /**
   * 搜索字段
   */
  @ApiProperty({ description: '搜索字段', example: ['name', 'description'], required: false })
  @IsOptional()
  @IsArray({ message: '搜索字段必须是数组' })
  @IsString({ each: true, message: '每个搜索字段必须是字符串' })
  fields?: string[];
}

/**
 * 密码验证DTO
 */
export class PasswordDto {
  /**
   * 密码
   */
  @ApiProperty({ description: '密码', example: '123456' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码至少6位' })
  @MaxLength(20, { message: '密码最多20位' })
  password: string;
}

/**
 * 修改密码DTO
 */
export class ChangePasswordDto extends PasswordDto {
  /**
   * 旧密码
   */
  @ApiProperty({ description: '旧密码', example: 'oldpassword' })
  @IsString({ message: '旧密码必须是字符串' })
  oldPassword: string;

  /**
   * 确认密码
   */
  @ApiProperty({ description: '确认密码', example: '123456' })
  @IsString({ message: '确认密码必须是字符串' })
  confirmPassword: string;
}

/**
 * 手机号验证DTO
 */
export class PhoneDto {
  /**
   * 手机号
   */
  @ApiProperty({ description: '手机号', example: '13800138000' })
  @IsString({ message: '手机号必须是字符串' })
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone: string;
}

/**
 * 邮箱验证DTO
 */
export class EmailDto {
  /**
   * 邮箱
   */
  @ApiProperty({ description: '邮箱', example: 'user@example.com' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;
}

/**
 * 验证码DTO
 */
export class VerificationCodeDto {
  /**
   * 验证码
   */
  @ApiProperty({ description: '验证码', example: '123456' })
  @IsString({ message: '验证码必须是字符串' })
  @Matches(/^\d{6}$/, { message: '验证码必须是6位数字' })
  code: string;

  /**
   * 验证码类型
   */
  @ApiProperty({ description: '验证码类型', example: 'login', enum: ['login', 'register', 'reset_password'] })
  @IsEnum(['login', 'register', 'reset_password'], {
    message: '验证码类型必须是login、register或reset_password',
  })
  type: string;
}

/**
 * 文件上传DTO
 */
export class FileUploadDto {
  /**
   * 文件类型
   */
  @ApiProperty({ description: '文件类型', example: 'image', enum: ['image', 'document', 'video', 'audio'] })
  @IsOptional()
  @IsEnum(['image', 'document', 'video', 'audio'], {
    message: '文件类型必须是image、document、video或audio',
  })
  fileType?: string;

  /**
   * 最大文件大小（MB）
   */
  @ApiProperty({ description: '最大文件大小（MB）', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '文件大小必须是数字' })
  @Min(1, { message: '文件大小至少1MB' })
  @Max(100, { message: '文件大小最多100MB' })
  maxSize?: number;
}

/**
 * 坐标DTO
 */
export class CoordinateDto {
  /**
   * 经度
   */
  @ApiProperty({ description: '经度', example: 116.404 })
  @Type(() => Number)
  @IsNumber({}, { message: '经度必须是数字' })
  @Min(-180, { message: '经度范围：-180到180' })
  @Max(180, { message: '经度范围：-180到180' })
  longitude: number;

  /**
   * 纬度
   */
  @ApiProperty({ description: '纬度', example: 39.915 })
  @Type(() => Number)
  @IsNumber({}, { message: '纬度必须是数字' })
  @Min(-90, { message: '纬度范围：-90到90' })
  @Max(90, { message: '纬度范围：-90到90' })
  latitude: number;
}

/**
 * 地址DTO
 */
export class AddressDto extends CoordinateDto {
  /**
   * 省份
   */
  @ApiProperty({ description: '省份', example: '北京市' })
  @IsString({ message: '省份必须是字符串' })
  @MaxLength(50, { message: '省份最多50个字符' })
  province: string;

  /**
   * 城市
   */
  @ApiProperty({ description: '城市', example: '北京市' })
  @IsString({ message: '城市必须是字符串' })
  @MaxLength(50, { message: '城市最多50个字符' })
  city: string;

  /**
   * 区县
   */
  @ApiProperty({ description: '区县', example: '朝阳区' })
  @IsString({ message: '区县必须是字符串' })
  @MaxLength(50, { message: '区县最多50个字符' })
  district: string;

  /**
   * 详细地址
   */
  @ApiProperty({ description: '详细地址', example: '某某街道某某号' })
  @IsString({ message: '详细地址必须是字符串' })
  @MaxLength(200, { message: '详细地址最多200个字符' })
  address: string;

  /**
   * 邮政编码
   */
  @ApiProperty({ description: '邮政编码', example: '100000', required: false })
  @IsOptional()
  @IsString({ message: '邮政编码必须是字符串' })
  @Matches(/^\d{6}$/, { message: '邮政编码必须是6位数字' })
  zipCode?: string;
}