import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
export declare const databaseConfig: () => TypeOrmModuleOptions;
export declare const AppDataSource: DataSource;
