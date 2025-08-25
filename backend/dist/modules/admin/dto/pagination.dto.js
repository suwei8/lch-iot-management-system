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
exports.AlertQueryDto = exports.InventoryQueryDto = exports.OrderQueryDto = exports.DeviceQueryDto = exports.StoreQueryDto = exports.MerchantQueryDto = exports.UserQueryDto = exports.PaginationDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class PaginationDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.PaginationDto = PaginationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '页码必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '页码不能小于1' }),
    __metadata("design:type", Number)
], PaginationDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '每页数量必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '每页数量不能小于1' }),
    (0, class_validator_1.Max)(100, { message: '每页数量不能超过100' }),
    __metadata("design:type", Number)
], PaginationDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '搜索关键词必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], PaginationDto.prototype, "query", void 0);
class UserQueryDto extends PaginationDto {
}
exports.UserQueryDto = UserQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '角色必须是字符串' }),
    __metadata("design:type", String)
], UserQueryDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '状态必须是字符串' }),
    __metadata("design:type", String)
], UserQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '搜索关键词必须是字符串' }),
    __metadata("design:type", String)
], UserQueryDto.prototype, "search", void 0);
class MerchantQueryDto extends PaginationDto {
}
exports.MerchantQueryDto = MerchantQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '状态必须是字符串' }),
    __metadata("design:type", String)
], MerchantQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '搜索关键词必须是字符串' }),
    __metadata("design:type", String)
], MerchantQueryDto.prototype, "search", void 0);
class StoreQueryDto extends PaginationDto {
}
exports.StoreQueryDto = StoreQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '商户ID必须是整数' }),
    __metadata("design:type", Number)
], StoreQueryDto.prototype, "merchantId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '状态必须是字符串' }),
    __metadata("design:type", String)
], StoreQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '搜索关键词必须是字符串' }),
    __metadata("design:type", String)
], StoreQueryDto.prototype, "search", void 0);
class DeviceQueryDto extends PaginationDto {
}
exports.DeviceQueryDto = DeviceQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '门店ID必须是整数' }),
    __metadata("design:type", Number)
], DeviceQueryDto.prototype, "storeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '状态必须是字符串' }),
    __metadata("design:type", String)
], DeviceQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '搜索关键词必须是字符串' }),
    __metadata("design:type", String)
], DeviceQueryDto.prototype, "search", void 0);
class OrderQueryDto extends PaginationDto {
}
exports.OrderQueryDto = OrderQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '商户ID必须是整数' }),
    __metadata("design:type", Number)
], OrderQueryDto.prototype, "merchantId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '门店ID必须是整数' }),
    __metadata("design:type", Number)
], OrderQueryDto.prototype, "storeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '状态必须是字符串' }),
    __metadata("design:type", String)
], OrderQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '搜索关键词必须是字符串' }),
    __metadata("design:type", String)
], OrderQueryDto.prototype, "search", void 0);
class InventoryQueryDto extends PaginationDto {
}
exports.InventoryQueryDto = InventoryQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '门店ID必须是整数' }),
    __metadata("design:type", Number)
], InventoryQueryDto.prototype, "storeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '物料类型必须是字符串' }),
    __metadata("design:type", String)
], InventoryQueryDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '状态必须是字符串' }),
    __metadata("design:type", String)
], InventoryQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '搜索关键词必须是字符串' }),
    __metadata("design:type", String)
], InventoryQueryDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], InventoryQueryDto.prototype, "lowStock", void 0);
class AlertQueryDto extends PaginationDto {
}
exports.AlertQueryDto = AlertQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '门店ID必须是整数' }),
    __metadata("design:type", Number)
], AlertQueryDto.prototype, "storeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '告警类型必须是字符串' }),
    __metadata("design:type", String)
], AlertQueryDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '状态必须是字符串' }),
    __metadata("design:type", String)
], AlertQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '级别必须是字符串' }),
    __metadata("design:type", String)
], AlertQueryDto.prototype, "level", void 0);
//# sourceMappingURL=pagination.dto.js.map