"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupErrorHandling = void 0;
const logging_1 = __importDefault(require("../config/logging"));
const errorHandler_1 = require("./errorHandler");
const setupErrorHandling = (app) => {
    // Log errors
    app.use((err, _, __, next) => {
        logging_1.default.error(err.stack);
        next(err);
    });
    // Handle errors
    app.use(errorHandler_1.errorHandler);
};
exports.setupErrorHandling = setupErrorHandling;
//# sourceMappingURL=errorHandling.js.map