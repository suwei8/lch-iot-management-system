import { test, expect } from '@playwright/test';

/**
 * 商户登录E2E测试
 * 测试商户账号登录流程和后台页面渲染
 */
test.describe('商户登录测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问登录页面
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // 等待页面完全加载
    await page.waitForTimeout(2000);
  });

  test('商户账号登录成功并显示后台页面', async ({ page }) => {
    // 等待登录页面加载完成
    await expect(page.locator('h1')).toContainText('亮车惠IoT管理系统');
    
    // 点击商户登录标签并等待标签激活
    await page.waitForSelector('.ant-tabs-tab:has-text("商户登录")', { state: 'visible' });
    await page.click('.ant-tabs-tab:has-text("商户登录")');
    
    // 等待商户登录表单完全加载并可见
    await page.waitForSelector('form[name="merchant-login"]', { state: 'visible', timeout: 30000 });
    
    // 等待手机号输入框可见并输入商户手机号（使用数据库中的测试商户）
    const phoneInput = page.locator('form[name="merchant-login"] input[placeholder="请输入手机号"]');
    await phoneInput.waitFor({ state: 'visible', timeout: 10000 });
    await phoneInput.fill('13800138005');
    
    // 等待密码输入框可见并输入
    const passwordInput = page.locator('form[name="merchant-login"] input[placeholder="请输入密码"]');
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await passwordInput.fill('123456');
    
    // 点击登录按钮
    const loginButton = page.locator('form[name="merchant-login"] button.login-button');
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton.click();
    
    // 等待登录成功，页面跳转
    await page.waitForURL('**/merchant/**', { timeout: 45000 });
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 验证商户后台页面元素
    await expect(page.locator('.ant-layout-sider')).toBeVisible();
    await expect(page.locator('.ant-menu')).toBeVisible();
    
    // 验证侧边栏菜单项
    await expect(page.locator('text=仪表板')).toBeVisible();
    await expect(page.locator('text=门店管理')).toBeVisible();
    await expect(page.locator('text=订单管理')).toBeVisible();
    await expect(page.locator('text=设备管理')).toBeVisible();
    
    // 验证主内容区域
    await expect(page.locator('.ant-layout-content')).toBeVisible();
    
    // 验证页面标题
    await expect(page).toHaveTitle(/商户后台/);
  });

  test('使用演示账户快速登录商户', async ({ page }) => {
    // 等待登录页面加载完成
    await expect(page.locator('h1')).toContainText('亮车惠IoT管理系统');
    
    // 点击商户登录标签并等待标签激活
    await page.waitForSelector('.ant-tabs-tab:has-text("商户登录")', { state: 'visible' });
    await page.click('.ant-tabs-tab:has-text("商户登录")');
    
    // 等待商户登录表单完全加载并可见
    await page.waitForSelector('form[name="merchant-login"]', { state: 'visible', timeout: 15000 });
    
    // 等待演示账号登录按钮出现并点击
    const demoButton = page.locator('form[name="merchant-login"] .demo-login button:has-text("使用演示账号登录")');
    await demoButton.waitFor({ state: 'visible', timeout: 15000 });
    await demoButton.click();
    
    // 等待登录成功，页面跳转
    await page.waitForURL('**/merchant/**', { timeout: 20000 });
    
    // 验证登录成功
    await expect(page.locator('.ant-layout-sider')).toBeVisible();
    await expect(page.locator('text=仪表板')).toBeVisible();
  });

  test('商户登录后可以访问各个功能模块', async ({ page }) => {
    // 使用演示账户快速登录
    await page.waitForSelector('.ant-tabs-tab:has-text("商户登录")', { state: 'visible' });
    await page.click('.ant-tabs-tab:has-text("商户登录")');
    
    // 等待商户登录表单出现
    await page.waitForSelector('form[name="merchant-login"]', { state: 'visible', timeout: 15000 });
    
    // 等待演示账号登录按钮出现并点击
    const demoButton = page.locator('form[name="merchant-login"] .demo-login button:has-text("使用演示账号登录")');
    await demoButton.waitFor({ state: 'visible', timeout: 15000 });
    await demoButton.click();
    await page.waitForURL('**/merchant/**', { timeout: 20000 });
    
    // 测试门店管理页面
    await page.click('text=门店管理');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=门店列表')).toBeVisible();
    
    // 测试订单管理页面
    await page.click('text=订单管理');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=订单列表')).toBeVisible();
    
    // 测试设备管理页面
    await page.click('text=设备管理');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=设备列表')).toBeVisible();
    
    // 返回仪表板
    await page.click('text=仪表板');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=数据统计')).toBeVisible();
  });

  test('商户登录失败处理', async ({ page }) => {
    // 点击商户登录标签
    await page.waitForSelector('.ant-tabs-tab:has-text("商户登录")', { state: 'visible' });
    await page.click('.ant-tabs-tab:has-text("商户登录")');
    
    // 等待商户登录表单完全加载并可见
    await page.waitForSelector('form[name="merchant-login"]', { state: 'visible', timeout: 15000 });
    
    // 等待手机号输入框可见并输入错误的手机号
    const phoneInput = page.locator('form[name="merchant-login"] input[placeholder="请输入手机号"]');
    await phoneInput.waitFor({ state: 'visible', timeout: 10000 });
    await phoneInput.fill('12345678901');
    
    // 等待密码输入框可见并输入错误的密码
    const passwordInput = page.locator('form[name="merchant-login"] input[placeholder="请输入密码"]');
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await passwordInput.fill('wrongpassword');
    
    // 点击登录按钮
    const loginButton = page.locator('form[name="merchant-login"] button.login-button');
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton.click();
    
    // 等待错误提示
    await page.waitForTimeout(3000);
    
    // 验证仍在登录页面
    await expect(page.locator('h1')).toContainText('亮车惠IoT管理系统');
  });

  test('商户后台页面响应式布局测试', async ({ page }) => {
    // 使用演示账户登录
    await page.waitForSelector('.ant-tabs-tab:has-text("商户登录")', { state: 'visible' });
    await page.click('.ant-tabs-tab:has-text("商户登录")');
    
    // 等待商户登录表单完全加载并可见
    await page.waitForSelector('form[name="merchant-login"]', { state: 'visible', timeout: 15000 });
    
    // 等待演示账号登录按钮出现并点击
    const demoButton = page.locator('form[name="merchant-login"] .demo-login button:has-text("使用演示账号登录")');
    await demoButton.waitFor({ state: 'visible', timeout: 15000 });
    await demoButton.click();
    await page.waitForURL('**/merchant/**', { timeout: 20000 });
    
    // 测试桌面端布局
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('.ant-layout-sider')).toBeVisible();
    
    // 测试平板端布局
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    // 测试移动端布局
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // 恢复桌面端布局
    await page.setViewportSize({ width: 1200, height: 800 });
  });
});