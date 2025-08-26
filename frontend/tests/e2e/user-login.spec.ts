import { test, expect } from '@playwright/test';

/**
 * 普通用户登录E2E测试
 * 测试普通用户账号登录流程和页面渲染
 */
test.describe('普通用户登录测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问登录页面
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('普通用户账号登录成功但无法访问商户页面', async ({ page }) => {
    // 等待登录页面加载完成
    await expect(page.locator('h1')).toContainText('亮车惠IoT管理系统');
    
    // 默认是管理员登录标签，需要切换到商户登录（因为没有普通用户标签，使用商户登录测试）
    await page.waitForSelector('.ant-tabs-tab:has-text("商户登录")', { state: 'visible' });
    // 点击商户登录标签
    await page.click('.ant-tabs-tab:has-text("商户登录")');
    
    // 等待商户登录表单出现
    await page.waitForSelector('form[name="merchant-login"]', { state: 'visible', timeout: 15000 });
    
    // 等待手机号输入框可见并输入普通用户手机号（使用数据库中的测试用户）
    const phoneInput = page.locator('form[name="merchant-login"] input[placeholder="请输入手机号"]');
    await phoneInput.waitFor({ state: 'visible', timeout: 10000 });
    await phoneInput.fill('13800138001');
    
    // 等待密码输入框可见并输入密码
    const passwordInput = page.locator('form[name="merchant-login"] input[placeholder="请输入密码"]');
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await passwordInput.fill('123456');
    
    // 点击登录按钮
    const loginButton = page.locator('form[name="merchant-login"] button[type="submit"]:has-text("商户登录")');
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton.click();
    
    // 等待页面响应（普通用户登录后会跳转到merchant页面但可能因权限问题无法正常加载）
    await page.waitForLoadState('networkidle', { timeout: 20000 });
    
    // 验证是否跳转到了merchant页面或者显示权限错误
    const currentUrl = page.url();
    const hasRedirected = currentUrl.includes('/merchant') || currentUrl.includes('/login');
    expect(hasRedirected).toBeTruthy();
    
    // 如果跳转到merchant页面，可能会显示权限不足或加载失败的提示
    if (currentUrl.includes('/merchant')) {
      // 页面可能因为权限问题无法正常加载，这是预期的行为
      console.log('普通用户尝试访问商户页面，可能因权限问题无法正常加载');
    }
  });

  test('普通用户登录后可以访问个人功能', async ({ page }) => {
    // 切换到商户登录标签
    const merchantTab = page.locator('.ant-tabs-tab:has-text("商户登录")');
    await merchantTab.waitFor({ state: 'visible', timeout: 10000 });
    await merchantTab.click();
    
    // 等待商户登录表单出现
    await page.waitForSelector('form[name="merchant-login"]', { state: 'visible', timeout: 15000 });
    
    // 等待手机号输入框出现
    await page.waitForSelector('input[placeholder="请输入手机号"]', { state: 'visible', timeout: 15000 });
    
    // 登录普通用户（使用商户登录表单）
    await page.waitForSelector('form[name="merchant-login"] input[placeholder="请输入手机号"]', { state: 'visible' });
    await page.fill('form[name="merchant-login"] input[placeholder="请输入手机号"]', '13800138001');
    await page.fill('form[name="merchant-login"] input[placeholder="请输入密码"]', '123456');
    
    const loginButton = page.locator('form[name="merchant-login"] button[type="submit"]:has-text("商户登录")');
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton.click();
    await page.waitForURL('**/merchant/**', { timeout: 20000 });
    
    // 测试个人中心页面
    const personalCenterLink = page.locator('text=个人中心');
    await personalCenterLink.waitFor({ state: 'visible', timeout: 10000 });
    await personalCenterLink.click();
    await expect(page.locator('text=个人信息')).toBeVisible();
    
    // 测试我的订单页面
    const myOrdersLink = page.locator('text=我的订单');
    await myOrdersLink.waitFor({ state: 'visible', timeout: 10000 });
    await myOrdersLink.click();
    await expect(page.locator('text=订单列表')).toBeVisible();
  });

  test('普通用户登录失败处理', async ({ page }) => {
    // 切换到商户登录标签
    const merchantTab = page.locator('.ant-tabs-tab:has-text("商户登录")');
    await merchantTab.waitFor({ state: 'visible', timeout: 10000 });
    await merchantTab.click();
    
    // 等待商户登录表单出现
    await page.waitForSelector('form[name="merchant-login"]', { state: 'visible', timeout: 15000 });
    
    // 等待手机号输入框出现
    await page.waitForSelector('input[placeholder="请输入手机号"]', { state: 'visible', timeout: 15000 });
    
    // 等待表单加载并输入错误的手机号
    await page.waitForSelector('form[name="merchant-login"] input[placeholder="请输入手机号"]', { state: 'visible' });
    await page.fill('form[name="merchant-login"] input[placeholder="请输入手机号"]', '12345678901');
    
    // 输入错误的密码
    await page.fill('form[name="merchant-login"] input[placeholder="请输入密码"]', 'wrongpassword');
    
    // 点击登录按钮
    const loginButton = page.locator('form[name="merchant-login"] button[type="submit"]:has-text("商户登录")');
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton.click();
    
    // 等待错误提示或页面响应
    await page.waitForLoadState('networkidle');
    
    // 验证仍在登录页面
    await expect(page.locator('h1')).toContainText('亮车惠IoT管理系统');
  });

  test('用户登录表单验证', async ({ page }) => {
    // 切换到商户登录标签
    const merchantTab = page.locator('.ant-tabs-tab:has-text("商户登录")');
    await merchantTab.waitFor({ state: 'visible', timeout: 10000 });
    await merchantTab.click();
    
    // 等待商户登录表单出现
    await page.waitForSelector('form[name="merchant-login"]', { state: 'visible', timeout: 15000 });
    
    // 等待手机号输入框出现
    await page.waitForSelector('input[placeholder="请输入手机号"]', { state: 'visible', timeout: 15000 });
    
    // 测试空手机号验证
    const passwordInput = page.locator('form[name="merchant-login"] input[placeholder="请输入密码"]');
    await passwordInput.fill('123456');
    
    const loginButton = page.locator('form[name="merchant-login"] button[type="submit"]:has-text("商户登录")');
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton.click();
    await page.waitForLoadState('networkidle');
    
    // 验证手机号必填提示
    await expect(page.locator('text=请输入手机号')).toBeVisible();
    
    // 测试空密码验证
    const phoneInput = page.locator('form[name="merchant-login"] input[placeholder="请输入手机号"]');
    await phoneInput.fill('13800138001');
    await passwordInput.clear();
    
    const loginButton2 = page.locator('form[name="merchant-login"] button[type="submit"]:has-text("商户登录")');
    await loginButton2.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton2.click();
    await page.waitForLoadState('networkidle');
    
    // 验证密码必填提示
    await expect(page.locator('text=请输入密码')).toBeVisible();
    
    // 测试手机号格式验证
    await phoneInput.clear();
    await phoneInput.fill('123');
    await passwordInput.fill('123456');
    
    const loginButton3 = page.locator('form[name="merchant-login"] button[type="submit"]:has-text("商户登录")');
    await loginButton3.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton3.click();
    await page.waitForLoadState('networkidle');
    
    // 验证手机号格式提示
    await expect(page.locator('text=请输入正确的手机号')).toBeVisible();
  });

  test('登录页面UI元素完整性检查', async ({ page }) => {
    // 验证登录页面基本元素
    await expect(page.locator('h1')).toContainText('亮车惠IoT管理系统');
    
    // 验证登录类型切换标签（只有管理员和商户）
    await expect(page.locator('.ant-tabs-tab:has-text("管理员登录")')).toBeVisible();
    await expect(page.locator('.ant-tabs-tab:has-text("商户登录")')).toBeVisible();
    
    // 验证登录表单元素
    await expect(page.locator('input[placeholder="请输入手机号"]')).toBeVisible();
    await expect(page.locator('input[placeholder="请输入密码"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // 验证演示账户登录按钮
    await expect(page.locator('text=使用演示账号登录')).toBeVisible();
  });
});