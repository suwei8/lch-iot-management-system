import { Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private userService;
    constructor(userService: UserService);
    validate(payload: any): Promise<{
        userId: number;
        phone: string;
        role: import("../../../common/decorators/roles.decorator").UserRole;
        nickname: string;
    }>;
}
export {};
