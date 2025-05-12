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
export declare function detectThreats(url: string): Promise<ThreatDetectionResult>;
