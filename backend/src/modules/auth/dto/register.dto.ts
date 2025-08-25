import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 用户注册DTO
 */
export class RegisterDto {
  /**
   * 手机号
   */
  @ApiProperty({
    description: '用户手机号',
    example: '13800138000',
    pattern: '^1[3-9]\\d{9}$',
    minLength: 11,
    maxLength: 11
  })
  @IsString({ message: '手机号必须是字符串' })
  @IsNotEmpty({ message: '手机号不能为空' })
  @Length(11, 11, { message: '手机号长度必须为11位' })
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone: string;

  /**
   * 密码
   */
  @ApiProperty({
    description: '用户密码',
    example: 'password123',
    minLength: 6,
    maxLength: 20
  })
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 20, { message: '密码长度必须在6-20位之间' })
  password: string;

  /**
   * 昵称（可选）
   */
  @ApiPropertyOptional({
    description: '用户昵称',
    example: '张三',
    minLength: 1,
    maxLength: 50
  })
  @IsString({ message: '昵称必须是字符串' })
  @Length(1, 50, { message: '昵称长度必须在1-50位之间' })
  nickname?: string;
}