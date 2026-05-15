import { Model } from 'mongoose';
import { CaseDocument } from './schemas/case.schema';
import { CreateCaseDto } from './dto/create-case.dto';
import { CaseStatus } from '../common/enums';
import { EmployeesService } from '../employees/employees.service';
export declare class CasesService {
    private caseModel;
    private employeesService;
    constructor(caseModel: Model<CaseDocument>, employeesService: EmployeesService);
    findAll(orgId: string, status?: CaseStatus): Promise<CaseDocument[]>;
    create(orgId: string, dto: CreateCaseDto, flaggedBy: string): Promise<CaseDocument>;
    resolve(caseId: string, orgId: string, resolvedBy: string): Promise<CaseDocument>;
    getLeaderboard(orgId: string, cycle?: string): Promise<unknown[]>;
}
