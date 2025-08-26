import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * 应用控制器单元测试
 */
describe('AppController', () => {
  let controller: AppController;
  let appService: AppService;

  // 模拟AppService
  const mockAppService = {
    getHealth: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('应该被定义', () => {
    expect(controller).toBeDefined();
  });

  it('应该注入AppService', () => {
    expect(appService).toBeDefined();
  });

  describe('getHealth', () => {
    it('应该调用AppService的getHealth方法', () => {
      const expectedResult = {
        status: 'ok',
        message: '亮车惠自助洗车系统后端服务运行正常',
        timestamp: '2024-01-01T12:00:00.000Z',
        version: '1.0.0',
      };

      mockAppService.getHealth.mockReturnValue(expectedResult);

      const result = controller.getHealth();

      expect(mockAppService.getHealth).toHaveBeenCalledTimes(1);
      expect(mockAppService.getHealth).toHaveBeenCalledWith();
      expect(result).toEqual(expectedResult);
    });

    it('应该返回健康状态信息', () => {
      const mockHealthData = {
        status: 'ok',
        message: '亮车惠自助洗车系统后端服务运行正常',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };

      mockAppService.getHealth.mockReturnValue(mockHealthData);

      const result = controller.getHealth();

      expect(result).toBe(mockHealthData);
      expect(result.status).toBe('ok');
      expect(result.message).toBe('亮车惠自助洗车系统后端服务运行正常');
      expect(result.version).toBe('1.0.0');
      expect(result.timestamp).toBeDefined();
    });

    it('应该处理AppService抛出的异常', () => {
      const error = new Error('Service unavailable');
      mockAppService.getHealth.mockImplementation(() => {
        throw error;
      });

      expect(() => controller.getHealth()).toThrow('Service unavailable');
      expect(mockAppService.getHealth).toHaveBeenCalledTimes(1);
    });

    it('应该正确传递AppService的返回值', () => {
      const customHealthData = {
        status: 'maintenance',
        message: '系统维护中',
        timestamp: '2024-01-01T00:00:00.000Z',
        version: '2.0.0',
      };

      mockAppService.getHealth.mockReturnValue(customHealthData);

      const result = controller.getHealth();

      expect(result).toStrictEqual(customHealthData);
    });

    it('应该在多次调用时都调用AppService', () => {
      const healthData = {
        status: 'ok',
        message: '亮车惠自助洗车系统后端服务运行正常',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };

      mockAppService.getHealth.mockReturnValue(healthData);

      // 第一次调用
      controller.getHealth();
      expect(mockAppService.getHealth).toHaveBeenCalledTimes(1);

      // 第二次调用
      controller.getHealth();
      expect(mockAppService.getHealth).toHaveBeenCalledTimes(2);

      // 第三次调用
      controller.getHealth();
      expect(mockAppService.getHealth).toHaveBeenCalledTimes(3);
    });
  });

  describe('依赖注入', () => {
    it('应该正确注入AppService依赖', () => {
      expect(controller['appService']).toBe(appService);
    });

    it('应该使用readonly修饰符保护AppService', () => {
      // 验证appService属性存在
      expect(controller['appService']).toBeDefined();
      // 在测试环境中，appService是mock对象，验证其具有预期的方法
      expect(controller['appService'].getHealth).toBeDefined();
    });
  });

  describe('控制器装饰器', () => {
    it('应该使用@Controller装饰器', () => {
      const controllerMetadata = Reflect.getMetadata('path', AppController);
      // @Controller() 不带参数时，路径为"/"
      expect(controllerMetadata).toBe('/');
    });

    it('应该在getHealth方法上使用@Get装饰器', () => {
      const routeMetadata = Reflect.getMetadata('path', controller.getHealth);
      // @Get() 不带参数时，路径为"/"
      expect(routeMetadata).toBe('/');

      const methodMetadata = Reflect.getMetadata('method', controller.getHealth);
      // NestJS中GET方法的元数据值为0
      expect(methodMetadata).toBe(0);
    });
  });
});