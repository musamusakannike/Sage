import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import configuration from './config/configuration';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmployeesModule } from './employees/employees.module';
import { VerificationModule } from './verification/verification.module';
import { ScoringModule } from './scoring/scoring.module';
import { PayrollModule } from './payroll/payroll.module';
import { TransactionsModule } from './transactions/transactions.module';
import { FraudRingModule } from './fraud-ring/fraud-ring.module';
import { CasesModule } from './cases/cases.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SquadModule } from './squad/squad.module';
import { ExportModule } from './export/export.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('database.uri'),
      }),
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('throttle.ttl')!,
          limit: config.get<number>('throttle.limit')!,
        },
      ],
    }),

    AuthModule,
    UsersModule,
    EmployeesModule,
    VerificationModule,
    ScoringModule,
    PayrollModule,
    TransactionsModule,
    FraudRingModule,
    CasesModule,
    NotificationsModule,
    SquadModule,
    ExportModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
