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
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const mongoose_2 = require("mongoose");
const crypto = __importStar(require("crypto"));
const payroll_schedule_schema_1 = require("./schemas/payroll-schedule.schema");
const ALGORITHM = 'aes-256-cbc';
let PayrollService = class PayrollService {
    scheduleModel;
    configService;
    encryptionKey;
    constructor(scheduleModel, configService) {
        this.scheduleModel = scheduleModel;
        this.configService = configService;
        const key = this.configService.get('app.encryptionKey');
        this.encryptionKey = Buffer.from(key.padEnd(32).slice(0, 32));
    }
    async getOrCreate(orgId) {
        if (!orgId || !mongoose_2.Types.ObjectId.isValid(orgId)) {
            throw new common_1.NotFoundException('Organisation not found.');
        }
        let schedule = await this.scheduleModel
            .findOne({ orgId: new mongoose_2.Types.ObjectId(orgId) })
            .lean()
            .exec();
        if (!schedule) {
            const created = await this.scheduleModel.create({
                orgId: new mongoose_2.Types.ObjectId(orgId),
                disbursementDay: 25,
                smsHoursBefore: 24,
            });
            return created;
        }
        return schedule;
    }
    async update(orgId, dto) {
        const updateData = {};
        if (dto.disbursementDay !== undefined)
            updateData.disbursementDay = dto.disbursementDay;
        if (dto.smsHoursBefore !== undefined)
            updateData.smsHoursBefore = dto.smsHoursBefore;
        if (dto.salaryAmounts !== undefined) {
            updateData.salaryAmounts = dto.salaryAmounts.map((s) => ({
                employeeId: new mongoose_2.Types.ObjectId(s.employeeId),
                amount: s.amount,
            }));
        }
        if (dto.squadApiKey) {
            updateData.encryptedSquadApiKey = this.encrypt(dto.squadApiKey);
        }
        const updated = await this.scheduleModel
            .findOneAndUpdate({ orgId: new mongoose_2.Types.ObjectId(orgId) }, { $set: updateData }, { new: true, upsert: true })
            .lean()
            .exec();
        if (!updated)
            throw new common_1.NotFoundException('Schedule not found.');
        return updated;
    }
    async getDecryptedSquadKey(orgId) {
        const schedule = await this.scheduleModel
            .findOne({ orgId: new mongoose_2.Types.ObjectId(orgId) })
            .lean()
            .exec();
        if (!schedule?.encryptedSquadApiKey)
            return null;
        return this.decrypt(schedule.encryptedSquadApiKey);
    }
    getNextDisbursementDate(disbursementDay) {
        const now = new Date();
        const next = new Date(now.getFullYear(), now.getMonth(), disbursementDay);
        if (next <= now) {
            next.setMonth(next.getMonth() + 1);
        }
        return next;
    }
    encrypt(text) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, this.encryptionKey, iv);
        const encrypted = Buffer.concat([
            cipher.update(text, 'utf8'),
            cipher.final(),
        ]);
        return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    }
    decrypt(encryptedText) {
        const [ivHex, dataHex] = encryptedText.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, this.encryptionKey, iv);
        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(dataHex, 'hex')),
            decipher.final(),
        ]);
        return decrypted.toString('utf8');
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payroll_schedule_schema_1.PayrollSchedule.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map