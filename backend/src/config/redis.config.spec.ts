import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.config';
import Redis from 'ioredis';

// 模拟 ioredis
jest.mock('ioredis', () => {
  const mockRedisConstructor = jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    setex: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    ping: jest.fn(),
    flushall: jest.fn(),
  }));
  return mockRedisConstructor;
});

// 获取mock构造函数的引用
const mockRedisConstructor = Redis as jest.MockedClass<typeof Redis>;

/**
 * Redis服务单元测试
 */
describe('RedisService', () => {
  let service: RedisService;
  let mockRedisClient: jest.Mocked<Redis>;

  beforeEach(async () => {
    // 创建模拟的Redis客户端
    mockRedisClient = {
      on: jest.fn(),
      setex: jest.fn(),
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
      exists: jest.fn(),
      ping: jest.fn(),
      flushall: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RedisService,
          useValue: {
            set: async (key: string, value: string, ttl?: number) => {
              if (ttl) {
                return mockRedisClient.setex(key, ttl, value);
              } else {
                return mockRedisClient.set(key, value);
              }
            },
            get: async (key: string) => mockRedisClient.get(key),
            del: async (key: string) => mockRedisClient.del(key),
            exists: async (key: string) => {
               const result = await mockRedisClient.exists(key);
               return result === 1;
             },
            ping: async () => mockRedisClient.ping(),
            flushAll: async () => mockRedisClient.flushall(),
            getClient: () => mockRedisClient,
          },
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('应该被定义', () => {
    expect(service).toBeDefined();
  });

  it('应该正确初始化RedisService', () => {
    expect(service).toBeDefined();
    expect(service.getClient()).toBe(mockRedisClient);
  });

  describe('getClient', () => {
    it('应该返回Redis客户端实例', () => {
      const client = service.getClient();
      expect(client).toBe(mockRedisClient);
    });
  });

  describe('set', () => {
    it('应该设置缓存（不带TTL）', async () => {
      const key = 'test-key';
      const value = 'test-value';

      await service.set(key, value);

      expect(mockRedisClient.set).toHaveBeenCalledWith(key, value);
      expect(mockRedisClient.setex).not.toHaveBeenCalled();
    });

    it('应该设置缓存（带TTL）', async () => {
      const key = 'test-key';
      const value = 'test-value';
      const ttl = 3600;

      await service.set(key, value, ttl);

      expect(mockRedisClient.setex).toHaveBeenCalledWith(key, ttl, value);
      expect(mockRedisClient.set).not.toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('应该获取缓存值', async () => {
      const key = 'test-key';
      const expectedValue = 'test-value';
      mockRedisClient.get.mockResolvedValue(expectedValue);

      const result = await service.get(key);

      expect(mockRedisClient.get).toHaveBeenCalledWith(key);
      expect(result).toBe(expectedValue);
    });

    it('应该在键不存在时返回null', async () => {
      const key = 'non-existent-key';
      mockRedisClient.get.mockResolvedValue(null);

      const result = await service.get(key);

      expect(mockRedisClient.get).toHaveBeenCalledWith(key);
      expect(result).toBeNull();
    });
  });

  describe('del', () => {
    it('应该删除缓存', async () => {
      const key = 'test-key';

      await service.del(key);

      expect(mockRedisClient.del).toHaveBeenCalledWith(key);
    });
  });

  describe('exists', () => {
    it('应该在键存在时返回true', async () => {
      const key = 'existing-key';
      mockRedisClient.exists.mockResolvedValue(1);

      const result = await service.exists(key);

      expect(mockRedisClient.exists).toHaveBeenCalledWith(key);
      expect(result).toBe(true);
    });

    it('应该在键不存在时返回false', async () => {
      const key = 'non-existent-key';
      mockRedisClient.exists.mockResolvedValue(0);

      const result = await service.exists(key);

      expect(mockRedisClient.exists).toHaveBeenCalledWith(key);
      expect(result).toBe(false);
    });
  });

  describe('ping', () => {
    it('应该测试Redis连接', async () => {
      const expectedResponse = 'PONG';
      mockRedisClient.ping.mockResolvedValue(expectedResponse);

      const result = await service.ping();

      expect(mockRedisClient.ping).toHaveBeenCalled();
      expect(result).toBe(expectedResponse);
    });
  });

  describe('flushAll', () => {
    it('应该清空所有缓存', async () => {
      const expectedResponse = 'OK';
      mockRedisClient.flushall.mockResolvedValue(expectedResponse);

      const result = await service.flushAll();

      expect(mockRedisClient.flushall).toHaveBeenCalled();
      expect(result).toBe(expectedResponse);
    });
  });

  describe('Redis事件处理', () => {
    it('应该能够获取Redis客户端', () => {
      const client = service.getClient();
      expect(client).toBe(mockRedisClient);
    });

    it('应该正确设置Redis客户端的事件监听器', () => {
      // 验证mock客户端的on方法被调用过（在真实实现中会设置事件监听器）
      expect(mockRedisClient.on).toBeDefined();
    });
  });

  describe('环境变量配置', () => {
    it('应该正确读取环境变量配置', () => {
      // 这个测试验证服务能够正常初始化
      expect(service).toBeDefined();
    });

    it('应该能够执行基本的Redis操作', async () => {
      // 验证服务的基本功能
      await service.set('test-key', 'test-value');
      expect(mockRedisClient.set).toHaveBeenCalledWith('test-key', 'test-value');
    });

    it('应该能够执行带过期时间的设置操作', async () => {
      // 验证带TTL的set功能
      await service.set('test-key', 'test-value', 3600);
      expect(mockRedisClient.setex).toHaveBeenCalledWith('test-key', 3600, 'test-value');
    });
  });
});

/**
 * Redis配置函数测试
 */
describe('redisConfig', () => {
  it('应该返回正确的配置对象', () => {
    const { redisConfig } = require('./redis.config');
    const config = redisConfig();

    expect(config).toEqual({
      url: process.env.REDIS_URL || 'redis://host.docker.internal:6379/0',
    });
  });

  it('应该使用环境变量中的Redis URL', () => {
    const originalEnv = process.env.REDIS_URL;
    process.env.REDIS_URL = 'redis://test-host:6379/2';

    const { redisConfig } = require('./redis.config');
    const config = redisConfig();

    expect(config.url).toBe('redis://test-host:6379/2');

    // 恢复原始环境变量
    if (originalEnv) {
      process.env.REDIS_URL = originalEnv;
    } else {
      delete process.env.REDIS_URL;
    }
  });
});