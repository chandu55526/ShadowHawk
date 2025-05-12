"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECURITY = exports.CORS = exports.CACHE = exports.RATE_LIMIT = void 0;
exports.RATE_LIMIT = {
    POINTS: 100,
    DURATION: 60, // seconds
    BLOCK_DURATION: 60 * 15, // 15 minutes
};
exports.CACHE = {
    DURATION: 60 * 5, // 5 minutes
};
exports.CORS = {
    ORIGIN: process.env.CORS_ORIGIN || "*",
    METHODS: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    ALLOWED_HEADERS: ["Content-Type", "Authorization"],
    CREDENTIALS: true,
    MAX_AGE: 86400, // 24 hours
};
exports.SECURITY = {
    JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
    JWT_EXPIRES_IN: "1d",
};
//# sourceMappingURL=constants.js.map