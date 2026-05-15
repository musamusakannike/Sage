import { VerificationService } from './verification.service';
import { SubmitChallengeDto } from './dto/submit-challenge.dto';
export declare class VerificationController {
    private readonly verificationService;
    constructor(verificationService: VerificationService);
    getChallenge(token: string): Promise<{
        challenge: string;
    }>;
    submitChallenge(token: string, dto: SubmitChallengeDto): Promise<{
        message: string;
        dnaScore: number;
        riskLevel: string | null;
        aiEnabled: boolean;
    }>;
}
