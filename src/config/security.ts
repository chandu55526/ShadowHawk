import { Express } from "express";
import { rateLimit } from "express-rate-limit";
import { createClient } from "redis";
import { RedisStore } from "rate-limit-redis";
import logger from "./logging";

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

// Configure rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    prefix: "rate-limit:",
    resetExpiryOnChange: true,
  }),
});

// Security headers
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};

export const applySecurityMiddleware = (app: Express) => {
  // Apply rate limiting
  app.use(limiter);

  // Apply security headers
  app.use((req, res, next) => {
    Object.entries(securityHeaders).forEach(([header, value]) => {
      res.setHeader(header, value);
    });
    next();
  });
};
