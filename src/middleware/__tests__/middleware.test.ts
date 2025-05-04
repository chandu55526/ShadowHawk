import { Request, Response } from "express";
import { authenticate, authorize } from "../auth";
import { validate } from "../validation";
import { cache } from "../caching";
import { rateLimit } from "../rateLimit";
import { z } from "zod";
import jwt from "jsonwebtoken";

// Mock dependencies
jest.mock("jsonwebtoken");
jest.mock("redis");
jest.mock("rate-limit-redis");

interface MockRequest extends Partial<Request> {
  user?: {
    role: string;
    id?: string;
  };
}

describe("Middleware Tests", () => {
  let mockRequest: MockRequest;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      ip: "127.0.0.1",
      path: "/test",
      method: "GET",
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  describe("Authentication Middleware", () => {
    it("should call next() with valid token", async () => {
      const token = "valid-token";
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      (jwt.verify as jest.Mock).mockReturnValue({ id: "123", role: "user" });

      await authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.user).toBeDefined();
    });

    it("should return 401 with invalid token", async () => {
      mockRequest.headers = {
        authorization: "Bearer invalid-token",
      };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Unauthorized",
        message: "Invalid or expired token",
      });
    });
  });

  describe("Authorization Middleware", () => {
    it("should call next() with authorized role", async () => {
      const authMiddleware = authorize(["admin"]);
      mockRequest.user = { role: "admin" };

      await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it("should return 403 with unauthorized role", async () => {
      const authMiddleware = authorize(["admin"]);
      mockRequest.user = { role: "user" };

      await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Forbidden",
        message: "Insufficient permissions",
      });
    });
  });

  describe("Validation Middleware", () => {
    it("should call next() with valid data", async () => {
      const schema = z.object({
        name: z.string(),
      });

      mockRequest.body = { name: "John" };

      const validationMiddleware = validate(schema);
      await validationMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it("should return 400 with invalid data", async () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      mockRequest.body = { name: "John", age: "thirty" };

      const validationMiddleware = validate(schema);
      await validationMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Validation Error",
        details: expect.any(Array),
      });
    });
  });

  describe("Cache Middleware", () => {
    it("should call next() for non-GET requests", async () => {
      mockRequest.method = "POST";

      await cache(60)(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe("Rate Limit Middleware", () => {
    it("should call next() when under rate limit", async () => {
      const mockRateLimiter = {
        consume: jest.fn().mockResolvedValue(true),
      };
      jest.mock("rate-limit-redis", () => ({
        RateLimiterRedis: jest.fn().mockImplementation(() => mockRateLimiter),
      }));

      await rateLimit(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it("should return 429 when rate limit exceeded", async () => {
      const mockRateLimiter = {
        consume: jest.fn().mockRejectedValue(new Error("Rate limit exceeded")),
      };
      jest.mock("rate-limit-redis", () => ({
        RateLimiterRedis: jest.fn().mockImplementation(() => mockRateLimiter),
      }));

      await rateLimit(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(429);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Too Many Requests",
        message: "Rate limit exceeded. Please try again later.",
      });
    });
  });
});
