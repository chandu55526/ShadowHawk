"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const redis_mock_1 = require("redis-mock");
let mongod;
// Mock Redis client
jest.mock("redis", () => ({
    createClient: () => (0, redis_mock_1.createClient)(),
}));
// Mock environment variables
process.env.JWT_SECRET = "test-secret";
process.env.NODE_ENV = "test";
beforeAll(async () => {
    // Start in-memory MongoDB instance
    mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    await mongoose_1.default.connect(mongoUri);
});
afterAll(async () => {
    // Clean up
    await mongoose_1.default.disconnect();
    await mongod.stop();
});
beforeEach(async () => {
    // Clear all collections before each test
    const db = mongoose_1.default.connection.db;
    if (!db) {
        throw new Error("Database connection not established");
    }
    const collections = await db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
});
//# sourceMappingURL=setup.js.map