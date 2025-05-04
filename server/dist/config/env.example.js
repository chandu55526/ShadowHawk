"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
exports.env = {
    // Server Configuration
    PORT: process.env.PORT || 5001,
    NODE_ENV: process.env.NODE_ENV || "development",
    // MongoDB Configuration
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/shadowhawk",
    MONGODB_USER: process.env.MONGODB_USER || "",
    MONGODB_PASSWORD: process.env.MONGODB_PASSWORD || "",
    // Redis Configuration
    REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
    // JWT Configuration
    JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
    STRICT_RATE_LIMIT_WINDOW_MS: parseInt(process.env.STRICT_RATE_LIMIT_WINDOW_MS || "3600000", 10), // 1 hour
    STRICT_RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.STRICT_RATE_LIMIT_MAX_REQUESTS || "5", 10),
    // Security
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
    HELMET_ENABLED: process.env.HELMET_ENABLED !== "false",
    COMPRESSION_ENABLED: process.env.COMPRESSION_ENABLED !== "false",
    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    LOG_FILE: process.env.LOG_FILE || "logs/combined.log",
    ERROR_LOG_FILE: process.env.ERROR_LOG_FILE || "logs/error.log",
    // Monitoring
    PROMETHEUS_ENABLED: process.env.PROMETHEUS_ENABLED !== "false",
    METRICS_PORT: parseInt(process.env.METRICS_PORT || "9090", 10),
};
//# sourceMappingURL=env.example.js.map