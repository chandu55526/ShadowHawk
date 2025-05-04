import { env } from "../../config/env";

describe("Environment Configuration", () => {
  it("should have all required environment variables", () => {
    expect(env.PORT).toBeDefined();
    expect(env.NODE_ENV).toBeDefined();
    expect(env.MONGODB_URI).toBeDefined();
    expect(env.JWT_SECRET).toBeDefined();
    expect(env.JWT_EXPIRES_IN).toBeDefined();
    expect(env.RATE_LIMIT_WINDOW_MS).toBeDefined();
    expect(env.RATE_LIMIT_MAX_REQUESTS).toBeDefined();
    expect(["development", "production", "test"]).toContain(env.NODE_ENV);
  });

  it("should have valid server configuration", () => {
    expect(env.PORT).toBeDefined();
    expect(env.NODE_ENV).toBeDefined();
    expect(env.MONGODB_URI).toBeDefined();
    expect(env.JWT_SECRET).toBeDefined();
    expect(env.JWT_EXPIRES_IN).toBeDefined();
    expect(env.RATE_LIMIT_WINDOW_MS).toBeDefined();
    expect(env.RATE_LIMIT_MAX_REQUESTS).toBeDefined();
  });

  it("should have valid database configuration", () => {
    expect(env.MONGODB_URI).toBeDefined();
    expect(env.MONGODB_URI).toMatch(/^mongodb:\/\//);
  });

  it("should have valid Redis configuration", () => {
    expect(env.REDIS_URL).toBeDefined();
    expect(env.REDIS_URL).toMatch(/^redis:\/\//);
  });

  it("should have valid JWT configuration", () => {
    expect(env.JWT_SECRET).toBeDefined();
    expect(env.JWT_SECRET.length).toBeGreaterThanOrEqual(32);
    expect(env.JWT_EXPIRES_IN).toBeDefined();
  });

  it("should have valid rate limiting configuration", () => {
    expect(env.RATE_LIMIT_WINDOW_MS).toBeDefined();
    expect(env.RATE_LIMIT_MAX_REQUESTS).toBeDefined();
  });

  it("should have valid security configuration", () => {
    expect(env.CORS_ORIGIN).toBeDefined();
    expect(typeof env.HELMET_ENABLED).toBe("boolean");
    expect(typeof env.COMPRESSION_ENABLED).toBe("boolean");
  });

  it("should have valid logging configuration", () => {
    expect(env.LOG_LEVEL).toBeDefined();
    expect(["error", "warn", "info", "debug", "silent"]).toContain(
      env.LOG_LEVEL,
    );
    expect(env.LOG_FILE).toBeDefined();
    expect(env.ERROR_LOG_FILE).toBeDefined();
  });

  it("should have valid monitoring configuration", () => {
    expect(typeof env.PROMETHEUS_ENABLED).toBe("boolean");
    expect(env.METRICS_PORT).toBeDefined();
    expect(typeof env.METRICS_PORT).toBe("number");
  });
});
