import { ConfigService } from '@nestjs/config';
export interface GeminiScoreInput {
    livenessPasssed: boolean;
    gpsCaptured: boolean;
    gpsLat?: number;
    gpsLng?: number;
    deviceFingerprint: string;
    recentSessionCount: number;
    sameDeviceCount: number;
    velocityFlagFromTransaction?: boolean;
    ruleBasedScore: number;
    challengeCode: string;
}
export interface GeminiAnalysis {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    riskReason: string;
    adjustedScore: number;
    anomalyFlags: string[];
}
export declare class GeminiService {
    private configService;
    private readonly logger;
    private readonly genAI;
    private readonly modelName;
    constructor(configService: ConfigService);
    analyzeVerification(input: GeminiScoreInput): Promise<GeminiAnalysis | null>;
    blendScores(ruleBasedScore: number, geminiAnalysis: GeminiAnalysis | null): number;
    private validateRiskLevel;
}
