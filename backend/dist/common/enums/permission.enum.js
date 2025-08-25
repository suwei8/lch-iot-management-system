"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissions = exports.Permission = void 0;
var Permission;
(function (Permission) {
    Permission["USER_READ"] = "user:read";
    Permission["USER_WRITE"] = "user:write";
    Permission["USER_DELETE"] = "user:delete";
    Permission["MERCHANT_READ"] = "merchant:read";
    Permission["MERCHANT_WRITE"] = "merchant:write";
    Permission["MERCHANT_DELETE"] = "merchant:delete";
    Permission["STORE_READ"] = "store:read";
    Permission["STORE_WRITE"] = "store:write";
    Permission["STORE_DELETE"] = "store:delete";
    Permission["DEVICE_READ"] = "device:read";
    Permission["DEVICE_WRITE"] = "device:write";
    Permission["DEVICE_DELETE"] = "device:delete";
    Permission["ORDER_READ"] = "order:read";
    Permission["ORDER_WRITE"] = "order:write";
    Permission["ORDER_DELETE"] = "order:delete";
    Permission["INVENTORY_READ"] = "inventory:read";
    Permission["INVENTORY_WRITE"] = "inventory:write";
    Permission["INVENTORY_DELETE"] = "inventory:delete";
    Permission["ALERT_READ"] = "alert:read";
    Permission["ALERT_WRITE"] = "alert:write";
    Permission["ALERT_DELETE"] = "alert:delete";
    Permission["STAFF_READ"] = "staff:read";
    Permission["STAFF_WRITE"] = "staff:write";
    Permission["STAFF_DELETE"] = "staff:delete";
    Permission["REPORT_READ"] = "report:read";
    Permission["REPORT_EXPORT"] = "report:export";
    Permission["SYSTEM_CONFIG"] = "system:config";
    Permission["SYSTEM_BACKUP"] = "system:backup";
    Permission["SYSTEM_RESTORE"] = "system:restore";
    Permission["SYSTEM_MONITOR"] = "system:monitor";
    Permission["ADMIN_READ"] = "admin:read";
    Permission["ADMIN_WRITE"] = "admin:write";
    Permission["AUDIT_LOG_READ"] = "audit_log:read";
    Permission["AUDIT_LOG_DELETE"] = "audit_log:delete";
})(Permission || (exports.Permission = Permission = {}));
exports.RolePermissions = {
    platform_admin: Object.values(Permission),
    merchant: [
        Permission.MERCHANT_READ,
        Permission.MERCHANT_WRITE,
        Permission.STORE_READ,
        Permission.STORE_WRITE,
        Permission.DEVICE_READ,
        Permission.DEVICE_WRITE,
        Permission.ORDER_READ,
        Permission.INVENTORY_READ,
        Permission.INVENTORY_WRITE,
        Permission.ALERT_READ,
        Permission.ALERT_WRITE,
        Permission.STAFF_READ,
        Permission.STAFF_WRITE,
        Permission.STAFF_DELETE,
        Permission.REPORT_READ,
        Permission.REPORT_EXPORT,
    ],
    store_manager: [
        Permission.STORE_READ,
        Permission.DEVICE_READ,
        Permission.ORDER_READ,
        Permission.ORDER_WRITE,
        Permission.INVENTORY_READ,
        Permission.INVENTORY_WRITE,
        Permission.ALERT_READ,
        Permission.ALERT_WRITE,
        Permission.STAFF_READ,
        Permission.STAFF_WRITE,
        Permission.REPORT_READ,
    ],
    store_staff: [
        Permission.STORE_READ,
        Permission.DEVICE_READ,
        Permission.ORDER_READ,
        Permission.INVENTORY_READ,
        Permission.ALERT_READ,
        Permission.REPORT_READ,
    ],
};
//# sourceMappingURL=permission.enum.js.map