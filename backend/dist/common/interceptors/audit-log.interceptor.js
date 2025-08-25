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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_log_entity_1 = require("../../modules/audit/entities/audit-log.entity");
const audit_log_decorator_1 = require("../decorators/audit-log.decorator");
let AuditLogInterceptor = class AuditLogInterceptor {
    constructor(reflector, auditLogRepository) {
        this.reflector = reflector;
        this.auditLogRepository = auditLogRepository;
    }
    intercept(context, next) {
        const auditConfig = this.reflector.get(audit_log_decorator_1.AUDIT_LOG_KEY, context.getHandler());
        if (!auditConfig) {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const startTime = Date.now();
        const requestInfo = {
            method: request.method,
            url: request.url,
            params: request.params,
            query: request.query,
            body: this.sanitizeBody(request.body),
            ip: this.getClientIp(request),
            userAgent: request.get('User-Agent') || '',
        };
        return next.handle().pipe((0, operators_1.tap)(async (response) => {
            await this.createAuditLog({
                ...auditConfig,
                userId: user?.id,
                userRole: user?.role,
                status: 'success',
                requestInfo,
                responseData: this.sanitizeResponse(response),
                duration: Date.now() - startTime,
                error: null,
            });
        }), (0, operators_1.catchError)(async (error) => {
            await this.createAuditLog({
                ...auditConfig,
                userId: user?.id,
                userRole: user?.role,
                status: 'failure',
                requestInfo,
                responseData: null,
                duration: Date.now() - startTime,
                error: {
                    message: error.message,
                    stack: error.stack,
                    code: error.code || error.status,
                },
            });
            throw error;
        }));
    }
    async createAuditLog(data) {
        try {
            const auditLog = this.auditLogRepository.create({
                action: data.action,
                resourceType: data.resource,
                resourceId: this.extractResourceId(data.requestInfo),
                description: data.description || `${data.action} ${data.resource}`,
                userId: data.userId,
                ipAddress: data.requestInfo.ip,
                userAgent: data.requestInfo.userAgent,
                requestData: JSON.stringify(data.requestInfo),
                responseData: JSON.stringify(data.responseData),
                result: data.status === 'success' ? 'SUCCESS' : 'FAILED',
                duration: data.duration,
                errorMessage: data.error ? JSON.stringify(data.error) : null,
            });
            await this.auditLogRepository.save(auditLog);
        }
        catch (error) {
            console.error('Failed to create audit log:', error);
        }
    }
    extractResourceId(requestInfo) {
        if (requestInfo.params?.id) {
            return parseInt(requestInfo.params.id, 10);
        }
        if (requestInfo.body?.id) {
            return parseInt(requestInfo.body.id, 10);
        }
        if (requestInfo.query?.id) {
            return parseInt(requestInfo.query.id, 10);
        }
        return null;
    }
    sanitizeBody(body) {
        if (!body || typeof body !== 'object') {
            return body;
        }
        const sanitized = { ...body };
        const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
        for (const field of sensitiveFields) {
            if (sanitized[field]) {
                sanitized[field] = '***';
            }
        }
        return sanitized;
    }
    sanitizeResponse(response) {
        if (!response || typeof response !== 'object') {
            return response;
        }
        const responseStr = JSON.stringify(response);
        if (responseStr.length > 10000) {
            return {
                message: 'Response data too large, truncated',
                dataType: Array.isArray(response) ? 'array' : typeof response,
                size: responseStr.length,
            };
        }
        const sanitized = { ...response };
        const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
        for (const field of sensitiveFields) {
            if (sanitized[field]) {
                sanitized[field] = '***';
            }
        }
        return sanitized;
    }
    getClientIp(request) {
        return (request.headers['x-forwarded-for'] ||
            request.headers['x-real-ip'] ||
            request.connection?.remoteAddress ||
            request.socket?.remoteAddress ||
            request.ip ||
            '').split(',')[0].trim();
    }
};
exports.AuditLogInterceptor = AuditLogInterceptor;
exports.AuditLogInterceptor = AuditLogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __metadata("design:paramtypes", [core_1.Reflector,
        typeorm_2.Repository])
], AuditLogInterceptor);
//# sourceMappingURL=audit-log.interceptor.js.map