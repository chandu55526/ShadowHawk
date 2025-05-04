import { URL } from "url";
import dns from "dns";
import { promisify } from "util";
import logger from "../config/logging";
import { Threat } from "../models/Threat";

const dnsLookup = promisify(dns.lookup);

export interface ThreatDetectionResult {
  isThreatenning: boolean;
  type?: string;
  severity?: string;
  details?: {
    ipAddress?: string;
    domain?: string;
    indicators?: string[];
    additionalInfo?: Record<string, unknown>;
  };
}

// Known malicious patterns
const maliciousPatterns = [
  /malware/i,
  /phish/i,
  /hack/i,
  /exploit/i,
  /trojan/i,
  /botnet/i,
];

// Known malicious domains
const maliciousDomains = new Set([
  "malware-domain.com",
  "phishing-site.net",
  "suspicious-domain.org",
]);

export async function detectThreats(url: string): Promise<ThreatDetectionResult> {
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;

    // Check domain reputation
    const domainCheck = await checkDomainReputation(domain);
    if (domainCheck.isThreatenning) {
      return domainCheck;
    }

    // Check URL patterns
    const patternCheck = checkUrlPatterns(url);
    if (patternCheck.isThreatenning) {
      return patternCheck;
    }

    // Check URL parameters
    const paramCheck = checkUrlParameters(parsedUrl);
    if (paramCheck.isThreatenning) {
      return paramCheck;
    }

    // No threats detected
    return { isThreatenning: false };
  } catch (error) {
    logger.error("Error in threat detection:", error);
    return {
      isThreatenning: true,
      type: "error",
      severity: "low",
      details: {
        additionalInfo: { error: "Invalid URL or processing error" },
      },
    };
  }
}

async function checkDomainReputation(domain: string): Promise<ThreatDetectionResult> {
  try {
    // Check known malicious domains
    if (maliciousDomains.has(domain)) {
      return {
        isThreatenning: true,
        type: "known_malicious",
        severity: "high",
        details: {
          domain,
        },
      };
    }

    // Perform DNS lookup
    const { address } = await dnsLookup(domain);

    // Store the result for future reference
    await Threat.create({
      url: domain,
      type: "suspicious",
      severity: "low",
      detectedBy: "system",
      details: {
        ipAddress: address,
        domain,
      },
      status: "active",
    });

    return { isThreatenning: false };
  } catch (error) {
    logger.error("DNS lookup error:", error);
    return {
      isThreatenning: true,
      type: "dns_failure",
      severity: "low",
      details: {
        domain,
        additionalInfo: { error: "DNS lookup failed" },
      },
    };
  }
}

function checkUrlPatterns(url: string): ThreatDetectionResult {
  for (const pattern of maliciousPatterns) {
    if (pattern.test(url)) {
      return {
        isThreatenning: true,
        type: "suspicious_pattern",
        severity: "medium",
        details: {
          indicators: [pattern.source],
        },
      };
    }
  }
  return { isThreatenning: false };
}

function checkUrlParameters(parsedUrl: URL): ThreatDetectionResult {
  const suspiciousParams = ["cmd", "exec", "run", "system", "shell"];
  
  for (const [key] of parsedUrl.searchParams) {
    if (suspiciousParams.includes(key.toLowerCase())) {
      return {
        isThreatenning: true,
        type: "suspicious_params",
        severity: "high",
        details: {
          indicators: [`Suspicious parameter: ${key}`],
        },
      };
    }
  }
  return { isThreatenning: false };
} 