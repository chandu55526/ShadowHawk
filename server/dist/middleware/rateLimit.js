"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRateLimiting = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
const redis_1 = require("redis");
const logging_1 = __importDefault(require("../config/logging"));
// Create Redis client with retry strategy
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 3) {
                logging_1.default.warn("Redis connection failed after 3 retries");
                return new Error("Redis connection failed");
            }
            return Math.min(retries * 100, 3000);
        },
    },
});
// Handle Redis connection events
redisClient.on("error", (err) => {
    logging_1.default.error("Redis connection error:", err);
});
redisClient.on("connect", () => {
    logging_1.default.info("Redis connected successfully");
});
redisClient.on("reconnecting", () => {
    logging_1.default.info("Redis reconnecting...");
});
// Connect to Redis
redisClient.connect().catch((err) => {
    logging_1.default.error("Redis connection error:", err);
});
const setupRateLimiting = (app) => {
    // Default rate limit
    const defaultLimiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        standardHeaders: true,
        legacyHeaders: false,
        store: new rate_limit_redis_1.default({
            sendCommand: (...args) => redisClient.sendCommand(args),
            prefix: "rate_limit:",
        }),
        handler: (req, res) => {
            logging_1.default.warn("Rate limit exceeded:", { ip: req.ip, path: req.path });
            res.status(429).json({
                error: "Too many requests",
                message: "Please try again later",
            });
        },
    });
    // Strict rate limit for auth endpoints
    const strictLimiter = (0, express_rate_limit_1.default)({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 5, // limit each IP to 5 requests per windowMs
        standardHeaders: true,
        legacyHeaders: false,
        store: new rate_limit_redis_1.default({
            sendCommand: (...args) => redisClient.sendCommand(args),
            prefix: "rate_limit_strict:",
        }),
        handler: (req, res) => {
            logging_1.default.warn("Strict rate limit exceeded:", {
                ip: req.ip,
                path: req.path,
            });
            res.status(429).json({
                error: "Too many requests",
                message: "Please try again in an hour",
            });
        },
    });
    // Apply rate limiting
    app.use(defaultLimiter);
    app.use("/api/auth/*", strictLimiter);
};
exports.setupRateLimiting = setupRateLimiting;
//# sourceMappingURL=rateLimit.js.map