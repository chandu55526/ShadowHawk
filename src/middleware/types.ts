import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export interface ValidationError {
  path: string[];
  message: string;
}

export interface ErrorResponse {
  status: string;
  message: string;
  errors?: Array<{ message: string }>;
}
