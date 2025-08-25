import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * 获取系统健康状态
   * @returns 健康状态信息
   */
  getHealth() {
    return {
      status: 'ok',
      message: '亮车惠自助洗车系统后端服务运行正常',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}