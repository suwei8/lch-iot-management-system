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
  Req,
  Ip,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { AuditLogDecorators } from '../../common/decorators/audit-log.decorator';
import { MerchantService } from './merchant.service';
import {
  StoreQueryDto,
  DeviceQueryDto,
  OrderQueryDto,
  InventoryQueryDto,
  AlertQueryDto,
  PaginationDto,
  UserQueryDto,
} from './dto/pagination.dto';
import {
  CreateStoreDto,
  UpdateStoreDto,
  CreateDeviceDto,
  UpdateDeviceDto,
  UpdateInventoryDto,
  AcknowledgeAlertDto,
  CreateStaffDto,
  UpdateStaffDto,
  UpdateMerchantProfileDto,
} from './dto/create-update.dto';

/**
 * 商户管理控制器
 * 提供商户端的门店管理、员工管理、设备监控、库存告警、订单报表等功能
 */
@Controller('merchant')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(UserRole.MERCHANT, UserRole.STORE_MANAGER)
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  /**
   * 获取商户仪表盘数据
   */
  @Get('dashboard')
  @RequirePermissions(Permission.MERCHANT_READ)
  async getDashboard(@Req() req: any) {
    return this.merchantService.getDashboardStats(req.user.id);
  }

  /**
   * 获取商户资料
   */
  @Get('profile')
  @RequirePermissions(Permission.MERCHANT_READ)
  async getProfile(@Req() req: any) {
    return this.merchantService.getMerchantProfile(req.user.id);
  }

  /**
   * 更新商户资料
   */
  @Put('profile')
  @RequirePermissions(Permission.MERCHANT_WRITE)
  @AuditLogDecorators.UpdateMerchant()
  async updateProfile(
    @Body() updateProfileDto: UpdateMerchantProfileDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.merchantService.updateMerchantProfile(req.user.id, updateProfileDto, req.user.id, ip);
  }

  /**
   * 获取门店列表
   */
  @Get('stores')
  async getStores(@Query() query: StoreQueryDto, @Req() req: any) {
    return this.merchantService.getStores(req.user.id, query);
  }

  /**
   * 创建门店
   */
  @Post('stores')
  @Roles(UserRole.MERCHANT)
  @RequirePermissions(Permission.STORE_WRITE)
  @AuditLogDecorators.CreateStore()
  async createStore(
    @Body() createStoreDto: CreateStoreDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.merchantService.createStore(req.user.id, createStoreDto, req.user.id, ip);
  }

  /**
   * 获取门店详情
   */
  @Get('stores/:id')
  async getStoreById(@Param('id') id: number, @Req() req: any) {
    return this.merchantService.getStoreById(req.user.id, id);
  }

  /**
   * 更新门店信息
   */
  @Put('stores/:id')
  @RequirePermissions(Permission.STORE_WRITE)
  @AuditLogDecorators.UpdateStore()
  async updateStore(
    @Param('id') id: number,
    @Body() updateStoreDto: UpdateStoreDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.merchantService.updateStore(req.user.id, id, updateStoreDto, req.user.id, ip);
  }

  /**
   * 获取门店员工列表
   */
  @Get('stores/:storeId/staff')
  async getStoreStaff(
    @Param('storeId') storeId: number,
    @Query() query: UserQueryDto,
    @Req() req: any,
  ) {
    return this.merchantService.getStaff(req.user.id, query);
  }

  /**
   * 添加门店员工
   */
  @Post('stores/:storeId/staff')
  @RequirePermissions(Permission.STAFF_WRITE)
  @AuditLogDecorators.CreateUser()
  async createStoreStaff(
    @Param('storeId') storeId: number,
    @Body() createStaffDto: CreateStaffDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.merchantService.createStaff(req.user.id, storeId, createStaffDto, req.user.id, ip);
  }

  /**
   * 更新员工信息
   */
  @Put('staff/:staffId')
  @RequirePermissions(Permission.STAFF_WRITE)
  @AuditLogDecorators.UpdateUser()
  async updateStaff(
    @Param('staffId') staffId: number,
    @Body() updateStaffDto: UpdateStaffDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.merchantService.updateStaff(req.user.id, staffId, updateStaffDto, req.user.id, ip);
  }

  /**
   * 删除员工
   */
  @Post('staff/:staffId/delete')
  @RequirePermissions(Permission.STAFF_DELETE)
  @AuditLogDecorators.DeleteUser()
  async deleteStaff(
    @Param('staffId') staffId: number,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.merchantService.deleteStaff(req.user.id, staffId, req.user.id, ip);
  }

  /**
   * 获取设备列表
   */
  @Get('devices')
  async getDevices(@Query() query: DeviceQueryDto, @Req() req: any) {
    return this.merchantService.getDevices(req.user.id, query);
  }

  /**
   * 创建设备
   */
  @Post('devices')
  @Roles(UserRole.MERCHANT)
  @RequirePermissions(Permission.DEVICE_WRITE)
  @AuditLogDecorators.CreateDevice()
  async createDevice(
    @Body() createDeviceDto: CreateDeviceDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.merchantService.createDevice(req.user.id, createDeviceDto, req.user.id, ip);
  }

  /**
   * 获取设备详情
   */
  @Get('devices/:id')
  async getDeviceById(@Param('id') id: number, @Req() req: any) {
    return this.merchantService.getDeviceById(req.user.id, id);
  }

  /**
   * 更新设备信息
   */
  @Put('devices/:id')
  @RequirePermissions(Permission.DEVICE_WRITE)
  @AuditLogDecorators.UpdateDevice()
  async updateDevice(
    @Param('id') id: number,
    @Body() updateDeviceDto: UpdateDeviceDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.merchantService.updateDevice(req.user.id, id, updateDeviceDto, req.user.id, ip);
  }

  /**
   * 获取设备日志
   */
  @Get('devices/:id/logs')
  async getDeviceLogs(
    @Param('id') id: number,
    @Query() query: PaginationDto,
    @Req() req: any,
  ) {
    return this.merchantService.getDeviceLogs(req.user.id, id, query);
  }

  /**
   * 获取订单列表
   */
  @Get('orders')
  async getOrders(@Query() query: OrderQueryDto, @Req() req: any) {
    return this.merchantService.getOrders(req.user.id, query);
  }

  /**
   * 获取订单详情
   */
  @Get('orders/:id')
  async getOrderById(@Param('id') id: number, @Req() req: any) {
    return this.merchantService.getOrderById(req.user.id, id);
  }

  /**
   * 获取订单统计报表
   */
  @Get('reports/orders')
  async getOrderReports(@Query() query: any, @Req() req: any) {
    return this.merchantService.getReports(req.user.id, query);
  }

  /**
   * 获取收入统计报表
   */
  @Get('reports/revenue')
  async getRevenueReports(@Query() query: any, @Req() req: any) {
    return this.merchantService.getReports(req.user.id, query);
  }

  /**
   * 获取库存列表
   */
  @Get('inventory')
  async getInventory(@Query() query: InventoryQueryDto, @Req() req: any) {
    return this.merchantService.getInventory(req.user.id, query);
  }

  /**
   * 更新库存
   */
  @Put('inventory/:id')
  @RequirePermissions(Permission.INVENTORY_WRITE)
  @AuditLogDecorators.UpdateInventory()
  async updateInventory(
    @Param('id') id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.merchantService.updateInventory(req.user.id, id, updateInventoryDto, req.user.id, ip);
  }

  /**
   * 获取告警列表
   */
  @Get('alerts')
  async getAlerts(@Query() query: AlertQueryDto, @Req() req: any) {
    return this.merchantService.getAlerts(req.user.id, query);
  }

  /**
   * 确认告警
   */
  @Put('alerts/:id/acknowledge')
  async acknowledgeAlert(
    @Param('id') id: number,
    @Body() acknowledgeAlertDto: AcknowledgeAlertDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.merchantService.acknowledgeAlert(req.user.id, id, acknowledgeAlertDto, req.user.id, ip);
  }
}