"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const verification_controller_1 = require("./verification.controller");
const verification_service_1 = require("./verification.service");
const verification_session_schema_1 = require("./schemas/verification-session.schema");
const scoring_module_1 = require("../scoring/scoring.module");
const gemini_module_1 = require("../gemini/gemini.module");
const employees_module_1 = require("../employees/employees.module");
const auth_module_1 = require("../auth/auth.module");
let VerificationModule = class VerificationModule {
};
exports.VerificationModule = VerificationModule;
exports.VerificationModule = VerificationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: verification_session_schema_1.VerificationSession.name, schema: verification_session_schema_1.VerificationSessionSchema },
            ]),
            scoring_module_1.ScoringModule,
            gemini_module_1.GeminiModule,
            employees_module_1.EmployeesModule,
            auth_module_1.AuthModule,
        ],
        controllers: [verification_controller_1.VerificationController],
        providers: [verification_service_1.VerificationService],
        exports: [verification_service_1.VerificationService],
    })
], VerificationModule);
//# sourceMappingURL=verification.module.js.map