import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { VerificationSessionDocument } from './schemas/verification-session.schema';
import { SubmitChallengeDto } from './dto/submit-challenge.dto';
import { ScoringService } from '../scoring/scoring.service';
import { GeminiService } from '../gemini/gemini.service';
import { EmployeesService } from '../employees/employees.service';
export declare class VerificationService {
    private sessionModel;
    private scoringService;
    private geminiService;
    private employeesService;
    private configService;
    constructor(sessionModel: Model<VerificationSessionDocument>, scoringService: ScoringService, geminiService: GeminiService, employeesService: EmployeesService, configService: ConfigService);
    createSession(employeeId: string, orgId: string, cycleId: string, expiresAt: Date): Promise<string>;
    getChallenge(token: string): Promise<{
        challenge: string;
    }>;
    submitChallenge(token: string, dto: SubmitChallengeDto): Promise<{
        message: string;
        dnaScore: number;
        riskLevel: string | null;
        aiEnabled: boolean;
    }>;
    private findValidSession;
    findByEmployee(employeeId: string): Promise<VerificationSessionDocument[]>;
}
