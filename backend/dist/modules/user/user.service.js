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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(userData) {
        const user = this.userRepository.create({
            ...userData,
            role: userData.role || roles_decorator_1.UserRole.USER,
            balance: 0,
            status: 'active',
        });
        return await this.userRepository.save(user);
    }
    async findById(id) {
        return await this.userRepository.findOne({ where: { id } });
    }
    async findByPhone(phone) {
        return await this.userRepository.findOne({ where: { phone } });
    }
    async updateLastLogin(id) {
        await this.userRepository.update(id, {
            lastLoginAt: new Date(),
        });
    }
    async update(id, updateData) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('用户不存在');
        }
        await this.userRepository.update(id, updateData);
        return await this.findById(id);
    }
    async updateBalance(id, amount) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('用户不存在');
        }
        const newBalance = user.balance + amount;
        if (newBalance < 0) {
            throw new Error('余额不足');
        }
        await this.userRepository.update(id, { balance: newBalance });
        return await this.findById(id);
    }
    async findAll(page = 1, limit = 10, role, status) {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        if (role) {
            queryBuilder.andWhere('user.role = :role', { role });
        }
        if (status) {
            queryBuilder.andWhere('user.status = :status', { status });
        }
        queryBuilder
            .orderBy('user.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [users, total] = await queryBuilder.getManyAndCount();
        return {
            users: users.map(user => ({
                id: user.id,
                phone: user.phone,
                nickname: user.nickname,
                role: user.role,
                avatar: user.avatar,
                balance: user.balance,
                status: user.status,
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async remove(id) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('用户不存在');
        }
        await this.userRepository.update(id, { status: 'inactive' });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map