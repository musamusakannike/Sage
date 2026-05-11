import { Injectable } from '@nestjs/common';

interface ScoreInput {
  livenessPasssed: boolean;
  gpsCaptured: boolean;
  gpsLat?: number;
  gpsLng?: number;
  deviceFingerprint: string;
  recentSessionCount: number;
  sameDeviceCount: number;
  velocityFlagFromTransaction?: boolean;
}

interface ScoreOutput {
  scoreLiveness: number;
  scoreGeoCluster: number;
  scoreDevice: number;
  scoreTimeCluster: number;
  scorePayVelocity: number;
  totalDnaScore: number;
}

@Injectable()
export class ScoringService {
  compute(input: ScoreInput): ScoreOutput {
    const scoreLiveness = this.computeLiveness(input.livenessPasssed);
    const scoreGeoCluster = this.computeGeoCluster(input.gpsCaptured);
    const scoreDevice = this.computeDevice(input.sameDeviceCount);
    const scoreTimeCluster = this.computeTimeCluster(input.recentSessionCount);
    const scorePayVelocity = this.computePayVelocity(
      input.velocityFlagFromTransaction,
    );

    const totalDnaScore = Math.min(
      100,
      scoreLiveness +
        scoreGeoCluster +
        scoreDevice +
        scoreTimeCluster +
        scorePayVelocity,
    );

    return {
      scoreLiveness,
      scoreGeoCluster,
      scoreDevice,
      scoreTimeCluster,
      scorePayVelocity,
      totalDnaScore,
    };
  }

  private computeLiveness(passed: boolean): number {
    return passed ? 30 : 0;
  }

  private computeGeoCluster(gpsCaptured: boolean): number {
    if (!gpsCaptured) return 10;
    return 20;
  }

  private computeDevice(sameDeviceCount: number): number {
    if (sameDeviceCount === 0) return 20;
    if (sameDeviceCount === 1) return 10;
    return 0;
  }

  private computeTimeCluster(recentSessionCount: number): number {
    if (recentSessionCount === 0) return 15;
    if (recentSessionCount <= 2) return 8;
    return 0;
  }

  private computePayVelocity(velocityFlag?: boolean): number {
    if (velocityFlag === undefined || velocityFlag === null) return 15;
    return velocityFlag ? 0 : 15;
  }
}
