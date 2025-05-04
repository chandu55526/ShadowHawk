import mongoose, { Document, Model } from "mongoose";
/**
 * @swagger
 * components:
 *   schemas:
 *     Threat:
 *       type: object
 *       required:
 *         - url
 *         - type
 *         - confidence
 *       properties:
 *         url:
 *           type: string
 *           description: The URL that was analyzed
 *         type:
 *           type: string
 *           enum: [phishing, malware, suspicious]
 *           description: The type of threat detected
 *         confidence:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           description: Confidence score of the threat detection
 *         detectedBy:
 *           type: string
 *           format: uuid
 *           description: ID of the user who detected the threat
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: When the threat was detected
 *         details:
 *           type: object
 *           description: Additional details about the threat
 */
export interface IThreat {
    url: string;
    type: "phishing" | "malware" | "suspicious";
    confidence: number;
    detectedBy?: mongoose.Types.ObjectId;
    timestamp: Date;
    details: Record<string, unknown>;
}
export interface IThreatDocument extends IThreat, Document {
}
export interface IThreatModel extends Model<IThreatDocument> {
}
declare const Threat: mongoose.Model<any, {}, {}, {}, any, any>;
export { Threat };
