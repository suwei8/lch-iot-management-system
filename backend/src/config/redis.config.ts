import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Redis配置服务
 */
@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL, {
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    });

    this.client.on('connect', () => {
      console.log('✅ Redis连接成功');
    });

    this.client.on('error', (err) => {
      console.error('❌ Redis连接错误:', err);
    });
  }

  /**
   * 获取Redis客户端实例
   */
  getClient(): Redis {
    return this.client;
  }

  /**
   * 设置缓存
   * @param key 键
   * @param value 值
   * @param ttl 过期时间（秒）
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setex(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  /**
   * 获取缓存
   * @param key 键
   */
  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  /**
   * 删除缓存
   * @param key 键
   */
  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  /**
   * 检查键是否存在
   * @param key 键
   */
  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  /**
   * 测试Redis连接
   */
  async ping(): Promise<string> {
    return await this.client.ping();
  }

  /**
   * 清空所有缓存
   */
  async flushAll(): Promise<string> {
    return await this.client.flushall();
  }
}

/**
 * Redis配置
 */
export const redisConfig = () => ({
  url: process.env.REDIS_URL,
});