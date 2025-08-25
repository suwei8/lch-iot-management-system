import { IsString, IsOptional, Length, IsEnum, IsNumber, Min } from 'class-validator';
import { UserRole } from '../../../common/decorators/roles.decorator';

/**
 * 更新用户DTO
 */
export class UpdateUserDto {
  /**
   * 昵称
   */
  @IsOptional()
  @IsString({ message: '昵称必须是字符串' })
  @Length(1, 50, { message: '昵称长度必须在1-50位之间' })
  nickname?: string;

  /**
   * 头像URL
   */
  @IsOptional()
  @IsString({ message: '头像必须是字符串' })
  avatar?: string;

  /**
   * 用户角色（仅管理员可修改）
   */
  @IsOptional()
  @IsEnum(UserRole, { message: '用户角色必须是有效值' })
  role?: UserRole;

  /**
   * 用户状态（仅管理员可修改）
   */
  @IsOptional()
  @IsString({ message: '状态必须是字符串' })
  @IsEnum(['active', 'inactive'], { message: '状态必须是active或inactive' })
  status?: string;

  /**
   * 余额（仅管理员可修改）
   */
  @IsOptional()
  @IsNumber({}, { message: '余额必须是数字' })
  @Min(0, { message: '余额不能为负数' })
  balance?: number;
}