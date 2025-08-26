import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AuditLogService } from './audit-log.service';
import { AuditLog } from '../../modules/audit/entities/audit-log.entity';
import { CreateAuditLogDto, AuditLogQueryDto, AuditLogStatsQueryDto } from '../../modules/admin/dto/audit-log.dto';
import { PaginatedResponseDto } from '../dto/response.dto';

/**
 * 审计日志服务单元测试
 */
describe('AuditLogService', () => {
  let service: AuditLogService;
  let repository: Repository<AuditLog>;
  let queryBuilder: SelectQueryBuilder<AuditLog>;

  // 模拟审计日志数据
  const mockAuditLog: AuditLog = {
    id: 1,
    action: 'CREATE',
    resourceType: 'user',
    resourceId: 123,
    userId: 1,
    description: '创建用户',
    oldData: null,
    newData: '{"name":"test"}',
    requestPath: '/api/users',
    requestMethod: 'POST',
    requestData: '{"name":"test"}',
    responseData: '{"id":123}',
    result: 'SUCCESS',
    errorMessage: null,
    duration: 100,
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    createdAt: new Date('2024-01-01'),
    user: {
      id: 1,
      phone: '13800138000',
      password: 'hashedPassword',
      role: 'ADMIN',
      nickname: 'testuser',
    } as any,
  };

  const mockCreateAuditLogDto: CreateAuditLogDto = {
    action: 'CREATE',
    resourceType: 'user',
    resourceId: 123,
    userId: 1,
    userRole: 'admin',
    description: '创建用户',
    requestData: JSON.stringify({ name: 'test' }),
    responseData: JSON.stringify({ id: 123 }),
    status: 'success',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
  };

  const mockQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    getCount: jest.fn(),
    clone: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    setParameters: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
    getQuery: jest.fn(),
    getParameters: jest.fn(),
    limit: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogService,
        {
          provide: getRepositoryToken(AuditLog),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);
    repository = module.get<Repository<AuditLog>>(getRepositoryToken(AuditLog));
    queryBuilder = mockQueryBuilder as any;

    // 重置所有模拟函数
    jest.clearAllMocks();
  });

  it('应该被定义', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('应该成功创建审计日志', async () => {
      const expectedAuditLog = {
        ...mockCreateAuditLogDto,
        requestData: JSON.stringify(mockCreateAuditLogDto.requestData),
        responseData: JSON.stringify(mockCreateAuditLogDto.responseData),
        createdAt: expect.any(Date),
      };

      mockRepository.create.mockReturnValue(expectedAuditLog);
      mockRepository.save.mockResolvedValue(mockAuditLog);

      const result = await service.create(mockCreateAuditLogDto);

      expect(mockRepository.create).toHaveBeenCalledWith(expectedAuditLog);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedAuditLog);
      expect(result).toEqual(mockAuditLog);
    });

    it('应该处理空的请求和响应数据', async () => {
      const dtoWithoutData = {
        ...mockCreateAuditLogDto,
        requestData: null,
        responseData: null,
      };

      const expectedAuditLog = {
        ...dtoWithoutData,
        requestData: null,
        responseData: null,
        createdAt: expect.any(Date),
      };

      mockRepository.create.mockReturnValue(expectedAuditLog);
      mockRepository.save.mockResolvedValue(mockAuditLog);

      await service.create(dtoWithoutData);

      expect(mockRepository.create).toHaveBeenCalledWith(expectedAuditLog);
    });
  });

  describe('createBatch', () => {
    it('应该成功批量创建审计日志', async () => {
      const dtos = [mockCreateAuditLogDto, mockCreateAuditLogDto];
      const expectedAuditLogs = dtos.map(dto => ({
        ...dto,
        requestData: JSON.stringify(dto.requestData),
        responseData: JSON.stringify(dto.responseData),
        createdAt: expect.any(Date),
      }));

      mockRepository.create.mockImplementation((dto) => dto);
      mockRepository.save.mockResolvedValue([mockAuditLog, mockAuditLog]);

      const result = await service.createBatch(dtos);

      expect(mockRepository.create).toHaveBeenCalledTimes(2);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedAuditLogs);
      expect(result).toEqual([mockAuditLog, mockAuditLog]);
    });
  });

  describe('findAll', () => {
    it('应该返回分页的审计日志列表', async () => {
      const queryDto: AuditLogQueryDto = {
        page: 1,
        limit: 10,
        query: 'test',
        action: 'CREATE',
        resource: 'user',
        userId: 1,
        userRole: 'admin',
        status: 'success',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        ipAddress: '192.168.1.1',
      };

      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockAuditLog], 1]);

      const result = await service.findAll(queryDto);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('audit_log');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(audit_log.description LIKE :query OR audit_log.action LIKE :query OR audit_log.resource LIKE :query)',
        { query: '%test%' }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('audit_log.action = :action', { action: 'CREATE' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('audit_log.resource = :resource', { resource: 'user' });
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('audit_log.createdAt', 'DESC');
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(result).toBeInstanceOf(PaginatedResponseDto);
      expect(result.items).toEqual([mockAuditLog]);
      expect(result.total).toBe(1);
    });

    it('应该处理默认分页参数', async () => {
      const queryDto: AuditLogQueryDto = {};

      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockAuditLog], 1]);

      await service.findAll(queryDto);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });
  });

  describe('findOne', () => {
    it('应该返回指定ID的审计日志', async () => {
      mockRepository.findOne.mockResolvedValue(mockAuditLog);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockAuditLog);
    });

    it('应该在审计日志不存在时抛出错误', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('审计日志不存在');
    });
  });

  describe('getStats', () => {
    it('应该返回审计日志统计信息', async () => {
      const queryDto: AuditLogStatsQueryDto = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        dimension: 'daily',
        userId: 1,
        userRole: 'admin',
      };

      mockQueryBuilder.getCount.mockResolvedValueOnce(100).mockResolvedValueOnce(80);
      mockQueryBuilder.getRawMany
        .mockResolvedValueOnce([{ action: 'CREATE', count: '50' }])
        .mockResolvedValueOnce([{ resource: 'user', count: '30' }])
        .mockResolvedValueOnce([{ userId: 1, userRole: 'admin', count: '20' }])
        .mockResolvedValueOnce([{ date: '2024-01-01', count: '10' }]);

      const result = await service.getStats(queryDto);

      expect(result.summary.totalCount).toBe(100);
      expect(result.summary.successCount).toBe(80);
      expect(result.summary.failureCount).toBe(20);
      expect(result.summary.successRate).toBe('80.00');
      expect(result.actionStats).toEqual([{ action: 'CREATE', count: 50 }]);
      expect(result.resourceStats).toEqual([{ resource: 'user', count: 30 }]);
      expect(result.userStats).toEqual([{ userId: 1, userRole: 'admin', count: 20 }]);
      expect(result.timeStats).toEqual([{ time: '2024-01-01', count: 10 }]);
    });

    it('应该处理按小时统计', async () => {
      const queryDto: AuditLogStatsQueryDto = {
        dimension: 'hourly',
      };

      mockQueryBuilder.getCount.mockResolvedValueOnce(50).mockResolvedValueOnce(40);
      mockQueryBuilder.getRawMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ hour: '2024-01-01 10:00:00', count: '5' }]);

      const result = await service.getStats(queryDto);

      expect(result.timeStats).toEqual([{ time: '2024-01-01 10:00:00', count: 5 }]);
    });
  });

  describe('cleanup', () => {
    it('应该清理过期的审计日志', async () => {
      mockQueryBuilder.execute.mockResolvedValue({ affected: 10 });

      const result = await service.cleanup(30);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.delete).toHaveBeenCalled();
      expect(mockQueryBuilder.from).toHaveBeenCalledWith(AuditLog);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'createdAt < :cutoffDate',
        { cutoffDate: expect.any(Date) }
      );
      expect(result.deletedCount).toBe(10);
    });

    it('应该使用默认保留天数', async () => {
      mockQueryBuilder.execute.mockResolvedValue({ affected: 5 });

      const result = await service.cleanup();

      expect(result.deletedCount).toBe(5);
    });
  });

  describe('export', () => {
    it('应该导出符合条件的审计日志', async () => {
      const queryDto: AuditLogQueryDto = {
        query: 'test',
        action: 'CREATE',
        resource: 'user',
      };

      mockQueryBuilder.getMany.mockResolvedValue([mockAuditLog]);

      const result = await service.export(queryDto);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('audit_log');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(audit_log.description LIKE :query OR audit_log.action LIKE :query OR audit_log.resource LIKE :query)',
        { query: '%test%' }
      );
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(10000);
      expect(result).toEqual([mockAuditLog]);
    });
  });

  describe('batchDelete', () => {
    it('应该批量删除审计日志', async () => {
      const ids = [1, 2, 3];
      mockRepository.delete.mockResolvedValue({ affected: 3 });

      const result = await service.batchDelete(ids);

      expect(mockRepository.delete).toHaveBeenCalledWith(ids);
      expect(result.deletedCount).toBe(3);
    });

    it('应该处理删除失败的情况', async () => {
      const ids = [1, 2, 3];
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.batchDelete(ids);

      expect(result.deletedCount).toBe(0);
    });
  });
});