import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

/**
 * JWT策略
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'sw63828!',
    });
  }

  /**
   * 验证JWT载荷
   * @param payload JWT载荷
   */
  async validate(payload: any) {
    const { userId } = payload;
    
    // 根据用户ID查找用户
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('用户已被禁用');
    }

    return {
      userId: user.id,
      phone: user.phone,
      role: user.role,
      nickname: user.nickname,
    };
  }
}