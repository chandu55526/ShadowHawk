import { URL } from "url";
import dns from "dns";
import { promisify } from "util";
import { logger } from "../utils/logger";
import { cacheStore } from "../config/redis";

const dnsResolve = promisify(dns.resolve);

interface ThreatDetectionResult {
  isThreat: boolean;
  threatLevel: 'low' | 'medium' | 'high';
  details?: {
    maliciousPatterns?: string[];
    suspiciousParams?: string[];
    dnsInfo?: any;
    redirectCount?: number;
    sslValid?: boolean;
    error?: string;
  };
}

class ThreatDetector {
  private static instance: ThreatDetector;
  private maliciousPatterns: RegExp[];
  private suspiciousParams: RegExp[];
  private knownMaliciousDomains: Set<string>;

  private constructor() {
    this.maliciousPatterns = [
      /phish(ing)?/i,
      /malware/i,
      /hack(ed|ing|er)?/i,
      /spam/i,
      /scam/i,
      /exploit/i,
      /malicious/i,
      /trojan/i,
      /virus/i,
      /ransom(ware)?/i,
    ];

    this.suspiciousParams = [
      /pass(word)?/i,
      /pwd/i,
      /token/i,
      /auth/i,
      /login/i,
      /user(name)?/i,
      /account/i,
      /bank/i,
      /credit/i,
      /card/i,
    ];

    this.knownMaliciousDomains = new Set([
      "malware-domain.com",
      "phishing-site.net",
      "suspicious-domain.org",
    ]);
  }

  public static getInstance(): ThreatDetector {
    if (!ThreatDetector.instance) {
      ThreatDetector.instance = new ThreatDetector();
    }
    return ThreatDetector.instance;
  }

  public async detectThreat(urlString: string): Promise<ThreatDetectionResult> {
    try {
      // Check cache first
      const cachedResult = await cacheStore.get(`threat:${urlString}`);
      if (cachedResult) {
        return cachedResult;
      }

      const url = new URL(urlString);
      const details: ThreatDetectionResult["details"] = {};
      let threatScore = 0;
      let threatType: string | undefined;

      // Check domain against known malicious domains
      if (this.knownMaliciousDomains.has(url.hostname)) {
        threatScore = 1;
        threatType = "known_malicious";
      }

      // Check for malicious patterns in URL
      const maliciousMatches = this.maliciousPatterns
        .filter((pattern) => pattern.test(urlString))
        .map((pattern) => pattern.source);

      if (maliciousMatches.length > 0) {
        threatScore += 0.4;
        details.maliciousPatterns = maliciousMatches;
        threatType = threatType || "suspicious_pattern";
      }

      // Check for suspicious query parameters
      const suspiciousParams = this.suspiciousParams
        .filter((pattern) => {
          const params = new URLSearchParams(url.search);
          return Array.from(params.keys()).some((key) => pattern.test(key));
        })
        .map((pattern) => pattern.source);

      if (suspiciousParams.length > 0) {
        threatScore += 0.2;
        details.suspiciousParams = suspiciousParams;
        threatType = threatType || "suspicious_params";
      }

      // Perform DNS lookup
      try {
        const dnsRecords = await dnsResolve(url.hostname);
        details.dnsInfo = dnsRecords;
      } catch (error) {
        threatScore += 0.3;
        threatType = threatType || "dns_failure";
      }

      // Normalize threat score
      threatScore = Math.min(threatScore, 1);

      const result: ThreatDetectionResult = {
        isThreat: threatScore > 0.5,
        threatLevel: threatScore > 0.75 ? 'high' : threatScore > 0.5 ? 'medium' : 'low',
        details,
      };

      // Cache the result
      await cacheStore.set(`threat:${urlString}`, result, 3600); // Cache for 1 hour

      return result;
    } catch (error) {
      logger.error("Error in threat detection:", error);
      return {
        isThreat: false,
        threatLevel: 'low',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      };
    }
  }

  public updateMaliciousDomains(domains: string[]): void {
    domains.forEach((domain) => this.knownMaliciousDomains.add(domain));
  }

  public addMaliciousPattern(pattern: RegExp): void {
    this.maliciousPatterns.push(pattern);
  }

  public addSuspiciousParam(pattern: RegExp): void {
    this.suspiciousParams.push(pattern);
  }
}

export const threatDetector = ThreatDetector.getInstance();
export const detectThreat = (url: string) => threatDetector.detectThreat(url);

export const analyzeUrl = async (url: string): Promise<ThreatDetectionResult> => {
  try {
    // URL validation
    if (!url || typeof url !== 'string') {
      return {
        isThreat: false,
        threatLevel: 'low',
        details: {
          error: 'Invalid URL provided'
        }
      };
    }

    // Basic threat analysis
    const result: ThreatDetectionResult = {
      isThreat: false,
      threatLevel: 'low',
      details: {
        maliciousPatterns: [],
        suspiciousParams: [],
        redirectCount: 0,
        sslValid: true
      }
    };

    // Add your threat detection logic here

    return result;
  } catch (error) {
    return {
      isThreat: false,
      threatLevel: 'low',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    };
  }
};
