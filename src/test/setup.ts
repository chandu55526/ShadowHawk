import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createClient } from "redis-mock";

let mongod: MongoMemoryServer;

// Mock Redis client
jest.mock("redis", () => ({
  createClient: () => createClient(),
}));

// Mock environment variables
process.env.JWT_SECRET = "test-secret";
process.env.NODE_ENV = "test";

beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Clean up
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  // Clear all collections before each test
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection not established");
  }
  const collections = await db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
