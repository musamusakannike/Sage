import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiScoreInput {
  livenessPasssed: boolean;
  gpsCaptured: boolean;
  gpsLat?: number;
  gpsLng?: number;
  deviceFingerprint: string;
  recentSessionCount: number;   // verified sessions in last 10 min (same org/cycle)
  sameDeviceCount: number;       // other employees who used the same device this cycle
  velocityFlagFromTransaction?: boolean;
  ruleBasedScore: number;        // deterministic score from ScoringService
  challengeCode: string;         // the liveness challenge presented
}

export interface GeminiAnalysis {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskReason: string;
  adjustedScore: number;         // Gemini's suggested score 0–100
  anomalyFlags: string[];        // e.g. ['shared_device', 'gps_missing', 'time_cluster']
}

const SYSTEM_CONTEXT = `You are the Behavioral DNA Scoring Engine for Sage AI, a payroll fraud
detection platform that protects government ministries from ghost workers — fictitious employees
added to payroll by corrupt officials.

Each time an employee is asked to complete a liveness verification challenge before their salary
is disbursed, a set of behavioral signals is captured. Your job is to analyze these signals and
determine whether this verification attempt is consistent with a real, unique individual completing
their own verification, or whether it shows signs of fraud (ghost worker, coordinated ring, device
sharing, GPS spoofing, etc.).

Respond ONLY with a valid JSON object. No markdown, no explanation outside the JSON.`;

const buildPrompt = (input: GeminiScoreInput): string => `
Analyze the following behavioral signals from a payroll verification attempt and assess the fraud risk.

VERIFICATION SIGNALS:
- Liveness challenge presented: "${input.challengeCode}"
- Liveness check passed: ${input.livenessPasssed}
- GPS location captured: ${input.gpsCaptured}
- GPS coordinates: ${input.gpsCaptured && input.gpsLat != null ? `${input.gpsLat}, ${input.gpsLng}` : 'Not available'}
- Device fingerprint: ${input.deviceFingerprint.slice(0, 16)}... (truncated for privacy)
- Other employees who used the SAME device this cycle: ${input.sameDeviceCount}
- Other verified sessions in the past 10 minutes (same organisation): ${input.recentSessionCount}
- Post-disbursement velocity flag raised: ${input.velocityFlagFromTransaction ?? 'No transaction data yet'}
- Rule-based DNA score (deterministic, 0-100): ${input.ruleBasedScore}

FRAUD SIGNAL INTERPRETATION GUIDE:
- sameDeviceCount > 0: Multiple employees sharing one device — strong ghost-worker indicator
- recentSessionCount > 3: Mass verification in a short window — coordinated ring indicator
- gpsCaptured = false: GPS refused — may indicate location spoofing awareness
- livenessPassed = false: Face match failed — could be a photo or different person
- velocityFlag = true: Account emptied rapidly after credit — ghost worker pattern
- Rule-based score < 40: High risk by deterministic model
- Rule-based score 40–69: Review threshold
- Rule-based score ≥ 70: Clear by deterministic model

TASK:
Return a JSON object with this exact shape:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "riskReason": "<1-2 sentence human-readable explanation for the HR admin>",
  "adjustedScore": <integer 0-100, your AI-adjusted behavioral DNA score>,
  "anomalyFlags": ["<flag1>", "<flag2>", ...]
}

Available anomaly flag values (use only what applies, can be empty array):
"liveness_failed", "gps_missing", "gps_suspicious", "shared_device", "time_cluster",
"velocity_flag", "coordinated_ring", "rapid_verification_pattern", "low_rule_score"

Be conservative — if signals are ambiguous, lean toward flagging. A false positive is better
than paying a ghost worker.
`;

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly genAI: GoogleGenerativeAI | null;
  private readonly modelName: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('gemini.apiKey');
    this.modelName = this.configService.get<string>('gemini.model') ?? 'gemini-2.0-flash';

    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      this.genAI = null;
      this.logger.warn('GEMINI_API_KEY not set — AI scoring will be skipped.');
    }
  }

  async analyzeVerification(input: GeminiScoreInput): Promise<GeminiAnalysis | null> {
    if (!this.genAI) return null;

    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: SYSTEM_CONTEXT,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,      // low temperature = more deterministic, less hallucination
          maxOutputTokens: 512,
        },
      });

      const result = await model.generateContent(buildPrompt(input));
      const text = result.response.text().trim();

      const parsed = JSON.parse(text) as {
        riskLevel: string;
        riskReason: string;
        adjustedScore: number;
        anomalyFlags: string[];
      };

      const riskLevel = this.validateRiskLevel(parsed.riskLevel);
      const adjustedScore = Math.max(0, Math.min(100, Math.round(parsed.adjustedScore)));

      return {
        riskLevel,
        riskReason: String(parsed.riskReason ?? '').slice(0, 500),
        adjustedScore,
        anomalyFlags: Array.isArray(parsed.anomalyFlags) ? parsed.anomalyFlags.map(String) : [],
      };
    } catch (err) {
      this.logger.error('Gemini analysis failed, using rule-based score only', err);
      return null;
    }
  }

  /**
   * Blends the deterministic rule-based score with Gemini's AI-adjusted score.
   * Falls back to the rule-based score if Gemini analysis is unavailable.
   *
   * Weight: 65% rule-based (auditable) + 35% AI-adjusted (pattern detection).
   */
  blendScores(ruleBasedScore: number, geminiAnalysis: GeminiAnalysis | null): number {
    if (!geminiAnalysis) return ruleBasedScore;
    const blended = 0.65 * ruleBasedScore + 0.35 * geminiAnalysis.adjustedScore;
    return Math.max(0, Math.min(100, Math.round(blended)));
  }

  private validateRiskLevel(value: string): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (value === 'LOW' || value === 'MEDIUM' || value === 'HIGH') return value;
    return 'HIGH'; // default to high-risk if malformed
  }
}
