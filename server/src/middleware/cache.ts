import { Express, Request, Response, NextFunction } from "express";
import { createClient } from "redis";
import logger from "../config/logging";

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

// Connect to Redis
redisClient.connect().catch((err) => {
  logger.error("Redis connection error:", err);
});

redisClient.on("error", (err) => {
  logger.error("Redis connection error:", err);
});

export const setupCache = (app: Express) => {
  // Cache middleware
  app.use(async (req: Request, res: Response, next: NextFunction) => {
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
            logger.error("Cache error:", err);
          });
        return originalJson.call(this, body);
      };

      return next();
    } catch (error) {
      logger.error("Cache middleware error:", error);
      return next();
    }
  });
};

// Clear cache middleware
export const clearCache = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await redisClient.flushAll();
    return next();
  } catch (error) {
    return res.status(500).json({ error: "Failed to clear cache" });
  }
};
