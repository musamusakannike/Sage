"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const cases_controller_1 = require("./cases.controller");
const leaderboard_controller_1 = require("./leaderboard.controller");
const cases_service_1 = require("./cases.service");
const case_schema_1 = require("./schemas/case.schema");
const employees_module_1 = require("../employees/employees.module");
const verification_module_1 = require("../verification/verification.module");
const transactions_module_1 = require("../transactions/transactions.module");
const notifications_module_1 = require("../notifications/notifications.module");
let CasesModule = class CasesModule {
};
exports.CasesModule = CasesModule;
exports.CasesModule = CasesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: case_schema_1.Case.name, schema: case_schema_1.CaseSchema }]),
            employees_module_1.EmployeesModule,
            verification_module_1.VerificationModule,
            transactions_module_1.TransactionsModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [cases_controller_1.CasesController, leaderboard_controller_1.LeaderboardController],
        providers: [cases_service_1.CasesService],
        exports: [cases_service_1.CasesService],
    })
], CasesModule);
//# sourceMappingURL=cases.module.js.map