export declare const config: {
    nodeEnv: "development" | "production" | "test";
    port: number;
    databaseUrl: string;
    jwt: {
        accessToken: {
            secret: string;
            expiry: string;
        };
        refreshToken: {
            secret: string;
            expiry: string;
        };
    };
    aws: {
        s3: {
            bucket: string | undefined;
            endpoint: string | undefined;
            region: string | undefined;
            accessKeyId: string | undefined;
            secretAccessKey: string | undefined;
        };
    };
    payments: {
        razorpay: {
            keyId: string | undefined;
            keySecret: string | undefined;
        };
        stripe: {
            secretKey: string | undefined;
            webhookSecret: string | undefined;
        };
    };
    video: {
        apiKey: string | undefined;
        secret: string | undefined;
    };
    smtp: {
        host: string | undefined;
        port: number | undefined;
        secure: boolean;
        user: string | undefined;
        pass: string | undefined;
        from: string | undefined;
    };
    rateLimit: {
        windowMs: number;
        max: number;
    };
    aiModels: {
        inferenceEndpoint: string | undefined;
        modelName: string | undefined;
        githubToken: string | undefined;
    };
    cors: {
        origin: string | undefined;
    };
    logLevel: "fatal" | "error" | "warn" | "info" | "debug" | "trace";
};
export type Config = typeof config;
export default config;
//# sourceMappingURL=index.d.ts.map