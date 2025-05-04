"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../../index");
describe("Server Integration Tests", () => {
    let server;
    beforeAll(() => {
        server = index_1.app.listen(0); // Let the OS assign a random port
    });
    afterAll((done) => {
        server.close(done);
    });
    it("should start the server successfully", async () => {
        const response = await (0, supertest_1.default)(index_1.app).get("/api/health");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status", "ok");
    });
    it("should handle 404 routes", async () => {
        const response = await (0, supertest_1.default)(index_1.app).get("/non-existent-route");
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error");
    });
    it("should handle server errors gracefully", async () => {
        const response = await (0, supertest_1.default)(index_1.app).get("/api/error-test");
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("error");
    });
});
//# sourceMappingURL=server.test.js.map