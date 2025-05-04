import request from "supertest";
import { Express } from "express";
import { createServer } from "../../server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { User } from "../../models/User";

describe("Authentication Endpoints", () => {
  let app: Express;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    app = await createServer();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "Password123!",
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.email).toBe("test@example.com");
    });

    it("should fail with invalid email", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "invalid-email",
        password: "Password123!",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should fail with weak password", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "123",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should fail with duplicate email", async () => {
      await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "Password123!",
      });

      const res = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "Password123!",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "Password123!",
      });
    });

    it("should login successfully with correct credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "Password123!",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should fail with incorrect password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "WrongPassword123!",
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");
    });

    it("should fail with non-existent email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "Password123!",
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");
    });

    it("should fail with invalid email format", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "invalid-email",
        password: "Password123!",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });
});
