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
exports.PayrollController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payroll_service_1 = require("./payroll.service");
const update_schedule_dto_1 = require("./dto/update-schedule.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const enums_1 = require("../common/enums");
const notifications_service_1 = require("../notifications/notifications.service");
const employees_service_1 = require("../employees/employees.service");
const verification_service_1 = require("../verification/verification.service");
let PayrollController = class PayrollController {
    payrollService;
    notificationsService;
    employeesService;
    verificationService;
    constructor(payrollService, notificationsService, employeesService, verificationService) {
        this.payrollService = payrollService;
        this.notificationsService = notificationsService;
        this.employeesService = employeesService;
        this.verificationService = verificationService;
    }
    getSchedule(user) {
        return this.payrollService.getOrCreate(user.orgId);
    }
    updateSchedule(user, dto) {
        return this.payrollService.update(user.orgId, dto);
    }
    async sendInvites(user) {
        const schedule = await this.payrollService.getOrCreate(user.orgId);
        const expiresAt = this.payrollService.getNextDisbursementDate(schedule.disbursementDay);
        const cycleId = expiresAt.toISOString().slice(0, 7);
        const { data: employees } = await this.employeesService.findAll(user.orgId);
        let sent = 0;
        for (const employee of employees) {
            const deepLink = await this.verificationService.createSession(String(employee._id), user.orgId, cycleId, expiresAt);
            await this.notificationsService.sendVerificationSms(employee.phone ?? '', employee.name, deepLink, expiresAt, employee.email);
            sent++;
        }
        return { message: `Verification invites sent to ${sent} employees.` };
    }
};
exports.PayrollController = PayrollController;
__decorate([
    (0, common_1.Get)('schedule'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payroll schedule for the organisation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payroll schedule object' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getSchedule", null);
__decorate([
    (0, common_1.Put)('schedule'),
    (0, swagger_1.ApiOperation)({ summary: 'Update payroll schedule configuration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Updated schedule' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_schedule_dto_1.UpdateScheduleDto]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "updateSchedule", null);
__decorate([
    (0, common_1.Post)('send-invites'),
    (0, swagger_1.ApiOperation)({ summary: 'Manually trigger SMS verification invite dispatch' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Invites dispatched' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "sendInvites", null);
exports.PayrollController = PayrollController = __decorate([
    (0, swagger_1.ApiTags)('payroll'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.HR_ADMIN),
    (0, common_1.Controller)('payroll'),
    __metadata("design:paramtypes", [payroll_service_1.PayrollService,
        notifications_service_1.NotificationsService,
        employees_service_1.EmployeesService,
        verification_service_1.VerificationService])
], PayrollController);
//# sourceMappingURL=payroll.controller.js.map