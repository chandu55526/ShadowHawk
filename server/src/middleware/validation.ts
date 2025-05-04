import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Threat detection schema
export const threatDetectionSchema = z.object({
  url: z.string().url("Invalid URL format"),
});

// Validation middleware
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      return next(error);
    }
  };
};
