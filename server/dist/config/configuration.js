"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    database: {
        uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/sage',
    },
    jwt: {
        secret: process.env.JWT_SECRET ?? 'change-me-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
        verificationTokenSecret: process.env.VERIFICATION_TOKEN_SECRET ?? 'change-verify-secret',
        verificationTokenExpiresIn: process.env.VERIFICATION_TOKEN_EXPIRES_IN ?? '24h',
    },
    sms: {
        termiiApiKey: process.env.TERMII_API_KEY ?? '',
        termiiBaseUrl: process.env.TERMII_BASE_URL ?? 'https://api.ng.termii.com',
        senderId: process.env.SMS_SENDER_ID ?? 'Sage AI',
    },
    email: {
        resendApiKey: process.env.RESEND_API_KEY ?? '',
        fromAddress: process.env.EMAIL_FROM ?? 'Sage AI <noreply@sage.ai>',
    },
    app: {
        deepLinkBaseUrl: process.env.DEEP_LINK_BASE_URL ?? 'https://app.sage.ai',
        squadWebhookSecret: process.env.SQUAD_WEBHOOK_SECRET ?? '',
        encryptionKey: process.env.ENCRYPTION_KEY ?? 'change-encryption-key-32ch',
    },
    throttle: {
        ttl: parseInt(process.env.THROTTLE_TTL ?? '60000', 10),
        limit: parseInt(process.env.THROTTLE_LIMIT ?? '10', 10),
    },
});
//# sourceMappingURL=configuration.js.map