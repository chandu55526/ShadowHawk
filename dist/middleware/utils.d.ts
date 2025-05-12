import { Request } from "express";
export declare const getClientIp: (req: Request) => string;
export declare const logError: (err: Error, req: Request) => void;
export declare const formatValidationError: (errors: any[]) => any[];
