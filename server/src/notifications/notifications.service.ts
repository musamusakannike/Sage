import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private configService: ConfigService) {}

  async sendVerificationSms(
    phone: string,
    employeeName: string,
    deepLink: string,
    deadline: Date,
  ): Promise<void> {
    const deadlineStr = deadline.toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
    const message =
      `Hi ${employeeName}, your salary verification is now open. ` +
      `Tap to verify before ${deadlineStr}: ${deepLink}`;

    await this.sendSms(phone, message);
  }

  async sendSms(phone: string, message: string): Promise<void> {
    const apiKey = this.configService.get<string>('sms.termiiApiKey');
    const baseUrl = this.configService.get<string>('sms.termiiBaseUrl');
    const senderId = this.configService.get<string>('sms.senderId');

    if (!apiKey) {
      this.logger.warn(`SMS not sent (no API key configured) to: ${phone}`);
      return;
    }

    try {
      await axios.post(`${baseUrl}/api/sms/send`, {
        to: phone,
        from: senderId,
        sms: message,
        type: 'plain',
        channel: 'generic',
        api_key: apiKey,
      });
      this.logger.log(`SMS sent to ${phone}`);
    } catch (error) {
      this.logger.error(`SMS failed to ${phone}`, (error as Error).message);
    }
  }

  async sendPushNotification(
    fcmTokens: string[],
    title: string,
    body: string,
  ): Promise<void> {
    this.logger.log(
      `Push notification queued for ${fcmTokens.length} device(s): ${title}`,
    );
  }
}
