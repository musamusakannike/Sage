"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const crypto = __importStar(require("crypto"));
const transactions_service_1 = require("./transactions.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
let TransactionsController = class TransactionsController {
    transactionsService;
    configService;
    constructor(transactionsService, configService) {
        this.transactionsService = transactionsService;
        this.configService = configService;
    }
    async handleSquadWebhook(payload, signature) {
        this.verifyHmac(payload, signature);
        this.transactionsService
            .processWebhook(payload, String(payload['orgId'] ?? ''), String(payload['employeeId'] ?? ''), payload['cycleId'] ? String(payload['cycleId']) : undefined)
            .catch((err) => console.error('Webhook processing error:', err));
        return { received: true };
    }
    verifyHmac(payload, signature) {
        const secret = this.configService.get('app.squadWebhookSecret');
        if (!secret)
            return;
        const expected = crypto
            .createHmac('sha512', secret)
            .update(JSON.stringify(payload))
            .digest('hex');
        if (signature !== expected) {
            throw new common_1.BadRequestException('Invalid webhook signature.');
        }
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Post)('squad'),
    (0, swagger_1.ApiOperation)({ summary: 'Squad Transaction API webhook receiver' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid signature' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-squad-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "handleSquadWebhook", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, swagger_1.ApiTags)('webhooks'),
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService,
        config_1.ConfigService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map