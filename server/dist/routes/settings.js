"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get settings
router.get("/", auth_1.authMiddleware, (_, res) => {
    return res.json({ settings: "user settings" });
});
// Update settings
router.put("/", auth_1.authMiddleware, (req, res) => {
    return res.json(req.body);
});
exports.default = router;
//# sourceMappingURL=settings.js.map