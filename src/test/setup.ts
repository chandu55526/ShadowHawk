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

// Clear database between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
