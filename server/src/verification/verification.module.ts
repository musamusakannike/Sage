import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import {
  VerificationSession,
  VerificationSessionSchema,
} from './schemas/verification-session.schema';
import { ScoringModule } from '../scoring/scoring.module';
import { EmployeesModule } from '../employees/employees.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VerificationSession.name, schema: VerificationSessionSchema },
    ]),
    ScoringModule,
    EmployeesModule,
    AuthModule,
  ],
  controllers: [VerificationController],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
