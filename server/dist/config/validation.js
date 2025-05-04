"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatedEnv = exports.validateEnv = void 0;
const zod_1 = require("zod");
// Define the schema for our environment variables
const envSchema = zod_1.z.object({
    // Server configuration
    PORT: zod_1.z.string().default('5001'),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    // Database configuration
    MONGODB_URI: zod_1.z.string().url(),
    MONGODB_USER: zod_1.z.string().optional(),
    MONGODB_PASSWORD: zod_1.z.string().optional(),
    // Redis configuration (optional)
    REDIS_URL: zod_1.z.string().url(),
    REDIS_PASSWORD: zod_1.z.string().optional(),
    // JWT configuration
    JWT_SECRET: zod_1.z.string().min(32),
    JWT_EXPIRES_IN: zod_1.z.string().default('1d'),
    // Rate limiting (optional)
    RATE_LIMIT_WINDOW_MS: zod_1.z
        .string()
        .transform((ms) => parseInt(ms, 10))
        .refine((ms) => ms > 0, "Rate limit window must be positive")
        .optional()
        .default("900000"),
    RATE_LIMIT_MAX_REQUESTS: zod_1.z
        .string()
        .transform((max) => parseInt(max, 10))
        .refine((max) => max > 0, "Rate limit max requests must be positive")
        .optional()
        .default("100"),
    // Security
    CORS_ORIGIN: zod_1.z.string().url(),
    HELMET_ENABLED: zod_1.z
        .string()
        .transform((val) => val.toLowerCase() === "true")
        .default("true"),
    COMPRESSION_ENABLED: zod_1.z
        .string()
        .transform((val) => val.toLowerCase() === "true")
        .default("true"),
    // Logging
    LOG_LEVEL: zod_1.z.enum(["error", "warn", "info", "debug"]).default("info"),
    LOG_FILE: zod_1.z.string().default("logs/combined.log"),
    ERROR_LOG_FILE: zod_1.z.string().default("logs/error.log"),
    // Monitoring (optional)
    PROMETHEUS_ENABLED: zod_1.z
        .string()
        .transform((val) => val.toLowerCase() === "true")
        .optional()
        .default("true"),
    METRICS_PORT: zod_1.z
        .string()
        .transform((port) => parseInt(port, 10))
        .refine((port) => port > 0 && port < 65536, "Metrics port must be between 1 and 65535")
        .optional()
        .default("9090"),
});
// Validate the environment variables
const validateEnv = () => {
    try {
        // Create a default environment object
        const defaultEnv = {
            PORT: "5001",
            NODE_ENV: "development",
            MONGODB_URI: "mongodb://localhost:27017/shadowhawk",
            JWT_SECRET: "your-secret-key-change-in-production-min-32-characters",
            JWT_EXPIRES_IN: "1d",
            CORS_ORIGIN: "http://localhost:3000",
            HELMET_ENABLED: "true",
            COMPRESSION_ENABLED: "true",
            LOG_LEVEL: "info",
            LOG_FILE: "logs/combined.log",
            ERROR_LOG_FILE: "logs/error.log",
        };
        // Merge with process.env
        const mergedEnv = { ...defaultEnv, ...process.env };
        // Validate
        const validatedEnv = envSchema.parse(mergedEnv);
        return validatedEnv;
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            console.error("❌ Invalid environment variables:");
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join(".")}: ${err.message}`);
            });
            console.error("\nUsing default values for missing or invalid variables...");
            return envSchema.parse({});
        }
        throw error;
    }
};
exports.validateEnv = validateEnv;
// Export the validated environment variables
exports.validatedEnv = (0, exports.validateEnv)();
//# sourceMappingURL=validation.js.map