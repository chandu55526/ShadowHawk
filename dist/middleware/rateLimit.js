"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
const rate_limit_redis_1 = require("rate-limit-redis");
const redis_1 = require("redis");
const logging_1 = __importDefault(require("../config/logging"));
// Create Redis client
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});
redisClient.on("error", (error) => {
    logging_1.default.error("Redis error:", error);
});
redisClient.on("connect", () => {
    logging_1.default.info("Redis connection established");
});
// Configure rate limiter
exports.rateLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    store: new rate_limit_redis_1.RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    handler: (req, res) => {
        logging_1.default.warn("Rate limit exceeded:", {
            ip: req.ip,
            path: req.path,
            method: req.method,
        });
        res.status(429).json({
            error: "Too Many Requests",
            message: "Rate limit exceeded. Please try again later.",
        });
    },
});
//# sourceMappingURL=rateLimit.js.map