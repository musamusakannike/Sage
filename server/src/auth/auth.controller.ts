import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SeedAdminDto } from './dto/seed-admin.dto';
import { InviteDto } from './dto/invite.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import type { UserDocument } from '../users/schemas/user.schema';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in as HR Admin (email + password)' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Returns JWT access token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Request() req: { user: UserDocument }) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('seed-admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an HR admin account' })
  @ApiResponse({ status: 201, description: 'Account created' })
  seedAdmin(@Body() dto: SeedAdminDto) {
    return this.authService.seedAdmin(dto);
  }

  @Roles(UserRole.HR_ADMIN)
  @Post('invite')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Invite an employee or auditor — creates account and sends welcome email' })
  @ApiResponse({ status: 201, description: 'Invitation sent' })
  @ApiResponse({ status: 400, description: 'Email already registered' })
  invite(
    @Body() dto: InviteDto,
    @CurrentUser() caller: JwtPayload,
  ) {
    return this.authService.invite(dto, caller.sub);
  }

  @Public()
  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a 6-digit sign-in code to an employee or auditor email' })
  @ApiResponse({ status: 200, description: 'Code sent (or silently skipped if email unknown)' })
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto);
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify the sign-in code and receive a JWT' })
  @ApiResponse({ status: 200, description: 'Returns JWT access token' })
  @ApiResponse({ status: 401, description: 'Invalid or expired code' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }
}
