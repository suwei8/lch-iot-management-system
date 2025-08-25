import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Repository } from 'typeorm';
import { AuditLog } from '../../modules/audit/entities/audit-log.entity';
export declare class AuditLogInterceptor implements NestInterceptor {
    private reflector;
    private auditLogRepository;
    constructor(reflector: Reflector, auditLogRepository: Repository<AuditLog>);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private createAuditLog;
    private extractResourceId;
    private sanitizeBody;
    private sanitizeResponse;
    private getClientIp;
}
