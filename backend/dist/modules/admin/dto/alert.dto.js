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
exports.AlertStatsQueryDto = exports.BatchAcknowledgeAlertDto = exports.CreateAlertDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateAlertDto {
}
exports.CreateAlertDto = CreateAlertDto;
__decorate([
    (0, class_validator_1.IsString)({ message: '告警类型必须是字符串' }),
    (0, class_validator_1.IsEnum)(['low_inventory', 'device_offline', 'device_error', 'system_error', 'maintenance'], {
        message: '告警类型必须是low_inventory、device_offline、device_error、system_error或maintenance',
    }),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "alertType", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '告警级别必须是字符串' }),
    (0, class_validator_1.IsEnum)(['low', 'medium', 'high', 'critical'], {
        message: '告警级别必须是low、medium、high或critical',
    }),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '告警标题必须是字符串' }),
    (0, class_validator_1.Length)(2, 200, { message: '告警标题长度必须在2-200字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '告警内容必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '门店ID必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '门店ID必须大于0' }),
    __metadata("design:type", Number)
], CreateAlertDto.prototype, "storeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '设备ID必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '设备ID必须大于0' }),
    __metadata("design:type", Number)
], CreateAlertDto.prototype, "deviceId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '库存ID必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '库存ID必须大于0' }),
    __metadata("design:type", Number)
], CreateAlertDto.prototype, "inventoryId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '相关数据必须是字符串' }),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "relatedData", void 0);
class BatchAcknowledgeAlertDto {
}
exports.BatchAcknowledgeAlertDto = BatchAcknowledgeAlertDto;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ each: true, message: '告警ID必须是整数' }),
    (0, class_validator_1.Min)(1, { each: true, message: '告警ID必须大于0' }),
    __metadata("design:type", Array)
], BatchAcknowledgeAlertDto.prototype, "alertIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '处理备注必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], BatchAcknowledgeAlertDto.prototype, "remark", void 0);
class AlertStatsQueryDto {
}
exports.AlertStatsQueryDto = AlertStatsQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: '开始日期格式无效' }),
    __metadata("design:type", String)
], AlertStatsQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: '结束日期格式无效' }),
    __metadata("design:type", String)
], AlertStatsQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '门店ID必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '门店ID必须大于0' }),
    __metadata("design:type", Number)
], AlertStatsQueryDto.prototype, "storeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '商户ID必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '商户ID必须大于0' }),
    __metadata("design:type", Number)
], AlertStatsQueryDto.prototype, "merchantId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '告警类型必须是字符串' }),
    (0, class_validator_1.IsEnum)(['low_inventory', 'device_offline', 'device_error', 'system_error', 'maintenance'], {
        message: '告警类型必须是low_inventory、device_offline、device_error、system_error或maintenance',
    }),
    __metadata("design:type", String)
], AlertStatsQueryDto.prototype, "alertType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '告警级别必须是字符串' }),
    (0, class_validator_1.IsEnum)(['low', 'medium', 'high', 'critical'], {
        message: '告警级别必须是low、medium、high或critical',
    }),
    __metadata("design:type", String)
], AlertStatsQueryDto.prototype, "level", void 0);
//# sourceMappingURL=alert.dto.js.map