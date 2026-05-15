"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const configuration_1 = __importDefault(require("./config/configuration"));
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const employees_module_1 = require("./employees/employees.module");
const verification_module_1 = require("./verification/verification.module");
const scoring_module_1 = require("./scoring/scoring.module");
const payroll_module_1 = require("./payroll/payroll.module");
const transactions_module_1 = require("./transactions/transactions.module");
const fraud_ring_module_1 = require("./fraud-ring/fraud-ring.module");
const cases_module_1 = require("./cases/cases.module");
const notifications_module_1 = require("./notifications/notifications.module");
const squad_module_1 = require("./squad/squad.module");
const export_module_1 = require("./export/export.module");
const gemini_module_1 = require("./gemini/gemini.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [configuration_1.default],
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    uri: config.get('database.uri'),
                }),
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => [
                    {
                        ttl: config.get('throttle.ttl'),
                        limit: config.get('throttle.limit'),
                    },
                ],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            employees_module_1.EmployeesModule,
            verification_module_1.VerificationModule,
            scoring_module_1.ScoringModule,
            payroll_module_1.PayrollModule,
            transactions_module_1.TransactionsModule,
            fraud_ring_module_1.FraudRingModule,
            cases_module_1.CasesModule,
            notifications_module_1.NotificationsModule,
            squad_module_1.SquadModule,
            export_module_1.ExportModule,
            gemini_module_1.GeminiModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map