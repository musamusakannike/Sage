import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class SubmitChallengeDto {
  @ApiProperty({ description: 'Device fingerprint string captured on page load' })
  @IsString()
  @IsNotEmpty()
  deviceFingerprint: string;

  @ApiPropertyOptional({ description: 'GPS latitude (if permission granted)' })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  gpsLat?: number;

  @ApiPropertyOptional({ description: 'GPS longitude (if permission granted)' })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  gpsLng?: number;

  @ApiProperty({ description: 'Whether location permission was granted' })
  @IsBoolean()
  gpsCaptured: boolean;

  @ApiProperty({ description: 'Result from face match model: passed or not' })
  @IsBoolean()
  livenessPasssed: boolean;
}
