import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from '../../common/decorators/roles.decorator';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    create(userData: {
        phone: string;
        password: string;
        nickname?: string;
        role?: UserRole;
        avatar?: string;
    }): Promise<User>;
    findById(id: number): Promise<User | null>;
    findByPhone(phone: string): Promise<User | null>;
    updateLastLogin(id: number): Promise<void>;
    update(id: number, updateData: Partial<User>): Promise<User>;
    updateBalance(id: number, amount: number): Promise<User>;
    findAll(page?: number, limit?: number, role?: UserRole, status?: string): Promise<{
        users: {
            id: number;
            phone: string;
            nickname: string;
            role: UserRole;
            avatar: string;
            balance: number;
            status: string;
            lastLoginAt: Date;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    remove(id: number): Promise<void>;
}
