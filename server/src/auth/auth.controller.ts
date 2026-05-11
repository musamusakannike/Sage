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
import { Public } from '../common/decorators/public.decorator';
import { UserDocument } from '../users/schemas/user.schema';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login as HR Admin or Auditor' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Returns JWT access token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Request() req: { user: UserDocument }) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('seed-admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an admin or auditor account (dev seeding)' })
  @ApiResponse({ status: 201, description: 'Account created' })
  seedAdmin(@Body() dto: SeedAdminDto) {
    return this.authService.seedAdmin(dto);
  }
}
