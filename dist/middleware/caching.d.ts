import { Request, Response, NextFunction } from "express";
export declare const cache: (duration: number) => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
