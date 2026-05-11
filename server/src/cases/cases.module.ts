import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CasesController } from './cases.controller';
import { LeaderboardController } from './leaderboard.controller';
import { CasesService } from './cases.service';
import { Case, CaseSchema } from './schemas/case.schema';
import { EmployeesModule } from '../employees/employees.module';
import { VerificationModule } from '../verification/verification.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Case.name, schema: CaseSchema }]),
    EmployeesModule,
    VerificationModule,
    TransactionsModule,
  ],
  controllers: [CasesController, LeaderboardController],
  providers: [CasesService],
  exports: [CasesService],
})
export class CasesModule {}
