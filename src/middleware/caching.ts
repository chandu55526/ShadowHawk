import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";
import logger from "../config/logging";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  logger.error("Redis error:", err);
});

redisClient.connect().catch((err) => {
  logger.error("Redis connection error:", err);
});

export const cache = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
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
          logger.error("Redis set error:", err);
        });

        return originalJson.call(this, body);
      };

      next();
    } catch (err) {
      logger.error("Cache middleware error:", err);
      next();
    }
  };
};
