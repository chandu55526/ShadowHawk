import { z } from "zod";

// Define the schema for our environment variables
const envSchema = z.object({
  // Server configuration
  PORT: z.string().default('5001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Database configuration
  MONGODB_URI: z.string().url(),
  MONGODB_USER: z.string().optional(),
  MONGODB_PASSWORD: z.string().optional(),

  // Redis configuration (optional)
  REDIS_URL: z.string().url(),
  REDIS_PASSWORD: z.string().optional(),

  // JWT configuration
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('1d'),

  // Rate limiting (optional)
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .transform((ms) => parseInt(ms, 10))
    .refine((ms) => ms > 0, "Rate limit window must be positive")
    .optional()
    .default("900000"),
  RATE_LIMIT_MAX_REQUESTS: z
    .string()
    .transform((max) => parseInt(max, 10))
    .refine((max) => max > 0, "Rate limit max requests must be positive")
    .optional()
    .default("100"),

  // Security
  CORS_ORIGIN: z.string().url(),
  HELMET_ENABLED: z
    .string()
    .transform((val) => val.toLowerCase() === "true")
    .default("true"),
  COMPRESSION_ENABLED: z
    .string()
    .transform((val) => val.toLowerCase() === "true")
    .default("true"),

  // Logging
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  LOG_FILE: z.string().default("logs/combined.log"),
  ERROR_LOG_FILE: z.string().default("logs/error.log"),

  // Monitoring (optional)
  PROMETHEUS_ENABLED: z
    .string()
    .transform((val) => val.toLowerCase() === "true")
    .optional()
    .default("true"),
  METRICS_PORT: z
    .string()
    .transform((port) => parseInt(port, 10))
    .refine(
      (port) => port > 0 && port < 65536,
      "Metrics port must be between 1 and 65535",
    )
    .optional()
    .default("9090"),
});

// Validate the environment variables
export const validateEnv = () => {
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:");
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
      console.error(
        "\nUsing default values for missing or invalid variables...",
      );
      return envSchema.parse({});
    }
    throw error;
  }
};

// Export the validated environment variables
export const validatedEnv = validateEnv();
