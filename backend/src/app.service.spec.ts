import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

/**
 * 应用服务单元测试
 */
describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('应该被定义', () => {
    expect(service).toBeDefined();
  });

  describe('getHealth', () => {
    it('应该返回系统健康状态信息', () => {
      // 模拟当前时间
      const mockDate = new Date('2024-01-01T12:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      jest.spyOn(mockDate, 'toISOString').mockReturnValue('2024-01-01T12:00:00.000Z');

      const result = service.getHealth();

      expect(result).toEqual({
        status: 'ok',
        message: '亮车惠自助洗车系统后端服务运行正常',
        timestamp: '2024-01-01T12:00:00.000Z',
        version: '1.0.0',
      });

      // 恢复原始的Date构造函数
      jest.restoreAllMocks();
    });

    it('应该返回正确的状态码', () => {
      const result = service.getHealth();

      expect(result.status).toBe('ok');
    });

    it('应该返回正确的消息', () => {
      const result = service.getHealth();

      expect(result.message).toBe('亮车惠自助洗车系统后端服务运行正常');
    });

    it('应该返回正确的版本号', () => {
      const result = service.getHealth();

      expect(result.version).toBe('1.0.0');
    });

    it('应该返回当前时间戳', () => {
      const beforeCall = new Date().toISOString();
      const result = service.getHealth();
      const afterCall = new Date().toISOString();

      expect(result.timestamp).toBeDefined();
      expect(typeof result.timestamp).toBe('string');
      // 验证时间戳格式（ISO 8601）
      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      // 验证时间戳在合理范围内
      expect(result.timestamp >= beforeCall).toBeTruthy();
      expect(result.timestamp <= afterCall).toBeTruthy();
    });

    it('应该每次调用都返回不同的时间戳', async () => {
      const result1 = service.getHealth();
      
      // 等待1毫秒确保时间戳不同
      await new Promise(resolve => setTimeout(resolve, 1));
      
      const result2 = service.getHealth();

      expect(result1.timestamp).not.toBe(result2.timestamp);
    });

    it('应该返回包含所有必需字段的对象', () => {
      const result = service.getHealth();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('version');
    });

    it('应该返回的对象结构正确', () => {
      const result = service.getHealth();

      expect(typeof result.status).toBe('string');
      expect(typeof result.message).toBe('string');
      expect(typeof result.timestamp).toBe('string');
      expect(typeof result.version).toBe('string');
    });
  });
});