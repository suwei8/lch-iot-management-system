import * as winston from 'winston';
import { WinstonModuleOptions } from 'nest-winston';

/**
 * 创建Winston日志配置
 */
export const createLogger = (): WinstonModuleOptions => {
  const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, stack, context }) => {
      return `${timestamp} [${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}${stack ? `\n${stack}` : ''}`;
    }),
  );

  return {
    transports: [
      // 控制台输出
      new winston.transports.Console({
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        format: winston.format.combine(
          winston.format.colorize(),
          logFormat,
        ),
      }),
      // 错误日志文件
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
      // 所有日志文件
      new winston.transports.File({
        filename: 'logs/combined.log',
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
    ],
  };
};