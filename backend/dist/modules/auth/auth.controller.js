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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        return await this.authService.register(registerDto);
    }
    async login(loginDto) {
        return await this.authService.login(loginDto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({
        summary: '用户注册',
        description: '创建新用户账户，支持管理员和商户角色注册'
    }),
    (0, swagger_1.ApiBody)({
        type: register_dto_1.RegisterDto,
        description: '用户注册信息',
        examples: {
            admin: {
                summary: '管理员注册示例',
                value: {
                    username: 'admin',
                    email: 'admin@example.com',
                    password: 'Admin123!',
                    role: 'admin',
                    merchantName: null
                }
            },
            merchant: {
                summary: '商户注册示例',
                value: {
                    username: 'merchant01',
                    email: 'merchant@example.com',
                    password: 'Merchant123!',
                    role: 'merchant',
                    merchantName: '示例商户'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '注册成功',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '注册成功' },
                data: {
                    type: 'object',
                    properties: {
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', example: 'uuid-string' },
                                username: { type: 'string', example: 'admin' },
                                email: { type: 'string', example: 'admin@example.com' },
                                role: { type: 'string', example: 'admin' },
                                status: { type: 'string', example: 'active' },
                                createdAt: { type: 'string', format: 'date-time' }
                            }
                        }
                    }
                },
                timestamp: { type: 'string', format: 'date-time' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: '请求参数错误',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: '用户名已存在' },
                error: {
                    type: 'object',
                    properties: {
                        code: { type: 'string', example: 'USER_EXISTS' },
                        details: { type: 'string', example: '该用户名已被注册' }
                    }
                },
                timestamp: { type: 'string', format: 'date-time' }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: '用户登录',
        description: '用户身份验证，返回JWT访问令牌和用户信息'
    }),
    (0, swagger_1.ApiBody)({
        type: login_dto_1.LoginDto,
        description: '用户登录凭据',
        examples: {
            admin: {
                summary: '管理员登录示例',
                value: {
                    username: 'admin',
                    password: 'Admin123!'
                }
            },
            merchant: {
                summary: '商户登录示例',
                value: {
                    username: 'merchant01',
                    password: 'Merchant123!'
                }
            },
            email: {
                summary: '邮箱登录示例',
                value: {
                    username: 'admin@example.com',
                    password: 'Admin123!'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '登录成功',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '登录成功' },
                data: {
                    type: 'object',
                    properties: {
                        token: {
                            type: 'string',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                            description: 'JWT访问令牌'
                        },
                        refreshToken: {
                            type: 'string',
                            example: 'refresh-token-string',
                            description: '刷新令牌'
                        },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', example: 'uuid-string' },
                                username: { type: 'string', example: 'admin' },
                                email: { type: 'string', example: 'admin@example.com' },
                                role: { type: 'string', example: 'admin' },
                                status: { type: 'string', example: 'active' },
                                lastLoginAt: { type: 'string', format: 'date-time' }
                            }
                        },
                        expiresIn: {
                            type: 'integer',
                            example: 3600,
                            description: '令牌过期时间（秒）'
                        }
                    }
                },
                timestamp: { type: 'string', format: 'date-time' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: '认证失败',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: '用户名或密码错误' },
                error: {
                    type: 'object',
                    properties: {
                        code: { type: 'string', example: 'INVALID_CREDENTIALS' },
                        details: { type: 'string', example: '提供的登录凭据无效' }
                    }
                },
                timestamp: { type: 'string', format: 'date-time' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: '账户被禁用',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: '账户已被禁用' },
                error: {
                    type: 'object',
                    properties: {
                        code: { type: 'string', example: 'ACCOUNT_DISABLED' },
                        details: { type: 'string', example: '该账户已被管理员禁用' }
                    }
                },
                timestamp: { type: 'string', format: 'date-time' }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map