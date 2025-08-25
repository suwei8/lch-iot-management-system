import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PayOrderDto } from './dto/pay-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

/**
 * 订单控制器
 */
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * 创建订单
   * @param req 请求对象
   * @param createOrderDto 创建订单数据
   */
  @Post()
  async create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(req.user.id, createOrderDto);
  }

  /**
   * 获取订单列表
   * @param req 请求对象
   * @param page 页码
   * @param limit 每页数量
   * @param status 状态筛选
   */
  @Get()
  async findAll(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: string,
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    
    // 普通用户只能查看自己的订单
    const userId = req.user.role === 'admin' ? undefined : req.user.id;
    
    return await this.orderService.findAll(pageNum, limitNum, userId, undefined, status);
  }

  /**
   * 获取所有订单（仅管理员）
   * @param page 页码
   * @param limit 每页数量
   * @param userId 用户ID筛选
   * @param merchantId 商户ID筛选
   * @param status 状态筛选
   */
  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findAllForAdmin(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('userId') userId?: string,
    @Query('merchantId') merchantId?: string,
    @Query('status') status?: string,
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const userIdNum = userId ? parseInt(userId, 10) : undefined;
    const merchantIdNum = merchantId ? parseInt(merchantId, 10) : undefined;
    
    return await this.orderService.findAll(pageNum, limitNum, userIdNum, merchantIdNum, status);
  }

  /**
   * 获取指定订单详情
   * @param req 请求对象
   * @param id 订单ID
   */
  @Get(':id')
  async findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const order = await this.orderService.findOne(id);
    
    // 普通用户只能查看自己的订单
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      throw new Error('无权查看此订单');
    }
    
    return order;
  }

  /**
   * 更新订单（仅管理员）
   * @param id 订单ID
   * @param updateOrderDto 更新数据
   */
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.orderService.update(id, updateOrderDto);
  }

  /**
   * 支付订单
   * @param req 请求对象
   * @param orderNumber 订单号
   * @param payOrderDto 支付数据
   */
  @Post(':orderNumber/pay')
  async pay(
    @Request() req,
    @Param('orderNumber') orderNumber: string,
    @Body() payOrderDto: PayOrderDto,
  ) {
    const order = await this.orderService.findByOrderNumber(orderNumber);
    
    // 验证订单所有者
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      throw new Error('无权支付此订单');
    }
    
    return await this.orderService.pay(orderNumber, payOrderDto.paymentMethod);
  }

  /**
   * 取消订单
   * @param req 请求对象
   * @param id 订单ID
   */
  @Post(':id/cancel')
  async cancel(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return await this.orderService.cancel(id, req.user.id);
  }

  /**
   * 开始洗车（设备回调接口）
   * @param orderNumber 订单号
   */
  @Post(':orderNumber/start')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async startWash(@Param('orderNumber') orderNumber: string) {
    return await this.orderService.startWash(orderNumber);
  }

  /**
   * 完成洗车（设备回调接口）
   * @param orderNumber 订单号
   * @param body 请求体
   */
  @Post(':orderNumber/complete')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async completeWash(
    @Param('orderNumber') orderNumber: string,
    @Body() body: { actualDuration?: number },
  ) {
    return await this.orderService.completeWash(orderNumber, body.actualDuration);
  }

  /**
   * 获取用户订单统计
   * @param req 请求对象
   */
  @Get('stats/user')
  async getUserStats(@Request() req) {
    return await this.orderService.getUserOrderStats(req.user.id);
  }

  /**
   * 获取指定用户订单统计（仅管理员）
   * @param userId 用户ID
   */
  @Get('stats/user/:userId')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getUserStatsForAdmin(@Param('userId', ParseIntPipe) userId: number) {
    return await this.orderService.getUserOrderStats(userId);
  }
}