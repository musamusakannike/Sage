import { PayrollService } from './payroll.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { NotificationsService } from '../notifications/notifications.service';
import { EmployeesService } from '../employees/employees.service';
import { VerificationService } from '../verification/verification.service';
export declare class PayrollController {
    private readonly payrollService;
    private readonly notificationsService;
    private readonly employeesService;
    private readonly verificationService;
    constructor(payrollService: PayrollService, notificationsService: NotificationsService, employeesService: EmployeesService, verificationService: VerificationService);
    getSchedule(user: JwtPayload): Promise<import("mongoose").Document<unknown, {}, import("./schemas/payroll-schedule.schema").PayrollSchedule, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payroll-schedule.schema").PayrollSchedule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    updateSchedule(user: JwtPayload, dto: UpdateScheduleDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/payroll-schedule.schema").PayrollSchedule, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payroll-schedule.schema").PayrollSchedule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    sendInvites(user: JwtPayload): Promise<{
        message: string;
    }>;
}
