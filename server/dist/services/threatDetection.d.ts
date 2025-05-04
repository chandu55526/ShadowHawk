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
declare class ThreatDetector {
    private static instance;
    private maliciousPatterns;
    private suspiciousParams;
    private knownMaliciousDomains;
    private constructor();
    static getInstance(): ThreatDetector;
    detectThreat(urlString: string): Promise<ThreatDetectionResult>;
    updateMaliciousDomains(domains: string[]): void;
    addMaliciousPattern(pattern: RegExp): void;
    addSuspiciousParam(pattern: RegExp): void;
}
export declare const threatDetector: ThreatDetector;
export declare const detectThreat: (url: string) => Promise<ThreatDetectionResult>;
export declare const analyzeUrl: (url: string) => Promise<ThreatDetectionResult>;
export {};
