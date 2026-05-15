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
exports.PayrollScheduleSchema = exports.PayrollSchedule = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let PayrollSchedule = class PayrollSchedule {
    orgId;
    disbursementDay;
    smsHoursBefore;
    salaryAmounts;
    encryptedSquadApiKey;
};
exports.PayrollSchedule = PayrollSchedule;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'User', unique: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PayrollSchedule.prototype, "orgId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number, min: 1, max: 28 }),
    __metadata("design:type", Number)
], PayrollSchedule.prototype, "disbursementDay", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number, default: 24 }),
    __metadata("design:type", Number)
], PayrollSchedule.prototype, "smsHoursBefore", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ employeeId: mongoose_2.Types.ObjectId, amount: Number }],
        default: [],
    }),
    __metadata("design:type", Array)
], PayrollSchedule.prototype, "salaryAmounts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], PayrollSchedule.prototype, "encryptedSquadApiKey", void 0);
exports.PayrollSchedule = PayrollSchedule = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'payroll_schedules' })
], PayrollSchedule);
exports.PayrollScheduleSchema = mongoose_1.SchemaFactory.createForClass(PayrollSchedule);
exports.PayrollScheduleSchema.index({ orgId: 1 }, { unique: true });
//# sourceMappingURL=payroll-schedule.schema.js.map