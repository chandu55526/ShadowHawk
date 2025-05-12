"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectThreats = detectThreats;
const url_1 = require("url");
const dns_1 = __importDefault(require("dns"));
const util_1 = require("util");
const logging_1 = __importDefault(require("../config/logging"));
const Threat_1 = require("../models/Threat");
const dnsLookup = (0, util_1.promisify)(dns_1.default.lookup);
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
async function detectThreats(url) {
    try {
        const parsedUrl = new url_1.URL(url);
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
    }
    catch (error) {
        logging_1.default.error("Error in threat detection:", error);
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
async function checkDomainReputation(domain) {
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
        await Threat_1.Threat.create({
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
    }
    catch (error) {
        logging_1.default.error("DNS lookup error:", error);
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
function checkUrlPatterns(url) {
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
function checkUrlParameters(parsedUrl) {
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
//# sourceMappingURL=threatDetection.js.map