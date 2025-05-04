import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import logger from "../config/logging";

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      logger.error("Validation error:", error);
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Validation Error",
          details: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      } else {
        next(error);
      }
    }
  };
};
