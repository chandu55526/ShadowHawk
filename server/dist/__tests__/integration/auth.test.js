"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../../server");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../../models/User");
describe("Authentication Endpoints", () => {
    let app;
    let mongoServer;
    beforeAll(async () => {
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose_1.default.connect(mongoUri);
        app = await (0, server_1.createServer)();
    });
    afterAll(async () => {
        await mongoose_1.default.disconnect();
        await mongoServer.stop();
    });
    beforeEach(async () => {
        await User_1.User.deleteMany({});
    });
    describe("POST /api/auth/register", () => {
        it("should register a new user successfully", async () => {
            const res = await (0, supertest_1.default)(app).post("/api/auth/register").send({
                email: "test@example.com",
                password: "Password123!",
            });
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("id");
            expect(res.body.email).toBe("test@example.com");
        });
        it("should fail with invalid email", async () => {
            const res = await (0, supertest_1.default)(app).post("/api/auth/register").send({
                email: "invalid-email",
                password: "Password123!",
            });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("error");
        });
        it("should fail with weak password", async () => {
            const res = await (0, supertest_1.default)(app).post("/api/auth/register").send({
                email: "test@example.com",
                password: "123",
            });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("error");
        });
        it("should fail with duplicate email", async () => {
            await (0, supertest_1.default)(app).post("/api/auth/register").send({
                email: "test@example.com",
                password: "Password123!",
            });
            const res = await (0, supertest_1.default)(app).post("/api/auth/register").send({
                email: "test@example.com",
                password: "Password123!",
            });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("error");
        });
    });
    describe("POST /api/auth/login", () => {
        beforeEach(async () => {
            await (0, supertest_1.default)(app).post("/api/auth/register").send({
                email: "test@example.com",
                password: "Password123!",
            });
        });
        it("should login successfully with correct credentials", async () => {
            const res = await (0, supertest_1.default)(app).post("/api/auth/login").send({
                email: "test@example.com",
                password: "Password123!",
            });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("token");
        });
        it("should fail with incorrect password", async () => {
            const res = await (0, supertest_1.default)(app).post("/api/auth/login").send({
                email: "test@example.com",
                password: "WrongPassword123!",
            });
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty("error");
        });
        it("should fail with non-existent email", async () => {
            const res = await (0, supertest_1.default)(app).post("/api/auth/login").send({
                email: "nonexistent@example.com",
                password: "Password123!",
            });
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty("error");
        });
        it("should fail with invalid email format", async () => {
            const res = await (0, supertest_1.default)(app).post("/api/auth/login").send({
                email: "invalid-email",
                password: "Password123!",
            });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("error");
        });
    });
});
//# sourceMappingURL=auth.test.js.map