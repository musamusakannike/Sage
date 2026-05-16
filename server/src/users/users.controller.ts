import { Body, Controller, Get, NotFoundException, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { UpdatePushTokenDto } from './dto/update-push-token.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  async getMe(@CurrentUser() payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new NotFoundException('User not found.');
    const { passwordHash: _ph, ...safe } = user as unknown as Record<string, unknown>;
    void _ph;
    return safe;
  }

  @Patch('push-token')
  @ApiOperation({ summary: 'Register or update the Expo push notification token for the current user' })
  @ApiResponse({ status: 200, description: 'Push token saved' })
  async updatePushToken(
    @CurrentUser() payload: JwtPayload,
    @Body() dto: UpdatePushTokenDto,
  ) {
    await this.usersService.updatePushToken(payload.sub, dto.token);
    return { message: 'Push token saved.' };
  }
}
