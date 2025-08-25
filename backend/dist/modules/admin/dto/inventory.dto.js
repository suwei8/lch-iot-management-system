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
exports.BatchInventoryOperationDto = exports.InventoryOperationDto = exports.CreateInventoryDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateInventoryDto {
}
exports.CreateInventoryDto = CreateInventoryDto;
__decorate([
    (0, class_validator_1.IsString)({ message: '物料名称必须是字符串' }),
    (0, class_validator_1.Length)(2, 100, { message: '物料名称长度必须在2-100字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "itemName", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '物料编码必须是字符串' }),
    (0, class_validator_1.Length)(2, 50, { message: '物料编码长度必须在2-50字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "itemCode", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '物料类型必须是字符串' }),
    (0, class_validator_1.IsEnum)(['detergent', 'wax', 'foam', 'water', 'electricity', 'other'], {
        message: '物料类型必须是detergent、wax、foam、water、electricity或other',
    }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "itemType", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '门店ID必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '门店ID必须大于0' }),
    __metadata("design:type", Number)
], CreateInventoryDto.prototype, "storeId", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '当前库存量必须是数字' }),
    (0, class_validator_1.Min)(0, { message: '当前库存量不能小于0' }),
    __metadata("design:type", Number)
], CreateInventoryDto.prototype, "currentStock", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '最小阈值必须是数字' }),
    (0, class_validator_1.Min)(0, { message: '最小阈值不能小于0' }),
    __metadata("design:type", Number)
], CreateInventoryDto.prototype, "minThreshold", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '最大容量必须是数字' }),
    (0, class_validator_1.Min)(0, { message: '最大容量不能小于0' }),
    __metadata("design:type", Number)
], CreateInventoryDto.prototype, "maxCapacity", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '计量单位必须是字符串' }),
    (0, class_validator_1.Length)(1, 20, { message: '计量单位长度必须在1-20字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "unit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '单价必须是整数' }),
    (0, class_validator_1.Min)(0, { message: '单价不能小于0' }),
    __metadata("design:type", Number)
], CreateInventoryDto.prototype, "unitPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '供应商必须是字符串' }),
    (0, class_validator_1.Length)(2, 100, { message: '供应商长度必须在2-100字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "supplier", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '备注必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "remark", void 0);
class InventoryOperationDto {
}
exports.InventoryOperationDto = InventoryOperationDto;
__decorate([
    (0, class_validator_1.IsString)({ message: '操作类型必须是字符串' }),
    (0, class_validator_1.IsEnum)(['in', 'out'], { message: '操作类型必须是in或out' }),
    __metadata("design:type", String)
], InventoryOperationDto.prototype, "operationType", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '操作数量必须是数字' }),
    (0, class_validator_1.Min)(0.01, { message: '操作数量必须大于0' }),
    __metadata("design:type", Number)
], InventoryOperationDto.prototype, "operationAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '操作原因必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], InventoryOperationDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '备注必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], InventoryOperationDto.prototype, "remark", void 0);
class BatchInventoryOperationDto {
}
exports.BatchInventoryOperationDto = BatchInventoryOperationDto;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ each: true, message: '库存ID必须是整数' }),
    (0, class_validator_1.Min)(1, { each: true, message: '库存ID必须大于0' }),
    __metadata("design:type", Array)
], BatchInventoryOperationDto.prototype, "inventoryIds", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '操作类型必须是字符串' }),
    (0, class_validator_1.IsEnum)(['in', 'out', 'adjust'], { message: '操作类型必须是in、out或adjust' }),
    __metadata("design:type", String)
], BatchInventoryOperationDto.prototype, "operationType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '操作原因必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], BatchInventoryOperationDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '备注必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], BatchInventoryOperationDto.prototype, "remark", void 0);
//# sourceMappingURL=inventory.dto.js.map