"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheStore = void 0;
const redis_1 = require("redis");
const logging_1 = __importDefault(require("./logging"));
class CacheStore {
    constructor() {
        this.useRedis = false;
        this.memoryCache = new Map();
        this.initializeRedis();
    }
    static getInstance() {
        if (!CacheStore.instance) {
            CacheStore.instance = new CacheStore();
        }
        return CacheStore.instance;
    }
    async initializeRedis() {
        try {
            this.redisClient = (0, redis_1.createClient)({
                url: process.env.REDIS_URL || "redis://localhost:6379",
                socket: {
                    reconnectStrategy: (retries) => {
                        if (retries > 3) {
                            logging_1.default.warn("Redis connection failed, falling back to in-memory cache");
                            return false;
                        }
                        return Math.min(retries * 100, 3000);
                    },
                },
            });
            this.redisClient.on("error", (err) => {
                logging_1.default.error("Redis error, falling back to in-memory cache:", err);
                this.useRedis = false;
            });
            this.redisClient.on("connect", () => {
                logging_1.default.info("Redis connected successfully");
                this.useRedis = true;
            });
            this.redisClient.on("reconnecting", () => {
                logging_1.default.info("Redis reconnecting...");
            });
            await this.redisClient.connect();
        }
        catch (error) {
            logging_1.default.error("Redis initialization failed, using in-memory cache:", error);
            this.useRedis = false;
        }
    }
    async set(key, value, expireSeconds = 300) {
        try {
            if (this.useRedis && this.redisClient.isReady) {
                await this.redisClient.setEx(key, expireSeconds, JSON.stringify(value));
            }
            else {
                this.memoryCache.set(key, {
                    value,
                    expiry: Date.now() + expireSeconds * 1000,
                });
                this.cleanupMemoryCache();
            }
        }
        catch (error) {
            logging_1.default.error("Cache set error:", error);
            this.fallbackToMemoryCache(key, value, expireSeconds);
        }
    }
    async get(key) {
        try {
            if (this.useRedis && this.redisClient.isReady) {
                const value = await this.redisClient.get(key);
                return value ? JSON.parse(value) : null;
            }
            else {
                return this.getFromMemoryCache(key);
            }
        }
        catch (error) {
            logging_1.default.error("Cache get error:", error);
            return this.getFromMemoryCache(key);
        }
    }
    async delete(key) {
        try {
            if (this.useRedis && this.redisClient.isReady) {
                await this.redisClient.del(key);
            }
            this.memoryCache.delete(key);
        }
        catch (error) {
            logging_1.default.error("Cache delete error:", error);
            this.memoryCache.delete(key);
        }
    }
    async flush() {
        try {
            if (this.useRedis && this.redisClient.isReady) {
                await this.redisClient.flushAll();
            }
            this.memoryCache.clear();
        }
        catch (error) {
            logging_1.default.error("Cache flush error:", error);
            this.memoryCache.clear();
        }
    }
    getFromMemoryCache(key) {
        const item = this.memoryCache.get(key);
        if (!item)
            return null;
        if (item.expiry < Date.now()) {
            this.memoryCache.delete(key);
            return null;
        }
        return item.value;
    }
    fallbackToMemoryCache(key, value, expireSeconds) {
        this.memoryCache.set(key, {
            value,
            expiry: Date.now() + expireSeconds * 1000,
        });
    }
    cleanupMemoryCache() {
        const now = Date.now();
        for (const [key, item] of this.memoryCache.entries()) {
            if (item.expiry < now) {
                this.memoryCache.delete(key);
            }
        }
    }
}
exports.cacheStore = CacheStore.getInstance();
//# sourceMappingURL=redis.js.map