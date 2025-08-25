import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { AuditLogService } from '../../common/services/audit-log.service';
import {
  AuditLogQueryDto,
  AuditLogStatsQueryDto,
} from './dto/audit-log.dto';
import { PaginatedResponseDto } from '../../common/dto/response.dto';
import { BatchIdDto } from '../../common/dto/validation.dto';

@ApiTags('审计日志管理')
@ApiBearerAuth()
@Controller('admin/audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(UserRole.PLATFORM_ADMIN)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  /**
   * 获取审计日志列表
   */
  @Get()
  @RequirePermissions(Permission.AUDIT_LOG_READ)
  @ApiOperation({ summary: '获取审计日志列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getAuditLogs(@Query() queryDto: AuditLogQueryDto) {
    return this.auditLogService.findAll(queryDto);
  }

  /**
   * 获取审计日志详情
   */
  @Get(':id')
  @RequirePermissions(Permission.AUDIT_LOG_READ)
  @ApiOperation({ summary: '获取审计日志详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getAuditLog(@Param('id', ParseIntPipe) id: number) {
    return this.auditLogService.findOne(id);
  }

  /**
   * 获取审计日志统计
   */
  @Get('stats/overview')
  @RequirePermissions(Permission.AUDIT_LOG_READ)
  @ApiOperation({ summary: '获取审计日志统计' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getAuditLogStats(@Query() queryDto: AuditLogStatsQueryDto) {
    return this.auditLogService.getStats(queryDto);
  }

  /**
   * 导出审计日志
   */
  @Post('export')
  @RequirePermissions(Permission.AUDIT_LOG_READ)
  @ApiOperation({ summary: '导出审计日志' })
  @ApiResponse({ status: 200, description: '导出成功' })
  async exportAuditLogs(@Body() queryDto: AuditLogQueryDto) {
    return this.auditLogService.export(queryDto);
  }

  /**
   * 批量删除审计日志
   */
  @Delete('batch')
  @RequirePermissions(Permission.AUDIT_LOG_DELETE)
  @ApiOperation({ summary: '批量删除审计日志' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async batchDeleteAuditLogs(@Body() batchIdDto: BatchIdDto) {
    return this.auditLogService.batchDelete(batchIdDto.ids);
  }

  /**
   * 清理过期审计日志
   */
  @Post('cleanup')
  @RequirePermissions(Permission.AUDIT_LOG_DELETE)
  @ApiOperation({ summary: '清理过期审计日志' })
  @ApiResponse({ status: 200, description: '清理成功' })
  async cleanupExpiredLogs(@Body() body: { days: number }) {
    return this.auditLogService.cleanup(body.days);
  }
}