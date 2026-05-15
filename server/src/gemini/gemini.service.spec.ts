import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GeminiService, GeminiScoreInput } from './gemini.service';

const baseInput: GeminiScoreInput = {
  livenessPasssed: true,
  gpsCaptured: true,
  gpsLat: 6.5244,
  gpsLng: 3.3792,
  deviceFingerprint: 'abc123xyz',
  recentSessionCount: 0,
  sameDeviceCount: 0,
  ruleBasedScore: 85,
  challengeCode: 'Blink twice, then tilt your head to the right.',
};

function makeService(apiKey: string): GeminiService {
  const configService = { get: (key: string) => {
    if (key === 'gemini.apiKey') return apiKey;
    if (key === 'gemini.model') return 'gemini-2.0-flash';
    return undefined;
  }} as unknown as ConfigService;
  return new GeminiService(configService);
}

describe('GeminiService', () => {
  describe('constructor', () => {
    it('initialises without error when no API key is set', () => {
      expect(() => makeService('')).not.toThrow();
    });

    it('initialises without error when an API key is set', () => {
      expect(() => makeService('fake-key-for-test')).not.toThrow();
    });
  });

  describe('analyzeVerification', () => {
    it('returns null immediately when no API key is configured', async () => {
      const service = makeService('');
      const result = await service.analyzeVerification(baseInput);
      expect(result).toBeNull();
    });
  });

  describe('blendScores', () => {
    let service: GeminiService;
    beforeEach(() => { service = makeService(''); });

    it('returns the rule-based score unchanged when geminiAnalysis is null', () => {
      expect(service.blendScores(72, null)).toBe(72);
      expect(service.blendScores(35, null)).toBe(35);
      expect(service.blendScores(0, null)).toBe(0);
    });

    it('blends 65% rule-based + 35% Gemini and rounds to integer', () => {
      const analysis = { riskLevel: 'LOW' as const, riskReason: '', adjustedScore: 90, anomalyFlags: [] };
      // 0.65 * 60 + 0.35 * 90 = 39 + 31.5 = 70.5 → 71
      expect(service.blendScores(60, analysis)).toBe(71);
    });

    it('clamps blended score to 0 when both scores are 0', () => {
      const analysis = { riskLevel: 'HIGH' as const, riskReason: '', adjustedScore: 0, anomalyFlags: [] };
      expect(service.blendScores(0, analysis)).toBe(0);
    });

    it('clamps blended score to 100 when both scores are 100', () => {
      const analysis = { riskLevel: 'LOW' as const, riskReason: '', adjustedScore: 100, anomalyFlags: [] };
      expect(service.blendScores(100, analysis)).toBe(100);
    });

    it('Gemini HIGH RISK pulls a borderline-clear score into REVIEW territory', () => {
      // rule-based: 72 (just above REVIEW threshold of 70)
      // Gemini: 30 (high risk)
      // blend: 0.65 * 72 + 0.35 * 30 = 46.8 + 10.5 = 57.3 → 57 (REVIEW range)
      const analysis = { riskLevel: 'HIGH' as const, riskReason: 'Shared device', adjustedScore: 30, anomalyFlags: ['shared_device'] };
      expect(service.blendScores(72, analysis)).toBe(57);
    });

    it('Gemini LOW RISK lifts a borderline-review score toward CLEAR', () => {
      // rule-based: 65 (in REVIEW)
      // Gemini: 88 (low risk)
      // blend: 0.65 * 65 + 0.35 * 88 = 42.25 + 30.8 = 73.05 → 73 (CLEAR)
      const analysis = { riskLevel: 'LOW' as const, riskReason: 'Consistent signals', adjustedScore: 88, anomalyFlags: [] };
      expect(service.blendScores(65, analysis)).toBe(73);
    });
  });
});
