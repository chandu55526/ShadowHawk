"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCache = exports.setupCache = void 0;
const redis_1 = require("redis");
const logging_1 = __importDefault(require("../config/logging"));
// Create Redis client
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});
// Connect to Redis
redisClient.connect().catch((err) => {
    logging_1.default.error("Redis connection error:", err);
});
redisClient.on("error", (err) => {
    logging_1.default.error("Redis connection error:", err);
});
const setupCache = (app) => {
    // Cache middleware
    app.use(async (req, res, next) => {
        if (req.method !== "GET") {
            return next();
        }
        try {
            const key = `cache:${req.originalUrl}`;
            const cachedData = await redisClient.get(key);
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }
            // Override res.json to cache the response
            const originalJson = res.json;
            res.json = function (body) {
                redisClient
                    .set(key, JSON.stringify(body), {
                    EX: 300, // Cache for 5 minutes
                })
                    .catch((err) => {
                    logging_1.default.error("Cache error:", err);
                });
                return originalJson.call(this, body);
            };
            return next();
        }
        catch (error) {
            logging_1.default.error("Cache middleware error:", error);
            return next();
        }
    });
};
exports.setupCache = setupCache;
// Clear cache middleware
const clearCache = async (_, res, next) => {
    try {
        await redisClient.flushAll();
        return next();
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to clear cache" });
    }
};
exports.clearCache = clearCache;
//# sourceMappingURL=cache.js.map