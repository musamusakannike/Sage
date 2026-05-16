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
exports.EmployeeSchema = exports.Employee = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const enums_1 = require("../../common/enums");
let Employee = class Employee {
    orgId;
    name;
    roleTitle;
    accountNumber;
    phone;
    email;
    dnaScore;
    status;
    lastVerifiedAt;
    deletedAt;
};
exports.Employee = Employee;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'User', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Employee.prototype, "orgId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String }),
    __metadata("design:type", String)
], Employee.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String }),
    __metadata("design:type", String)
], Employee.prototype, "roleTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: String, default: null }),
    __metadata("design:type", Object)
], Employee.prototype, "accountNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: String, sparse: true, default: null }),
    __metadata("design:type", Object)
], Employee.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Employee.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: null }),
    __metadata("design:type", Object)
], Employee.prototype, "dnaScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(enums_1.EmployeeStatus),
        default: enums_1.EmployeeStatus.PENDING,
    }),
    __metadata("design:type", String)
], Employee.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], Employee.prototype, "lastVerifiedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Employee.prototype, "deletedAt", void 0);
exports.Employee = Employee = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'employees' })
], Employee);
exports.EmployeeSchema = mongoose_1.SchemaFactory.createForClass(Employee);
exports.EmployeeSchema.index({ orgId: 1, status: 1 });
exports.EmployeeSchema.index({ phone: 1 }, { unique: true, sparse: true });
//# sourceMappingURL=employee.schema.js.map