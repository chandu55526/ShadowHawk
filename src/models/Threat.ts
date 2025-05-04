import mongoose, { Document, Schema } from "mongoose";

export interface IThreat extends Document {
  url: string;
  type: "malware" | "phishing" | "suspicious";
  severity: "low" | "medium" | "high";
  detectedBy: string;
  details: {
    ipAddress?: string;
    domain?: string;
    indicators?: string[];
    additionalInfo?: Record<string, unknown>;
  };
  status: "active" | "resolved" | "false_positive";
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

const threatSchema = new Schema<IThreat>(
  {
    url: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["malware", "phishing", "suspicious"],
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
    detectedBy: {
      type: String,
      required: true,
    },
    details: {
      ipAddress: String,
      domain: String,
      indicators: [String],
      additionalInfo: Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ["active", "resolved", "false_positive"],
      default: "active",
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
threatSchema.index({ type: 1, severity: 1, status: 1 });
threatSchema.index({ createdAt: 1 });
threatSchema.index({ detectedBy: 1 });

export const Threat = mongoose.model<IThreat>("Threat", threatSchema); 