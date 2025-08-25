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
exports.CreateDeviceDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateDeviceDto {
}
exports.CreateDeviceDto = CreateDeviceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '设备名称',
        example: '温湿度传感器-001',
        minLength: 1,
        maxLength: 100
    }),
    (0, class_validator_1.IsString)({ message: '设备名称必须是字符串' }),
    (0, class_validator_1.IsNotEmpty)({ message: '设备名称不能为空' }),
    (0, class_validator_1.Length)(1, 100, { message: '设备名称长度必须在1-100位之间' }),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '设备型号',
        example: 'DHT22-Pro',
        minLength: 1,
        maxLength: 50
    }),
    (0, class_validator_1.IsString)({ message: '设备型号必须是字符串' }),
    (0, class_validator_1.IsNotEmpty)({ message: '设备型号不能为空' }),
    (0, class_validator_1.Length)(1, 50, { message: '设备型号长度必须在1-50位之间' }),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '设备ICCID（SIM卡标识）',
        example: '89860318740800123456',
        minLength: 19,
        maxLength: 20
    }),
    (0, class_validator_1.IsString)({ message: 'ICCID必须是字符串' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ICCID不能为空' }),
    (0, class_validator_1.Length)(19, 20, { message: 'ICCID长度必须在19-20位之间' }),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "iccid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '所属商户ID',
        example: 1
    }),
    (0, class_validator_1.IsNumber)({}, { message: '商户ID必须是数字' }),
    __metadata("design:type", Number)
], CreateDeviceDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '设备配置参数',
        example: {
            "sampleRate": 60,
            "threshold": {
                "temperature": { "min": -10, "max": 50 },
                "humidity": { "min": 0, "max": 100 }
            }
        }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: '设备配置必须是对象' }),
    __metadata("design:type", Object)
], CreateDeviceDto.prototype, "config", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '设备安装位置描述',
        example: '北京市朝阳区办公楼A座3层会议室',
        maxLength: 200
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '位置描述必须是字符串' }),
    (0, class_validator_1.Length)(0, 200, { message: '位置描述长度不能超过200位' }),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '设备安装位置纬度',
        example: 39.9042,
        minimum: -90,
        maximum: 90
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: '纬度必须是数字' }),
    __metadata("design:type", Number)
], CreateDeviceDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '设备安装位置经度',
        example: 116.4074,
        minimum: -180,
        maximum: 180
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: '经度必须是数字' }),
    __metadata("design:type", Number)
], CreateDeviceDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '设备固件版本',
        example: 'v1.2.3',
        maxLength: 20
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '设备版本必须是字符串' }),
    (0, class_validator_1.Length)(0, 20, { message: '设备版本长度不能超过20位' }),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "version", void 0);
//# sourceMappingURL=create-device.dto.js.map