import { Model } from 'mongoose';
import { TransactionDocument } from './schemas/transaction.schema';
interface SquadWebhookPayload {
    transaction_reference: string;
    amount: number;
    destination_account: string;
    account_number: string;
    transaction_date: string;
    transaction_type?: string;
}
export declare class TransactionsService {
    private transactionModel;
    private readonly logger;
    constructor(transactionModel: Model<TransactionDocument>);
    processWebhook(payload: SquadWebhookPayload, orgId: string, employeeId: string, cycleId?: string): Promise<void>;
    findByEmployee(employeeId: string): Promise<TransactionDocument[]>;
    detectConvergingDestinations(orgId: string, cycleId?: string): Promise<Array<{
        destination: string;
        employeeIds: string[];
        count: number;
    }>>;
    private getSalaryDisbursementTime;
}
export {};
