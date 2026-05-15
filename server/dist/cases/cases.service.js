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
exports.CasesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const case_schema_1 = require("./schemas/case.schema");
const enums_1 = require("../common/enums");
const employees_service_1 = require("../employees/employees.service");
let CasesService = class CasesService {
    caseModel;
    employeesService;
    constructor(caseModel, employeesService) {
        this.caseModel = caseModel;
        this.employeesService = employeesService;
    }
    async findAll(orgId, status) {
        const filter = {
            orgId: new mongoose_2.Types.ObjectId(orgId),
        };
        if (status)
            filter.status = status;
        return this.caseModel
            .find(filter)
            .populate('employeeId', 'name roleTitle dnaScore status')
            .sort({ flaggedAt: -1 })
            .lean()
            .exec();
    }
    async create(orgId, dto, flaggedBy) {
        const existing = await this.caseModel
            .findOne({
            employeeId: new mongoose_2.Types.ObjectId(dto.employeeId),
            orgId: new mongoose_2.Types.ObjectId(orgId),
            status: enums_1.CaseStatus.OPEN,
        })
            .lean()
            .exec();
        if (existing) {
            throw new common_1.ConflictException('An open case already exists for this employee.');
        }
        const [created] = await Promise.all([
            this.caseModel.create({
                employeeId: new mongoose_2.Types.ObjectId(dto.employeeId),
                orgId: new mongoose_2.Types.ObjectId(orgId),
                flaggedBy: new mongoose_2.Types.ObjectId(flaggedBy),
                notes: dto.notes ?? null,
            }),
            this.employeesService.updateStatus(dto.employeeId, orgId, enums_1.EmployeeStatus.FLAGGED),
        ]);
        return created;
    }
    async resolve(caseId, orgId, resolvedBy) {
        const existing = await this.caseModel.findOne({
            _id: new mongoose_2.Types.ObjectId(caseId),
            orgId: new mongoose_2.Types.ObjectId(orgId),
        });
        if (!existing)
            throw new common_1.NotFoundException('Case not found.');
        existing.status = enums_1.CaseStatus.RESOLVED;
        existing.resolvedAt = new Date();
        existing.resolvedBy = new mongoose_2.Types.ObjectId(resolvedBy);
        return existing.save();
    }
    async getLeaderboard(orgId, cycle) {
        const employees = await this.employeesService.findAll(orgId);
        const cases = await this.caseModel
            .find({ orgId: new mongoose_2.Types.ObjectId(orgId), status: enums_1.CaseStatus.OPEN })
            .lean()
            .exec();
        const caseMap = new Set(cases.map((c) => c.employeeId.toString()));
        return employees.data
            .map((e) => ({
            _id: e._id,
            name: e.name,
            roleTitle: e.roleTitle,
            dnaScore: e.dnaScore,
            status: e.status,
            lastVerifiedAt: e.lastVerifiedAt,
            isFlagged: caseMap.has(String(e._id)),
            accountNumber: this.employeesService.maskAccountNumber(e.accountNumber),
            phone: this.employeesService.maskPhone(e.phone),
            cycle,
        }))
            .sort((a, b) => (a.dnaScore ?? 101) - (b.dnaScore ?? 101));
    }
};
exports.CasesService = CasesService;
exports.CasesService = CasesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(case_schema_1.Case.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        employees_service_1.EmployeesService])
], CasesService);
//# sourceMappingURL=cases.service.js.map