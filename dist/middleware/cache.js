"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCache = void 0;
const redis_1 = require("redis");
const logging_1 = __importDefault(require("../config/logging"));
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});
redisClient.on("error", (error) => {
    logging_1.default.error("Redis error:", error);
});
redisClient.on("connect", () => {
    logging_1.default.info("Redis connection established");
});
const setupCache = (app) => {
    app.use(async (req, res, next) => {
        // Only cache GET requests
        if (req.method !== "GET") {
            return next();
        }
        const key = `cache:${req.originalUrl || req.url}`;
        try {
            const data = await redisClient.get(key);
            if (data) {
                return res.json(JSON.parse(data));
            }
            // Store the original send function
            const originalSend = res.send;
            // Override send
            res.send = function (body) {
                try {
                    // Store the response in cache
                    redisClient.set(key, JSON.stringify(body), {
                        EX: 3600, // Cache for 1 hour
                    });
                }
                catch (error) {
                    logging_1.default.error("Redis set error:", error);
                }
                // Call the original send
                return originalSend.call(this, body);
            };
            next();
        }
        catch (error) {
            logging_1.default.error("Cache middleware error:", error);
            next();
        }
    });
};
exports.setupCache = setupCache;
//# sourceMappingURL=cache.js.map