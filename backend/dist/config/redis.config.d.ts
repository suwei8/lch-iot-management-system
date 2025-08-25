import Redis from 'ioredis';
export declare class RedisService {
    private client;
    constructor();
    getClient(): Redis;
    set(key: string, value: string, ttl?: number): Promise<void>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    ping(): Promise<string>;
    flushAll(): Promise<string>;
}
export declare const redisConfig: () => {
    url: string;
};
