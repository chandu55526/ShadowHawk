export declare const env: {
    PORT: string;
    NODE_ENV: "development" | "production" | "test";
    MONGODB_URI: string;
    REDIS_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
    CORS_ORIGIN: string;
    HELMET_ENABLED: boolean;
    COMPRESSION_ENABLED: boolean;
    LOG_LEVEL: "error" | "warn" | "info" | "debug";
    LOG_FILE: string;
    ERROR_LOG_FILE: string;
    PROMETHEUS_ENABLED: boolean;
    METRICS_PORT: number;
    MONGODB_USER?: string | undefined;
    MONGODB_PASSWORD?: string | undefined;
    REDIS_PASSWORD?: string | undefined;
};
