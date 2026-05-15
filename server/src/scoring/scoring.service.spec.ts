import { ScoringService, ScoreInput } from './scoring.service';

const baseInput: ScoreInput = {
  livenessPasssed: true,
  gpsCaptured: true,
  deviceFingerprint: 'device-abc',
  recentSessionCount: 0,
  sameDeviceCount: 0,
};

describe('ScoringService', () => {
  let service: ScoringService;

  beforeEach(() => { service = new ScoringService(); });

  describe('compute — perfect signals → max score', () => {
    it('returns 100 when all signals are ideal', () => {
      const result = service.compute({ ...baseInput, velocityFlagFromTransaction: false });
      expect(result.totalDnaScore).toBe(100);
      expect(result.scoreLiveness).toBe(30);
      expect(result.scoreGeoCluster).toBe(20);
      expect(result.scoreDevice).toBe(20);
      expect(result.scoreTimeCluster).toBe(15);
      expect(result.scorePayVelocity).toBe(15);
    });
  });

  describe('liveness signal (weight 30)', () => {
    it('awards 30 when liveness passed', () => {
      expect(service.compute({ ...baseInput, livenessPasssed: true }).scoreLiveness).toBe(30);
    });

    it('awards 0 when liveness failed', () => {
      expect(service.compute({ ...baseInput, livenessPasssed: false }).scoreLiveness).toBe(0);
    });
  });

  describe('geolocation signal (weight 20)', () => {
    it('awards 20 when GPS captured', () => {
      expect(service.compute({ ...baseInput, gpsCaptured: true }).scoreGeoCluster).toBe(20);
    });

    it('awards 10 when GPS not captured (partial credit)', () => {
      expect(service.compute({ ...baseInput, gpsCaptured: false }).scoreGeoCluster).toBe(10);
    });
  });

  describe('device fingerprint signal (weight 20)', () => {
    it('awards 20 when no shared device (unique)', () => {
      expect(service.compute({ ...baseInput, sameDeviceCount: 0 }).scoreDevice).toBe(20);
    });

    it('awards 10 when device shared with one other employee', () => {
      expect(service.compute({ ...baseInput, sameDeviceCount: 1 }).scoreDevice).toBe(10);
    });

    it('awards 0 when device shared with two or more employees (ring signal)', () => {
      expect(service.compute({ ...baseInput, sameDeviceCount: 2 }).scoreDevice).toBe(0);
      expect(service.compute({ ...baseInput, sameDeviceCount: 10 }).scoreDevice).toBe(0);
    });
  });

  describe('time clustering signal (weight 15)', () => {
    it('awards 15 when no other recent verifications', () => {
      expect(service.compute({ ...baseInput, recentSessionCount: 0 }).scoreTimeCluster).toBe(15);
    });

    it('awards 8 when 1–2 other recent verifications', () => {
      expect(service.compute({ ...baseInput, recentSessionCount: 1 }).scoreTimeCluster).toBe(8);
      expect(service.compute({ ...baseInput, recentSessionCount: 2 }).scoreTimeCluster).toBe(8);
    });

    it('awards 0 when 3+ verifications in 10-minute window (coordinated ring)', () => {
      expect(service.compute({ ...baseInput, recentSessionCount: 3 }).scoreTimeCluster).toBe(0);
    });
  });

  describe('pay velocity signal (weight 15)', () => {
    it('awards 15 when no velocity flag', () => {
      expect(service.compute({ ...baseInput, velocityFlagFromTransaction: false }).scorePayVelocity).toBe(15);
    });

    it('awards 15 when no transaction data yet (undefined)', () => {
      expect(service.compute({ ...baseInput, velocityFlagFromTransaction: undefined }).scorePayVelocity).toBe(15);
    });

    it('awards 0 when velocity flag raised (rapid cash-out detected)', () => {
      expect(service.compute({ ...baseInput, velocityFlagFromTransaction: true }).scorePayVelocity).toBe(0);
    });
  });

  describe('score thresholds', () => {
    it('a ghost worker with all bad signals scores below freeze threshold (40)', () => {
      const result = service.compute({
        livenessPasssed: false,
        gpsCaptured: false,
        deviceFingerprint: 'shared-device',
        recentSessionCount: 5,
        sameDeviceCount: 3,
        velocityFlagFromTransaction: true,
      });
      expect(result.totalDnaScore).toBeLessThan(40);
    });

    it('total score is capped at 100', () => {
      const result = service.compute({ ...baseInput });
      expect(result.totalDnaScore).toBeLessThanOrEqual(100);
    });

    it('total score is never negative', () => {
      const result = service.compute({
        livenessPasssed: false,
        gpsCaptured: false,
        deviceFingerprint: 'x',
        recentSessionCount: 10,
        sameDeviceCount: 10,
        velocityFlagFromTransaction: true,
      });
      expect(result.totalDnaScore).toBeGreaterThanOrEqual(0);
    });
  });
});
