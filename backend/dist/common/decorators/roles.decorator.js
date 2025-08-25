"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.ROLES_KEY = exports.UserRole = void 0;
const common_1 = require("@nestjs/common");
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["MERCHANT"] = "merchant";
    UserRole["STORE_MANAGER"] = "store_manager";
    UserRole["STORE_STAFF"] = "store_staff";
    UserRole["PLATFORM_ADMIN"] = "platform_admin";
})(UserRole || (exports.UserRole = UserRole = {}));
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
//# sourceMappingURL=roles.decorator.js.map