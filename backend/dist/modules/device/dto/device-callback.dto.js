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
exports.DeviceCallbackDto = void 0;
const class_validator_1 = require("class-validator");
class DeviceCallbackDto {
}
exports.DeviceCallbackDto = DeviceCallbackDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'ICCID必须是字符串' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ICCID不能为空' }),
    __metadata("design:type", String)
], DeviceCallbackDto.prototype, "iccid", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '事件类型必须是字符串' }),
    (0, class_validator_1.IsNotEmpty)({ message: '事件类型不能为空' }),
    __metadata("design:type", String)
], DeviceCallbackDto.prototype, "eventType", void 0);
__decorate([
    (0, class_validator_1.IsObject)({ message: '事件数据必须是对象' }),
    __metadata("design:type", Object)
], DeviceCallbackDto.prototype, "payload", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: '时间戳格式不正确' }),
    __metadata("design:type", String)
], DeviceCallbackDto.prototype, "timestamp", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '签名必须是字符串' }),
    __metadata("design:type", String)
], DeviceCallbackDto.prototype, "signature", void 0);
//# sourceMappingURL=device-callback.dto.js.map