"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirePermissions = exports.PERMISSIONS_KEY = exports.ROLE_PERMISSIONS = exports.Permission = void 0;
exports.hasPermission = hasPermission;
exports.getUserPermissions = getUserPermissions;
const common_1 = require("@nestjs/common");
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
    Permission["DEVICE_CONTROL"] = "device:control";
    Permission["ORDER_READ"] = "order:read";
    Permission["ORDER_WRITE"] = "order:write";
    Permission["ORDER_REFUND"] = "order:refund";
    Permission["INVENTORY_READ"] = "inventory:read";
    Permission["INVENTORY_WRITE"] = "inventory:write";
    Permission["ALERT_READ"] = "alert:read";
    Permission["ALERT_WRITE"] = "alert:write";
    Permission["SYSTEM_READ"] = "system:read";
    Permission["SYSTEM_WRITE"] = "system:write";
    Permission["SYSTEM_EXPORT"] = "system:export";
    Permission["AUDIT_READ"] = "audit:read";
})(Permission || (exports.Permission = Permission = {}));
exports.ROLE_PERMISSIONS = {
    platform_admin: [
        ...Object.values(Permission),
    ],
    merchant: [
        Permission.MERCHANT_READ,
        Permission.STORE_READ,
        Permission.STORE_WRITE,
        Permission.STORE_DELETE,
        Permission.DEVICE_READ,
        Permission.DEVICE_WRITE,
        Permission.DEVICE_CONTROL,
        Permission.ORDER_READ,
        Permission.ORDER_WRITE,
        Permission.ORDER_REFUND,
        Permission.INVENTORY_READ,
        Permission.INVENTORY_WRITE,
        Permission.ALERT_READ,
        Permission.ALERT_WRITE,
        Permission.USER_READ,
        Permission.USER_WRITE,
        Permission.AUDIT_READ,
    ],
    store_manager: [
        Permission.STORE_READ,
        Permission.DEVICE_READ,
        Permission.DEVICE_WRITE,
        Permission.DEVICE_CONTROL,
        Permission.ORDER_READ,
        Permission.ORDER_WRITE,
        Permission.INVENTORY_READ,
        Permission.INVENTORY_WRITE,
        Permission.ALERT_READ,
        Permission.ALERT_WRITE,
        Permission.USER_READ,
        Permission.USER_WRITE,
    ],
    store_staff: [
        Permission.STORE_READ,
        Permission.DEVICE_READ,
        Permission.DEVICE_CONTROL,
        Permission.ORDER_READ,
        Permission.INVENTORY_READ,
        Permission.ALERT_READ,
    ],
    user: [
        Permission.ORDER_READ,
    ],
};
exports.PERMISSIONS_KEY = 'permissions';
const RequirePermissions = (...permissions) => (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, permissions);
exports.RequirePermissions = RequirePermissions;
function hasPermission(userRole, permission) {
    const rolePermissions = exports.ROLE_PERMISSIONS[userRole] || [];
    return rolePermissions.includes(permission);
}
function getUserPermissions(userRole) {
    return exports.ROLE_PERMISSIONS[userRole] || [];
}
//# sourceMappingURL=permissions.decorator.js.map