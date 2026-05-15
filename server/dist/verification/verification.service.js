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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const mongoose_2 = require("mongoose");
const uuid_1 = require("uuid");
const jwt_1 = require("@nestjs/jwt");
const verification_session_schema_1 = require("./schemas/verification-session.schema");
const scoring_service_1 = require("../scoring/scoring.service");
const employees_service_1 = require("../employees/employees.service");
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
let VerificationService = class VerificationService {
    sessionModel;
    scoringService;
    employeesService;
    configService;
    jwtService;
    constructor(sessionModel, scoringService, employeesService, configService, jwtService) {
        this.sessionModel = sessionModel;
        this.scoringService = scoringService;
        this.employeesService = employeesService;
        this.configService = configService;
        this.jwtService = jwtService;
    }
    async createSession(employeeId, orgId, cycleId, expiresAt) {
        const token = (0, uuid_1.v4)();
        const challengeCode = CHALLENGE_POOL[Math.floor(Math.random() * CHALLENGE_POOL.length)];
        await this.sessionModel.create({
            employeeId: new mongoose_2.Types.ObjectId(employeeId),
            orgId: new mongoose_2.Types.ObjectId(orgId),
            token,
            tokenExpiresAt: expiresAt,
            challengeCode,
            cycleId,
        });
        const deepLinkBase = this.configService.get('app.deepLinkBaseUrl');
        return `${deepLinkBase}/verify?token=${token}`;
    }
    async getChallenge(token) {
        const session = await this.findValidSession(token);
        return { challenge: session.challengeCode };
    }
    async submitChallenge(token, dto) {
        const session = await this.findValidSession(token);
        if (session.attemptCount >= 2) {
            throw new common_1.BadRequestException('Verification window closed. No more retries.');
        }
        const recentSessions = await this.sessionModel
            .find({
            orgId: session.orgId,
            cycleId: session.cycleId,
            verifiedAt: {
                $exists: true,
                $ne: null,
                $gte: new Date(Date.now() - 10 * 60 * 1000),
            },
        })
            .lean()
            .exec();
        const sameDeviceSessions = await this.sessionModel
            .find({
            orgId: session.orgId,
            deviceFingerprint: dto.deviceFingerprint,
            _id: { $ne: session._id },
            cycleId: session.cycleId,
        })
            .lean()
            .exec();
        const scores = this.scoringService.compute({
            livenessPasssed: dto.livenessPasssed,
            gpsCaptured: dto.gpsCaptured,
            gpsLat: dto.gpsLat,
            gpsLng: dto.gpsLng,
            deviceFingerprint: dto.deviceFingerprint,
            recentSessionCount: recentSessions.length,
            sameDeviceCount: sameDeviceSessions.length,
        });
        await this.sessionModel
            .findByIdAndUpdate(session._id, {
            deviceFingerprint: dto.deviceFingerprint,
            gpsLat: dto.gpsLat ?? null,
            gpsLng: dto.gpsLng ?? null,
            gpsCaptured: dto.gpsCaptured,
            livenessPasssed: dto.livenessPasssed,
            ...scores,
            isConsumed: true,
            verifiedAt: new Date(),
            $inc: { attemptCount: 1 },
        })
            .exec();
        await this.employeesService.updateDnaScore(session.employeeId.toString(), scores.totalDnaScore);
        return { message: 'Verification received.' };
    }
    async findValidSession(token) {
        const session = await this.sessionModel.findOne({ token }).exec();
        if (!session)
            throw new common_1.NotFoundException('Verification link not found.');
        if (session.isConsumed) {
            throw new common_1.BadRequestException('This verification link has already been used.');
        }
        if (session.tokenExpiresAt < new Date()) {
            throw new common_1.BadRequestException('This verification link has expired. Contact your HR department.');
        }
        return session;
    }
    async findByEmployee(employeeId) {
        return this.sessionModel
            .find({ employeeId: new mongoose_2.Types.ObjectId(employeeId), isConsumed: true })
            .sort({ verifiedAt: -1 })
            .lean()
            .exec();
    }
};
exports.VerificationService = VerificationService;
exports.VerificationService = VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(verification_session_schema_1.VerificationSession.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        scoring_service_1.ScoringService,
        employees_service_1.EmployeesService,
        config_1.ConfigService,
        jwt_1.JwtService])
], VerificationService);
//# sourceMappingURL=verification.service.js.map