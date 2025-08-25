export declare enum Permission {
    USER_READ = "user:read",
    USER_WRITE = "user:write",
    USER_DELETE = "user:delete",
    MERCHANT_READ = "merchant:read",
    MERCHANT_WRITE = "merchant:write",
    MERCHANT_DELETE = "merchant:delete",
    STORE_READ = "store:read",
    STORE_WRITE = "store:write",
    STORE_DELETE = "store:delete",
    DEVICE_READ = "device:read",
    DEVICE_WRITE = "device:write",
    DEVICE_DELETE = "device:delete",
    DEVICE_CONTROL = "device:control",
    ORDER_READ = "order:read",
    ORDER_WRITE = "order:write",
    ORDER_REFUND = "order:refund",
    INVENTORY_READ = "inventory:read",
    INVENTORY_WRITE = "inventory:write",
    ALERT_READ = "alert:read",
    ALERT_WRITE = "alert:write",
    SYSTEM_READ = "system:read",
    SYSTEM_WRITE = "system:write",
    SYSTEM_EXPORT = "system:export",
    AUDIT_READ = "audit:read"
}
export declare const ROLE_PERMISSIONS: {
    platform_admin: Permission[];
    merchant: Permission[];
    store_manager: Permission[];
    store_staff: Permission[];
    user: Permission[];
};
export declare const PERMISSIONS_KEY = "permissions";
export declare const RequirePermissions: (...permissions: Permission[]) => import("@nestjs/common").CustomDecorator<string>;
export declare function hasPermission(userRole: string, permission: Permission): boolean;
export declare function getUserPermissions(userRole: string): Permission[];
