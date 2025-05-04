import { Express, Request, Response, NextFunction } from "express";
export declare const setupCache: (app: Express) => void;
export declare const clearCache: (_: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
