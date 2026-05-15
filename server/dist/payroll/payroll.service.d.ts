import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { PayrollScheduleDocument } from './schemas/payroll-schedule.schema';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
export declare class PayrollService {
    private scheduleModel;
    private configService;
    private readonly encryptionKey;
    constructor(scheduleModel: Model<PayrollScheduleDocument>, configService: ConfigService);
    getOrCreate(orgId: string): Promise<PayrollScheduleDocument>;
    update(orgId: string, dto: UpdateScheduleDto): Promise<PayrollScheduleDocument>;
    getDecryptedSquadKey(orgId: string): Promise<string | null>;
    getNextDisbursementDate(disbursementDay: number): Date;
    private encrypt;
    private decrypt;
}
