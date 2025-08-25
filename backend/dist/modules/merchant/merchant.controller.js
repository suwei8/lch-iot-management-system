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
exports.MerchantController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const permission_enum_1 = require("../../common/enums/permission.enum");
const audit_log_decorator_1 = require("../../common/decorators/audit-log.decorator");
const merchant_service_1 = require("./merchant.service");
const pagination_dto_1 = require("./dto/pagination.dto");
const create_update_dto_1 = require("./dto/create-update.dto");
let MerchantController = class MerchantController {
    constructor(merchantService) {
        this.merchantService = merchantService;
    }
    async getDashboard(req) {
        return this.merchantService.getDashboardStats(req.user.id);
    }
    async getProfile(req) {
        return this.merchantService.getMerchantProfile(req.user.id);
    }
    async updateProfile(updateProfileDto, req, ip) {
        return this.merchantService.updateMerchantProfile(req.user.id, updateProfileDto, req.user.id, ip);
    }
    async getStores(query, req) {
        return this.merchantService.getStores(req.user.id, query);
    }
    async createStore(createStoreDto, req, ip) {
        return this.merchantService.createStore(req.user.id, createStoreDto, req.user.id, ip);
    }
    async getStoreById(id, req) {
        return this.merchantService.getStoreById(req.user.id, id);
    }
    async updateStore(id, updateStoreDto, req, ip) {
        return this.merchantService.updateStore(req.user.id, id, updateStoreDto, req.user.id, ip);
    }
    async getStoreStaff(storeId, query, req) {
        return this.merchantService.getStaff(req.user.id, query);
    }
    async createStoreStaff(storeId, createStaffDto, req, ip) {
        return this.merchantService.createStaff(req.user.id, storeId, createStaffDto, req.user.id, ip);
    }
    async updateStaff(staffId, updateStaffDto, req, ip) {
        return this.merchantService.updateStaff(req.user.id, staffId, updateStaffDto, req.user.id, ip);
    }
    async deleteStaff(staffId, req, ip) {
        return this.merchantService.deleteStaff(req.user.id, staffId, req.user.id, ip);
    }
    async getDevices(query, req) {
        return this.merchantService.getDevices(req.user.id, query);
    }
    async createDevice(createDeviceDto, req, ip) {
        return this.merchantService.createDevice(req.user.id, createDeviceDto, req.user.id, ip);
    }
    async getDeviceById(id, req) {
        return this.merchantService.getDeviceById(req.user.id, id);
    }
    async updateDevice(id, updateDeviceDto, req, ip) {
        return this.merchantService.updateDevice(req.user.id, id, updateDeviceDto, req.user.id, ip);
    }
    async getDeviceLogs(id, query, req) {
        return this.merchantService.getDeviceLogs(req.user.id, id, query);
    }
    async getOrders(query, req) {
        return this.merchantService.getOrders(req.user.id, query);
    }
    async getOrderById(id, req) {
        return this.merchantService.getOrderById(req.user.id, id);
    }
    async getOrderReports(query, req) {
        return this.merchantService.getReports(req.user.id, query);
    }
    async getRevenueReports(query, req) {
        return this.merchantService.getReports(req.user.id, query);
    }
    async getInventory(query, req) {
        return this.merchantService.getInventory(req.user.id, query);
    }
    async updateInventory(id, updateInventoryDto, req, ip) {
        return this.merchantService.updateInventory(req.user.id, id, updateInventoryDto, req.user.id, ip);
    }
    async getAlerts(query, req) {
        return this.merchantService.getAlerts(req.user.id, query);
    }
    async acknowledgeAlert(id, acknowledgeAlertDto, req, ip) {
        return this.merchantService.acknowledgeAlert(req.user.id, id, acknowledgeAlertDto, req.user.id, ip);
    }
};
exports.MerchantController = MerchantController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.MERCHANT_READ),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.MERCHANT_READ),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.MERCHANT_WRITE),
    audit_log_decorator_1.AuditLogDecorators.UpdateMerchant(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_update_dto_1.UpdateMerchantProfileDto, Object, String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('stores'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.StoreQueryDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getStores", null);
__decorate([
    (0, common_1.Post)('stores'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.MERCHANT),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.STORE_WRITE),
    audit_log_decorator_1.AuditLogDecorators.CreateStore(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_update_dto_1.CreateStoreDto, Object, String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "createStore", null);
__decorate([
    (0, common_1.Get)('stores/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getStoreById", null);
__decorate([
    (0, common_1.Put)('stores/:id'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.STORE_WRITE),
    audit_log_decorator_1.AuditLogDecorators.UpdateStore(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_update_dto_1.UpdateStoreDto, Object, String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "updateStore", null);
__decorate([
    (0, common_1.Get)('stores/:storeId/staff'),
    __param(0, (0, common_1.Param)('storeId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pagination_dto_1.UserQueryDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getStoreStaff", null);
__decorate([
    (0, common_1.Post)('stores/:storeId/staff'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.STAFF_WRITE),
    audit_log_decorator_1.AuditLogDecorators.CreateUser(),
    __param(0, (0, common_1.Param)('storeId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_update_dto_1.CreateStaffDto, Object, String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "createStoreStaff", null);
__decorate([
    (0, common_1.Put)('staff/:staffId'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.STAFF_WRITE),
    audit_log_decorator_1.AuditLogDecorators.UpdateUser(),
    __param(0, (0, common_1.Param)('staffId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_update_dto_1.UpdateStaffDto, Object, String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "updateStaff", null);
__decorate([
    (0, common_1.Post)('staff/:staffId/delete'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.STAFF_DELETE),
    audit_log_decorator_1.AuditLogDecorators.DeleteUser(),
    __param(0, (0, common_1.Param)('staffId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "deleteStaff", null);
__decorate([
    (0, common_1.Get)('devices'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.DeviceQueryDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getDevices", null);
__decorate([
    (0, common_1.Post)('devices'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.MERCHANT),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.DEVICE_WRITE),
    audit_log_decorator_1.AuditLogDecorators.CreateDevice(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_update_dto_1.CreateDeviceDto, Object, String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "createDevice", null);
__decorate([
    (0, common_1.Get)('devices/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getDeviceById", null);
__decorate([
    (0, common_1.Put)('devices/:id'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.DEVICE_WRITE),
    audit_log_decorator_1.AuditLogDecorators.UpdateDevice(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_update_dto_1.UpdateDeviceDto, Object, String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "updateDevice", null);
__decorate([
    (0, common_1.Get)('devices/:id/logs'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pagination_dto_1.PaginationDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getDeviceLogs", null);
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.OrderQueryDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Get)('reports/orders'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getOrderReports", null);
__decorate([
    (0, common_1.Get)('reports/revenue'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getRevenueReports", null);
__decorate([
    (0, common_1.Get)('inventory'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.InventoryQueryDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getInventory", null);
__decorate([
    (0, common_1.Put)('inventory/:id'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.INVENTORY_WRITE),
    audit_log_decorator_1.AuditLogDecorators.UpdateInventory(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_update_dto_1.UpdateInventoryDto, Object, String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "updateInventory", null);
__decorate([
    (0, common_1.Get)('alerts'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.AlertQueryDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Put)('alerts/:id/acknowledge'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_update_dto_1.AcknowledgeAlertDto, Object, String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "acknowledgeAlert", null);
exports.MerchantController = MerchantController = __decorate([
    (0, common_1.Controller)('merchant'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.MERCHANT, roles_decorator_1.UserRole.STORE_MANAGER),
    __metadata("design:paramtypes", [merchant_service_1.MerchantService])
], MerchantController);
//# sourceMappingURL=merchant.controller.js.map