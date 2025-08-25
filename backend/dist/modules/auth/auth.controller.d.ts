import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: number;
            phone: string;
            nickname: string;
            role: import("../../common/decorators/roles.decorator").UserRole;
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
            role: import("../../common/decorators/roles.decorator").UserRole;
            balance: number;
            status: string;
            lastLoginAt: Date;
        };
        token: string;
    }>;
}
