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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogStatsQueryDto = exports.AuditLogQueryDto = exports.CreateAuditLogDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateAuditLogDto {
}
exports.CreateAuditLogDto = CreateAuditLogDto;
__decorate([
    (0, class_validator_1.IsString)({ message: '操作类型必须是字符串' }),
    (0, class_validator_1.IsEnum)([
        'create', 'update', 'delete', 'login', 'logout',
        'export', 'import', 'backup', 'restore', 'config_change'
    ], {
        message: '操作类型必须是create、update、delete、login、logout、export、import、backup、restore或config_change',
    }),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "action", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '资源类型必须是字符串' }),
    (0, class_validator_1.IsEnum)([
        'user', 'merchant', 'store', 'device', 'order',
        'inventory', 'alert', 'system', 'auth'
    ], {
        message: '资源类型必须是user、merchant、store、device、order、inventory、alert、system或auth',
    }),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "resourceType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '资源ID必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '资源ID必须大于0' }),
    __metadata("design:type", Number)
], CreateAuditLogDto.prototype, "resourceId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '操作描述必须是字符串' }),
    (0, class_validator_1.Length)(2, 500, { message: '操作描述长度必须在2-500字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '用户ID必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '用户ID必须大于0' }),
    __metadata("design:type", Number)
], CreateAuditLogDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '用户角色必须是字符串' }),
    (0, class_validator_1.Length)(2, 50, { message: '用户角色长度必须在2-50字符之间' }),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "userRole", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIP)(undefined, { message: 'IP地址格式无效' }),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "ipAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '用户代理必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "userAgent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '操作前数据必须是字符串' }),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "beforeData", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '操作后数据必须是字符串' }),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "afterData", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '操作状态必须是字符串' }),
    (0, class_validator_1.IsEnum)(['success', 'failed', 'pending'], {
        message: '操作状态必须是success、failed或pending',
    }),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '错误信息必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "errorMessage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '请求数据必须是字符串' }),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "requestData", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '响应数据必须是字符串' }),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "responseData", void 0);
class AuditLogQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
    }
}
exports.AuditLogQueryDto = AuditLogQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '页码必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '页码必须大于0' }),
    __metadata("design:type", Number)
], AuditLogQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '每页数量必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '每页数量必须大于0' }),
    __metadata("design:type", Number)
], AuditLogQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '搜索关键词必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], AuditLogQueryDto.prototype, "query", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '操作类型必须是字符串' }),
    (0, class_validator_1.IsEnum)([
        'create', 'update', 'delete', 'login', 'logout',
        'export', 'import', 'backup', 'restore', 'config_change'
    ], {
        message: '操作类型必须是create、update、delete、login、logout、export、import、backup、restore或config_change',
    }),
    __metadata("design:type", String)
], AuditLogQueryDto.prototype, "action", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '资源类型必须是字符串' }),
    (0, class_validator_1.IsEnum)([
        'user', 'merchant', 'store', 'device', 'order',
        'inventory', 'alert', 'system', 'auth'
    ], {
        message: '资源类型必须是user、merchant、store、device、order、inventory、alert、system或auth',
    }),
    __metadata("design:type", String)
], AuditLogQueryDto.prototype, "resourceType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '用户ID必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '用户ID必须大于0' }),
    __metadata("design:type", Number)
], AuditLogQueryDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '用户角色必须是字符串' }),
    __metadata("design:type", String)
], AuditLogQueryDto.prototype, "userRole", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '操作状态必须是字符串' }),
    (0, class_validator_1.IsEnum)(['success', 'failed', 'pending'], {
        message: '操作状态必须是success、failed或pending',
    }),
    __metadata("design:type", String)
], AuditLogQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: '开始日期格式无效' }),
    __metadata("design:type", String)
], AuditLogQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: '结束日期格式无效' }),
    __metadata("design:type", String)
], AuditLogQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIP)(undefined, { message: 'IP地址格式无效' }),
    __metadata("design:type", String)
], AuditLogQueryDto.prototype, "ipAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '资源必须是字符串' }),
    __metadata("design:type", String)
], AuditLogQueryDto.prototype, "resource", void 0);
class AuditLogStatsQueryDto {
}
exports.AuditLogStatsQueryDto = AuditLogStatsQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: '开始日期格式无效' }),
    __metadata("design:type", String)
], AuditLogStatsQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: '结束日期格式无效' }),
    __metadata("design:type", String)
], AuditLogStatsQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '统计维度必须是字符串' }),
    (0, class_validator_1.IsEnum)(['action', 'resourceType', 'userRole', 'status', 'hourly', 'daily'], {
        message: '统计维度必须是action、resourceType、userRole、status、hourly或daily',
    }),
    __metadata("design:type", String)
], AuditLogStatsQueryDto.prototype, "dimension", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '用户ID必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '用户ID必须大于0' }),
    __metadata("design:type", Number)
], AuditLogStatsQueryDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '用户角色必须是字符串' }),
    __metadata("design:type", String)
], AuditLogStatsQueryDto.prototype, "userRole", void 0);
//# sourceMappingURL=audit-log.dto.js.map