import { ConfigService } from '@nestjs/config';
import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private readonly transactionsService;
    private readonly configService;
    constructor(transactionsService: TransactionsService, configService: ConfigService);
    handleSquadWebhook(payload: Record<string, unknown>, signature: string): Promise<{
        received: boolean;
    }>;
    private verifyHmac;
}
