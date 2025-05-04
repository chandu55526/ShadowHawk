"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeUrl = exports.detectThreat = exports.threatDetector = void 0;
const url_1 = require("url");
const dns_1 = __importDefault(require("dns"));
const util_1 = require("util");
const logger_1 = require("../utils/logger");
const redis_1 = require("../config/redis");
const dnsResolve = (0, util_1.promisify)(dns_1.default.resolve);
class ThreatDetector {
    constructor() {
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
    static getInstance() {
        if (!ThreatDetector.instance) {
            ThreatDetector.instance = new ThreatDetector();
        }
        return ThreatDetector.instance;
    }
    async detectThreat(urlString) {
        try {
            // Check cache first
            const cachedResult = await redis_1.cacheStore.get(`threat:${urlString}`);
            if (cachedResult) {
                return cachedResult;
            }
            const url = new url_1.URL(urlString);
            const details = {};
            let threatScore = 0;
            let threatType;
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
            }
            catch (error) {
                threatScore += 0.3;
                threatType = threatType || "dns_failure";
            }
            // Normalize threat score
            threatScore = Math.min(threatScore, 1);
            const result = {
                isThreat: threatScore > 0.5,
                threatLevel: threatScore > 0.75 ? 'high' : threatScore > 0.5 ? 'medium' : 'low',
                details,
            };
            // Cache the result
            await redis_1.cacheStore.set(`threat:${urlString}`, result, 3600); // Cache for 1 hour
            return result;
        }
        catch (error) {
            logger_1.logger.error("Error in threat detection:", error);
            return {
                isThreat: false,
                threatLevel: 'low',
                details: {
                    error: error instanceof Error ? error.message : 'Unknown error occurred'
                }
            };
        }
    }
    updateMaliciousDomains(domains) {
        domains.forEach((domain) => this.knownMaliciousDomains.add(domain));
    }
    addMaliciousPattern(pattern) {
        this.maliciousPatterns.push(pattern);
    }
    addSuspiciousParam(pattern) {
        this.suspiciousParams.push(pattern);
    }
}
exports.threatDetector = ThreatDetector.getInstance();
const detectThreat = (url) => exports.threatDetector.detectThreat(url);
exports.detectThreat = detectThreat;
const analyzeUrl = async (url) => {
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
        const result = {
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
    }
    catch (error) {
        return {
            isThreat: false,
            threatLevel: 'low',
            details: {
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }
        };
    }
};
exports.analyzeUrl = analyzeUrl;
//# sourceMappingURL=threatDetection.js.map