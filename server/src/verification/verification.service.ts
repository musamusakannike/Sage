import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {
  VerificationSession,
  VerificationSessionDocument,
} from './schemas/verification-session.schema';
import { SubmitChallengeDto } from './dto/submit-challenge.dto';
import { ScoringService } from '../scoring/scoring.service';
import { GeminiService } from '../gemini/gemini.service';
import { EmployeesService } from '../employees/employees.service';

const CHALLENGE_POOL = [
  'Blink twice, then tilt your head to the right.',
  'Smile, then look up at the ceiling.',
  'Turn your head left, then back to centre.',
  'Nod three times slowly.',
  'Open your mouth wide, then close it.',
  'Raise your eyebrows, then relax.',
  'Tilt your head left, then right.',
  'Look down, then look straight at the camera.',
];

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel(VerificationSession.name)
    private sessionModel: Model<VerificationSessionDocument>,
    private scoringService: ScoringService,
    private geminiService: GeminiService,
    private employeesService: EmployeesService,
    private configService: ConfigService,
  ) {}

  async createSession(
    employeeId: string,
    orgId: string,
    cycleId: string,
    expiresAt: Date,
  ): Promise<string> {
    const token = uuidv4();
    const challengeCode =
      CHALLENGE_POOL[Math.floor(Math.random() * CHALLENGE_POOL.length)];

    await this.sessionModel.create({
      employeeId: new Types.ObjectId(employeeId),
      orgId: new Types.ObjectId(orgId),
      token,
      tokenExpiresAt: expiresAt,
      challengeCode,
      cycleId,
    });

    const deepLinkBase = this.configService.get<string>('app.deepLinkBaseUrl');
    return `${deepLinkBase}/verify?token=${token}`;
  }

  async getChallenge(token: string): Promise<{ challenge: string }> {
    const session = await this.findValidSession(token);
    return { challenge: session.challengeCode };
  }

  async submitChallenge(
    token: string,
    dto: SubmitChallengeDto,
  ): Promise<{ message: string; dnaScore: number; riskLevel: string | null; aiEnabled: boolean }> {
    const session = await this.findValidSession(token);

    if (session.attemptCount >= 2) {
      throw new BadRequestException('Verification window closed. No more retries.');
    }

    // ── 1. Context queries ───────────────────────────────────────────────────

    const [recentSessions, sameDeviceSessions] = await Promise.all([
      this.sessionModel
        .find({
          orgId: session.orgId,
          cycleId: session.cycleId,
          verifiedAt: { $exists: true, $ne: null, $gte: new Date(Date.now() - 10 * 60 * 1000) },
        })
        .lean()
        .exec(),
      this.sessionModel
        .find({
          orgId: session.orgId,
          deviceFingerprint: dto.deviceFingerprint,
          _id: { $ne: session._id },
          cycleId: session.cycleId,
        })
        .lean()
        .exec(),
    ]);

    // ── 2. Rule-based scoring ────────────────────────────────────────────────

    const ruleScores = this.scoringService.compute({
      livenessPasssed: dto.livenessPasssed,
      gpsCaptured: dto.gpsCaptured,
      gpsLat: dto.gpsLat,
      gpsLng: dto.gpsLng,
      deviceFingerprint: dto.deviceFingerprint,
      recentSessionCount: recentSessions.length,
      sameDeviceCount: sameDeviceSessions.length,
    });

    // ── 3. Gemini AI analysis (runs concurrently; graceful fallback) ─────────

    const geminiAnalysis = await this.geminiService.analyzeVerification({
      livenessPasssed: dto.livenessPasssed,
      gpsCaptured: dto.gpsCaptured,
      gpsLat: dto.gpsLat,
      gpsLng: dto.gpsLng,
      deviceFingerprint: dto.deviceFingerprint,
      recentSessionCount: recentSessions.length,
      sameDeviceCount: sameDeviceSessions.length,
      ruleBasedScore: ruleScores.totalDnaScore,
      challengeCode: session.challengeCode,
    });

    // ── 4. Blend scores ──────────────────────────────────────────────────────

    const finalDnaScore = this.geminiService.blendScores(
      ruleScores.totalDnaScore,
      geminiAnalysis,
    );

    // ── 5. Persist session ───────────────────────────────────────────────────

    await this.sessionModel.findByIdAndUpdate(session._id, {
      deviceFingerprint: dto.deviceFingerprint,
      gpsLat: dto.gpsLat ?? null,
      gpsLng: dto.gpsLng ?? null,
      gpsCaptured: dto.gpsCaptured,
      livenessPasssed: dto.livenessPasssed,
      // rule-based breakdown
      scoreLiveness:    ruleScores.scoreLiveness,
      scoreGeoCluster:  ruleScores.scoreGeoCluster,
      scoreDevice:      ruleScores.scoreDevice,
      scoreTimeCluster: ruleScores.scoreTimeCluster,
      scorePayVelocity: ruleScores.scorePayVelocity,
      ruleBasedDnaScore: ruleScores.totalDnaScore,
      // Gemini analysis
      geminiRiskLevel:      geminiAnalysis?.riskLevel    ?? null,
      geminiReason:         geminiAnalysis?.riskReason   ?? null,
      geminiAdjustedScore:  geminiAnalysis?.adjustedScore ?? null,
      geminiAnomalyFlags:   geminiAnalysis?.anomalyFlags  ?? null,
      // final blended score
      totalDnaScore: finalDnaScore,
      isConsumed: true,
      verifiedAt: new Date(),
      $inc: { attemptCount: 1 },
    }).exec();

    // ── 6. Update employee's live DNA score ──────────────────────────────────

    await this.employeesService.updateDnaScore(
      session.employeeId.toString(),
      finalDnaScore,
    );

    return {
      message: 'Verification received.',
      dnaScore: finalDnaScore,
      riskLevel: geminiAnalysis?.riskLevel ?? null,
      aiEnabled: geminiAnalysis !== null,
    };
  }

  private async findValidSession(token: string): Promise<VerificationSessionDocument> {
    const session = await this.sessionModel.findOne({ token }).exec();
    if (!session) throw new NotFoundException('Verification link not found.');
    if (session.isConsumed) {
      throw new BadRequestException('This verification link has already been used.');
    }
    if (session.tokenExpiresAt < new Date()) {
      throw new BadRequestException(
        'This verification link has expired. Contact your HR department.',
      );
    }
    return session;
  }

  async findByEmployee(employeeId: string): Promise<VerificationSessionDocument[]> {
    return this.sessionModel
      .find({ employeeId: new Types.ObjectId(employeeId), isConsumed: true })
      .sort({ verifiedAt: -1 })
      .lean()
      .exec() as Promise<VerificationSessionDocument[]>;
  }
}
