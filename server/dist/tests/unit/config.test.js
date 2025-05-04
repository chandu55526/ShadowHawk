"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../../config/env");
describe("Environment Configuration", () => {
    it("should have all required environment variables", () => {
        expect(env_1.env.PORT).toBeDefined();
        expect(env_1.env.NODE_ENV).toBeDefined();
        expect(env_1.env.MONGODB_URI).toBeDefined();
        expect(env_1.env.JWT_SECRET).toBeDefined();
        expect(env_1.env.JWT_EXPIRES_IN).toBeDefined();
        expect(env_1.env.RATE_LIMIT_WINDOW_MS).toBeDefined();
        expect(env_1.env.RATE_LIMIT_MAX_REQUESTS).toBeDefined();
        expect(["development", "production", "test"]).toContain(env_1.env.NODE_ENV);
    });
    it("should have valid server configuration", () => {
        expect(env_1.env.PORT).toBeDefined();
        expect(env_1.env.NODE_ENV).toBeDefined();
        expect(env_1.env.MONGODB_URI).toBeDefined();
        expect(env_1.env.JWT_SECRET).toBeDefined();
        expect(env_1.env.JWT_EXPIRES_IN).toBeDefined();
        expect(env_1.env.RATE_LIMIT_WINDOW_MS).toBeDefined();
        expect(env_1.env.RATE_LIMIT_MAX_REQUESTS).toBeDefined();
    });
    it("should have valid database configuration", () => {
        expect(env_1.env.MONGODB_URI).toBeDefined();
        expect(env_1.env.MONGODB_URI).toMatch(/^mongodb:\/\//);
    });
    it("should have valid Redis configuration", () => {
        expect(env_1.env.REDIS_URL).toBeDefined();
        expect(env_1.env.REDIS_URL).toMatch(/^redis:\/\//);
    });
    it("should have valid JWT configuration", () => {
        expect(env_1.env.JWT_SECRET).toBeDefined();
        expect(env_1.env.JWT_SECRET.length).toBeGreaterThanOrEqual(32);
        expect(env_1.env.JWT_EXPIRES_IN).toBeDefined();
    });
    it("should have valid rate limiting configuration", () => {
        expect(env_1.env.RATE_LIMIT_WINDOW_MS).toBeDefined();
        expect(env_1.env.RATE_LIMIT_MAX_REQUESTS).toBeDefined();
    });
    it("should have valid security configuration", () => {
        expect(env_1.env.CORS_ORIGIN).toBeDefined();
        expect(typeof env_1.env.HELMET_ENABLED).toBe("boolean");
        expect(typeof env_1.env.COMPRESSION_ENABLED).toBe("boolean");
    });
    it("should have valid logging configuration", () => {
        expect(env_1.env.LOG_LEVEL).toBeDefined();
        expect(["error", "warn", "info", "debug", "silent"]).toContain(env_1.env.LOG_LEVEL);
        expect(env_1.env.LOG_FILE).toBeDefined();
        expect(env_1.env.ERROR_LOG_FILE).toBeDefined();
    });
    it("should have valid monitoring configuration", () => {
        expect(typeof env_1.env.PROMETHEUS_ENABLED).toBe("boolean");
        expect(env_1.env.METRICS_PORT).toBeDefined();
        expect(typeof env_1.env.METRICS_PORT).toBe("number");
    });
});
//# sourceMappingURL=config.test.js.map