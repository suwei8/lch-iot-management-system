import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { WinstonModule } from 'nest-winston';
import { createLogger } from './common/logger/logger.config';

async function bootstrap() {
  // 创建应用实例，使用Winston日志
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(createLogger()),
  });

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 自动转换类型
      whitelist: true, // 过滤掉DTO中未定义的属性
      forbidNonWhitelisted: true, // 如果有未定义属性则抛出错误
    }),
  );

  // 全局异常过滤器
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 启用CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // 设置全局路由前缀
  app.setGlobalPrefix('api/v1');

  // 监听端口
  await app.listen(8000);
  console.log('🚀 亮车惠后端服务已启动，端口: 8000');
}

bootstrap();