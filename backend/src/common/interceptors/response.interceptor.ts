import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * 统一响应格式
 */
export interface Response<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * 响应拦截器 - 统一响应格式
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        code: 200,
        message: '操作成功',
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}