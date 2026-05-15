import { EmployeesService } from '../employees/employees.service';
import { VerificationService } from '../verification/verification.service';
import { TransactionsService } from '../transactions/transactions.service';
export declare class ExportService {
    private employeesService;
    private verificationService;
    private transactionsService;
    constructor(employeesService: EmployeesService, verificationService: VerificationService, transactionsService: TransactionsService);
    generateCaseFilePdf(employeeId: string, orgId: string): Promise<Buffer>;
}
