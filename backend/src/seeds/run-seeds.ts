import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { databaseConfig } from '../config/database.config';
import { runSeeds } from './seed';

/**
 * 独立运行种子数据脚本
 */
async function main() {
  console.log('正在连接数据库...');
  
  // 创建数据源
  const dataSource = new DataSource({
    ...databaseConfig(),
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
    migrationsRun: false, // 禁用自动迁移运行
  } as any);

  try {
    // 初始化数据源
    await dataSource.initialize();
    console.log('数据库连接成功');

    // 运行种子数据
    await runSeeds(dataSource);
    
    console.log('种子数据执行完成');
  } catch (error) {
    console.error('种子数据执行失败:', error);
    process.exit(1);
  } finally {
    // 关闭数据库连接
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('数据库连接已关闭');
    }
  }
}

// 运行脚本
if (require.main === module) {
  main();
}