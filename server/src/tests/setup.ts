import dotenv from "dotenv";
import path from "path";

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, "./test.env") });

// Set test environment
process.env.NODE_ENV = "test";

// Mock console methods
global.console = {
  ...console,
  // Suppress console output during tests
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Increase timeout for tests
jest.setTimeout(10000);

// Clean up after tests
afterAll(() => {
  // Add any cleanup code here
});
