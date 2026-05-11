import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateCaseDto {
  @ApiProperty({ description: 'Employee ID to flag for investigation' })
  @IsMongoId()
  employeeId: string;

  @ApiPropertyOptional({ description: 'Notes for this case' })
  @IsOptional()
  @IsString()
  notes?: string;
}
