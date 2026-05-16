import { ConfigService } from '@nestjs/config';
export declare class NotificationsService {
    private configService;
    private readonly logger;
    private readonly expo;
    private resend;
    constructor(configService: ConfigService);
    private sendEmail;
    sendWelcomeEmail(to: string, name: string, role: string): Promise<void>;
    sendOtpEmail(to: string, name: string, code: string): Promise<void>;
    sendVerificationEmail(to: string, employeeName: string, deepLink: string, deadline: Date, deadlineStr?: string): Promise<void>;
    sendVerificationSms(phone: string, employeeName: string, deepLink: string, deadline: Date, email?: string | null): Promise<void>;
    sendSms(phone: string, message: string): Promise<void>;
    sendFreezeEmail(to: string, name: string): Promise<void>;
    sendPushNotification(expoPushTokens: string[], title: string, body: string, data?: Record<string, unknown>): Promise<void>;
}
