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
exports.VerificationSessionSchema = exports.VerificationSession = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let VerificationSession = class VerificationSession {
    employeeId;
    orgId;
    token;
    tokenExpiresAt;
    isConsumed;
    challengeCode;
    deviceFingerprint;
    gpsLat;
    gpsLng;
    gpsCaptured;
    livenessPasssed;
    scoreLiveness;
    scoreGeoCluster;
    scoreDevice;
    scoreTimeCluster;
    scorePayVelocity;
    totalDnaScore;
    verifiedAt;
    cycleId;
    attemptCount;
};
exports.VerificationSession = VerificationSession;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'Employee', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], VerificationSession.prototype, "employeeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'User', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], VerificationSession.prototype, "orgId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, unique: true, index: true }),
    __metadata("design:type", String)
], VerificationSession.prototype, "token", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Date }),
    __metadata("design:type", Date)
], VerificationSession.prototype, "tokenExpiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], VerificationSession.prototype, "isConsumed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String }),
    __metadata("design:type", String)
], VerificationSession.prototype, "challengeCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], VerificationSession.prototype, "deviceFingerprint", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: null }),
    __metadata("design:type", Object)
], VerificationSession.prototype, "gpsLat", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: null }),
    __metadata("design:type", Object)
], VerificationSession.prototype, "gpsLng", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], VerificationSession.prototype, "gpsCaptured", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: null }),
    __metadata("design:type", Object)
], VerificationSession.prototype, "livenessPasssed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: null }),
    __metadata("design:type", Object)
], VerificationSession.prototype, "scoreLiveness", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: null }),
    __metadata("design:type", Object)
], VerificationSession.prototype, "scoreGeoCluster", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: null }),
    __metadata("design:type", Object)
], VerificationSession.prototype, "scoreDevice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: null }),
    __metadata("design:type", Object)
], VerificationSession.prototype, "scoreTimeCluster", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: null }),
    __metadata("design:type", Object)
], VerificationSession.prototype, "scorePayVelocity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: null }),
    __metadata("design:type", Object)
], VerificationSession.prototype, "totalDnaScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], VerificationSession.prototype, "verifiedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], VerificationSession.prototype, "cycleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], VerificationSession.prototype, "attemptCount", void 0);
exports.VerificationSession = VerificationSession = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'verification_sessions' })
], VerificationSession);
exports.VerificationSessionSchema = mongoose_1.SchemaFactory.createForClass(VerificationSession);
exports.VerificationSessionSchema.index({ token: 1 });
exports.VerificationSessionSchema.index({ employeeId: 1, cycleId: 1 });
//# sourceMappingURL=verification-session.schema.js.map