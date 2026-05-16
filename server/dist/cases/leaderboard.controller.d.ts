import { CasesService } from './cases.service';
import { EmployeesService } from '../employees/employees.service';
import { VerificationService } from '../verification/verification.service';
import { TransactionsService } from '../transactions/transactions.service';
import { NotificationsService } from '../notifications/notifications.service';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { EmployeeStatus } from '../common/enums';
export declare class LeaderboardController {
    private readonly casesService;
    private readonly employeesService;
    private readonly verificationService;
    private readonly transactionsService;
    private readonly notificationsService;
    constructor(casesService: CasesService, employeesService: EmployeesService, verificationService: VerificationService, transactionsService: TransactionsService, notificationsService: NotificationsService);
    getLeaderboard(user: JwtPayload, cycle?: string): Promise<unknown[]>;
    getCaseProfile(employeeId: string, user: JwtPayload): Promise<{
        employee: {
            accountNumber: string;
            phone: string;
            _id: import("mongoose").Types.ObjectId;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            isNew: boolean;
            schema: import("mongoose").Schema;
            orgId: import("mongoose").Types.ObjectId;
            name: string;
            roleTitle: string;
            email: string | null;
            dnaScore: number | null;
            status: EmployeeStatus;
            lastVerifiedAt: Date | null;
            pushToken: string | null;
            deletedAt: boolean;
            __v: number;
            id: string;
        };
        sessions: (import("mongoose").Document<unknown, {}, import("../verification/schemas/verification-session.schema").VerificationSession, {}, import("mongoose").DefaultSchemaOptions> & import("../verification/schemas/verification-session.schema").VerificationSession & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
        transactions: (import("mongoose").Document<unknown, {}, import("../transactions/schemas/transaction.schema").Transaction, {}, import("mongoose").DefaultSchemaOptions> & import("../transactions/schemas/transaction.schema").Transaction & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    freezeEmployee(employeeId: string, user: JwtPayload): Promise<import("mongoose").Document<unknown, {}, import("../employees/schemas/employee.schema").Employee, {}, import("mongoose").DefaultSchemaOptions> & import("../employees/schemas/employee.schema").Employee & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
}
