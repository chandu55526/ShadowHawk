import { Express } from "express";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";
import logger from "../config/logging";

// Create Redis client with retry strategy
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        logger.warn("Redis connection failed after 3 retries");
        return new Error("Redis connection failed");
      }
      return Math.min(retries * 100, 3000);
    },
  },
});

// Handle Redis connection events
redisClient.on("error", (err) => {
  logger.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
  logger.info("Redis connected successfully");
});

redisClient.on("reconnecting", () => {
  logger.info("Redis reconnecting...");
});

// Connect to Redis
redisClient.connect().catch((err) => {
  logger.error("Redis connection error:", err);
});

export const setupRateLimiting = (app: Express) => {
  // Default rate limit
  const defaultLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
      prefix: "rate_limit:",
    }),
    handler: (req, res) => {
      logger.warn("Rate limit exceeded:", { ip: req.ip, path: req.path });
      res.status(429).json({
        error: "Too many requests",
        message: "Please try again later",
      });
    },
  });

  // Strict rate limit for auth endpoints
  const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
      prefix: "rate_limit_strict:",
    }),
    handler: (req, res) => {
      logger.warn("Strict rate limit exceeded:", {
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
