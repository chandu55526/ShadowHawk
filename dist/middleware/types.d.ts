import { Request } from "express";
export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
        [key: string]: any;
    };
}
export interface ValidationError {
    path: string[];
    message: string;
}
export interface ErrorResponse {
    error: string;
    message: string;
    details?: ValidationError[];
}
