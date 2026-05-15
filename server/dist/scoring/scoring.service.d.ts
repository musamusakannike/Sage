export interface ScoreInput {
    livenessPasssed: boolean;
    gpsCaptured: boolean;
    gpsLat?: number;
    gpsLng?: number;
    deviceFingerprint: string;
    recentSessionCount: number;
    sameDeviceCount: number;
    velocityFlagFromTransaction?: boolean;
}
export interface ScoreOutput {
    scoreLiveness: number;
    scoreGeoCluster: number;
    scoreDevice: number;
    scoreTimeCluster: number;
    scorePayVelocity: number;
    totalDnaScore: number;
}
export declare class ScoringService {
    compute(input: ScoreInput): ScoreOutput;
    private computeLiveness;
    private computeGeoCluster;
    private computeDevice;
    private computeTimeCluster;
    private computePayVelocity;
}
