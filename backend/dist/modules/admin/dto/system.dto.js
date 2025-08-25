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
exports.SystemNotificationDto = exports.ReportQueryDto = exports.SystemMonitorQueryDto = exports.SystemRestoreDto = exports.SystemBackupDto = exports.BatchUpdateSystemConfigDto = exports.SystemConfigDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SystemConfigDto {
}
exports.SystemConfigDto = SystemConfigDto;
__decorate([
    (0, class_validator_1.IsString)({ message: '配置键必须是字符串' }),
    (0, class_validator_1.Length)(2, 100, { message: '配置键长度必须在2-100字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], SystemConfigDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '配置值必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], SystemConfigDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '配置描述必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], SystemConfigDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '配置分组必须是字符串' }),
    (0, class_validator_1.IsEnum)(['system', 'payment', 'notification', 'security', 'business'], {
        message: '配置分组必须是system、payment、notification、security或business',
    }),
    __metadata("design:type", String)
], SystemConfigDto.prototype, "group", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: '是否敏感配置必须是布尔值' }),
    __metadata("design:type", Boolean)
], SystemConfigDto.prototype, "isSensitive", void 0);
class BatchUpdateSystemConfigDto {
}
exports.BatchUpdateSystemConfigDto = BatchUpdateSystemConfigDto;
class SystemBackupDto {
}
exports.SystemBackupDto = SystemBackupDto;
__decorate([
    (0, class_validator_1.IsString)({ message: '备份类型必须是字符串' }),
    (0, class_validator_1.IsEnum)(['full', 'incremental', 'config_only', 'data_only'], {
        message: '备份类型必须是full、incremental、config_only或data_only',
    }),
    __metadata("design:type", String)
], SystemBackupDto.prototype, "backupType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '备份描述必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], SystemBackupDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: '是否压缩必须是布尔值' }),
    __metadata("design:type", Boolean)
], SystemBackupDto.prototype, "compress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true, message: '表名必须是字符串' }),
    __metadata("design:type", Array)
], SystemBackupDto.prototype, "includeTables", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true, message: '表名必须是字符串' }),
    __metadata("design:type", Array)
], SystemBackupDto.prototype, "excludeTables", void 0);
class SystemRestoreDto {
}
exports.SystemRestoreDto = SystemRestoreDto;
__decorate([
    (0, class_validator_1.IsString)({ message: '备份文件路径必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], SystemRestoreDto.prototype, "backupFilePath", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '恢复类型必须是字符串' }),
    (0, class_validator_1.IsEnum)(['full', 'config_only', 'data_only', 'selective'], {
        message: '恢复类型必须是full、config_only、data_only或selective',
    }),
    __metadata("design:type", String)
], SystemRestoreDto.prototype, "restoreType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: '是否覆盖现有数据必须是布尔值' }),
    __metadata("design:type", Boolean)
], SystemRestoreDto.prototype, "overwrite", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true, message: '表名必须是字符串' }),
    __metadata("design:type", Array)
], SystemRestoreDto.prototype, "includeTables", void 0);
class SystemMonitorQueryDto {
}
exports.SystemMonitorQueryDto = SystemMonitorQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '监控类型必须是字符串' }),
    (0, class_validator_1.IsEnum)(['cpu', 'memory', 'disk', 'network', 'database', 'redis'], {
        message: '监控类型必须是cpu、memory、disk、network、database或redis',
    }),
    __metadata("design:type", String)
], SystemMonitorQueryDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '时间范围必须是字符串' }),
    (0, class_validator_1.IsEnum)(['1h', '6h', '24h', '7d', '30d'], {
        message: '时间范围必须是1h、6h、24h、7d或30d',
    }),
    __metadata("design:type", String)
], SystemMonitorQueryDto.prototype, "timeRange", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: '开始时间格式无效' }),
    __metadata("design:type", String)
], SystemMonitorQueryDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: '结束时间格式无效' }),
    __metadata("design:type", String)
], SystemMonitorQueryDto.prototype, "endTime", void 0);
class ReportQueryDto {
}
exports.ReportQueryDto = ReportQueryDto;
__decorate([
    (0, class_validator_1.IsString)({ message: '报表类型必须是字符串' }),
    (0, class_validator_1.IsEnum)([
        'revenue', 'orders', 'devices', 'users', 'merchants',
        'inventory', 'alerts', 'performance'
    ], {
        message: '报表类型必须是revenue、orders、devices、users、merchants、inventory、alerts或performance',
    }),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "reportType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '时间维度必须是字符串' }),
    (0, class_validator_1.IsEnum)(['hourly', 'daily', 'weekly', 'monthly', 'yearly'], {
        message: '时间维度必须是hourly、daily、weekly、monthly或yearly',
    }),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "timeDimension", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: '开始日期格式无效' }),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: '结束日期格式无效' }),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '商户ID必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '商户ID必须大于0' }),
    __metadata("design:type", Number)
], ReportQueryDto.prototype, "merchantId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '门店ID必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '门店ID必须大于0' }),
    __metadata("design:type", Number)
], ReportQueryDto.prototype, "storeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '设备ID必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '设备ID必须大于0' }),
    __metadata("design:type", Number)
], ReportQueryDto.prototype, "deviceId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true, message: '分组字段必须是字符串' }),
    __metadata("design:type", Array)
], ReportQueryDto.prototype, "groupBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '排序字段必须是字符串' }),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "orderBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '排序方向必须是字符串' }),
    (0, class_validator_1.IsEnum)(['ASC', 'DESC'], { message: '排序方向必须是ASC或DESC' }),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "orderDirection", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '导出格式必须是字符串' }),
    (0, class_validator_1.IsEnum)(['json', 'csv', 'excel', 'pdf'], {
        message: '导出格式必须是json、csv、excel或pdf',
    }),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "exportFormat", void 0);
class SystemNotificationDto {
}
exports.SystemNotificationDto = SystemNotificationDto;
__decorate([
    (0, class_validator_1.IsString)({ message: '通知类型必须是字符串' }),
    (0, class_validator_1.IsEnum)(['system', 'maintenance', 'security', 'business'], {
        message: '通知类型必须是system、maintenance、security或business',
    }),
    __metadata("design:type", String)
], SystemNotificationDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '通知级别必须是字符串' }),
    (0, class_validator_1.IsEnum)(['info', 'warning', 'error', 'success'], {
        message: '通知级别必须是info、warning、error或success',
    }),
    __metadata("design:type", String)
], SystemNotificationDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '通知标题必须是字符串' }),
    (0, class_validator_1.Length)(2, 200, { message: '通知标题长度必须在2-200字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], SystemNotificationDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '通知内容必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], SystemNotificationDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true, message: '用户角色必须是字符串' }),
    __metadata("design:type", Array)
], SystemNotificationDto.prototype, "targetRoles", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ each: true, message: '用户ID必须是整数' }),
    (0, class_validator_1.Min)(1, { each: true, message: '用户ID必须大于0' }),
    __metadata("design:type", Array)
], SystemNotificationDto.prototype, "targetUserIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: '是否立即发送必须是布尔值' }),
    __metadata("design:type", Boolean)
], SystemNotificationDto.prototype, "sendImmediately", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: '计划发送时间格式无效' }),
    __metadata("design:type", String)
], SystemNotificationDto.prototype, "scheduledAt", void 0);
//# sourceMappingURL=system.dto.js.map