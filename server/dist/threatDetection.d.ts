import { Express } from "express";
export interface ThreatDetectionResult {
    isThreat: boolean;
    type?: string;
    confidence: number;
    url: string;
}
export declare const detectThreat: (url: string) => Promise<ThreatDetectionResult>;
export declare const setupThreatDetection: (app: Express) => void;
