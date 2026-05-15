"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GeminiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const generative_ai_1 = require("@google/generative-ai");
const SYSTEM_CONTEXT = `You are the Behavioral DNA Scoring Engine for Sage AI, a payroll fraud
detection platform that protects government ministries from ghost workers — fictitious employees
added to payroll by corrupt officials.

Each time an employee is asked to complete a liveness verification challenge before their salary
is disbursed, a set of behavioral signals is captured. Your job is to analyze these signals and
determine whether this verification attempt is consistent with a real, unique individual completing
their own verification, or whether it shows signs of fraud (ghost worker, coordinated ring, device
sharing, GPS spoofing, etc.).

Respond ONLY with a valid JSON object. No markdown, no explanation outside the JSON.`;
const buildPrompt = (input) => `
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
let GeminiService = GeminiService_1 = class GeminiService {
    configService;
    logger = new common_1.Logger(GeminiService_1.name);
    genAI;
    modelName;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('gemini.apiKey');
        this.modelName = this.configService.get('gemini.model') ?? 'gemini-2.0-flash';
        if (apiKey) {
            this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        }
        else {
            this.genAI = null;
            this.logger.warn('GEMINI_API_KEY not set — AI scoring will be skipped.');
        }
    }
    async analyzeVerification(input) {
        if (!this.genAI)
            return null;
        try {
            const model = this.genAI.getGenerativeModel({
                model: this.modelName,
                systemInstruction: SYSTEM_CONTEXT,
                generationConfig: {
                    responseMimeType: 'application/json',
                    temperature: 0.2,
                    maxOutputTokens: 512,
                },
            });
            const result = await model.generateContent(buildPrompt(input));
            const text = result.response.text().trim();
            const parsed = JSON.parse(text);
            const riskLevel = this.validateRiskLevel(parsed.riskLevel);
            const adjustedScore = Math.max(0, Math.min(100, Math.round(parsed.adjustedScore)));
            return {
                riskLevel,
                riskReason: String(parsed.riskReason ?? '').slice(0, 500),
                adjustedScore,
                anomalyFlags: Array.isArray(parsed.anomalyFlags) ? parsed.anomalyFlags.map(String) : [],
            };
        }
        catch (err) {
            this.logger.error('Gemini analysis failed, using rule-based score only', err);
            return null;
        }
    }
    blendScores(ruleBasedScore, geminiAnalysis) {
        if (!geminiAnalysis)
            return ruleBasedScore;
        const blended = 0.65 * ruleBasedScore + 0.35 * geminiAnalysis.adjustedScore;
        return Math.max(0, Math.min(100, Math.round(blended)));
    }
    validateRiskLevel(value) {
        if (value === 'LOW' || value === 'MEDIUM' || value === 'HIGH')
            return value;
        return 'HIGH';
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = GeminiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeminiService);
//# sourceMappingURL=gemini.service.js.map