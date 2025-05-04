"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load test environment variables
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "./test.env") });
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
//# sourceMappingURL=setup.js.map