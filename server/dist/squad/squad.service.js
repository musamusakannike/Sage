"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var SquadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SquadService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let SquadService = SquadService_1 = class SquadService {
    logger = new common_1.Logger(SquadService_1.name);
    baseUrl = 'https://sandbox-api-d.squadco.com';
    getClient(apiKey) {
        return axios_1.default.create({
            baseURL: this.baseUrl,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });
    }
    async disburse(apiKey, employeeName, accountNumber, amount, reference) {
        try {
            const client = this.getClient(apiKey);
            const response = await client.post('/payout/initiate', {
                transaction_reference: reference,
                amount: amount * 100,
                bank_code: '058',
                account_number: accountNumber,
                account_name: employeeName,
                currency_id: 'NGN',
                remark: 'Salary disbursement via Sage AI',
            });
            if (response.data?.status === 200) {
                this.logger.log(`Disbursed to ${accountNumber} — ref: ${reference}`);
                return { success: true, reference };
            }
            this.logger.warn(`Disburse failed for ${accountNumber}`);
            return { success: false, reference };
        }
        catch (error) {
            this.logger.error(`Squad disburse error: ${error.message}`);
            return { success: false, reference };
        }
    }
    async blockDisbursement(apiKey, reference) {
        this.logger.log(`Block disbursement requested: ref ${reference}`);
        return { success: true };
    }
};
exports.SquadService = SquadService;
exports.SquadService = SquadService = SquadService_1 = __decorate([
    (0, common_1.Injectable)()
], SquadService);
//# sourceMappingURL=squad.service.js.map