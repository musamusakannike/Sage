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
exports.LeaderboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cases_service_1 = require("./cases.service");
const employees_service_1 = require("../employees/employees.service");
const verification_service_1 = require("../verification/verification.service");
const transactions_service_1 = require("../transactions/transactions.service");
const notifications_service_1 = require("../notifications/notifications.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const enums_1 = require("../common/enums");
let LeaderboardController = class LeaderboardController {
    casesService;
    employeesService;
    verificationService;
    transactionsService;
    notificationsService;
    constructor(casesService, employeesService, verificationService, transactionsService, notificationsService) {
        this.casesService = casesService;
        this.employeesService = employeesService;
        this.verificationService = verificationService;
        this.transactionsService = transactionsService;
        this.notificationsService = notificationsService;
    }
    getLeaderboard(user, cycle) {
        return this.casesService.getLeaderboard(user.orgId, cycle);
    }
    async getCaseProfile(employeeId, user) {
        const [employee, sessions, transactions] = await Promise.all([
            this.employeesService.findById(employeeId, user.orgId),
            this.verificationService.findByEmployee(employeeId),
            this.transactionsService.findByEmployee(employeeId),
        ]);
        return {
            employee: {
                ...employee,
                accountNumber: this.employeesService.maskAccountNumber(employee.accountNumber),
                phone: this.employeesService.maskPhone(employee.phone),
            },
            sessions,
            transactions,
        };
    }
    async freezeEmployee(employeeId, user) {
        const employee = await this.employeesService.updateStatusById(employeeId, enums_1.EmployeeStatus.FROZEN);
        const pushToken = employee.pushToken;
        if (pushToken) {
            await this.notificationsService.sendPushNotification([pushToken], 'Account Frozen', 'Your salary account has been frozen and requires verification. Please contact your HR admin.', { employeeId, action: 'FROZEN' });
        }
        return employee;
    }
};
exports.LeaderboardController = LeaderboardController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Risk leaderboard — all employees sorted by DNA score ascending' }),
    (0, swagger_1.ApiQuery)({ name: 'cycle', required: false, example: '2026-05' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Employees sorted by risk (riskiest first)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('cycle')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LeaderboardController.prototype, "getLeaderboard", null);
__decorate([
    (0, common_1.Get)(':employeeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Full case profile for a single employee' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Employee + sessions + transactions' }),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LeaderboardController.prototype, "getCaseProfile", null);
__decorate([
    (0, common_1.Patch)(':employeeId/freeze'),
    (0, swagger_1.ApiOperation)({ summary: 'Freeze an employee — sets status to FROZEN and fires push notification' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Employee frozen' }),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LeaderboardController.prototype, "freezeEmployee", null);
exports.LeaderboardController = LeaderboardController = __decorate([
    (0, swagger_1.ApiTags)('leaderboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.AUDITOR),
    (0, common_1.Controller)('leaderboard'),
    __metadata("design:paramtypes", [cases_service_1.CasesService,
        employees_service_1.EmployeesService,
        verification_service_1.VerificationService,
        transactions_service_1.TransactionsService,
        notifications_service_1.NotificationsService])
], LeaderboardController);
//# sourceMappingURL=leaderboard.controller.js.map