import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { EmployeesService } from '../employees/employees.service';
import { VerificationService } from '../verification/verification.service';
import { TransactionsService } from '../transactions/transactions.service';
import { NotificationsService } from '../notifications/notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { UserRole, EmployeeStatus } from '../common/enums';

@ApiTags('leaderboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.AUDITOR)
@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    private readonly casesService: CasesService,
    private readonly employeesService: EmployeesService,
    private readonly verificationService: VerificationService,
    private readonly transactionsService: TransactionsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Risk leaderboard — all employees sorted by DNA score ascending' })
  @ApiQuery({ name: 'cycle', required: false, example: '2026-05' })
  @ApiResponse({ status: 200, description: 'Employees sorted by risk (riskiest first)' })
  getLeaderboard(
    @CurrentUser() user: JwtPayload,
    @Query('cycle') cycle?: string,
  ) {
    return this.casesService.getLeaderboard(user.orgId, cycle);
  }

  @Get(':employeeId')
  @ApiOperation({ summary: 'Full case profile for a single employee' })
  @ApiResponse({ status: 200, description: 'Employee + sessions + transactions' })
  async getCaseProfile(
    @Param('employeeId') employeeId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const [employee, sessions, transactions] = await Promise.all([
      this.employeesService.findById(employeeId, user.orgId),
      this.verificationService.findByEmployee(employeeId),
      this.transactionsService.findByEmployee(employeeId),
    ]);

    return {
      employee: {
        ...employee,
        accountNumber: this.employeesService.maskAccountNumber(
          employee.accountNumber,
        ),
        phone: this.employeesService.maskPhone(employee.phone),
      },
      sessions,
      transactions,
    };
  }

  @Patch(':employeeId/freeze')
  @ApiOperation({ summary: 'Freeze an employee — sets status to FROZEN, fires push + email notification' })
  @ApiResponse({ status: 200, description: 'Employee frozen' })
  async freezeEmployee(
    @Param('employeeId') employeeId: string,
  ) {
    // Best-effort status update — may 404 on static demo pages; notifications always fire
    let employee: unknown = null;
    try {
      employee = await this.employeesService.updateStatusById(
        employeeId,
        EmployeeStatus.FROZEN,
      );
    } catch { /* ignore — demo pages may not have a matching DB record */ }

    // ── Push notification ────────────────────────────────────────────────────
    const pushToken = (employee as { pushToken?: string | null } | null)?.pushToken;
    // Hardcoded demo fallback — replace with real Expo token from Musa's device
    const DEMO_PUSH_TOKEN = pushToken ?? '';
    if (DEMO_PUSH_TOKEN) {
      await this.notificationsService.sendPushNotification(
        [DEMO_PUSH_TOKEN],
        'Account Frozen ❄️',
        'Your salary account has been frozen and requires verification. Please contact your HR admin.',
        { employeeId, action: 'FROZEN' },
      );
    }

    // ── Email notification (hardcoded for hackathon demo) ────────────────────
    await this.notificationsService.sendFreezeEmail(
      'musamusakannike@gmail.com',
      'Musa Musa Kannike',
    );

    return employee ?? { status: EmployeeStatus.FROZEN };
  }
}
