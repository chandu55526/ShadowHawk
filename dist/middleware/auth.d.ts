import { Request, Response, NextFunction } from "express";
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const isAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export {};
