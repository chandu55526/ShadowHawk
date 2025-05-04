import { Express, Request, Response, NextFunction } from 'express';
import logger from '../config/logging';

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  errors?: Array<{ message: string }>;
}

export const setupErrorHandling = (app: Express) => {
  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Cannot ${req.method} ${req.path}`,
    });
  });

  // Global error handler
  app.use((err: CustomError, req: Request, res: Response, _next: NextFunction) => {
    logger.error('Error:', err);

    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong';

    res.status(statusCode).json({
      status,
      message,
      ...(err.errors && { errors: err.errors }),
    });
  });
};
