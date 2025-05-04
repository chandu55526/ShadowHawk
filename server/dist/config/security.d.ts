import { Express } from "express";
export declare const securityConfig: {
    jwt: {
        secret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    rateLimit: {
        windowMs: number;
        max: number;
    };
    cors: {
        origin: string;
        methods: string[];
        allowedHeaders: string[];
        credentials: boolean;
    };
    passwordPolicy: {
        minLength: number;
        requireUppercase: boolean;
        requireLowercase: boolean;
        requireNumbers: boolean;
        requireSpecialChars: boolean;
    };
};
export declare const applySecurityMiddleware: (app: Express) => void;
