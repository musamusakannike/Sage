import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';
import { NotificationsService } from '../notifications/notifications.service';
import { EmployeesService } from '../employees/employees.service';
import { VerificationService } from '../verification/verification.service';

@ApiTags('payroll')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.HR_ADMIN)
@Controller('payroll')
export class PayrollController {
  constructor(
    private readonly payrollService: PayrollService,
    private readonly notificationsService: NotificationsService,
    private readonly employeesService: EmployeesService,
    private readonly verificationService: VerificationService,
  ) {}

  @Get('schedule')
  @ApiOperation({ summary: 'Get payroll schedule for the organisation' })
  @ApiResponse({ status: 200, description: 'Payroll schedule object' })
  getSchedule(@CurrentUser() user: JwtPayload) {
    return this.payrollService.getOrCreate(user.orgId);
  }

  @Put('schedule')
  @ApiOperation({ summary: 'Update payroll schedule configuration' })
  @ApiResponse({ status: 200, description: 'Updated schedule' })
  updateSchedule(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateScheduleDto,
  ) {
    return this.payrollService.update(user.orgId, dto);
  }

  @Post('send-invites')
  @ApiOperation({ summary: 'Manually trigger SMS verification invite dispatch' })
  @ApiResponse({ status: 201, description: 'Invites dispatched' })
  async sendInvites(@CurrentUser() user: JwtPayload) {
    const schedule = await this.payrollService.getOrCreate(user.orgId);
    const expiresAt = this.payrollService.getNextDisbursementDate(
      schedule.disbursementDay,
    );
    const cycleId = expiresAt.toISOString().slice(0, 7);

    const { data: employees } = await this.employeesService.findAll(user.orgId);
    let sent = 0;

    for (const employee of employees) {
      const deepLink = await this.verificationService.createSession(
        String(employee._id),
        user.orgId,
        cycleId,
        expiresAt,
      );
      await this.notificationsService.sendVerificationSms(
        employee.phone,
        employee.name,
        deepLink,
        expiresAt,
        employee.email,
      );
      sent++;
    }

    return { message: `Verification invites sent to ${sent} employees.` };
  }
}
