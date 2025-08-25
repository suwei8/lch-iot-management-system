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
exports.AuditLogController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const permission_enum_1 = require("../../common/enums/permission.enum");
const audit_log_service_1 = require("../../common/services/audit-log.service");
const audit_log_dto_1 = require("./dto/audit-log.dto");
const validation_dto_1 = require("../../common/dto/validation.dto");
let AuditLogController = class AuditLogController {
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
    }
    async getAuditLogs(queryDto) {
        return this.auditLogService.findAll(queryDto);
    }
    async getAuditLog(id) {
        return this.auditLogService.findOne(id);
    }
    async getAuditLogStats(queryDto) {
        return this.auditLogService.getStats(queryDto);
    }
    async exportAuditLogs(queryDto) {
        return this.auditLogService.export(queryDto);
    }
    async batchDeleteAuditLogs(batchIdDto) {
        return this.auditLogService.batchDelete(batchIdDto.ids);
    }
    async cleanupExpiredLogs(body) {
        return this.auditLogService.cleanup(body.days);
    }
};
exports.AuditLogController = AuditLogController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.AUDIT_LOG_READ),
    (0, swagger_1.ApiOperation)({ summary: '获取审计日志列表' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '获取成功' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [audit_log_dto_1.AuditLogQueryDto]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.AUDIT_LOG_READ),
    (0, swagger_1.ApiOperation)({ summary: '获取审计日志详情' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '获取成功' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "getAuditLog", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.AUDIT_LOG_READ),
    (0, swagger_1.ApiOperation)({ summary: '获取审计日志统计' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '获取成功' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [audit_log_dto_1.AuditLogStatsQueryDto]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "getAuditLogStats", null);
__decorate([
    (0, common_1.Post)('export'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.AUDIT_LOG_READ),
    (0, swagger_1.ApiOperation)({ summary: '导出审计日志' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '导出成功' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [audit_log_dto_1.AuditLogQueryDto]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "exportAuditLogs", null);
__decorate([
    (0, common_1.Delete)('batch'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.AUDIT_LOG_DELETE),
    (0, swagger_1.ApiOperation)({ summary: '批量删除审计日志' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '删除成功' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [validation_dto_1.BatchIdDto]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "batchDeleteAuditLogs", null);
__decorate([
    (0, common_1.Post)('cleanup'),
    (0, permissions_decorator_1.RequirePermissions)(permission_enum_1.Permission.AUDIT_LOG_DELETE),
    (0, swagger_1.ApiOperation)({ summary: '清理过期审计日志' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '清理成功' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "cleanupExpiredLogs", null);
exports.AuditLogController = AuditLogController = __decorate([
    (0, swagger_1.ApiTags)('审计日志管理'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin/audit-logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.PLATFORM_ADMIN),
    __metadata("design:paramtypes", [audit_log_service_1.AuditLogService])
], AuditLogController);
//# sourceMappingURL=audit-log.controller.js.map