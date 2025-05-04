"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Threat = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Define the Threat schema
const threatSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
const Threat = mongoose_1.default.models.Threat ||
    mongoose_1.default.model("Threat", threatSchema);
exports.Threat = Threat;
//# sourceMappingURL=Threat.js.map