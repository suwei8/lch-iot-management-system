import { UserRole } from '../../../common/decorators/roles.decorator';
export declare class UpdateUserDto {
    nickname?: string;
    avatar?: string;
    role?: UserRole;
    status?: string;
    balance?: number;
}
