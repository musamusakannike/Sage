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
var TransactionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transaction_schema_1 = require("./schemas/transaction.schema");
const VELOCITY_WINDOW_SECONDS = 90;
const CONVERGENCE_WINDOW_HOURS = 4;
let TransactionsService = TransactionsService_1 = class TransactionsService {
    transactionModel;
    logger = new common_1.Logger(TransactionsService_1.name);
    constructor(transactionModel) {
        this.transactionModel = transactionModel;
    }
    async processWebhook(payload, orgId, employeeId, cycleId) {
        const txTimestamp = new Date(payload.transaction_date);
        const salaryDisbursedAt = await this.getSalaryDisbursementTime(employeeId, cycleId);
        const velocityFlag = salaryDisbursedAt !== null &&
            txTimestamp.getTime() - salaryDisbursedAt.getTime() <
                VELOCITY_WINDOW_SECONDS * 1000;
        await this.transactionModel.create({
            txId: payload.transaction_reference,
            employeeId: new mongoose_2.Types.ObjectId(employeeId),
            orgId: new mongoose_2.Types.ObjectId(orgId),
            amount: payload.amount,
            destination: payload.destination_account,
            txTimestamp,
            txType: payload.transaction_type ?? 'transfer',
            velocityFlag,
            isSuspicious: velocityFlag,
            cycleId: cycleId ?? null,
        });
        this.logger.log(`Transaction recorded: ${payload.transaction_reference}, velocity=${velocityFlag}`);
    }
    async findByEmployee(employeeId) {
        return this.transactionModel
            .find({ employeeId: new mongoose_2.Types.ObjectId(employeeId) })
            .sort({ txTimestamp: -1 })
            .lean()
            .exec();
    }
    async detectConvergingDestinations(orgId, cycleId) {
        const windowStart = new Date(Date.now() - CONVERGENCE_WINDOW_HOURS * 60 * 60 * 1000);
        const pipeline = [
            {
                $match: {
                    orgId: new mongoose_2.Types.ObjectId(orgId),
                    txTimestamp: { $gte: windowStart },
                    ...(cycleId ? { cycleId } : {}),
                },
            },
            {
                $group: {
                    _id: '$destination',
                    employeeIds: { $addToSet: '$employeeId' },
                    count: { $sum: 1 },
                },
            },
            { $match: { count: { $gte: 2 } } },
            { $sort: { count: -1 } },
        ];
        const results = await this.transactionModel.aggregate(pipeline).exec();
        return results.map((r) => ({
            destination: r._id,
            employeeIds: r.employeeIds.map((id) => id.toString()),
            count: r.count,
        }));
    }
    async getSalaryDisbursementTime(_employeeId, _cycleId) {
        return null;
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = TransactionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map