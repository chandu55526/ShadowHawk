import { Request, Response, NextFunction } from 'express';
import logger from '../config/logging';

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  errors?: Array<{ message: string }>;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong';

  res.status(statusCode).json({
    status,
    message,
    ...(err.errors && { errors: err.errors }),
  });

  // Log stack trace in development
  if (process.env.NODE_ENV === 'development') {
    logger.error(err.stack);
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors,
    });
  }

  // Handle unauthorized errors
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: err.message,
    });
  }
};
