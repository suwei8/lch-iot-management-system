import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../../common/decorators/roles.decorator';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: number;
            phone: string;
            nickname: string;
            role: UserRole;
            balance: number;
            status: string;
            createdAt: Date;
        };
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: number;
            phone: string;
            nickname: string;
            role: UserRole;
            balance: number;
            status: string;
            lastLoginAt: Date;
        };
        token: string;
    }>;
    private generateToken;
    validateToken(token: string): Promise<{
        userId: number;
        phone: string;
        role: UserRole;
        nickname: string;
    }>;
}
