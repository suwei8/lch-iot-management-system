"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const typeorm_1 = require("typeorm");
const merchant_entity_1 = require("../../merchant/entities/merchant.entity");
const device_entity_1 = require("../../device/entities/device.entity");
const order_entity_1 = require("../../order/entities/order.entity");
const inventory_entity_1 = require("../../inventory/entities/inventory.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const alert_entity_1 = require("../../alert/entities/alert.entity");
let Store = class Store {
};
exports.Store = Store;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Store.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Store.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, unique: true }),
    (0, typeorm_1.Index)('idx_store_code'),
    __metadata("design:type", String)
], Store.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Store.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Store.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Store.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Store.prototype, "contact", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Store.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['active', 'closed', 'maintenance'],
        default: 'active',
    }),
    __metadata("design:type", String)
], Store.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "businessHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1000 }),
    __metadata("design:type", Number)
], Store.prototype, "basicPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1500 }),
    __metadata("design:type", Number)
], Store.prototype, "premiumPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 2000 }),
    __metadata("design:type", Number)
], Store.prototype, "deluxePrice", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Store.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Store.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Store.prototype, "merchantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => merchant_entity_1.Merchant, (merchant) => merchant.stores),
    (0, typeorm_1.JoinColumn)({ name: 'merchantId' }),
    __metadata("design:type", merchant_entity_1.Merchant)
], Store.prototype, "merchant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => device_entity_1.Device, (device) => device.store),
    __metadata("design:type", Array)
], Store.prototype, "devices", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (order) => order.store),
    __metadata("design:type", Array)
], Store.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => inventory_entity_1.Inventory, (inventory) => inventory.store),
    __metadata("design:type", Array)
], Store.prototype, "inventory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (user) => user.store),
    __metadata("design:type", Array)
], Store.prototype, "staff", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => alert_entity_1.Alert, (alert) => alert.store),
    __metadata("design:type", Array)
], Store.prototype, "alerts", void 0);
exports.Store = Store = __decorate([
    (0, typeorm_1.Entity)('stores')
], Store);
//# sourceMappingURL=store.entity.js.map