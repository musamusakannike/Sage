import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Case, CaseDocument } from './schemas/case.schema';
import { CreateCaseDto } from './dto/create-case.dto';
import { CaseStatus, EmployeeStatus } from '../common/enums';
import { EmployeesService } from '../employees/employees.service';

@Injectable()
export class CasesService {
  constructor(
    @InjectModel(Case.name) private caseModel: Model<CaseDocument>,
    private employeesService: EmployeesService,
  ) {}

  async findAll(
    orgId: string,
    status?: CaseStatus,
  ): Promise<CaseDocument[]> {
    const filter: Record<string, unknown> = {
      orgId: new Types.ObjectId(orgId),
    };
    if (status) filter.status = status;

    return this.caseModel
      .find(filter)
      .populate('employeeId', 'name roleTitle dnaScore status')
      .sort({ flaggedAt: -1 })
      .lean()
      .exec() as Promise<CaseDocument[]>;
  }

  async create(
    orgId: string,
    dto: CreateCaseDto,
    flaggedBy: string,
  ): Promise<CaseDocument> {
    const existing = await this.caseModel
      .findOne({
        employeeId: new Types.ObjectId(dto.employeeId),
        orgId: new Types.ObjectId(orgId),
        status: CaseStatus.OPEN,
      })
      .lean()
      .exec();

    if (existing) {
      throw new ConflictException('An open case already exists for this employee.');
    }

    const [created] = await Promise.all([
      this.caseModel.create({
        employeeId: new Types.ObjectId(dto.employeeId),
        orgId: new Types.ObjectId(orgId),
        flaggedBy: new Types.ObjectId(flaggedBy),
        notes: dto.notes ?? null,
      }),
      this.employeesService.updateStatus(
        dto.employeeId,
        orgId,
        EmployeeStatus.FLAGGED,
      ),
    ]);

    return created;
  }

  async resolve(
    caseId: string,
    orgId: string,
    resolvedBy: string,
  ): Promise<CaseDocument> {
    const existing = await this.caseModel.findOne({
      _id: new Types.ObjectId(caseId),
      orgId: new Types.ObjectId(orgId),
    });
    if (!existing) throw new NotFoundException('Case not found.');

    existing.status = CaseStatus.RESOLVED;
    existing.resolvedAt = new Date();
    existing.resolvedBy = new Types.ObjectId(resolvedBy);
    return existing.save();
  }

  async getLeaderboard(
    orgId: string,
    cycle?: string,
  ): Promise<unknown[]> {
    const employees = await this.employeesService.findAll(orgId, undefined, undefined, 1, 500, true);
    const cases = await this.caseModel
      .find({ orgId: new Types.ObjectId(orgId), status: CaseStatus.OPEN })
      .lean()
      .exec();
    const caseMap = new Set(
      cases.map((c) => c.employeeId.toString()),
    );

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
}
