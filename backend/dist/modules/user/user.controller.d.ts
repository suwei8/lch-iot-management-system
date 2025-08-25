import { UserService } from './user.service';
import { UserRole } from '../../common/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(req: any): Promise<{
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
    }>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<{
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
    }>;
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
    findOne(id: number): Promise<{
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
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
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
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
