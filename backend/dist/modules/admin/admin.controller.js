"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const permission_enum_1 = require("../../common/enums/permission.enum");
const audit_log_decorator_1 = require("../../common/decorators/audit-log.decorator");
const admin_service_1 = require("./admin.service");
const pagination_dto_1 = require("./dto/pagination.dto");
const create_update_dto_1 = require("./dto/create-update.dto");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getDashboardStats() {
        return await this.adminService.getDashboardStats();
    }
    async getUserGrowthTrend() {
        return await this.adminService.getUserTrend();
    }
    async getOrderTrend() {
        return await this.adminService.getOrderTrend();
    }
    async getDeviceUsageStats() {
        return await this.adminService.getDeviceUsage();
    }
    async getSystemHealth() {
        return await this.adminService.getSystemHealth();
    }
    async getSystemLogs(query) {
        return await this.adminService.getSystemLogs(query);
    }
    async clearCache(req, ip) {
        return await this.adminService.clearCache(req.user.id, ip);
    }
    async getUsers(query) {
        return this.adminService.getUsers(query);
    }
    async getUserById(id) {
        return this.adminService.getUserById(id);
    }
    async updateUser(id, updateUserDto, req, ip) {
        return this.adminService.updateUser(id, updateUserDto, req.user.id, ip);
    }
    async deleteUser(id, req, ip) {
        return this.adminService.deleteUser(id, req.user.id, ip);
    }
    async createMerchant(createMerchantDto, req, ip) {
        return this.adminService.createMerchant(createMerchantDto, req.user.id, ip);
    }
    async getMerchants(query) {
        return this.adminService.getMerchants(query);
    }
    async getMerchantById(id) {
        return this.adminService.getMerchantById(id);
    }
    async updateMerchant(id, updateMerchantDto, req, ip) {
        return this.adminService.updateMerchant(id, updateMerchantDto, req.user.id, ip);
    }
    async deleteMerchant(id, req, ip) {
        return this.adminService.deleteMerchant(id, req.user.id, ip);
    }
    async createStore(createStoreDto, req, ip) {
        return this.adminService.createStore(createStoreDto, req.user.id, ip);
    }
    async getStores(query) {
        return this.adminService.getStores(query);
    }
    async getStoreById(id) {
        return this.adminService.getStoreById(id);
    }
    async updateStore(id, updateStoreDto, req, ip) {
        return this.adminService.updateStore(id, updateStoreDto, req.user.id, ip);
    }
    async deleteStore(id, req, ip) {
        return this.adminService.deleteStore(id, req.user.id, ip);
    }
    async createDevice(createDeviceDto, req, ip) {
        return this.adminService.createDevice(createDeviceDto, req.user.id, ip);
    }
    async getDevices(query) {
        return this.adminService.getDevices(query);
    }
    async getDeviceById(id) {
        return this.adminService.getDeviceById(id);
    }
    async updateDevice(id, updateDeviceDto, req, ip) {
        return this.adminService.updateDevice(id, updateDeviceDto, req.user.id, ip);
    }
    async deleteDevice(id, req, ip) {
        return this.adminService.deleteDevice(id, req.user.id, ip);
    }
    async getDeviceLogs(id, query) {
        return this.adminService.getDeviceLogs(id, query);
    }
    async getOrders(query) {
        return this.adminService.getOrders(query);
    }
    async getOrderById(id) {
        return this.adminService.getOrderById(id);
    }
    async updateOrder(id, updateOrderDto, req, ip) {
        return this.adminService.updateOrder(id, updateOrderDto, req.user.id, ip);
    }
    async getInventory(query) {
        return this.adminService.getInventory(query);
    }
    async updateInventory(id, updateInventoryDto, req, ip) {
        return this.adminService.updateInventory(id, updateInventoryDto, req.user.id, ip);
    }
    async getAlerts(query) {
        return this.adminService.getAlerts(query);
    }
    async acknowledgeAlert(id, acknowledgeAlertDto, req, ip) {
        return await this.adminService.acknowledgeAlert(id, acknowledgeAlertDto, req.user.id, ip);
    }
    async exportData(exportDataDto, req, ip) {
        return await this.adminService.exportData(exportDataDto, req.user.id, ip);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard/stats'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.ADMIN_READ),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('dashboard/user-growth'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.USER_READ),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserGrowthTrend", null);
__decorate([
    (0, common_1.Get)('dashboard/order-trend'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.ORDER_READ),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOrderTrend", null);
__decorate([
    (0, common_1.Get)('dashboard/device-usage'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.DEVICE_READ),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDeviceUsageStats", null);
__decorate([
    (0, common_1.Get)('system/health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSystemHealth", null);
__decorate([
    (0, common_1.Get)('system/logs'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSystemLogs", null);
__decorate([
    (0, common_1.Post)('system/clear-cache'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "clearCache", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.USER_READ),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.UserQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.USER_READ),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Put)('users/:id'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.USER_WRITE),
    audit_log_decorator_1.AuditLogDecorators.UpdateUser(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_update_dto_1.UpdateUserDto, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Post)('users/:id/delete'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.USER_DELETE),
    audit_log_decorator_1.AuditLogDecorators.DeleteUser(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)('merchants'),
    audit_log_decorator_1.AuditLogDecorators.CreateMerchant(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_update_dto_1.CreateMerchantDto, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createMerchant", null);
__decorate([
    (0, common_1.Get)('merchants'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.MerchantQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMerchants", null);
__decorate([
    (0, common_1.Get)('merchants/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMerchantById", null);
__decorate([
    (0, common_1.Put)('merchants/:id'),
    audit_log_decorator_1.AuditLogDecorators.UpdateMerchant(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_update_dto_1.UpdateMerchantDto, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateMerchant", null);
__decorate([
    (0, common_1.Post)('merchants/:id/delete'),
    audit_log_decorator_1.AuditLogDecorators.DeleteMerchant(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteMerchant", null);
__decorate([
    (0, common_1.Post)('stores'),
    audit_log_decorator_1.AuditLogDecorators.CreateStore(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_update_dto_1.CreateStoreDto, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createStore", null);
__decorate([
    (0, common_1.Get)('stores'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.StoreQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStores", null);
__decorate([
    (0, common_1.Get)('stores/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStoreById", null);
__decorate([
    (0, common_1.Put)('stores/:id'),
    audit_log_decorator_1.AuditLogDecorators.UpdateStore(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_update_dto_1.UpdateStoreDto, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateStore", null);
__decorate([
    (0, common_1.Post)('stores/:id/delete'),
    audit_log_decorator_1.AuditLogDecorators.DeleteStore(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteStore", null);
__decorate([
    (0, common_1.Post)('devices'),
    audit_log_decorator_1.AuditLogDecorators.CreateDevice(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_update_dto_1.CreateDeviceDto, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createDevice", null);
__decorate([
    (0, common_1.Get)('devices'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.DeviceQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDevices", null);
__decorate([
    (0, common_1.Get)('devices/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDeviceById", null);
__decorate([
    (0, common_1.Put)('devices/:id'),
    audit_log_decorator_1.AuditLogDecorators.UpdateDevice(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_update_dto_1.UpdateDeviceDto, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateDevice", null);
__decorate([
    (0, common_1.Post)('devices/:id/delete'),
    audit_log_decorator_1.AuditLogDecorators.DeleteDevice(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteDevice", null);
__decorate([
    (0, common_1.Get)('devices/:id/logs'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDeviceLogs", null);
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.OrderQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Put)('orders/:id'),
    audit_log_decorator_1.AuditLogDecorators.UpdateOrder(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_update_dto_1.UpdateOrderDto, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateOrder", null);
__decorate([
    (0, common_1.Get)('inventory'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.InventoryQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getInventory", null);
__decorate([
    (0, common_1.Put)('inventory/:id'),
    audit_log_decorator_1.AuditLogDecorators.UpdateInventory(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_update_dto_1.UpdateInventoryDto, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateInventory", null);
__decorate([
    (0, common_1.Get)('alerts'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.AlertQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Put)('alerts/:id/acknowledge'),
    audit_log_decorator_1.AuditLogDecorators.AcknowledgeAlert(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_update_dto_1.AcknowledgeAlertDto, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "acknowledgeAlert", null);
__decorate([
    (0, common_1.Post)('data/export'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_update_dto_1.ExportDataDto, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "exportData", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.PLATFORM_ADMIN),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map