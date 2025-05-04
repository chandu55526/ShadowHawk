/// <reference types="node" />
import fs from "fs";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
};

const defaultEnv = {
  // Server Configuration
  PORT: "5001",
  NODE_ENV: "development",

  // Database Configuration
  MONGODB_URI: "mongodb://localhost:27017/shadowhawk",
  MONGODB_USER: "",
  MONGODB_PASSWORD: "",

  // Redis Configuration
  REDIS_URL: "redis://localhost:6379",
  REDIS_PASSWORD: "",

  // JWT Configuration
  JWT_SECRET: "your-secret-key-change-in-production-min-32-characters",
  JWT_EXPIRES_IN: "1d",

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: "900000",
  RATE_LIMIT_MAX_REQUESTS: "100",
  STRICT_RATE_LIMIT_WINDOW_MS: "3600000",
  STRICT_RATE_LIMIT_MAX_REQUESTS: "5",

  // Security
  CORS_ORIGIN: "http://localhost:3000",
  HELMET_ENABLED: "true",
  COMPRESSION_ENABLED: "true",

  // Logging
  LOG_LEVEL: "info",
  LOG_FILE: "logs/combined.log",
  ERROR_LOG_FILE: "logs/error.log",

  // Monitoring
  PROMETHEUS_ENABLED: "true",
  METRICS_PORT: "9090",
};

async function askQuestion(key: string, defaultValue: string): Promise<string> {
  const answer = await question(`Enter ${key} (default: ${defaultValue}): `);
  return answer.trim() || defaultValue;
}

async function setupEnvironment() {
  console.log("Setting up environment variables...\n");

  const envVars: Record<string, string> = {};

  for (const [key, defaultValue] of Object.entries(defaultEnv)) {
    envVars[key] = await askQuestion(key, defaultValue);
  }

  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const envPath = path.resolve(__dirname, "../.env");
  const envExamplePath = path.resolve(__dirname, "../.env.example");

  try {
    // Create .env file
    fs.writeFileSync(envPath, envContent);
    console.log("\n✅ Created .env file");

    // Create .env.example file
    const envExampleContent = Object.entries(defaultEnv)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");
    fs.writeFileSync(envExamplePath, envExampleContent);
    console.log("✅ Created .env.example file");

    // Create logs directory
    const logsDir = path.resolve(__dirname, "../logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
      console.log("✅ Created logs directory");
    }

    console.log("\n🎉 Environment setup complete!");
    console.log("\nNext steps:");
    console.log("1. Review the .env file and update any values as needed");
    console.log("2. Start MongoDB and Redis services");
    console.log("3. Run npm run dev to start the server");
  } catch (error) {
    console.error("❌ Error setting up environment:", error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setupEnvironment();
