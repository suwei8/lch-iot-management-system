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
import { AdminService } from './admin.service';
import {
  PaginationDto,
  UserQueryDto,
  MerchantQueryDto,
  StoreQueryDto,
  DeviceQueryDto,
  OrderQueryDto,
  InventoryQueryDto,
  AlertQueryDto,
} from './dto/pagination.dto';
import {
  UpdateUserDto,
  CreateMerchantDto,
  UpdateMerchantDto,
  CreateStoreDto,
  UpdateStoreDto,
  CreateDeviceDto,
  UpdateDeviceDto,
  UpdateOrderDto,
  UpdateInventoryDto,
  AcknowledgeAlertDto,
  ExportDataDto,
} from './dto/create-update.dto';

/**
 * 管理员控制器
 */
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(UserRole.PLATFORM_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * 获取仪表板统计数据
   */
  @Get('dashboard/stats')
  @RequirePermissions(Permission.ADMIN_READ)
  async getDashboardStats() {
    return await this.adminService.getDashboardStats();
  }

  /**
   * 获取用户增长趋势
   */
  @Get('dashboard/user-growth')
  @RequirePermissions(Permission.USER_READ)
  async getUserGrowthTrend() {
    return await this.adminService.getUserTrend();
  }

  /**
   * 获取订单趋势
   */
  @Get('dashboard/order-trend')
  @RequirePermissions(Permission.ORDER_READ)
  async getOrderTrend() {
    return await this.adminService.getOrderTrend();
  }

  /**
   * 获取设备使用率统计
   */
  @Get('dashboard/device-usage')
  @RequirePermissions(Permission.DEVICE_READ)
  async getDeviceUsageStats() {
    return await this.adminService.getDeviceUsage();
  }

  /**
   * 获取系统健康状态
   */
  @Get('system/health')
  async getSystemHealth() {
    return await this.adminService.getSystemHealth();
  }

  /**
   * 获取系统日志
   */
  @Get('system/logs')
  async getSystemLogs(@Query() query: PaginationDto) {
    return await this.adminService.getSystemLogs(query);
  }

  /**
   * 清理系统缓存
   */
  @Post('system/clear-cache')
  async clearCache(@Req() req: any, @Ip() ip: string) {
    return await this.adminService.clearCache(req.user.id, ip);
  }

  /**
   * 获取用户列表
   */
  @Get('users')
  @RequirePermissions(Permission.USER_READ)
  async getUsers(@Query() query: UserQueryDto) {
    return this.adminService.getUsers(query);
  }

  /**
   * 获取用户详情
   */
  @Get('users/:id')
  @RequirePermissions(Permission.USER_READ)
  async getUserById(@Param('id') id: number) {
    return this.adminService.getUserById(id);
  }

  /**
   * 更新用户信息
   */
  @Put('users/:id')
  @RequirePermissions(Permission.USER_WRITE)
  @AuditLogDecorators.UpdateUser()
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.adminService.updateUser(id, updateUserDto, req.user.id, ip);
  }

  /**
   * 删除用户
   */
  @Post('users/:id/delete')
  @RequirePermissions(Permission.USER_DELETE)
  @AuditLogDecorators.DeleteUser()
  async deleteUser(
    @Param('id') id: number,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.adminService.deleteUser(id, req.user.id, ip);
  }

  /**
   * 创建商户
   */
  @Post('merchants')
  @AuditLogDecorators.CreateMerchant()
  async createMerchant(
    @Body() createMerchantDto: CreateMerchantDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.adminService.createMerchant(createMerchantDto, req.user.id, ip);
  }

  /**
   * 获取商户列表
   */
  @Get('merchants')
  async getMerchants(@Query() query: MerchantQueryDto) {
    return this.adminService.getMerchants(query);
  }

  /**
   * 获取商户详情
   */
  @Get('merchants/:id')
  async getMerchantById(@Param('id') id: number) {
    return this.adminService.getMerchantById(id);
  }

  /**
   * 更新商户信息
   */
  @Put('merchants/:id')
  @AuditLogDecorators.UpdateMerchant()
  async updateMerchant(
    @Param('id') id: number,
    @Body() updateMerchantDto: UpdateMerchantDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.adminService.updateMerchant(id, updateMerchantDto, req.user.id, ip);
  }

  /**
   * 删除商户
   */
  @Post('merchants/:id/delete')
  @AuditLogDecorators.DeleteMerchant()
  async deleteMerchant(
    @Param('id') id: number,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.adminService.deleteMerchant(id, req.user.id, ip);
  }

  /**
   * 创建门店
   */
  @Post('stores')
  @AuditLogDecorators.CreateStore()
  async createStore(
    @Body() createStoreDto: CreateStoreDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.adminService.createStore(createStoreDto, req.user.id, ip);
  }

  /**
   * 获取门店列表
   */
  @Get('stores')
  async getStores(@Query() query: StoreQueryDto) {
    return this.adminService.getStores(query);
  }

  /**
   * 获取门店详情
   */
  @Get('stores/:id')
  async getStoreById(@Param('id') id: number) {
    return this.adminService.getStoreById(id);
  }

  /**
   * 更新门店信息
   */
  @Put('stores/:id')
  @AuditLogDecorators.UpdateStore()
  async updateStore(
    @Param('id') id: number,
    @Body() updateStoreDto: UpdateStoreDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.adminService.updateStore(id, updateStoreDto, req.user.id, ip);
  }

  /**
   * 删除门店
   */
  @Post('stores/:id/delete')
  @AuditLogDecorators.DeleteStore()
  async deleteStore(
    @Param('id') id: number,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.adminService.deleteStore(id, req.user.id, ip);
  }

  /**
   * 创建设备
   */
  @Post('devices')
  @AuditLogDecorators.CreateDevice()
  async createDevice(
    @Body() createDeviceDto: CreateDeviceDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.adminService.createDevice(createDeviceDto, req.user.id, ip);
  }

  /**
   * 获取设备列表
   */
  @Get('devices')
  async getDevices(@Query() query: DeviceQueryDto) {
    return this.adminService.getDevices(query);
  }

  /**
   * 获取设备详情
   */
  @Get('devices/:id')
  async getDeviceById(@Param('id') id: number) {
    return this.adminService.getDeviceById(id);
  }

  /**
   * 更新设备信息
   */
  @Put('devices/:id')
  @AuditLogDecorators.UpdateDevice()
  async updateDevice(
    @Param('id') id: number,
    @Body() updateDeviceDto: UpdateDeviceDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.adminService.updateDevice(id, updateDeviceDto, req.user.id, ip);
  }

  /**
   * 删除设备
   */
  @Post('devices/:id/delete')
  @AuditLogDecorators.DeleteDevice()
  async deleteDevice(
    @Param('id') id: number,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.adminService.deleteDevice(id, req.user.id, ip);
  }

  /**
   * 获取设备日志
   */
  @Get('devices/:id/logs')
  async getDeviceLogs(
    @Param('id') id: number,
    @Query() query: PaginationDto,
  ) {
    return this.adminService.getDeviceLogs(id, query);
  }

  /**
   * 获取订单列表
   */
  @Get('orders')
  async getOrders(@Query() query: OrderQueryDto) {
    return this.adminService.getOrders(query);
  }

  /**
   * 获取订单详情
   */
  @Get('orders/:id')
  async getOrderById(@Param('id') id: number) {
    return this.adminService.getOrderById(id);
  }

  /**
   * 更新订单信息
   */
  @Put('orders/:id')
  @AuditLogDecorators.UpdateOrder()
  async updateOrder(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.adminService.updateOrder(id, updateOrderDto, req.user.id, ip);
  }

  /**
   * 获取库存列表
   */
  @Get('inventory')
  async getInventory(@Query() query: InventoryQueryDto) {
    return this.adminService.getInventory(query);
  }

  /**
   * 更新库存
   */
  @Put('inventory/:id')
  @AuditLogDecorators.UpdateInventory()
  async updateInventory(
    @Param('id') id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.adminService.updateInventory(id, updateInventoryDto, req.user.id, ip);
  }

  /**
   * 获取告警列表
   */
  @Get('alerts')
  async getAlerts(@Query() query: AlertQueryDto) {
    return this.adminService.getAlerts(query);
  }

  /**
   * 确认告警
   */
  @Put('alerts/:id/acknowledge')
  @AuditLogDecorators.AcknowledgeAlert()
  async acknowledgeAlert(
    @Param('id') id: number,
    @Body() acknowledgeAlertDto: AcknowledgeAlertDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return await this.adminService.acknowledgeAlert(id, acknowledgeAlertDto, req.user.id, ip);
  }

  /**
   * 导出数据
   * @param exportDataDto 导出参数
   */
  @Post('data/export')
  async exportData(
    @Body() exportDataDto: ExportDataDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return await this.adminService.exportData(exportDataDto, req.user.id, ip);
  }
}