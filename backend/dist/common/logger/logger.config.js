"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const winston = require("winston");
const createLogger = () => {
    const logFormat = winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.errors({ stack: true }), winston.format.json(), winston.format.printf(({ timestamp, level, message, stack, context }) => {
        return `${timestamp} [${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}${stack ? `\n${stack}` : ''}`;
    }));
    return {
        transports: [
            new winston.transports.Console({
                level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
                format: winston.format.combine(winston.format.colorize(), logFormat),
            }),
            new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
                format: logFormat,
                maxsize: 5242880,
                maxFiles: 5,
            }),
            new winston.transports.File({
                filename: 'logs/combined.log',
                format: logFormat,
                maxsize: 5242880,
                maxFiles: 5,
            }),
        ],
    };
};
exports.createLogger = createLogger;
//# sourceMappingURL=logger.config.js.map