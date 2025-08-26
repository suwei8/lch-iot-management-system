import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E测试配置
 * 配置测试环境、浏览器和测试选项
 */
export default defineConfig({
  // 测试文件目录
  testDir: './tests/e2e',
  
  // 全局测试超时时间（60秒）
  timeout: 60 * 1000,
  
  // 断言超时时间（10秒）
  expect: {
    timeout: 10000,
  },
  
  // 测试失败时重试次数
  retries: process.env.CI ? 2 : 1,
  
  // 并行执行的worker数量
  workers: process.env.CI ? 1 : undefined,
  
  // 测试报告配置
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
  ],
  
  // 全局测试配置
  use: {
    // 基础URL - 前端应用地址
    baseURL: 'http://localhost:3000',
    
    // 浏览器上下文选项
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // 等待网络空闲时间
    actionTimeout: 15000,
    
    // 导航超时时间
    navigationTimeout: 30000,
  },
  
  // 浏览器项目配置
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  
  // 开发服务器配置
  webServer: {
    command: 'npm start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});