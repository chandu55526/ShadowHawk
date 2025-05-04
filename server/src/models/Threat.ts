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

// Define the Threat interface
export interface IThreat {
  url: string;
  type: "phishing" | "malware" | "suspicious";
  confidence: number;
  detectedBy?: mongoose.Types.ObjectId;
  timestamp: Date;
  details: Record<string, unknown>;
}

// Define the Threat document interface
export interface IThreatDocument extends IThreat, Document {}

// Define the Threat model interface
export interface IThreatModel extends Model<IThreatDocument> {}

// Define the Threat schema
const threatSchema = new mongoose.Schema<IThreatDocument, IThreatModel>({
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["phishing", "malware", "suspicious"],
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  detectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: Object,
  },
});

// Create and export the Threat model
const Threat =
  mongoose.models.Threat ||
  mongoose.model<IThreatDocument, IThreatModel>("Threat", threatSchema);
export { Threat };
