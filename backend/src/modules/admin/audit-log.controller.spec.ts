import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogController } from './audit-log.controller';
import { AuditLogService } from '../../common/services/audit-log.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import {
  AuditLogQueryDto,
  AuditLogStatsQueryDto,
} from './dto/audit-log.dto';
import { BatchIdDto } from '../../common/dto/validation.dto';

describe('AuditLogController', () => {
  let controller: AuditLogController;
  let auditLogService: AuditLogService;

  const mockAuditLogService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    getStats: jest.fn(),
    export: jest.fn(),
    batchDelete: jest.fn(),
    cleanup: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRolesGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockPermissionsGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditLogController],
      providers: [
        {
          provide: AuditLogService,
          useValue: mockAuditLogService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .overrideGuard(PermissionsGuard)
      .useValue(mockPermissionsGuard)
      .compile();

    controller = module.get<AuditLogController>(AuditLogController);
    auditLogService = module.get<AuditLogService>(AuditLogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAuditLogs', () => {
    it('should return paginated audit logs', async () => {
      const queryDto: AuditLogQueryDto = {
        page: 1,
        limit: 10,
        action: 'CREATE',
        startDate: '2023-12-01',
        endDate: '2023-12-31',
      };

      const mockAuditLogs = {
        data: [
          {
            id: 1,
            action: 'CREATE',
            resource: 'User',
            resourceId: '1',
            userId: 1,
            userRole: 'admin',
            ip: '127.0.0.1',
            userAgent: 'Mozilla/5.0',
            details: { name: '新用户' },
            createdAt: new Date(),
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockAuditLogService.findAll.mockResolvedValue(mockAuditLogs);

      const result = await controller.getAuditLogs(queryDto);

      expect(auditLogService.findAll).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(mockAuditLogs);
    });

    it('should handle empty query parameters', async () => {
      const queryDto: AuditLogQueryDto = {};
      const mockAuditLogs = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockAuditLogService.findAll.mockResolvedValue(mockAuditLogs);

      const result = await controller.getAuditLogs(queryDto);

      expect(auditLogService.findAll).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(mockAuditLogs);
    });
  });

  describe('getAuditLog', () => {
    it('should return audit log by id', async () => {
      const mockAuditLog = {
        id: 1,
        action: 'UPDATE',
        resource: 'User',
        resourceId: '1',
        userId: 1,
        userRole: 'admin',
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        details: { oldValue: '旧值', newValue: '新值' },
        createdAt: new Date(),
      };

      mockAuditLogService.findOne.mockResolvedValue(mockAuditLog);

      const result = await controller.getAuditLog(1);

      expect(auditLogService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAuditLog);
    });

    it('should handle non-existent audit log', async () => {
      mockAuditLogService.findOne.mockResolvedValue(null);

      const result = await controller.getAuditLog(999);

      expect(auditLogService.findOne).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('getAuditLogStats', () => {
    it('should return audit log statistics', async () => {
      const queryDto: AuditLogStatsQueryDto = {
        startDate: '2023-12-01',
        endDate: '2023-12-31',
      };

      const mockStats = {
        totalLogs: 1000,
        actionStats: {
          CREATE: 300,
          UPDATE: 400,
          DELETE: 200,
          LOGIN: 100,
        },
        userStats: {
          admin: 500,
          merchant: 300,
          user: 200,
        },
        dailyStats: [
          { date: '2023-12-01', count: 50 },
          { date: '2023-12-02', count: 45 },
        ],
      };

      mockAuditLogService.getStats.mockResolvedValue(mockStats);

      const result = await controller.getAuditLogStats(queryDto);

      expect(auditLogService.getStats).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(mockStats);
    });
  });

  describe('exportAuditLogs', () => {
    it('should export audit logs successfully', async () => {
      const queryDto: AuditLogQueryDto = {
        action: 'CREATE',
        startDate: '2023-12-01',
        endDate: '2023-12-31',
      };

      const mockExportResult = {
        success: true,
        message: '审计日志导出成功',
        data: {
          fileName: 'audit_logs_20231201_20231231.xlsx',
          downloadUrl: '/downloads/audit_logs_20231201_20231231.xlsx',
          recordCount: 500,
        },
      };

      mockAuditLogService.export.mockResolvedValue(mockExportResult);

      const result = await controller.exportAuditLogs(queryDto);

      expect(auditLogService.export).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(mockExportResult);
    });

    it('should handle export with no data', async () => {
      const queryDto: AuditLogQueryDto = {
        action: 'NONEXISTENT',
      };

      const mockExportResult = {
        success: false,
        message: '没有符合条件的审计日志',
        data: null,
      };

      mockAuditLogService.export.mockResolvedValue(mockExportResult);

      const result = await controller.exportAuditLogs(queryDto);

      expect(auditLogService.export).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(mockExportResult);
    });
  });

  describe('batchDeleteAuditLogs', () => {
    it('should batch delete audit logs successfully', async () => {
      const batchIdDto: BatchIdDto = {
        ids: [1, 2, 3, 4, 5],
      };

      const mockDeleteResult = {
        success: true,
        message: '批量删除审计日志成功',
        data: {
          deletedCount: 5,
          failedIds: [],
        },
      };

      mockAuditLogService.batchDelete.mockResolvedValue(mockDeleteResult);

      const result = await controller.batchDeleteAuditLogs(batchIdDto);

      expect(auditLogService.batchDelete).toHaveBeenCalledWith(batchIdDto.ids);
      expect(result).toEqual(mockDeleteResult);
    });

    it('should handle partial deletion failure', async () => {
      const batchIdDto: BatchIdDto = {
        ids: [1, 2, 999, 4, 5],
      };

      const mockDeleteResult = {
        success: true,
        message: '部分审计日志删除成功',
        data: {
          deletedCount: 4,
          failedIds: [999],
        },
      };

      mockAuditLogService.batchDelete.mockResolvedValue(mockDeleteResult);

      const result = await controller.batchDeleteAuditLogs(batchIdDto);

      expect(auditLogService.batchDelete).toHaveBeenCalledWith(batchIdDto.ids);
      expect(result).toEqual(mockDeleteResult);
    });

    it('should handle empty ids array', async () => {
      const batchIdDto: BatchIdDto = {
        ids: [],
      };

      const mockDeleteResult = {
        success: false,
        message: '没有提供要删除的审计日志ID',
        data: null,
      };

      mockAuditLogService.batchDelete.mockResolvedValue(mockDeleteResult);

      const result = await controller.batchDeleteAuditLogs(batchIdDto);

      expect(auditLogService.batchDelete).toHaveBeenCalledWith(batchIdDto.ids);
      expect(result).toEqual(mockDeleteResult);
    });
  });

  describe('cleanupExpiredLogs', () => {
    it('should cleanup expired logs successfully', async () => {
      const cleanupBody = { days: 90 };

      const mockCleanupResult = {
        success: true,
        message: '过期审计日志清理成功',
        data: {
          deletedCount: 1500,
          cutoffDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        },
      };

      mockAuditLogService.cleanup.mockResolvedValue(mockCleanupResult);

      const result = await controller.cleanupExpiredLogs(cleanupBody);

      expect(auditLogService.cleanup).toHaveBeenCalledWith(cleanupBody.days);
      expect(result).toEqual(mockCleanupResult);
    });

    it('should handle cleanup with no expired logs', async () => {
      const cleanupBody = { days: 30 };

      const mockCleanupResult = {
        success: true,
        message: '没有找到过期的审计日志',
        data: {
          deletedCount: 0,
          cutoffDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      };

      mockAuditLogService.cleanup.mockResolvedValue(mockCleanupResult);

      const result = await controller.cleanupExpiredLogs(cleanupBody);

      expect(auditLogService.cleanup).toHaveBeenCalledWith(cleanupBody.days);
      expect(result).toEqual(mockCleanupResult);
    });

    it('should handle invalid days parameter', async () => {
      const cleanupBody = { days: -1 };

      const mockCleanupResult = {
        success: false,
        message: '清理天数必须大于0',
        data: null,
      };

      mockAuditLogService.cleanup.mockResolvedValue(mockCleanupResult);

      const result = await controller.cleanupExpiredLogs(cleanupBody);

      expect(auditLogService.cleanup).toHaveBeenCalledWith(cleanupBody.days);
      expect(result).toEqual(mockCleanupResult);
    });
  });
});