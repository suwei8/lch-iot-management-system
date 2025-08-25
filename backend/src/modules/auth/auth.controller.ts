import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

/**
 * 认证控制器
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户注册
   * @param registerDto 注册信息
   */
  @Post('register')
  @ApiOperation({ 
    summary: '用户注册', 
    description: '创建新用户账户，支持管理员和商户角色注册' 
  })
  @ApiBody({ 
    type: RegisterDto,
    description: '用户注册信息',
    examples: {
      admin: {
        summary: '管理员注册示例',
        value: {
          username: 'admin',
          email: 'admin@example.com',
          password: 'Admin123!',
          role: 'admin',
          merchantName: null
        }
      },
      merchant: {
        summary: '商户注册示例',
        value: {
          username: 'merchant01',
          email: 'merchant@example.com',
          password: 'Merchant123!',
          role: 'merchant',
          merchantName: '示例商户'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: '注册成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '注册成功' },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'uuid-string' },
                username: { type: 'string', example: 'admin' },
                email: { type: 'string', example: 'admin@example.com' },
                role: { type: 'string', example: 'admin' },
                status: { type: 'string', example: 'active' },
                createdAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        timestamp: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: '请求参数错误',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: '用户名已存在' },
        error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'USER_EXISTS' },
            details: { type: 'string', example: '该用户名已被注册' }
          }
        },
        timestamp: { type: 'string', format: 'date-time' }
      }
    }
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  /**
   * 用户登录
   * @param loginDto 登录信息
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: '用户登录', 
    description: '用户身份验证，返回JWT访问令牌和用户信息' 
  })
  @ApiBody({ 
    type: LoginDto,
    description: '用户登录凭据',
    examples: {
      admin: {
        summary: '管理员登录示例',
        value: {
          username: 'admin',
          password: 'Admin123!'
        }
      },
      merchant: {
        summary: '商户登录示例',
        value: {
          username: 'merchant01',
          password: 'Merchant123!'
        }
      },
      email: {
        summary: '邮箱登录示例',
        value: {
          username: 'admin@example.com',
          password: 'Admin123!'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: '登录成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '登录成功' },
        data: {
          type: 'object',
          properties: {
            token: { 
              type: 'string', 
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              description: 'JWT访问令牌'
            },
            refreshToken: { 
              type: 'string', 
              example: 'refresh-token-string',
              description: '刷新令牌'
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'uuid-string' },
                username: { type: 'string', example: 'admin' },
                email: { type: 'string', example: 'admin@example.com' },
                role: { type: 'string', example: 'admin' },
                status: { type: 'string', example: 'active' },
                lastLoginAt: { type: 'string', format: 'date-time' }
              }
            },
            expiresIn: { 
              type: 'integer', 
              example: 3600,
              description: '令牌过期时间（秒）'
            }
          }
        },
        timestamp: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: '认证失败',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: '用户名或密码错误' },
        error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'INVALID_CREDENTIALS' },
            details: { type: 'string', example: '提供的登录凭据无效' }
          }
        },
        timestamp: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: '账户被禁用',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: '账户已被禁用' },
        error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'ACCOUNT_DISABLED' },
            details: { type: 'string', example: '该账户已被管理员禁用' }
          }
        },
        timestamp: { type: 'string', format: 'date-time' }
      }
    }
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}