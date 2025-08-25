import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
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
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceCallbackDto } from './dto/device-callback.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';

/**
 * 设备控制器
 */
@ApiTags('Devices')
@ApiBearerAuth()
@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  /**
   * 创建设备（仅管理员）
   * @param createDeviceDto 创建设备数据
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiOperation({ 
    summary: '创建设备', 
    description: '创建新的IoT设备，仅管理员可操作' 
  })
  @ApiBody({ 
    type: CreateDeviceDto,
    description: '设备创建信息',
    examples: {
      sensor: {
        summary: '传感器设备示例',
        value: {
          name: '温湿度传感器01',
          code: 'TH-001',
          type: 'sensor',
          model: 'DHT22',
          manufacturer: '博世',
          location: '车间A-01',
          merchantId: 'merchant-uuid',
          config: {
            interval: 60,
            threshold: { temperature: 35, humidity: 80 }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: '设备创建成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '设备创建成功' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'device-uuid' },
            name: { type: 'string', example: '温湿度传感器01' },
            code: { type: 'string', example: 'TH-001' },
            type: { type: 'string', example: 'sensor' },
            status: { type: 'string', example: 'offline' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        timestamp: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权访问' })
  @ApiResponse({ status: 403, description: '权限不足' })
  async create(@Body() createDeviceDto: CreateDeviceDto) {
    return await this.deviceService.create(createDeviceDto);
  }

  /**
   * 获取设备列表
   * @param page 页码
   * @param limit 每页数量
   * @param merchantId 商户ID筛选
   * @param status 状态筛选
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('merchantId') merchantId?: number,
    @Query('status') status?: string,
  ) {
    return await this.deviceService.findAll(page, limit, merchantId, status);
  }

  /**
   * 获取指定设备信息
   * @param id 设备ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.deviceService.findOne(id);
  }

  /**
   * 更新设备信息（仅管理员）
   * @param id 设备ID
   * @param updateDeviceDto 更新数据
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    return await this.deviceService.update(id, updateDeviceDto);
  }

  /**
   * 删除设备（仅管理员）
   * @param id 设备ID
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.deviceService.remove(id);
    return { message: '设备删除成功' };
  }

  /**
   * 获取设备日志
   * @param id 设备ID
   * @param page 页码
   * @param limit 每页数量
   * @param eventType 事件类型筛选
   */
  @Get(':id/logs')
  @UseGuards(JwtAuthGuard)
  async getDeviceLogs(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('eventType') eventType?: string,
  ) {
    return await this.deviceService.getDeviceLogs(id, page, limit, eventType);
  }

  /**
   * 设备回调接口（IoT设备调用，无需认证）
   * @param deviceCallbackDto 设备回调数据
   */
  @Post('callback')
  @HttpCode(HttpStatus.OK)
  async handleCallback(@Body() deviceCallbackDto: DeviceCallbackDto) {
    await this.deviceService.handleCallback(deviceCallbackDto);
    return { message: '回调处理成功' };
  }
}