"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoringService = void 0;
const common_1 = require("@nestjs/common");
let ScoringService = class ScoringService {
    compute(input) {
        const scoreLiveness = this.computeLiveness(input.livenessPasssed);
        const scoreGeoCluster = this.computeGeoCluster(input.gpsCaptured);
        const scoreDevice = this.computeDevice(input.sameDeviceCount);
        const scoreTimeCluster = this.computeTimeCluster(input.recentSessionCount);
        const scorePayVelocity = this.computePayVelocity(input.velocityFlagFromTransaction);
        const totalDnaScore = Math.min(100, scoreLiveness +
            scoreGeoCluster +
            scoreDevice +
            scoreTimeCluster +
            scorePayVelocity);
        return {
            scoreLiveness,
            scoreGeoCluster,
            scoreDevice,
            scoreTimeCluster,
            scorePayVelocity,
            totalDnaScore,
        };
    }
    computeLiveness(passed) {
        return passed ? 30 : 0;
    }
    computeGeoCluster(gpsCaptured) {
        if (!gpsCaptured)
            return 10;
        return 20;
    }
    computeDevice(sameDeviceCount) {
        if (sameDeviceCount === 0)
            return 20;
        if (sameDeviceCount === 1)
            return 10;
        return 0;
    }
    computeTimeCluster(recentSessionCount) {
        if (recentSessionCount === 0)
            return 15;
        if (recentSessionCount <= 2)
            return 8;
        return 0;
    }
    computePayVelocity(velocityFlag) {
        if (velocityFlag === undefined || velocityFlag === null)
            return 15;
        return velocityFlag ? 0 : 15;
    }
};
exports.ScoringService = ScoringService;
exports.ScoringService = ScoringService = __decorate([
    (0, common_1.Injectable)()
], ScoringService);
//# sourceMappingURL=scoring.service.js.map