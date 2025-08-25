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
    ORDER_READ = "order:read",
    ORDER_WRITE = "order:write",
    ORDER_DELETE = "order:delete",
    INVENTORY_READ = "inventory:read",
    INVENTORY_WRITE = "inventory:write",
    INVENTORY_DELETE = "inventory:delete",
    ALERT_READ = "alert:read",
    ALERT_WRITE = "alert:write",
    ALERT_DELETE = "alert:delete",
    STAFF_READ = "staff:read",
    STAFF_WRITE = "staff:write",
    STAFF_DELETE = "staff:delete",
    REPORT_READ = "report:read",
    REPORT_EXPORT = "report:export",
    SYSTEM_CONFIG = "system:config",
    SYSTEM_BACKUP = "system:backup",
    SYSTEM_RESTORE = "system:restore",
    SYSTEM_MONITOR = "system:monitor",
    ADMIN_READ = "admin:read",
    ADMIN_WRITE = "admin:write",
    AUDIT_LOG_READ = "audit_log:read",
    AUDIT_LOG_DELETE = "audit_log:delete"
}
export declare const RolePermissions: {
    platform_admin: Permission[];
    merchant: Permission[];
    store_manager: Permission[];
    store_staff: Permission[];
};
