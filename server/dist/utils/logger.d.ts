import winston from "winston";
import express from "express";
declare const logger: winston.Logger;
export { logger };
export declare const setupLogging: (app: express.Application) => void;
