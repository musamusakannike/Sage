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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const verification_service_1 = require("./verification.service");
const submit_challenge_dto_1 = require("./dto/submit-challenge.dto");
const public_decorator_1 = require("../common/decorators/public.decorator");
let VerificationController = class VerificationController {
    verificationService;
    constructor(verificationService) {
        this.verificationService = verificationService;
    }
    getChallenge(token) {
        return this.verificationService.getChallenge(token);
    }
    submitChallenge(token, dto) {
        return this.verificationService.submitChallenge(token, dto);
    }
};
exports.VerificationController = VerificationController;
__decorate([
    (0, common_1.Get)(':token'),
    (0, swagger_1.ApiOperation)({ summary: 'Get liveness challenge for an employee via SMS token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Challenge instruction returned' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Token not found or expired' }),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VerificationController.prototype, "getChallenge", null);
__decorate([
    (0, common_1.Post)(':token/submit'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit liveness challenge result' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Verification received' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Token consumed or expired' }),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submit_challenge_dto_1.SubmitChallengeDto]),
    __metadata("design:returntype", void 0)
], VerificationController.prototype, "submitChallenge", null);
exports.VerificationController = VerificationController = __decorate([
    (0, swagger_1.ApiTags)('verification'),
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('verify'),
    __metadata("design:paramtypes", [verification_service_1.VerificationService])
], VerificationController);
//# sourceMappingURL=verification.controller.js.map