import { Server } from "http";
import request from "supertest";
import { app } from "../../index";

describe("Server Integration Tests", () => {
  let server: Server;

  beforeAll(() => {
    server = app.listen(0); // Let the OS assign a random port
  });

  afterAll((done) => {
    server.close(done);
  });

  it("should start the server successfully", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
  });

  it("should handle 404 routes", async () => {
    const response = await request(app).get("/non-existent-route");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  it("should handle server errors gracefully", async () => {
    const response = await request(app).get("/api/error-test");
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });
});
