"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const nest_winston_1 = require("nest-winston");
const logger_config_1 = require("./common/logger/logger.config");
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
    await app.listen(8000);
    console.log('🚀 亮车惠后端服务已启动，端口: 8000');
}
bootstrap();
//# sourceMappingURL=main.js.map