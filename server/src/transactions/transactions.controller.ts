import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as crypto from 'crypto';
import { TransactionsService } from './transactions.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('webhooks')
@Public()
@Controller('webhooks')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly configService: ConfigService,
  ) {}

  @Post('squad')
  @ApiOperation({ summary: 'Squad Transaction API webhook receiver' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  @ApiResponse({ status: 400, description: 'Invalid signature' })
  async handleSquadWebhook(
    @Body() payload: Record<string, unknown>,
    @Headers('x-squad-signature') signature: string,
  ) {
    this.verifyHmac(payload, signature);
    this.transactionsService
      .processWebhook(
        payload as unknown as Parameters<TransactionsService['processWebhook']>[0],
        String(payload['orgId'] ?? ''),
        String(payload['employeeId'] ?? ''),
        payload['cycleId'] ? String(payload['cycleId']) : undefined,
      )
      .catch((err: Error) => console.error('Webhook processing error:', err));

    return { received: true };
  }

  private verifyHmac(
    payload: Record<string, unknown>,
    signature: string,
  ): void {
    const secret = this.configService.get<string>('app.squadWebhookSecret');
    if (!secret) return;

    const expected = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (signature !== expected) {
      throw new BadRequestException('Invalid webhook signature.');
    }
  }
}
