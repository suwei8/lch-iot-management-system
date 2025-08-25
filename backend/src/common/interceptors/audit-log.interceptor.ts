import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../modules/audit/entities/audit-log.entity';
import { AUDIT_LOG_KEY } from '../decorators/audit-log.decorator';

/**
 * 审计日志拦截器
 * 自动记录标记了@AuditLog装饰器的操作
 */
@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditConfig = this.reflector.get<{
      action: string;
      resource: string;
      description?: string;
    }>(AUDIT_LOG_KEY, context.getHandler());

    if (!auditConfig) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const startTime = Date.now();

    // 获取请求信息
    const requestInfo = {
      method: request.method,
      url: request.url,
      params: request.params,
      query: request.query,
      body: this.sanitizeBody(request.body),
      ip: this.getClientIp(request),
      userAgent: request.get('User-Agent') || '',
    };

    return next.handle().pipe(
      tap(async (response) => {
        // 操作成功
        await this.createAuditLog({
          ...auditConfig,
          userId: user?.id,
          userRole: user?.role,
          status: 'success',
          requestInfo,
          responseData: this.sanitizeResponse(response),
          duration: Date.now() - startTime,
          error: null,
        });
      }),
      catchError(async (error) => {
        // 操作失败
        await this.createAuditLog({
          ...auditConfig,
          userId: user?.id,
          userRole: user?.role,
          status: 'failure',
          requestInfo,
          responseData: null,
          duration: Date.now() - startTime,
          error: {
            message: error.message,
            stack: error.stack,
            code: error.code || error.status,
          },
        });
        throw error;
      }),
    );
  }

  /**
   * 创建审计日志记录
   */
  private async createAuditLog(data: {
    action: string;
    resource: string;
    description?: string;
    userId?: number;
    userRole?: string;
    status: 'success' | 'failure';
    requestInfo: any;
    responseData: any;
    duration: number;
    error: any;
  }) {
    try {
      const auditLog = this.auditLogRepository.create({
        action: data.action,
        resourceType: data.resource,
        resourceId: this.extractResourceId(data.requestInfo),
        description: data.description || `${data.action} ${data.resource}`,
        userId: data.userId,
        ipAddress: data.requestInfo.ip,
        userAgent: data.requestInfo.userAgent,
        requestData: JSON.stringify(data.requestInfo),
        responseData: JSON.stringify(data.responseData),
        result: data.status === 'success' ? 'SUCCESS' : 'FAILED',
        duration: data.duration,
        errorMessage: data.error ? JSON.stringify(data.error) : null,
      });

      await this.auditLogRepository.save(auditLog);
    } catch (error) {
      // 审计日志记录失败不应影响主业务流程
      console.error('Failed to create audit log:', error);
    }
  }

  /**
   * 提取资源ID
   */
  private extractResourceId(requestInfo: any): number | null {
    // 从URL参数中提取ID
    if (requestInfo.params?.id) {
      return parseInt(requestInfo.params.id, 10);
    }

    // 从请求体中提取ID
    if (requestInfo.body?.id) {
      return parseInt(requestInfo.body.id, 10);
    }

    // 从查询参数中提取ID
    if (requestInfo.query?.id) {
      return parseInt(requestInfo.query.id, 10);
    }

    return null;
  }

  /**
   * 清理请求体，移除敏感信息
   */
  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***';
      }
    }

    return sanitized;
  }

  /**
   * 清理响应数据，移除敏感信息
   */
  private sanitizeResponse(response: any): any {
    if (!response || typeof response !== 'object') {
      return response;
    }

    // 如果响应数据过大，只保留基本信息
    const responseStr = JSON.stringify(response);
    if (responseStr.length > 10000) {
      return {
        message: 'Response data too large, truncated',
        dataType: Array.isArray(response) ? 'array' : typeof response,
        size: responseStr.length,
      };
    }

    const sanitized = { ...response };
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***';
      }
    }

    return sanitized;
  }

  /**
   * 获取客户端IP地址
   */
  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for'] ||
      request.headers['x-real-ip'] ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.ip ||
      ''
    ).split(',')[0].trim();
  }
}