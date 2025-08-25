import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * 健康检查接口
   * @returns 系统状态信息
   */
  @Get()
  getHealth() {
    return this.appService.getHealth();
  }
}