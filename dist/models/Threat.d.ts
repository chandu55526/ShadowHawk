import mongoose, { Document } from "mongoose";
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
export declare const Threat: mongoose.Model<IThreat, {}, {}, {}, mongoose.Document<unknown, {}, IThreat, {}> & IThreat & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
