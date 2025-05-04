"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get dashboard stats
router.get("/stats", auth_1.authMiddleware, (_, res) => {
    return res.json({ stats: "dashboard stats" });
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map