import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

/**
 * 用户注册DTO
 */
export class RegisterDto {
  /**
   * 手机号
   */
  @IsString({ message: '手机号必须是字符串' })
  @IsNotEmpty({ message: '手机号不能为空' })
  @Length(11, 11, { message: '手机号长度必须为11位' })
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone: string;

  /**
   * 密码
   */
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 20, { message: '密码长度必须在6-20位之间' })
  password: string;

  /**
   * 昵称（可选）
   */
  @IsString({ message: '昵称必须是字符串' })
  @Length(1, 50, { message: '昵称长度必须在1-50位之间' })
  nickname?: string;
}