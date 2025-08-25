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
exports.AddressDto = exports.CoordinateDto = exports.FileUploadDto = exports.VerificationCodeDto = exports.EmailDto = exports.PhoneDto = exports.ChangePasswordDto = exports.PasswordDto = exports.SearchDto = exports.DateRangeDto = exports.SortDto = exports.StatusUpdateDto = exports.BatchIdDto = exports.IdDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class IdDto {
}
exports.IdDto = IdDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID', example: 1 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'ID必须是数字' }),
    (0, class_validator_1.Min)(1, { message: 'ID必须大于0' }),
    __metadata("design:type", Number)
], IdDto.prototype, "id", void 0);
class BatchIdDto {
}
exports.BatchIdDto = BatchIdDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID列表', example: [1, 2, 3] }),
    (0, class_validator_1.IsArray)({ message: 'IDs必须是数组' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: '至少选择一个项目' }),
    (0, class_validator_1.ArrayMaxSize)(100, { message: '最多选择100个项目' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { each: true, message: '每个ID必须是数字' }),
    (0, class_validator_1.Min)(1, { each: true, message: '每个ID必须大于0' }),
    __metadata("design:type", Array)
], BatchIdDto.prototype, "ids", void 0);
class StatusUpdateDto {
}
exports.StatusUpdateDto = StatusUpdateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '状态', example: 'active' }),
    (0, class_validator_1.IsString)({ message: '状态必须是字符串' }),
    (0, class_validator_1.IsEnum)(['active', 'inactive'], { message: '状态必须是active或inactive' }),
    __metadata("design:type", String)
], StatusUpdateDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '备注', example: '状态更新原因', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '备注必须是字符串' }),
    (0, class_validator_1.MaxLength)(500, { message: '备注最多500个字符' }),
    __metadata("design:type", String)
], StatusUpdateDto.prototype, "remark", void 0);
class SortDto {
}
exports.SortDto = SortDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '排序字段', example: 'createdAt' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '排序字段必须是字符串' }),
    __metadata("design:type", String)
], SortDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '排序方向', example: 'DESC', enum: ['ASC', 'DESC'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['ASC', 'DESC'], { message: '排序方向必须是ASC或DESC' }),
    __metadata("design:type", String)
], SortDto.prototype, "sortOrder", void 0);
class DateRangeDto {
}
exports.DateRangeDto = DateRangeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '开始日期', example: '2024-01-01' }),
    (0, class_validator_1.IsDateString)({}, { message: '开始日期格式无效' }),
    __metadata("design:type", String)
], DateRangeDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '结束日期', example: '2024-12-31' }),
    (0, class_validator_1.IsDateString)({}, { message: '结束日期格式无效' }),
    __metadata("design:type", String)
], DateRangeDto.prototype, "endDate", void 0);
class SearchDto {
}
exports.SearchDto = SearchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '搜索关键词', example: '关键词', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '搜索关键词必须是字符串' }),
    (0, class_validator_1.MaxLength)(100, { message: '搜索关键词最多100个字符' }),
    __metadata("design:type", String)
], SearchDto.prototype, "keyword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '搜索字段', example: ['name', 'description'], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: '搜索字段必须是数组' }),
    (0, class_validator_1.IsString)({ each: true, message: '每个搜索字段必须是字符串' }),
    __metadata("design:type", Array)
], SearchDto.prototype, "fields", void 0);
class PasswordDto {
}
exports.PasswordDto = PasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '密码', example: '123456' }),
    (0, class_validator_1.IsString)({ message: '密码必须是字符串' }),
    (0, class_validator_1.MinLength)(6, { message: '密码至少6位' }),
    (0, class_validator_1.MaxLength)(20, { message: '密码最多20位' }),
    __metadata("design:type", String)
], PasswordDto.prototype, "password", void 0);
class ChangePasswordDto extends PasswordDto {
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '旧密码', example: 'oldpassword' }),
    (0, class_validator_1.IsString)({ message: '旧密码必须是字符串' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "oldPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '确认密码', example: '123456' }),
    (0, class_validator_1.IsString)({ message: '确认密码必须是字符串' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "confirmPassword", void 0);
class PhoneDto {
}
exports.PhoneDto = PhoneDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '手机号', example: '13800138000' }),
    (0, class_validator_1.IsString)({ message: '手机号必须是字符串' }),
    (0, class_validator_1.Matches)(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' }),
    __metadata("design:type", String)
], PhoneDto.prototype, "phone", void 0);
class EmailDto {
}
exports.EmailDto = EmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '邮箱', example: 'user@example.com' }),
    (0, class_validator_1.IsEmail)({}, { message: '邮箱格式不正确' }),
    __metadata("design:type", String)
], EmailDto.prototype, "email", void 0);
class VerificationCodeDto {
}
exports.VerificationCodeDto = VerificationCodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '验证码', example: '123456' }),
    (0, class_validator_1.IsString)({ message: '验证码必须是字符串' }),
    (0, class_validator_1.Matches)(/^\d{6}$/, { message: '验证码必须是6位数字' }),
    __metadata("design:type", String)
], VerificationCodeDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '验证码类型', example: 'login', enum: ['login', 'register', 'reset_password'] }),
    (0, class_validator_1.IsEnum)(['login', 'register', 'reset_password'], {
        message: '验证码类型必须是login、register或reset_password',
    }),
    __metadata("design:type", String)
], VerificationCodeDto.prototype, "type", void 0);
class FileUploadDto {
}
exports.FileUploadDto = FileUploadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '文件类型', example: 'image', enum: ['image', 'document', 'video', 'audio'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['image', 'document', 'video', 'audio'], {
        message: '文件类型必须是image、document、video或audio',
    }),
    __metadata("design:type", String)
], FileUploadDto.prototype, "fileType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '最大文件大小（MB）', example: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '文件大小必须是数字' }),
    (0, class_validator_1.Min)(1, { message: '文件大小至少1MB' }),
    (0, class_validator_1.Max)(100, { message: '文件大小最多100MB' }),
    __metadata("design:type", Number)
], FileUploadDto.prototype, "maxSize", void 0);
class CoordinateDto {
}
exports.CoordinateDto = CoordinateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '经度', example: 116.404 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '经度必须是数字' }),
    (0, class_validator_1.Min)(-180, { message: '经度范围：-180到180' }),
    (0, class_validator_1.Max)(180, { message: '经度范围：-180到180' }),
    __metadata("design:type", Number)
], CoordinateDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '纬度', example: 39.915 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '纬度必须是数字' }),
    (0, class_validator_1.Min)(-90, { message: '纬度范围：-90到90' }),
    (0, class_validator_1.Max)(90, { message: '纬度范围：-90到90' }),
    __metadata("design:type", Number)
], CoordinateDto.prototype, "latitude", void 0);
class AddressDto extends CoordinateDto {
}
exports.AddressDto = AddressDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '省份', example: '北京市' }),
    (0, class_validator_1.IsString)({ message: '省份必须是字符串' }),
    (0, class_validator_1.MaxLength)(50, { message: '省份最多50个字符' }),
    __metadata("design:type", String)
], AddressDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '城市', example: '北京市' }),
    (0, class_validator_1.IsString)({ message: '城市必须是字符串' }),
    (0, class_validator_1.MaxLength)(50, { message: '城市最多50个字符' }),
    __metadata("design:type", String)
], AddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '区县', example: '朝阳区' }),
    (0, class_validator_1.IsString)({ message: '区县必须是字符串' }),
    (0, class_validator_1.MaxLength)(50, { message: '区县最多50个字符' }),
    __metadata("design:type", String)
], AddressDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '详细地址', example: '某某街道某某号' }),
    (0, class_validator_1.IsString)({ message: '详细地址必须是字符串' }),
    (0, class_validator_1.MaxLength)(200, { message: '详细地址最多200个字符' }),
    __metadata("design:type", String)
], AddressDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '邮政编码', example: '100000', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '邮政编码必须是字符串' }),
    (0, class_validator_1.Matches)(/^\d{6}$/, { message: '邮政编码必须是6位数字' }),
    __metadata("design:type", String)
], AddressDto.prototype, "zipCode", void 0);
//# sourceMappingURL=validation.dto.js.map