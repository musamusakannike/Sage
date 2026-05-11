import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import {
  PayrollSchedule,
  PayrollScheduleSchema,
} from './schemas/payroll-schedule.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { EmployeesModule } from '../employees/employees.module';
import { VerificationModule } from '../verification/verification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PayrollSchedule.name, schema: PayrollScheduleSchema },
    ]),
    NotificationsModule,
    EmployeesModule,
    VerificationModule,
  ],
  controllers: [PayrollController],
  providers: [PayrollService],
  exports: [PayrollService],
})
export class PayrollModule {}
