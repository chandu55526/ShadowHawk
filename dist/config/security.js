"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySecurityMiddleware = void 0;
const express_rate_limit_1 = require("express-rate-limit");
const redis_1 = require("redis");
const rate_limit_redis_1 = require("rate-limit-redis");
// Create Redis client
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});
// Configure rate limiter
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    store: new rate_limit_redis_1.RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
        prefix: "rate-limit:",
        resetExpiryOnChange: true,
    }),
});
// Security headers
const securityHeaders = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};
const applySecurityMiddleware = (app) => {
    // Apply rate limiting
    app.use(limiter);
    // Apply security headers
    app.use((req, res, next) => {
        Object.entries(securityHeaders).forEach(([header, value]) => {
            res.setHeader(header, value);
        });
        next();
    });
};
exports.applySecurityMiddleware = applySecurityMiddleware;
//# sourceMappingURL=security.js.map