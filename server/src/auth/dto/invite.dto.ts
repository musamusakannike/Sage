import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum InviteRole {
  EMPLOYEE = 'employee',
  AUDITOR = 'auditor',
}

export class InviteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  @IsEmail()
  email: string;

  @ApiProperty({ enum: InviteRole })
  @IsEnum(InviteRole)
  role: InviteRole;
}
