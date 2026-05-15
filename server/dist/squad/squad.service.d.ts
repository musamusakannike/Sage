export declare class SquadService {
    private readonly logger;
    private readonly baseUrl;
    private getClient;
    disburse(apiKey: string, employeeName: string, accountNumber: string, amount: number, reference: string): Promise<{
        success: boolean;
        reference: string;
    }>;
    blockDisbursement(apiKey: string, reference: string): Promise<{
        success: boolean;
    }>;
}
