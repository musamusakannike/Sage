import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type VerificationSessionDocument = HydratedDocument<VerificationSession>;

@Schema({ timestamps: true, collection: 'verification_sessions' })
export class VerificationSession {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Employee', index: true })
  employeeId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  orgId: Types.ObjectId;

  @Prop({ required: true, type: String, unique: true, index: true })
  token: string;

  @Prop({ required: true, type: Date })
  tokenExpiresAt: Date;

  @Prop({ type: Boolean, default: false })
  isConsumed: boolean;

  @Prop({ required: true, type: String })
  challengeCode: string;

  @Prop({ type: String, default: null })
  deviceFingerprint: string | null;

  @Prop({ type: Number, default: null })
  gpsLat: number | null;

  @Prop({ type: Number, default: null })
  gpsLng: number | null;

  @Prop({ type: Boolean, default: false })
  gpsCaptured: boolean;

  @Prop({ type: Boolean, default: null })
  livenessPasssed: boolean | null;

  // ── Rule-based score breakdown ─────────────────────────────────────────────

  @Prop({ type: Number, default: null })
  scoreLiveness: number | null;

  @Prop({ type: Number, default: null })
  scoreGeoCluster: number | null;

  @Prop({ type: Number, default: null })
  scoreDevice: number | null;

  @Prop({ type: Number, default: null })
  scoreTimeCluster: number | null;

  @Prop({ type: Number, default: null })
  scorePayVelocity: number | null;

  /** Raw deterministic score before Gemini blending */
  @Prop({ type: Number, default: null })
  ruleBasedDnaScore: number | null;

  // ── Gemini AI analysis ─────────────────────────────────────────────────────

  /** Gemini's risk classification: LOW | MEDIUM | HIGH */
  @Prop({ type: String, default: null })
  geminiRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | null;

  /** Human-readable explanation from Gemini for HR admins */
  @Prop({ type: String, default: null })
  geminiReason: string | null;

  /** Gemini's suggested 0–100 score based on pattern analysis */
  @Prop({ type: Number, default: null })
  geminiAdjustedScore: number | null;

  /** Specific anomaly flags raised by Gemini */
  @Prop({ type: [String], default: null })
  geminiAnomalyFlags: string[] | null;

  // ── Final blended score ────────────────────────────────────────────────────

  /** Final DNA score: 65% rule-based + 35% Gemini (falls back to rule-based if Gemini unavailable) */
  @Prop({ type: Number, default: null })
  totalDnaScore: number | null;

  @Prop({ type: Date, default: null })
  verifiedAt: Date | null;

  @Prop({ type: String, default: null })
  cycleId: string | null;

  @Prop({ type: Number, default: 0 })
  attemptCount: number;
}

export const VerificationSessionSchema =
  SchemaFactory.createForClass(VerificationSession);

VerificationSessionSchema.index({ token: 1 });
VerificationSessionSchema.index({ employeeId: 1, cycleId: 1 });
