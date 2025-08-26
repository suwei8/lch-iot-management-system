import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../../common/decorators/roles.decorator';

/**
 * 认证服务
 */
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * 用户注册
   * @param registerDto 注册信息
   */
  async register(registerDto: RegisterDto) {
    const { phone, password, nickname } = registerDto;

    // 检查手机号是否已存在
    const existingUser = await this.userService.findByPhone(phone);
    if (existingUser) {
      throw new ConflictException('手机号已被注册');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await this.userService.create({
      phone,
      password: hashedPassword,
      nickname: nickname || `用户${phone.slice(-4)}`,
      role: UserRole.USER,
    });

    // 生成JWT token
    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        role: user.role,
        balance: user.balance,
        status: user.status,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * 用户登录
   * @param loginDto 登录信息
   */
  async login(loginDto: LoginDto) {
    const { phone, password } = loginDto;

    // 查找用户
    const user = await this.userService.findByPhone(phone);
    if (!user) {
      throw new UnauthorizedException('手机号或密码错误');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('手机号或密码错误');
    }

    // 检查用户状态
    if (user.status !== 'active') {
      throw new UnauthorizedException('账户已被禁用');
    }

    // 更新最后登录时间
    await this.userService.updateLastLogin(user.id);

    // 生成JWT token
    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        role: user.role,
        balance: user.balance,
        status: user.status,
        lastLoginAt: new Date(),
      },
      token,
    };
  }

  /**
   * 生成JWT token
   * @param user 用户信息
   */
  private generateToken(user: any) {
    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * 验证token
   * @param token JWT token
   */
  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findById(payload.sub);
      
      if (!user || user.status !== 'active') {
        throw new UnauthorizedException('无效的token');
      }

      return {
        userId: user.id,
        phone: user.phone,
        role: user.role,
        nickname: user.nickname,
      };
    } catch (error) {
      throw new UnauthorizedException('无效的token');
    }
  }
}