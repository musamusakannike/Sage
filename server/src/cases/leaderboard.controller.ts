import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

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
}
