export declare enum UserRole {
    USER = "user",
    MERCHANT = "merchant",
    STORE_MANAGER = "store_manager",
    STORE_STAFF = "store_staff",
    PLATFORM_ADMIN = "platform_admin"
}
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
