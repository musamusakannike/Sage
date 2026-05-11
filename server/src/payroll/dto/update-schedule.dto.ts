import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class SalaryAmountDto {
  @ApiPropertyOptional()
  @IsMongoId()
  employeeId: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsPositive()
  amount: number;
}

export class UpdateScheduleDto {
  @ApiPropertyOptional({ minimum: 1, maximum: 28 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(28)
  disbursementDay?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(72)
  smsHoursBefore?: number;

  @ApiPropertyOptional({ type: [SalaryAmountDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalaryAmountDto)
  salaryAmounts?: SalaryAmountDto[];

  @ApiPropertyOptional({ description: 'Squad Disburse API key (will be encrypted at rest)' })
  @IsOptional()
  @IsString()
  squadApiKey?: string;
}
