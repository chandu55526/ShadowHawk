import { Express } from "express";
import logger from "./config/logging";

export interface ThreatDetectionResult {
  isThreat: boolean;
  type?: string;
  confidence: number;
  url: string;
}

// Simple threat detection function
export const detectThreat = async (
  url: string,
): Promise<ThreatDetectionResult> => {
  // Basic threat detection logic
  const isMalicious = url.includes("malicious") || url.includes("hack");
  const confidence = isMalicious ? 0.9 : 0.1;

  return {
    isThreat: isMalicious,
    type: isMalicious ? "malicious" : undefined,
    confidence,
    url,
  };
};

// Setup threat detection middleware
export const setupThreatDetection = (app: Express) => {
  app.use(async (req, _, next) => {
    try {
      const result = await detectThreat(req.url);
      if (result.isThreat) {
        logger.warn("Threat detected", { url: req.url, type: result.type });
      }
      next();
    } catch (error) {
      logger.error("Threat detection error", { error });
      next();
    }
  });
};
