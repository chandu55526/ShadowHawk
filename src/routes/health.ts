import { Router } from "express";
import { connectDatabase } from "../config/database";
import { createClient } from "redis";
import logger from "../config/logging";

const router = Router();

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
      const db = await connectDatabase();
      health.services.database = db ? "connected" : "disconnected";
    } catch (error) {
      health.services.database = "error";
      logger.error("Database health check failed:", error);
    }

    // Check Redis connection
    try {
      const redis = createClient({ url: process.env.REDIS_URL });
      await redis.connect();
      await redis.ping();
      await redis.disconnect();
      health.services.redis = "connected";
    } catch (error) {
      health.services.redis = "error";
      logger.error("Redis health check failed:", error);
    }

    // Determine overall health
    const isHealthy = Object.values(health.services).every(
      (status) => status === "connected" || status === "unknown",
    );

    res.status(isHealthy ? 200 : 503).json(health);
  } catch (error) {
    logger.error("Health check failed:", error);
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: "Health check failed",
    });
  }
});

export default router;
