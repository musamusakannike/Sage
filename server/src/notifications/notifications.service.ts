import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Expo, { ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { Resend } from 'resend';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly expo = new Expo();
  private resend: Resend | null = null;

  constructor(private configService: ConfigService) {
    const resendApiKey = this.configService.get<string>('email.resendApiKey');
    if (resendApiKey) {
      this.resend = new Resend(resendApiKey);
    }
  }

  async sendVerificationSms(
    phone: string,
    employeeName: string,
    deepLink: string,
    deadline: Date,
    email?: string | null,
  ): Promise<void> {
    const deadlineStr = deadline.toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    const apiKey = this.configService.get<string>('sms.termiiApiKey');
    const smsConfigured = Boolean(apiKey);

    if (smsConfigured) {
      const message =
        `Hi ${employeeName}, your salary verification is now open. ` +
        `Tap to verify before ${deadlineStr}: ${deepLink}`;
      await this.sendSms(phone, message);
    } else if (email) {
      this.logger.warn(
        `Termii not configured — falling back to email for ${employeeName}`,
      );
      await this.sendVerificationEmail(email, employeeName, deepLink, deadline, deadlineStr);
    } else {
      this.logger.warn(
        `Cannot deliver verification to ${employeeName}: Termii unconfigured and no email on record`,
      );
    }
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

  async sendVerificationEmail(
    to: string,
    employeeName: string,
    deepLink: string,
    deadline: Date,
    deadlineStr?: string,
  ): Promise<void> {
    const fromAddress = this.configService.get<string>('email.fromAddress');
    const formatted = deadlineStr ?? deadline.toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    if (!this.resend) {
      this.logger.warn(`Email not sent (RESEND_API_KEY not configured) to: ${to}`);
      return;
    }

    try {
      await this.resend.emails.send({
        from: fromAddress ?? 'Sage AI <noreply@sage.ai>',
        to,
        subject: 'Action Required: Complete Your Salary Verification',
        html: `
          <p>Hi ${employeeName},</p>
          <p>Your salary verification is now open. Please complete it before <strong>${formatted}</strong>.</p>
          <p>
            <a href="${deepLink}" style="
              display:inline-block;
              padding:12px 24px;
              background:#1a1a2e;
              color:#ffffff;
              text-decoration:none;
              border-radius:6px;
              font-weight:bold;
            ">Verify Now</a>
          </p>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${deepLink}</p>
          <hr/>
          <p style="color:#888;font-size:12px;">This link expires on ${formatted}. Do not share it with anyone.</p>
        `,
      });
      this.logger.log(`Verification email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Email failed to ${to}`, (error as Error).message);
    }
  }

  async sendPushNotification(
    expoPushTokens: string[],
    title: string,
    body: string,
    data?: Record<string, unknown>,
  ): Promise<void> {
    const validTokens = expoPushTokens.filter((token) =>
      Expo.isExpoPushToken(token),
    );

    if (validTokens.length === 0) {
      this.logger.warn('No valid Expo push tokens provided');
      return;
    }

    const messages: ExpoPushMessage[] = validTokens.map((to) => ({
      to,
      title,
      body,
      data,
      sound: 'default',
    }));

    const chunks = this.expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        const tickets: ExpoPushTicket[] =
          await this.expo.sendPushNotificationsAsync(chunk);

        tickets.forEach((ticket, i) => {
          if (ticket.status === 'error') {
            this.logger.error(
              `Push failed for ${validTokens[i]}: ${ticket.message}`,
            );
          }
        });

        this.logger.log(`Push sent to ${chunk.length} device(s): ${title}`);
      } catch (error) {
        this.logger.error('Push chunk failed', (error as Error).message);
      }
    }
  }
}
