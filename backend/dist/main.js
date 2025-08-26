"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const nest_winston_1 = require("nest-winston");
const logger_config_1 = require("./common/logger/logger.config");
const typeorm_1 = require("typeorm");
const seed_1 = require("./seeds/seed");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: nest_winston_1.WinstonModule.createLogger((0, logger_config_1.createLogger)()),
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.setGlobalPrefix('api/v1');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('IoT数据管理平台 API')
        .setDescription('物联网数据管理平台的RESTful API文档')
        .setVersion('1.0.0')
        .setContact('API支持', 'https://iot-platform.com', 'support@iot-platform.com')
        .setLicense('MIT', 'https://opensource.org/licenses/MIT')
        .addServer('http://localhost:3000', '开发环境')
        .addServer('https://api.iot-platform.com', '生产环境')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'JWT认证令牌',
        in: 'header',
    }, 'JWT-auth')
        .addApiKey({
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'API密钥认证'
    }, 'API-Key')
        .addTag('Auth', '认证相关接口')
        .addTag('Users', '用户管理接口')
        .addTag('Merchants', '商户管理接口')
        .addTag('Devices', '设备管理接口')
        .addTag('Data', '数据管理接口')
        .addTag('Analytics', '数据分析接口')
        .addTag('Reports', '报表管理接口')
        .addTag('Settings', '系统设置接口')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config, {
        operationIdFactory: (controllerKey, methodKey) => methodKey,
        deepScanRoutes: true,
    });
    swagger_1.SwaggerModule.setup('api-docs', app, document, {
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
    await app.listen(8000);
    console.log('🚀 亮车惠后端服务已启动，端口: 8000');
    console.log(`📚 Swagger文档地址: http://localhost:8000/api-docs`);
    console.log(`📄 API规范JSON: http://localhost:8000/api-docs-json`);
    if (process.env.NODE_ENV !== 'production') {
        try {
            const dataSource = app.get(typeorm_1.DataSource);
            await (0, seed_1.runSeeds)(dataSource);
            console.log('✅ 种子数据初始化完成');
        }
        catch (error) {
            console.warn('⚠️ 种子数据初始化失败:', error.message);
        }
    }
}
bootstrap();
//# sourceMappingURL=main.js.map