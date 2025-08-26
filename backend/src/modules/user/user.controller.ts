import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery, 
  ApiBearerAuth,
  ApiBody 
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * 用户控制器
 */
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 获取当前用户信息
   * @param req 请求对象
   */
  @Get('profile')
  @ApiOperation({ 
    summary: '获取当前用户信息', 
    description: '获取当前登录用户的详细信息' 
  })
  @ApiResponse({ 
    status: 200, 
    description: '获取成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '获取成功' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-string' },
            phone: { type: 'string', example: '13800138000' },
            nickname: { type: 'string', example: '用户昵称' },
            role: { type: 'string', example: 'merchant' },
            avatar: { type: 'string', example: 'https://example.com/avatar.jpg' },
            balance: { type: 'number', example: 1000.50 },
            status: { type: 'string', example: 'active' },
            lastLoginAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        timestamp: { type: 'string', format: 'date-time' }
      }
    }
  })
  async getProfile(@Request() req) {
    const user = await this.userService.findById(req.user.userId);
    return {
      id: user.id,
      phone: user.phone,
      nickname: user.nickname,
      role: user.role,
      avatar: user.avatar,
      balance: user.balance,
      status: user.status,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * 更新当前用户信息
   * @param req 请求对象
   * @param updateUserDto 更新数据
   */
  @Put('profile')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(req.user.userId, updateUserDto);
    return {
      id: updatedUser.id,
      phone: updatedUser.phone,
      nickname: updatedUser.nickname,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      balance: updatedUser.balance,
      status: updatedUser.status,
      lastLoginAt: updatedUser.lastLoginAt,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  /**
   * 获取用户列表（仅管理员）
   * @param page 页码
   * @param limit 每页数量
   * @param role 角色筛选
   * @param status 状态筛选
   */
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('role') role?: UserRole,
    @Query('status') status?: string,
  ) {
    return await this.userService.findAll(page, limit, role, status);
  }

  /**
   * 获取指定用户信息（仅管理员）
   * @param id 用户ID
   */
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findById(id);
    return {
      id: user.id,
      phone: user.phone,
      nickname: user.nickname,
      role: user.role,
      avatar: user.avatar,
      balance: user.balance,
      status: user.status,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * 更新指定用户信息（仅管理员）
   * @param id 用户ID
   * @param updateUserDto 更新数据
   */
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return {
      id: updatedUser.id,
      phone: updatedUser.phone,
      nickname: updatedUser.nickname,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      balance: updatedUser.balance,
      status: updatedUser.status,
      lastLoginAt: updatedUser.lastLoginAt,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  /**
   * 删除用户（仅管理员）
   * @param id 用户ID
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.userService.remove(id);
    return { message: '用户删除成功' };
  }
}