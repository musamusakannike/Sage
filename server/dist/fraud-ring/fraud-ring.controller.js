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
exports.FraudRingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fraud_ring_service_1 = require("./fraud-ring.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const enums_1 = require("../common/enums");
let FraudRingController = class FraudRingController {
    fraudRingService;
    constructor(fraudRingService) {
        this.fraudRingService = fraudRingService;
    }
    buildGraph(user, cycle) {
        return this.fraudRingService.buildGraph(user.orgId, cycle);
    }
    getGraph(user, cycle) {
        return this.fraudRingService.getGraph(user.orgId, cycle);
    }
    getNode(nodeId, user) {
        return this.fraudRingService.getNodeDetail(nodeId, user.orgId);
    }
};
exports.FraudRingController = FraudRingController;
__decorate([
    (0, common_1.Post)('build'),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger graph rebuild for current cycle (Auditor)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('cycle')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FraudRingController.prototype, "buildGraph", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get fraud ring graph data for a cycle' }),
    (0, swagger_1.ApiQuery)({ name: 'cycle', required: false, example: '2026-05' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Graph nodes, edges, ring confidence' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('cycle')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FraudRingController.prototype, "getGraph", null);
__decorate([
    (0, common_1.Get)('node/:nodeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detail for a single graph node' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Node detail with connected edges' }),
    __param(0, (0, common_1.Param)('nodeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FraudRingController.prototype, "getNode", null);
exports.FraudRingController = FraudRingController = __decorate([
    (0, swagger_1.ApiTags)('fraud-ring'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.AUDITOR),
    (0, common_1.Controller)('fraud-ring'),
    __metadata("design:paramtypes", [fraud_ring_service_1.FraudRingService])
], FraudRingController);
//# sourceMappingURL=fraud-ring.controller.js.map