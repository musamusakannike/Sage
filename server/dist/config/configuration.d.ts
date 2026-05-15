declare const _default: () => {
    port: number;
    database: {
        uri: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        verificationTokenSecret: string;
        verificationTokenExpiresIn: string;
    };
    sms: {
        termiiApiKey: string;
        termiiBaseUrl: string;
        senderId: string;
    };
    email: {
        resendApiKey: string;
        fromAddress: string;
    };
    app: {
        deepLinkBaseUrl: string;
        squadWebhookSecret: string;
        encryptionKey: string;
    };
    throttle: {
        ttl: number;
        limit: number;
    };
};
export default _default;
