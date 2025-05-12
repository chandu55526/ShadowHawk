"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const redis_1 = require("redis");
const logging_1 = __importDefault(require("../config/logging"));
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});
redisClient.on("error", (err) => {
    logging_1.default.error("Redis error:", err);
});
redisClient.connect().catch((err) => {
    logging_1.default.error("Redis connection error:", err);
});
const cache = (duration) => {
    return async (req, res, next) => {
        if (req.method !== "GET") {
            return next();
        }
        const key = `cache:${req.originalUrl}`;
        try {
            const cachedData = await redisClient.get(key);
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }
            // Store the original res.json method
            const originalJson = res.json;
            // Override res.json to cache the response
            res.json = function (body) {
                redisClient.setEx(key, duration, JSON.stringify(body)).catch((err) => {
                    logging_1.default.error("Redis set error:", err);
                });
                return originalJson.call(this, body);
            };
            next();
        }
        catch (err) {
            logging_1.default.error("Cache middleware error:", err);
            next();
        }
    };
};
exports.cache = cache;
//# sourceMappingURL=caching.js.map