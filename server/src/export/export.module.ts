import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { EmployeesModule } from '../employees/employees.module';
import { VerificationModule } from '../verification/verification.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [EmployeesModule, VerificationModule, TransactionsModule],
  controllers: [ExportController],
  providers: [ExportService],
})
export class ExportModule {}
