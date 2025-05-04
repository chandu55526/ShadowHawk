import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";
import logger from "../config/logging";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (error) => {
  logger.error("Redis error:", error);
});

redisClient.on("connect", () => {
  logger.info("Redis connection established");
});

export const setupCache = (app: any) => {
  app.use(async (req: Request, res: Response, next: NextFunction) => {
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
      res.send = function (body: any): Response {
        try {
          // Store the response in cache
          redisClient.set(key, JSON.stringify(body), {
            EX: 3600, // Cache for 1 hour
          });
        } catch (error) {
          logger.error("Redis set error:", error);
        }

        // Call the original send
        return originalSend.call(this, body);
      };

      next();
    } catch (error) {
      logger.error("Cache middleware error:", error);
      next();
    }
  });
}; 