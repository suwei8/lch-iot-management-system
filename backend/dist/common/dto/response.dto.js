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
exports.BatchOperationResponseDto = exports.FileUploadResponseDto = exports.ChartDataResponseDto = exports.StatsResponseDto = exports.PaginatedResponseDto = exports.ApiResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ApiResponseDto {
    constructor(code, message, data) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = Date.now();
    }
    static success(data, message = '操作成功') {
        return new ApiResponseDto(200, message, data);
    }
    static error(code, message) {
        return new ApiResponseDto(code, message);
    }
}
exports.ApiResponseDto = ApiResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '响应状态码', example: 200 }),
    __metadata("design:type", Number)
], ApiResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '响应消息', example: '操作成功' }),
    __metadata("design:type", String)
], ApiResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '响应数据' }),
    __metadata("design:type", Object)
], ApiResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '时间戳', example: 1640995200000 }),
    __metadata("design:type", Number)
], ApiResponseDto.prototype, "timestamp", void 0);
class PaginatedResponseDto {
    constructor(items, total, page, limit) {
        this.items = items;
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.totalPages = Math.ceil(total / limit);
        this.hasNext = page < this.totalPages;
        this.hasPrev = page > 1;
    }
}
exports.PaginatedResponseDto = PaginatedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '数据列表', isArray: true }),
    __metadata("design:type", Array)
], PaginatedResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总数量', example: 100 }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '当前页码', example: 1 }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '每页数量', example: 10 }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总页数', example: 10 }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '是否有下一页', example: true }),
    __metadata("design:type", Boolean)
], PaginatedResponseDto.prototype, "hasNext", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '是否有上一页', example: false }),
    __metadata("design:type", Boolean)
], PaginatedResponseDto.prototype, "hasPrev", void 0);
class StatsResponseDto {
}
exports.StatsResponseDto = StatsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '统计标签', example: '今日订单' }),
    __metadata("design:type", String)
], StatsResponseDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '统计值', example: 100 }),
    __metadata("design:type", Number)
], StatsResponseDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '变化百分比', example: 15.5 }),
    __metadata("design:type", Number)
], StatsResponseDto.prototype, "changePercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '变化趋势', example: 'up', enum: ['up', 'down', 'stable'] }),
    __metadata("design:type", String)
], StatsResponseDto.prototype, "trend", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '额外信息' }),
    __metadata("design:type", Object)
], StatsResponseDto.prototype, "extra", void 0);
class ChartDataResponseDto {
}
exports.ChartDataResponseDto = ChartDataResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'X轴标签', example: ['1月', '2月', '3月'] }),
    __metadata("design:type", Array)
], ChartDataResponseDto.prototype, "labels", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '数据集' }),
    __metadata("design:type", Array)
], ChartDataResponseDto.prototype, "datasets", void 0);
class FileUploadResponseDto {
}
exports.FileUploadResponseDto = FileUploadResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '文件名', example: 'document.pdf' }),
    __metadata("design:type", String)
], FileUploadResponseDto.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '文件路径', example: '/uploads/documents/document.pdf' }),
    __metadata("design:type", String)
], FileUploadResponseDto.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '文件大小（字节）', example: 1024000 }),
    __metadata("design:type", Number)
], FileUploadResponseDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '文件类型', example: 'application/pdf' }),
    __metadata("design:type", String)
], FileUploadResponseDto.prototype, "mimetype", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '上传时间', example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], FileUploadResponseDto.prototype, "uploadedAt", void 0);
class BatchOperationResponseDto {
    constructor(successCount, failureCount, failures) {
        this.successCount = successCount;
        this.failureCount = failureCount;
        this.totalCount = successCount + failureCount;
        this.failures = failures;
        this.success = failureCount === 0;
    }
}
exports.BatchOperationResponseDto = BatchOperationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '成功数量', example: 8 }),
    __metadata("design:type", Number)
], BatchOperationResponseDto.prototype, "successCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '失败数量', example: 2 }),
    __metadata("design:type", Number)
], BatchOperationResponseDto.prototype, "failureCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总数量', example: 10 }),
    __metadata("design:type", Number)
], BatchOperationResponseDto.prototype, "totalCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '失败详情', example: [{ id: 1, error: '数据不存在' }] }),
    __metadata("design:type", Array)
], BatchOperationResponseDto.prototype, "failures", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '操作结果', example: true }),
    __metadata("design:type", Boolean)
], BatchOperationResponseDto.prototype, "success", void 0);
//# sourceMappingURL=response.dto.js.map