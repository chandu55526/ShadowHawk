import { createClient } from "redis";
import logger from "./logging";

class CacheStore {
  private static instance: CacheStore;
  private redisClient: any;
  private memoryCache: Map<string, { value: any; expiry: number }>;
  private useRedis: boolean = false;

  private constructor() {
    this.memoryCache = new Map();
    this.initializeRedis();
  }

  public static getInstance(): CacheStore {
    if (!CacheStore.instance) {
      CacheStore.instance = new CacheStore();
    }
    return CacheStore.instance;
  }

  private async initializeRedis() {
    try {
      this.redisClient = createClient({
        url: process.env.REDIS_URL || "redis://localhost:6379",
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 3) {
              logger.warn(
                "Redis connection failed, falling back to in-memory cache",
              );
              return false;
            }
            return Math.min(retries * 100, 3000);
          },
        },
      });

      this.redisClient.on("error", (err: Error) => {
        logger.error("Redis error, falling back to in-memory cache:", err);
        this.useRedis = false;
      });

      this.redisClient.on("connect", () => {
        logger.info("Redis connected successfully");
        this.useRedis = true;
      });

      this.redisClient.on("reconnecting", () => {
        logger.info("Redis reconnecting...");
      });

      await this.redisClient.connect();
    } catch (error) {
      logger.error(
        "Redis initialization failed, using in-memory cache:",
        error,
      );
      this.useRedis = false;
    }
  }

  public async set(
    key: string,
    value: any,
    expireSeconds: number = 300,
  ): Promise<void> {
    try {
      if (this.useRedis && this.redisClient.isReady) {
        await this.redisClient.setEx(key, expireSeconds, JSON.stringify(value));
      } else {
        this.memoryCache.set(key, {
          value,
          expiry: Date.now() + expireSeconds * 1000,
        });
        this.cleanupMemoryCache();
      }
    } catch (error) {
      logger.error("Cache set error:", error);
      this.fallbackToMemoryCache(key, value, expireSeconds);
    }
  }

  public async get(key: string): Promise<any> {
    try {
      if (this.useRedis && this.redisClient.isReady) {
        const value = await this.redisClient.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        return this.getFromMemoryCache(key);
      }
    } catch (error) {
      logger.error("Cache get error:", error);
      return this.getFromMemoryCache(key);
    }
  }

  public async delete(key: string): Promise<void> {
    try {
      if (this.useRedis && this.redisClient.isReady) {
        await this.redisClient.del(key);
      }
      this.memoryCache.delete(key);
    } catch (error) {
      logger.error("Cache delete error:", error);
      this.memoryCache.delete(key);
    }
  }

  public async flush(): Promise<void> {
    try {
      if (this.useRedis && this.redisClient.isReady) {
        await this.redisClient.flushAll();
      }
      this.memoryCache.clear();
    } catch (error) {
      logger.error("Cache flush error:", error);
      this.memoryCache.clear();
    }
  }

  private getFromMemoryCache(key: string): any {
    const item = this.memoryCache.get(key);
    if (!item) return null;
    if (item.expiry < Date.now()) {
      this.memoryCache.delete(key);
      return null;
    }
    return item.value;
  }

  private fallbackToMemoryCache(
    key: string,
    value: any,
    expireSeconds: number,
  ): void {
    this.memoryCache.set(key, {
      value,
      expiry: Date.now() + expireSeconds * 1000,
    });
  }

  private cleanupMemoryCache(): void {
    const now = Date.now();
    for (const [key, item] of this.memoryCache.entries()) {
      if (item.expiry < now) {
        this.memoryCache.delete(key);
      }
    }
  }
}

export const cacheStore = CacheStore.getInstance();
