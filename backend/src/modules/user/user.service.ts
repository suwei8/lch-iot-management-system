import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from '../../common/decorators/roles.decorator';

/**
 * 用户服务
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 创建用户
   * @param userData 用户数据
   */
  async create(userData: {
    phone: string;
    password: string;
    nickname?: string;
    role?: UserRole;
    avatar?: string;
  }): Promise<User> {
    const user = this.userRepository.create({
      ...userData,
      role: userData.role || UserRole.USER,
      balance: 0,
      status: 'active',
    });

    return await this.userRepository.save(user);
  }

  /**
   * 根据ID查找用户
   * @param id 用户ID
   */
  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  /**
   * 根据手机号查找用户
   * @param phone 手机号
   */
  async findByPhone(phone: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { phone } });
  }

  /**
   * 更新最后登录时间
   * @param id 用户ID
   */
  async updateLastLogin(id: number): Promise<void> {
    await this.userRepository.update(id, {
      lastLoginAt: new Date(),
    });
  }

  /**
   * 更新用户信息
   * @param id 用户ID
   * @param updateData 更新数据
   */
  async update(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    await this.userRepository.update(id, updateData);
    return await this.findById(id);
  }

  /**
   * 更新用户余额
   * @param id 用户ID
   * @param amount 金额变化（正数为增加，负数为减少）
   */
  async updateBalance(id: number, amount: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const newBalance = user.balance + amount;
    if (newBalance < 0) {
      throw new Error('余额不足');
    }

    await this.userRepository.update(id, { balance: newBalance });
    return await this.findById(id);
  }

  /**
   * 获取用户列表（分页）
   * @param page 页码
   * @param limit 每页数量
   * @param role 角色筛选
   * @param status 状态筛选
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    role?: UserRole,
    status?: string,
  ) {
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

  /**
   * 删除用户（软删除，更改状态为inactive）
   * @param id 用户ID
   */
  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    await this.userRepository.update(id, { status: 'inactive' });
  }
}