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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
let RolesGuard = class RolesGuard {
    constructor(reflector, jwtService) {
        this.reflector = reflector;
        this.jwtService = jwtService;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('用户未认证');
        }
        const hasRole = requiredRoles.some((role) => user.role === role);
        if (!hasRole) {
            throw new common_1.ForbiddenException('权限不足');
        }
        this.validateDataScope(request, user);
        return true;
    }
    validateDataScope(request, user) {
        const { method, params, body } = request;
        const userRole = user.role;
        if (userRole === roles_decorator_1.UserRole.PLATFORM_ADMIN) {
            return;
        }
        if (userRole === roles_decorator_1.UserRole.MERCHANT) {
            const merchantId = params.merchantId || body.merchantId || user.merchantId;
            if (merchantId && merchantId !== user.merchantId) {
                throw new common_1.ForbiddenException('无权访问其他商户数据');
            }
        }
        if (userRole === roles_decorator_1.UserRole.STORE_MANAGER) {
            const storeId = params.storeId || body.storeId || user.storeId;
            if (storeId && storeId !== user.storeId) {
                throw new common_1.ForbiddenException('无权访问其他门店数据');
            }
        }
        if (userRole === roles_decorator_1.UserRole.STORE_STAFF) {
            const storeId = params.storeId || body.storeId || user.storeId;
            if (storeId && storeId !== user.storeId) {
                throw new common_1.ForbiddenException('无权访问其他门店数据');
            }
            if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
                const allowedPaths = ['/profile', '/password'];
                const isAllowed = allowedPaths.some(path => request.url.includes(path));
                if (!isAllowed) {
                    throw new common_1.ForbiddenException('门店员工无权执行此操作');
                }
            }
        }
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        jwt_1.JwtService])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map