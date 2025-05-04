"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all threats
router.get("/", auth_1.authMiddleware, (_, res) => {
    return res.json({ threats: [] });
});
// Get threat by ID
router.get("/:id", auth_1.authMiddleware, (_, res) => {
    return res.json({ threat: { id: "1", status: "detected" } });
});
// Update threat status
router.put("/:id", auth_1.authMiddleware, (_, res) => {
    return res.json({ message: "Threat status updated" });
});
exports.default = router;
//# sourceMappingURL=threats.js.map