import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { webhookService } from "../services/webhook";
import { validateRequest } from "../middleware/validation";
import { z } from "zod";
import logger from "../config/logging";

const router = Router();

// Apply auth middleware to all webhook routes
router.use(authenticate);

const webhookSchema = z.object({
  url: z.string().url(),
  secret: z.string().optional(),
  events: z.array(z.string()),
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
router.post("/", validateRequest(webhookSchema), async (req, res) => {
  try {
    const { url, secret, events } = req.body;
    const id = `webhook_${Date.now()}`;

    webhookService.registerWebhook(id, { url, secret, events });
    res.json({ id, message: "Webhook registered successfully" });
  } catch (error) {
    logger.error("Error registering webhook:", error);
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
    webhookService.unregisterWebhook(id);
    res.json({ message: "Webhook deleted successfully" });
  } catch (error) {
    logger.error("Error deleting webhook:", error);
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
    const webhooks = webhookService.getWebhooks();
    res.json(
      Array.from(webhooks.entries()).map(([id, config]) => ({
        id,
        url: config.url,
        events: config.events,
      })),
    );
  } catch (error) {
    logger.error("Error listing webhooks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
