"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const redis_1 = require("redis");
const logging_1 = __importDefault(require("../config/logging"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *       503:
 *         description: Service is unhealthy
 */
router.get("/", async (req, res) => {
    try {
        const health = {
            status: "healthy",
            timestamp: new Date().toISOString(),
            services: {
                database: "unknown",
                redis: "unknown",
            },
        };
        // Check database connection
        try {
            const db = await (0, database_1.connectDatabase)();
            health.services.database = db ? "connected" : "disconnected";
        }
        catch (error) {
            health.services.database = "error";
            logging_1.default.error("Database health check failed:", error);
        }
        // Check Redis connection
        try {
            const redis = (0, redis_1.createClient)({ url: process.env.REDIS_URL });
            await redis.connect();
            await redis.ping();
            await redis.disconnect();
            health.services.redis = "connected";
        }
        catch (error) {
            health.services.redis = "error";
            logging_1.default.error("Redis health check failed:", error);
        }
        // Determine overall health
        const isHealthy = Object.values(health.services).every((status) => status === "connected" || status === "unknown");
        res.status(isHealthy ? 200 : 503).json(health);
    }
    catch (error) {
        logging_1.default.error("Health check failed:", error);
        res.status(503).json({
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            error: "Health check failed",
        });
    }
});
exports.default = router;
//# sourceMappingURL=health.js.map