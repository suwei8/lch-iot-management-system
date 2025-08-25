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
exports.CreateOrderDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateOrderDto {
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: '设备ID不能为空' }),
    (0, class_validator_1.IsNumber)({}, { message: '设备ID必须是数字' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "deviceId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: '洗车类型不能为空' }),
    (0, class_validator_1.IsString)({ message: '洗车类型必须是字符串' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "washType", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: '洗车时长不能为空' }),
    (0, class_validator_1.IsNumber)({}, { message: '洗车时长必须是数字' }),
    (0, class_validator_1.Min)(1, { message: '洗车时长至少1分钟' }),
    (0, class_validator_1.Max)(60, { message: '洗车时长最多60分钟' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: '订单金额不能为空' }),
    (0, class_validator_1.IsNumber)({}, { message: '订单金额必须是数字' }),
    (0, class_validator_1.Min)(0.01, { message: '订单金额必须大于0' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '备注必须是字符串' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "remark", void 0);
//# sourceMappingURL=create-order.dto.js.map