declare class CacheStore {
    private static instance;
    private redisClient;
    private memoryCache;
    private useRedis;
    private constructor();
    static getInstance(): CacheStore;
    private initializeRedis;
    set(key: string, value: any, expireSeconds?: number): Promise<void>;
    get(key: string): Promise<any>;
    delete(key: string): Promise<void>;
    flush(): Promise<void>;
    private getFromMemoryCache;
    private fallbackToMemoryCache;
    private cleanupMemoryCache;
}
export declare const cacheStore: CacheStore;
export {};
