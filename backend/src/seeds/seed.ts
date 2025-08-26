import { DataSource } from 'typeorm';
import { User } from '../modules/user/entities/user.entity';
import { Merchant } from '../modules/merchant/entities/merchant.entity';
import { Device } from '../modules/device/entities/device.entity';
import { Order } from '../modules/order/entities/order.entity';
import { UserRole } from '../common/decorators/roles.decorator';
import * as bcrypt from 'bcryptjs';
/**
 * 数据库种子数据初始化
 */
export class DatabaseSeeder {
  constructor(private dataSource: DataSource) {}

  /**
   * 运行所有种子数据
   */
  async run(): Promise<void> {
    console.log('🌱 开始初始化种子数据...');
    
    // 确保数据库连接
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }

    try {
      await this.seedUsers();
      await this.seedMerchants();
      await this.seedDevices();
      console.log('✅ 种子数据初始化完成!');
    } catch (error) {
      console.error('❌ 种子数据初始化失败:', error);
      throw error;
    }
  }

  /**
   * 创建用户种子数据
   */
  private async seedUsers(): Promise<void> {
    const userRepository = this.dataSource.getRepository(User);
    
    // 检查是否已有用户数据
    const existingUserCount = await userRepository.count();
    if (existingUserCount > 0) {
      console.log('📋 用户数据已存在，跳过用户种子数据创建');
      return;
    }
    
    const users = [
      {
        phone: '13800138001',
        password: await bcrypt.hash('123456', 10),
        role: UserRole.USER,
        nickname: '测试用户1',
        balance: 10000, // 100元
      },
      {
        phone: '13800138002', 
        password: await bcrypt.hash('123456', 10),
        role: UserRole.USER,
        nickname: '测试用户2',
        balance: 5000, // 50元
      },
      {
        phone: '13800138003',
        password: await bcrypt.hash('123456', 10),
        role: UserRole.PLATFORM_ADMIN,
        nickname: '平台管理员',
        balance: 0,
      },
    ];

    for (const userData of users) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
    }

    console.log('✅ 用户种子数据创建完成');
  }

  /**
   * 创建商户种子数据
   */
  private async seedMerchants(): Promise<void> {
    const merchantRepository = this.dataSource.getRepository(Merchant);
    
    // 检查是否已有商户数据
    const existingMerchantCount = await merchantRepository.count();
    if (existingMerchantCount > 0) {
      console.log('📋 商户数据已存在，跳过商户种子数据创建');
      return;
    }

    const merchants = [
      {
        name: '亮车惠洗车店（测试店）',
        code: 'LCH001',
        contact: '张经理',
        phone: '13800138003',
        address: '北京市朝阳区测试路123号',
        longitude: 116.397128,
        latitude: 39.916527,
        status: 'active' as const,
        shareRatio: 70.00,
        description: '测试商户，提供优质洗车服务',
        businessHours: '08:00-20:00',
      },
      {
        name: '快洗车服务中心',
        code: 'KXC001',
        contact: '李经理',
        phone: '13800138005',
        address: '上海市浦东新区测试大道456号',
        longitude: 121.505269,
        latitude: 31.245944,
        status: 'active' as const,
        shareRatio: 75.00,
        description: '快速洗车，专业服务',
        businessHours: '07:00-22:00',
      },
    ];

    await merchantRepository.save(merchants);
    console.log('✅ 商户种子数据创建完成');
  }

  /**
   * 创建设备种子数据
   */
  private async seedDevices(): Promise<void> {
    const deviceRepository = this.dataSource.getRepository(Device);
    const merchantRepository = this.dataSource.getRepository(Merchant);
    
    // 检查是否已有设备数据
    const existingDeviceCount = await deviceRepository.count();
    if (existingDeviceCount > 0) {
      console.log('📋 设备数据已存在，跳过设备种子数据创建');
      return;
    }
    
    // 获取商户
    const merchants = await merchantRepository.find();
    if (merchants.length === 0) {
      console.log('⚠️ 没有找到商户，跳过设备种子数据创建');
      return;
    }

    const devices = [
      {
        devid: 'LCH001_001',
        name: '1号洗车机',
        model: 'WashBot-Pro-2024',
        status: 'online' as const,
        iccid: '89860000000000000001',
        config: {
          washTypes: ['basic', 'premium', 'deluxe'],
          maxPressure: 150,
          waterCapacity: 500,
        },
        location: '北京市朝阳区测试路123号-A区',
        longitude: 116.397128,
        latitude: 39.916527,
        lastOnlineAt: new Date(),
        version: 'v2.1.0',
        merchantId: merchants[0].id,
      },
      {
        devid: 'LCH001_002',
        name: '2号洗车机',
        model: 'WashBot-Standard-2024',
        status: 'offline' as const,
        iccid: '89860000000000000002',
        config: {
          washTypes: ['basic', 'premium'],
          maxPressure: 120,
          waterCapacity: 300,
        },
        location: '北京市朝阳区测试路123号-B区',
        longitude: 116.397200,
        latitude: 39.916600,
        lastOfflineAt: new Date(Date.now() - 3600000), // 1小时前离线
        version: 'v2.0.5',
        merchantId: merchants[0].id,
      },
      {
        devid: 'KXC001_001',
        name: '快洗1号机',
        model: 'QuickWash-Pro-2024',
        status: 'online' as const,
        iccid: '89860000000000000003',
        config: {
          washTypes: ['basic', 'premium', 'deluxe'],
          maxPressure: 180,
          waterCapacity: 600,
        },
        location: '上海市浦东新区测试大道456号-1号位',
        longitude: 121.505269,
        latitude: 31.245944,
        lastOnlineAt: new Date(),
        version: 'v2.2.0',
        merchantId: merchants[1]?.id || merchants[0].id,
      },
    ];

    await deviceRepository.save(devices);
    console.log('✅ 设备种子数据创建完成');
  }
}

/**
 * 运行种子数据脚本
 */
export async function runSeeds(dataSource: DataSource) {
  try {
    const seeder = new DatabaseSeeder(dataSource);
    await seeder.run();
  } catch (error) {
    console.error('种子数据初始化失败:', error.message);
    throw error;
  }
}