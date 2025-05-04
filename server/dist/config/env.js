"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const validation_1 = require("./validation");
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
// Export the validated environment variables
exports.env = validation_1.validatedEnv;
//# sourceMappingURL=env.js.map