import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

/**
 * 用户登录DTO
 */
export class LoginDto {
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
  password: string;
}