"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookService = void 0;
const axios_1 = __importDefault(require("axios"));
const logging_1 = __importDefault(require("../config/logging"));
class WebhookService {
    constructor() {
        this.webhooks = new Map();
    }
    static getInstance() {
        if (!WebhookService.instance) {
            WebhookService.instance = new WebhookService();
        }
        return WebhookService.instance;
    }
    registerWebhook(id, config) {
        this.webhooks.set(id, config);
        logging_1.default.info(`Webhook registered: ${id}`);
    }
    unregisterWebhook(id) {
        this.webhooks.delete(id);
        logging_1.default.info(`Webhook unregistered: ${id}`);
    }
    async notifyThreatDetected(result) {
        const event = "threat_detected";
        const payload = {
            event,
            timestamp: new Date().toISOString(),
            data: result,
        };
        for (const [id, config] of this.webhooks.entries()) {
            if (config.events.includes(event)) {
                try {
                    const headers = {
                        "Content-Type": "application/json",
                    };
                    if (config.secret) {
                        headers["X-Webhook-Secret"] = config.secret;
                    }
                    await axios_1.default.post(config.url, payload, { headers });
                    logging_1.default.info(`Webhook notification sent to ${id}`);
                }
                catch (error) {
                    logging_1.default.error(`Failed to send webhook to ${id}:`, error);
                }
            }
        }
    }
    getWebhooks() {
        return new Map(this.webhooks);
    }
}
exports.webhookService = WebhookService.getInstance();
//# sourceMappingURL=webhook.js.map