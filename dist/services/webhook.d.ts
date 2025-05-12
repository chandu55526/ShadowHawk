import { ThreatDetectionResult } from "./threatDetection";
interface WebhookConfig {
    url: string;
    secret?: string;
    events: string[];
}
declare class WebhookService {
    private static instance;
    private webhooks;
    private constructor();
    static getInstance(): WebhookService;
    registerWebhook(id: string, config: WebhookConfig): void;
    unregisterWebhook(id: string): void;
    notifyThreatDetected(result: ThreatDetectionResult): Promise<void>;
    getWebhooks(): Map<string, WebhookConfig>;
}
export declare const webhookService: WebhookService;
export {};
