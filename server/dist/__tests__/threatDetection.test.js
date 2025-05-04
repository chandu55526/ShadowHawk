"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const threatDetection_1 = require("../threatDetection");
describe("Threat Detection", () => {
    it("should detect phishing URLs", async () => {
        const phishingUrl = "http://example.com/phishing";
        const result = await (0, threatDetection_1.detectThreat)(phishingUrl);
        expect(result.isThreat).toBe(true);
        expect(result.type).toBeDefined();
        expect(result.confidence).toBeGreaterThan(0);
        expect(result.url).toBeDefined();
    });
    it("should detect malicious domains", async () => {
        const maliciousUrl = "http://malware-distribution.com/download";
        const result = await (0, threatDetection_1.detectThreat)(maliciousUrl);
        expect(result.isThreat).toBe(true);
        expect(result.type).toBe("malware");
    });
    it("should allow safe URLs", async () => {
        const safeUrl = "https://github.com";
        const result = await (0, threatDetection_1.detectThreat)(safeUrl);
        expect(result.isThreat).toBe(false);
    });
    it("should handle invalid URLs", async () => {
        const invalidUrl = "not-a-url";
        const result = await (0, threatDetection_1.detectThreat)(invalidUrl);
        expect(result.isThreat).toBe(false);
    });
});
//# sourceMappingURL=threatDetection.test.js.map