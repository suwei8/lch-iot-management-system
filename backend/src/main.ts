import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { WinstonModule } from 'nest-winston';
import { createLogger } from './common/logger/logger.config';
import { DataSource } from 'typeorm';
import { runSeeds } from './seeds/seed';

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

  // 配置Swagger文档
  const config = new DocumentBuilder()
    .setTitle('IoT数据管理平台 API')
    .setDescription('物联网数据管理平台的RESTful API文档')
    .setVersion('1.0.0')
    .setContact('API支持', 'https://iot-platform.com', 'support@iot-platform.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', '开发环境')
    .addServer('https://api.iot-platform.com', '生产环境')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'JWT认证令牌',
        in: 'header',
      },
      'JWT-auth'
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'API密钥认证'
      },
      'API-Key'
    )
    .addTag('Auth', '认证相关接口')
    .addTag('Users', '用户管理接口')
    .addTag('Merchants', '商户管理接口')
    .addTag('Devices', '设备管理接口')
    .addTag('Data', '数据管理接口')
    .addTag('Analytics', '数据分析接口')
    .addTag('Reports', '报表管理接口')
    .addTag('Settings', '系统设置接口')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    deepScanRoutes: true,
  });

  // 设置Swagger UI
  SwaggerModule.setup('api-docs', app, document, {
    explorer: true,
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      showCommonExtensions: true,
      tryItOutEnabled: true,
      persistAuthorization: true,
      displayOperationId: false,
      displayRequestDuration: true
    },
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #1890ff; font-size: 2em; }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 15px; border-radius: 5px; }
      .swagger-ui .opblock.opblock-post { border-color: #49cc90; }
      .swagger-ui .opblock.opblock-get { border-color: #61affe; }
      .swagger-ui .opblock.opblock-put { border-color: #fca130; }
      .swagger-ui .opblock.opblock-delete { border-color: #f93e3e; }
    `,
    customSiteTitle: 'IoT平台 API文档',
    customfavIcon: '/favicon.ico',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
  });

  // 监听端口
  await app.listen(8000);
  console.log('🚀 亮车惠后端服务已启动，端口: 8000');
  console.log(`📚 Swagger文档地址: http://localhost:8000/api-docs`);
  console.log(`📄 API规范JSON: http://localhost:8000/api-docs-json`);

  // 初始化种子数据（仅在开发环境）
  if (process.env.NODE_ENV !== 'production') {
    try {
      const dataSource = app.get(DataSource);
      await runSeeds(dataSource);
      console.log('✅ 种子数据初始化完成');
    } catch (error) {
      console.warn('⚠️ 种子数据初始化失败:', error.message);
    }
  }
}

bootstrap();