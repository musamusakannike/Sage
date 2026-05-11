import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerificationService } from './verification.service';
import { SubmitChallengeDto } from './dto/submit-challenge.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('verification')
@Public()
@Controller('verify')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get(':token')
  @ApiOperation({ summary: 'Get liveness challenge for an employee via SMS token' })
  @ApiResponse({ status: 200, description: 'Challenge instruction returned' })
  @ApiResponse({ status: 404, description: 'Token not found or expired' })
  getChallenge(@Param('token') token: string) {
    return this.verificationService.getChallenge(token);
  }

  @Post(':token/submit')
  @ApiOperation({ summary: 'Submit liveness challenge result' })
  @ApiResponse({ status: 200, description: 'Verification received' })
  @ApiResponse({ status: 400, description: 'Token consumed or expired' })
  submitChallenge(
    @Param('token') token: string,
    @Body() dto: SubmitChallengeDto,
  ) {
    return this.verificationService.submitChallenge(token, dto);
  }
}
