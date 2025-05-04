"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get user profile
router.get("/profile", auth_1.authMiddleware, (_, res) => {
    return res.json({ profile: "user profile" });
});
exports.default = router;
//# sourceMappingURL=users.js.map