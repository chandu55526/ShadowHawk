import { Request, Response, NextFunction } from 'express';
import logger from '../config/logging';

export const getClientIp = (req: Request): string => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0].trim();
  }
  return req.ip || 'unknown';
};

export const handleError = (error: unknown, context: string): void => {
  logger.error('Error:', {
    context,
    error: error instanceof Error ? error.message : 'Unknown error',
  });
};

export const formatValidationError = (errors: any[]): any[] => {
  return errors.map(error => ({
    path: error.path.join('.'),
    message: error.message,
  }));
};

export const validateRequest = (schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // ... existing code ...
  };
};
