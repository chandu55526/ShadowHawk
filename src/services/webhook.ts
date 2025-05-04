import axios from "axios";
import logger from "../config/logging";
import { ThreatDetectionResult } from "./threatDetection";

interface WebhookConfig {
  url: string;
  secret?: string;
  events: string[];
}

class WebhookService {
  private static instance: WebhookService;
  private webhooks: Map<string, WebhookConfig>;

  private constructor() {
    this.webhooks = new Map();
  }

  public static getInstance(): WebhookService {
    if (!WebhookService.instance) {
      WebhookService.instance = new WebhookService();
    }
    return WebhookService.instance;
  }

  public registerWebhook(id: string, config: WebhookConfig): void {
    this.webhooks.set(id, config);
    logger.info(`Webhook registered: ${id}`);
  }

  public unregisterWebhook(id: string): void {
    this.webhooks.delete(id);
    logger.info(`Webhook unregistered: ${id}`);
  }

  public async notifyThreatDetected(
    result: ThreatDetectionResult,
  ): Promise<void> {
    const event = "threat_detected";
    const payload = {
      event,
      timestamp: new Date().toISOString(),
      data: result,
    };

    for (const [id, config] of this.webhooks.entries()) {
      if (config.events.includes(event)) {
        try {
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
          };

          if (config.secret) {
            headers["X-Webhook-Secret"] = config.secret;
          }

          await axios.post(config.url, payload, { headers });
          logger.info(`Webhook notification sent to ${id}`);
        } catch (error) {
          logger.error(`Failed to send webhook to ${id}:`, error);
        }
      }
    }
  }

  public getWebhooks(): Map<string, WebhookConfig> {
    return new Map(this.webhooks);
  }
}

export const webhookService = WebhookService.getInstance();
