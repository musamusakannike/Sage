"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const expo_server_sdk_1 = __importDefault(require("expo-server-sdk"));
const resend_1 = require("resend");
const axios_1 = __importDefault(require("axios"));
let NotificationsService = NotificationsService_1 = class NotificationsService {
    configService;
    logger = new common_1.Logger(NotificationsService_1.name);
    expo = new expo_server_sdk_1.default();
    resend = null;
    constructor(configService) {
        this.configService = configService;
        const resendApiKey = this.configService.get('email.resendApiKey');
        if (resendApiKey) {
            this.resend = new resend_1.Resend(resendApiKey);
        }
    }
    async sendVerificationSms(phone, employeeName, deepLink, deadline, email) {
        const deadlineStr = deadline.toLocaleDateString('en-NG', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
        const apiKey = this.configService.get('sms.termiiApiKey');
        const smsConfigured = Boolean(apiKey);
        if (smsConfigured) {
            const message = `Hi ${employeeName}, your salary verification is now open. ` +
                `Tap to verify before ${deadlineStr}: ${deepLink}`;
            await this.sendSms(phone, message);
        }
        else if (email) {
            this.logger.warn(`Termii not configured — falling back to email for ${employeeName}`);
            await this.sendVerificationEmail(email, employeeName, deepLink, deadline, deadlineStr);
        }
        else {
            this.logger.warn(`Cannot deliver verification to ${employeeName}: Termii unconfigured and no email on record`);
        }
    }
    async sendSms(phone, message) {
        const apiKey = this.configService.get('sms.termiiApiKey');
        const baseUrl = this.configService.get('sms.termiiBaseUrl');
        const senderId = this.configService.get('sms.senderId');
        if (!apiKey) {
            this.logger.warn(`SMS not sent (no API key configured) to: ${phone}`);
            return;
        }
        try {
            await axios_1.default.post(`${baseUrl}/api/sms/send`, {
                to: phone,
                from: senderId,
                sms: message,
                type: 'plain',
                channel: 'generic',
                api_key: apiKey,
            });
            this.logger.log(`SMS sent to ${phone}`);
        }
        catch (error) {
            this.logger.error(`SMS failed to ${phone}`, error.message);
        }
    }
    async sendVerificationEmail(to, employeeName, deepLink, deadline, deadlineStr) {
        const fromAddress = this.configService.get('email.fromAddress');
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
        }
        catch (error) {
            this.logger.error(`Email failed to ${to}`, error.message);
        }
    }
    async sendPushNotification(expoPushTokens, title, body, data) {
        const validTokens = expoPushTokens.filter((token) => expo_server_sdk_1.default.isExpoPushToken(token));
        if (validTokens.length === 0) {
            this.logger.warn('No valid Expo push tokens provided');
            return;
        }
        const messages = validTokens.map((to) => ({
            to,
            title,
            body,
            data,
            sound: 'default',
        }));
        const chunks = this.expo.chunkPushNotifications(messages);
        for (const chunk of chunks) {
            try {
                const tickets = await this.expo.sendPushNotificationsAsync(chunk);
                tickets.forEach((ticket, i) => {
                    if (ticket.status === 'error') {
                        this.logger.error(`Push failed for ${validTokens[i]}: ${ticket.message}`);
                    }
                });
                this.logger.log(`Push sent to ${chunk.length} device(s): ${title}`);
            }
            catch (error) {
                this.logger.error('Push chunk failed', error.message);
            }
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map