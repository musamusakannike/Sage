import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { VerificationSessionDocument } from './schemas/verification-session.schema';
import { SubmitChallengeDto } from './dto/submit-challenge.dto';
import { ScoringService } from '../scoring/scoring.service';
import { EmployeesService } from '../employees/employees.service';
export declare class VerificationService {
    private sessionModel;
    private scoringService;
    private employeesService;
    private configService;
    private jwtService;
    constructor(sessionModel: Model<VerificationSessionDocument>, scoringService: ScoringService, employeesService: EmployeesService, configService: ConfigService, jwtService: JwtService);
    createSession(employeeId: string, orgId: string, cycleId: string, expiresAt: Date): Promise<string>;
    getChallenge(token: string): Promise<{
        challenge: string;
        orgName?: string;
    }>;
    submitChallenge(token: string, dto: SubmitChallengeDto): Promise<{
        message: string;
    }>;
    private findValidSession;
    findByEmployee(employeeId: string): Promise<VerificationSessionDocument[]>;
}
