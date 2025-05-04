"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySecurityMiddleware = exports.securityConfig = void 0;
const dotenv_1 = require("dotenv");
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const redis_1 = require("redis");
const rate_limit_redis_1 = require("rate-limit-redis");
const logging_1 = __importDefault(require("./logging"));
(0, dotenv_1.config)();
// Create Redis client
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});
redisClient.on("error", (err) => {
    logging_1.default.error("Redis connection error:", err);
});
exports.securityConfig = {
    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || "your-secret-key",
        expiresIn: "1h",
        refreshExpiresIn: "7d",
    },
    // Rate Limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    },
    // CORS Configuration
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    },
    // Password Policy
    passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
    },
};
const applySecurityMiddleware = (app) => {
    // Helmet for security headers
    app.use((0, helmet_1.default)());
    // CORS configuration
    app.use((0, cors_1.default)({
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    }));
    // Rate limiting
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        standardHeaders: true,
        legacyHeaders: false,
        store: new rate_limit_redis_1.RedisStore({
            sendCommand: (...args) => redisClient.sendCommand(args),
            prefix: "rate-limit:",
        }),
        handler: (req, res) => {
            logging_1.default.warn("Rate limit exceeded", { ip: req.ip });
            res.status(429).json({
                error: "Too many requests",
                message: "Please try again later",
            });
        },
    });
    app.use(limiter);
    // XSS protection
    app.use((_, res, next) => {
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("X-XSS-Protection", "1; mode=block");
        next();
    });
    app.use((_, res, next) => {
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        next();
    });
    app.use((_, res, next) => {
        res.setHeader("Content-Security-Policy", "default-src 'self'");
        next();
    });
    app.use((_, res, next) => {
        res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        next();
    });
};
exports.applySecurityMiddleware = applySecurityMiddleware;
//# sourceMappingURL=security.js.map