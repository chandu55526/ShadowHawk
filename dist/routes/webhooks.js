"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const webhook_1 = require("../services/webhook");
const validation_1 = require("../middleware/validation");
const zod_1 = require("zod");
const logging_1 = __importDefault(require("../config/logging"));
const router = (0, express_1.Router)();
// Apply auth middleware to all webhook routes
router.use(auth_1.authenticate);
const webhookSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    secret: zod_1.z.string().optional(),
    events: zod_1.z.array(zod_1.z.string()),
});
/**
 * @swagger
 * /api/webhooks:
 *   post:
 *     summary: Register a new webhook
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *               - events
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *               secret:
 *                 type: string
 *               events:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Webhook registered successfully
 */
router.post("/", (0, validation_1.validateRequest)(webhookSchema), async (req, res) => {
    try {
        const { url, secret, events } = req.body;
        const id = `webhook_${Date.now()}`;
        webhook_1.webhookService.registerWebhook(id, { url, secret, events });
        res.json({ id, message: "Webhook registered successfully" });
    }
    catch (error) {
        logging_1.default.error("Error registering webhook:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
/**
 * @swagger
 * /api/webhooks/{id}:
 *   delete:
 *     summary: Delete a webhook
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Webhook deleted successfully
 */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        webhook_1.webhookService.unregisterWebhook(id);
        res.json({ message: "Webhook deleted successfully" });
    }
    catch (error) {
        logging_1.default.error("Error deleting webhook:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
/**
 * @swagger
 * /api/webhooks:
 *   get:
 *     summary: List all webhooks
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of webhooks
 */
router.get("/", async (req, res) => {
    try {
        const webhooks = webhook_1.webhookService.getWebhooks();
        res.json(Array.from(webhooks.entries()).map(([id, config]) => ({
            id,
            url: config.url,
            events: config.events,
        })));
    }
    catch (error) {
        logging_1.default.error("Error listing webhooks:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=webhooks.js.map