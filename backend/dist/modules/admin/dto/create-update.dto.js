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
exports.ExportDataDto = exports.AcknowledgeAlertDto = exports.UpdateInventoryDto = exports.UpdateOrderDto = exports.UpdateUserDto = exports.UpdateDeviceDto = exports.CreateDeviceDto = exports.UpdateStoreDto = exports.CreateStoreDto = exports.UpdateMerchantDto = exports.CreateMerchantDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
class CreateMerchantDto {
}
exports.CreateMerchantDto = CreateMerchantDto;
__decorate([
    (0, class_validator_1.IsString)({ message: '商户名称必须是字符串' }),
    (0, class_validator_1.Length)(2, 100, { message: '商户名称长度必须在2-100字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '商户编码必须是字符串' }),
    (0, class_validator_1.Length)(2, 50, { message: '商户编码长度必须在2-50字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '联系人必须是字符串' }),
    (0, class_validator_1.Length)(2, 50, { message: '联系人长度必须在2-50字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "contact", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '联系电话必须是字符串' }),
    (0, class_validator_1.Length)(11, 20, { message: '联系电话长度必须在11-20字符之间' }),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '商户地址必须是字符串' }),
    (0, class_validator_1.Length)(5, 255, { message: '商户地址长度必须在5-255字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '经度必须是数字' }),
    (0, class_validator_1.Min)(-180, { message: '经度不能小于-180' }),
    (0, class_validator_1.Max)(180, { message: '经度不能大于180' }),
    __metadata("design:type", Number)
], CreateMerchantDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '纬度必须是数字' }),
    (0, class_validator_1.Min)(-90, { message: '纬度不能小于-90' }),
    (0, class_validator_1.Max)(90, { message: '纬度不能大于90' }),
    __metadata("design:type", Number)
], CreateMerchantDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '分成比例必须是数字' }),
    (0, class_validator_1.Min)(0, { message: '分成比例不能小于0' }),
    (0, class_validator_1.Max)(100, { message: '分成比例不能大于100' }),
    __metadata("design:type", Number)
], CreateMerchantDto.prototype, "shareRatio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '商户描述必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '营业时间必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateMerchantDto.prototype, "businessHours", void 0);
class UpdateMerchantDto {
}
exports.UpdateMerchantDto = UpdateMerchantDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '商户名称必须是字符串' }),
    (0, class_validator_1.Length)(2, 100, { message: '商户名称长度必须在2-100字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateMerchantDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '联系人必须是字符串' }),
    (0, class_validator_1.Length)(2, 50, { message: '联系人长度必须在2-50字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateMerchantDto.prototype, "contact", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '联系电话必须是字符串' }),
    (0, class_validator_1.Length)(11, 20, { message: '联系电话长度必须在11-20字符之间' }),
    __metadata("design:type", String)
], UpdateMerchantDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '商户地址必须是字符串' }),
    (0, class_validator_1.Length)(5, 255, { message: '商户地址长度必须在5-255字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateMerchantDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '经度必须是数字' }),
    (0, class_validator_1.Min)(-180, { message: '经度不能小于-180' }),
    (0, class_validator_1.Max)(180, { message: '经度不能大于180' }),
    __metadata("design:type", Number)
], UpdateMerchantDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '纬度必须是数字' }),
    (0, class_validator_1.Min)(-90, { message: '纬度不能小于-90' }),
    (0, class_validator_1.Max)(90, { message: '纬度不能大于90' }),
    __metadata("design:type", Number)
], UpdateMerchantDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['active', 'disabled'], { message: '商户状态必须是active或disabled' }),
    __metadata("design:type", String)
], UpdateMerchantDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '分成比例必须是数字' }),
    (0, class_validator_1.Min)(0, { message: '分成比例不能小于0' }),
    (0, class_validator_1.Max)(100, { message: '分成比例不能大于100' }),
    __metadata("design:type", Number)
], UpdateMerchantDto.prototype, "shareRatio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '商户描述必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateMerchantDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '营业时间必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateMerchantDto.prototype, "businessHours", void 0);
class CreateStoreDto {
}
exports.CreateStoreDto = CreateStoreDto;
__decorate([
    (0, class_validator_1.IsString)({ message: '门店名称必须是字符串' }),
    (0, class_validator_1.Length)(2, 100, { message: '门店名称长度必须在2-100字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '门店编码必须是字符串' }),
    (0, class_validator_1.Length)(2, 50, { message: '门店编码长度必须在2-50字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '门店地址必须是字符串' }),
    (0, class_validator_1.Length)(5, 255, { message: '门店地址长度必须在5-255字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '联系人必须是字符串' }),
    (0, class_validator_1.Length)(2, 50, { message: '联系人长度必须在2-50字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "contact", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '联系电话必须是字符串' }),
    (0, class_validator_1.Length)(11, 20, { message: '联系电话长度必须在11-20字符之间' }),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "phone", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '商户ID必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '商户ID必须大于0' }),
    __metadata("design:type", Number)
], CreateStoreDto.prototype, "merchantId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '经度必须是数字' }),
    (0, class_validator_1.Min)(-180, { message: '经度不能小于-180' }),
    (0, class_validator_1.Max)(180, { message: '经度不能大于180' }),
    __metadata("design:type", Number)
], CreateStoreDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '纬度必须是数字' }),
    (0, class_validator_1.Min)(-90, { message: '纬度不能小于-90' }),
    (0, class_validator_1.Max)(90, { message: '纬度不能大于90' }),
    __metadata("design:type", Number)
], CreateStoreDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '营业时间必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "businessHours", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '门店描述必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '基础洗车价格必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '基础洗车价格必须大于0' }),
    __metadata("design:type", Number)
], CreateStoreDto.prototype, "basicPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '精洗价格必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '精洗价格必须大于0' }),
    __metadata("design:type", Number)
], CreateStoreDto.prototype, "premiumPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '豪华洗车价格必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '豪华洗车价格必须大于0' }),
    __metadata("design:type", Number)
], CreateStoreDto.prototype, "deluxePrice", void 0);
class UpdateStoreDto {
}
exports.UpdateStoreDto = UpdateStoreDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '门店名称必须是字符串' }),
    (0, class_validator_1.Length)(2, 100, { message: '门店名称长度必须在2-100字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateStoreDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '门店地址必须是字符串' }),
    (0, class_validator_1.Length)(5, 255, { message: '门店地址长度必须在5-255字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateStoreDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '联系人必须是字符串' }),
    (0, class_validator_1.Length)(2, 50, { message: '联系人长度必须在2-50字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateStoreDto.prototype, "contact", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '联系电话必须是字符串' }),
    (0, class_validator_1.Length)(11, 20, { message: '联系电话长度必须在11-20字符之间' }),
    __metadata("design:type", String)
], UpdateStoreDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '经度必须是数字' }),
    (0, class_validator_1.Min)(-180, { message: '经度不能小于-180' }),
    (0, class_validator_1.Max)(180, { message: '经度不能大于180' }),
    __metadata("design:type", Number)
], UpdateStoreDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '纬度必须是数字' }),
    (0, class_validator_1.Min)(-90, { message: '纬度不能小于-90' }),
    (0, class_validator_1.Max)(90, { message: '纬度不能大于90' }),
    __metadata("design:type", Number)
], UpdateStoreDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['active', 'disabled', 'maintenance'], {
        message: '门店状态必须是active、disabled或maintenance',
    }),
    __metadata("design:type", String)
], UpdateStoreDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '营业时间必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateStoreDto.prototype, "businessHours", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '门店描述必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateStoreDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '基础洗车价格必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '基础洗车价格必须大于0' }),
    __metadata("design:type", Number)
], UpdateStoreDto.prototype, "basicPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '精洗价格必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '精洗价格必须大于0' }),
    __metadata("design:type", Number)
], UpdateStoreDto.prototype, "premiumPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '豪华洗车价格必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '豪华洗车价格必须大于0' }),
    __metadata("design:type", Number)
], UpdateStoreDto.prototype, "deluxePrice", void 0);
class CreateDeviceDto {
}
exports.CreateDeviceDto = CreateDeviceDto;
__decorate([
    (0, class_validator_1.IsString)({ message: '设备ID必须是字符串' }),
    (0, class_validator_1.Length)(1, 50, { message: '设备ID长度必须在1-50字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "devid", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '设备名称必须是字符串' }),
    (0, class_validator_1.Length)(2, 100, { message: '设备名称长度必须在2-100字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '门店ID必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '门店ID必须大于0' }),
    __metadata("design:type", Number)
], CreateDeviceDto.prototype, "storeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '设备型号必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "model", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'ICCID必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "iccid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '设备位置必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '经度必须是数字' }),
    (0, class_validator_1.Min)(-180, { message: '经度不能小于-180' }),
    (0, class_validator_1.Max)(180, { message: '经度不能大于180' }),
    __metadata("design:type", Number)
], CreateDeviceDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '纬度必须是数字' }),
    (0, class_validator_1.Min)(-90, { message: '纬度不能小于-90' }),
    (0, class_validator_1.Max)(90, { message: '纬度不能大于90' }),
    __metadata("design:type", Number)
], CreateDeviceDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsJSON)({ message: '设备配置必须是有效的JSON字符串' }),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "config", void 0);
class UpdateDeviceDto {
}
exports.UpdateDeviceDto = UpdateDeviceDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '设备名称必须是字符串' }),
    (0, class_validator_1.Length)(2, 100, { message: '设备名称长度必须在2-100字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '设备型号必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "model", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['online', 'offline', 'busy', 'maintenance'], {
        message: '设备状态必须是online、offline、busy或maintenance',
    }),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'ICCID必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "iccid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '设备位置必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '经度必须是数字' }),
    (0, class_validator_1.Min)(-180, { message: '经度不能小于-180' }),
    (0, class_validator_1.Max)(180, { message: '经度不能大于180' }),
    __metadata("design:type", Number)
], UpdateDeviceDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '纬度必须是数字' }),
    (0, class_validator_1.Min)(-90, { message: '纬度不能小于-90' }),
    (0, class_validator_1.Max)(90, { message: '纬度不能大于90' }),
    __metadata("design:type", Number)
], UpdateDeviceDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '门店ID必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '门店ID必须大于0' }),
    __metadata("design:type", Number)
], UpdateDeviceDto.prototype, "storeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsJSON)({ message: '设备配置必须是有效的JSON字符串' }),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "config", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '设备版本必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "version", void 0);
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '用户昵称必须是字符串' }),
    (0, class_validator_1.Length)(1, 50, { message: '用户昵称长度必须在1-50字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "nickname", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(roles_decorator_1.UserRole, { message: '用户角色无效' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['active', 'disabled'], { message: '用户状态必须是active或disabled' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '账户余额必须是整数' }),
    (0, class_validator_1.Min)(0, { message: '账户余额不能小于0' }),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "balance", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '门店ID必须是整数' }),
    (0, class_validator_1.Min)(1, { message: '门店ID必须大于0' }),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "storeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '员工角色必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "staffRole", void 0);
class UpdateOrderDto {
}
exports.UpdateOrderDto = UpdateOrderDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['draft', 'pending', 'paid', 'using', 'completed', 'cancelled', 'refunded'], {
        message: '订单状态无效',
    }),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '备注必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "remark", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '退款原因必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "refundReason", void 0);
class UpdateInventoryDto {
}
exports.UpdateInventoryDto = UpdateInventoryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '当前库存量必须是数字' }),
    (0, class_validator_1.Min)(0, { message: '当前库存量不能小于0' }),
    __metadata("design:type", Number)
], UpdateInventoryDto.prototype, "currentStock", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '最小阈值必须是数字' }),
    (0, class_validator_1.Min)(0, { message: '最小阈值不能小于0' }),
    __metadata("design:type", Number)
], UpdateInventoryDto.prototype, "minThreshold", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '最大容量必须是数字' }),
    (0, class_validator_1.Min)(0, { message: '最大容量不能小于0' }),
    __metadata("design:type", Number)
], UpdateInventoryDto.prototype, "maxCapacity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '单价必须是整数' }),
    (0, class_validator_1.Min)(0, { message: '单价不能小于0' }),
    __metadata("design:type", Number)
], UpdateInventoryDto.prototype, "unitPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '供应商必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateInventoryDto.prototype, "supplier", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['normal', 'low', 'empty', 'expired'], {
        message: '库存状态必须是normal、low、empty或expired',
    }),
    __metadata("design:type", String)
], UpdateInventoryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '备注必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateInventoryDto.prototype, "remark", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['in', 'out'], { message: '操作类型必须是in或out' }),
    __metadata("design:type", String)
], UpdateInventoryDto.prototype, "operationType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '操作数量必须是数字' }),
    (0, class_validator_1.Min)(0.01, { message: '操作数量必须大于0' }),
    __metadata("design:type", Number)
], UpdateInventoryDto.prototype, "operationAmount", void 0);
class AcknowledgeAlertDto {
}
exports.AcknowledgeAlertDto = AcknowledgeAlertDto;
__decorate([
    (0, class_validator_1.IsString)({ message: '处理方案必须是字符串' }),
    (0, class_validator_1.Length)(1, 500, { message: '处理方案长度必须在1-500字符之间' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], AcknowledgeAlertDto.prototype, "resolution", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '备注必须是字符串' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], AcknowledgeAlertDto.prototype, "remark", void 0);
class ExportDataDto {
    constructor() {
        this.format = 'excel';
    }
}
exports.ExportDataDto = ExportDataDto;
__decorate([
    (0, class_validator_1.IsString)({ message: '导出类型必须是字符串' }),
    (0, class_validator_1.IsEnum)(['orders', 'devices', 'stores', 'users', 'merchants'], {
        message: '导出类型必须是orders、devices、stores、users或merchants',
    }),
    __metadata("design:type", String)
], ExportDataDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '导出格式必须是字符串' }),
    (0, class_validator_1.IsEnum)(['excel', 'csv'], {
        message: '导出格式必须是excel或csv',
    }),
    __metadata("design:type", String)
], ExportDataDto.prototype, "format", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: '开始日期格式无效' }),
    __metadata("design:type", String)
], ExportDataDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: '结束日期格式无效' }),
    __metadata("design:type", String)
], ExportDataDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '商户ID必须是整数' }),
    __metadata("design:type", Number)
], ExportDataDto.prototype, "merchantId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: '门店ID必须是整数' }),
    __metadata("design:type", Number)
], ExportDataDto.prototype, "storeId", void 0);
//# sourceMappingURL=create-update.dto.js.map