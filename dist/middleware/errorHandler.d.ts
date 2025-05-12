import { Request, Response, NextFunction } from "express";
interface CustomError extends Error {
    status?: number;
    errors?: any[];
}
export declare const errorHandler: (err: CustomError, req: Request, res: Response, _next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
