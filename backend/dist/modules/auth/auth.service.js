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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const user_service_1 = require("../user/user.service");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { phone, password, nickname } = registerDto;
        const existingUser = await this.userService.findByPhone(phone);
        if (existingUser) {
            throw new common_1.ConflictException('手机号已被注册');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userService.create({
            phone,
            password: hashedPassword,
            nickname: nickname || `用户${phone.slice(-4)}`,
            role: roles_decorator_1.UserRole.USER,
        });
        const token = this.generateToken(user);
        return {
            user: {
                id: user.id,
                phone: user.phone,
                nickname: user.nickname,
                role: user.role,
                balance: user.balance,
                status: user.status,
                createdAt: user.createdAt,
            },
            token,
        };
    }
    async login(loginDto) {
        const { phone, password } = loginDto;
        const user = await this.userService.findByPhone(phone);
        if (!user) {
            throw new common_1.UnauthorizedException('手机号或密码错误');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('手机号或密码错误');
        }
        if (user.status !== 'active') {
            throw new common_1.UnauthorizedException('账户已被禁用');
        }
        await this.userService.updateLastLogin(user.id);
        const token = this.generateToken(user);
        return {
            user: {
                id: user.id,
                phone: user.phone,
                nickname: user.nickname,
                role: user.role,
                balance: user.balance,
                status: user.status,
                lastLoginAt: new Date(),
            },
            token,
        };
    }
    generateToken(user) {
        const payload = {
            userId: user.id,
            phone: user.phone,
            role: user.role,
        };
        return this.jwtService.sign(payload, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        });
    }
    async validateToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userService.findById(payload.userId);
            if (!user || user.status !== 'active') {
                throw new common_1.UnauthorizedException('无效的token');
            }
            return {
                userId: user.id,
                phone: user.phone,
                role: user.role,
                nickname: user.nickname,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('无效的token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map