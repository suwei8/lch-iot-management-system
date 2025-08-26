"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const admin_service_1 = require("./admin.service");
const admin_controller_1 = require("./admin.controller");
const user_entity_1 = require("../user/entities/user.entity");
const device_entity_1 = require("../device/entities/device.entity");
const order_entity_1 = require("../order/entities/order.entity");
const merchant_entity_1 = require("../merchant/entities/merchant.entity");
const store_entity_1 = require("../store/entities/store.entity");
const inventory_entity_1 = require("../inventory/entities/inventory.entity");
const alert_entity_1 = require("../alert/entities/alert.entity");
const audit_log_entity_1 = require("../audit/entities/audit-log.entity");
const device_log_entity_1 = require("../device/entities/device-log.entity");
const redis_config_1 = require("../../config/redis.config");
const audit_log_module_1 = require("./audit-log.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                device_entity_1.Device,
                order_entity_1.Order,
                merchant_entity_1.Merchant,
                store_entity_1.Store,
                inventory_entity_1.Inventory,
                alert_entity_1.Alert,
                audit_log_entity_1.AuditLog,
                device_log_entity_1.DeviceLog,
            ]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '24h' },
            }),
            audit_log_module_1.AuditLogModule,
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService, redis_config_1.RedisService],
        exports: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map