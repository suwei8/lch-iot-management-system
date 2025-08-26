# 亮车惠IoT管理系统 - 前端

基于React + TypeScript + Ant Design构建的现代化IoT设备管理系统前端应用。

## 🚀 技术栈

- **React 18** - 用户界面库
- **TypeScript** - 类型安全的JavaScript
- **Ant Design 5** - 企业级UI组件库
- **React Router 6** - 路由管理
- **Zustand** - 轻量级状态管理
- **Axios** - HTTP客户端
- **Recharts** - 数据可视化
- **Tailwind CSS** - 原子化CSS框架
- **Playwright** - E2E测试框架

## 📁 项目结构

```
src/
├── components/          # 通用组件
├── layouts/            # 布局组件
│   ├── AdminLayout/    # 管理员布局
│   └── MerchantLayout/ # 商户布局
├── pages/              # 页面组件
│   ├── Admin/          # 管理员页面
│   ├── Merchant/       # 商户页面
│   ├── Login/          # 登录页面
│   ├── NotFound/       # 404页面
│   └── Unauthorized/   # 未授权页面
├── services/           # API服务
├── store/              # 状态管理
├── types/              # TypeScript类型定义
├── utils/              # 工具函数
├── App.tsx             # 应用入口
└── index.tsx           # 渲染入口
```

## 🛠️ 开发环境

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

## 🧪 测试

### 运行单元测试

```bash
npm test
```

### 运行E2E测试

```bash
# 无头模式运行
npm run test:e2e

# 带界面运行
npm run test:e2e:ui

# 调试模式
npm run test:e2e:debug
```

## 🐳 Docker部署

### 构建镜像

```bash
docker build -t lch-frontend .
```

### 运行容器

```bash
docker run -p 80:80 lch-frontend
```

### 使用Docker Compose

在项目根目录运行：

```bash
docker-compose up -d
```

## 🔧 配置

### 环境变量

复制 `.env.example` 到 `.env` 并修改配置：

```bash
cp .env.example .env
```

主要配置项：

- `REACT_APP_API_URL` - 后端API地址
- `REACT_APP_TITLE` - 应用标题
- `REACT_APP_DEBUG` - 调试模式开关

## 🏗️ 功能模块

### 管理员后台

- 📊 数据仪表板 - 系统概览和统计图表
- 👥 用户管理 - 用户列表、角色分配
- 🏪 商户管理 - 商户审核、信息管理
- 🏢 门店管理 - 门店列表、设备关联
- 📦 订单管理 - 订单查看、状态管理
- 🔧 设备管理 - 设备监控、配置管理

### 商户后台

- 📈 业务仪表板 - 商户数据概览
- 📱 设备管理 - 设备列表、状态监控
- 📋 订单管理 - 订单处理、历史查询
- 📊 数据分析 - 业务数据统计

## 🔐 权限系统

- **管理员(admin)** - 系统全部功能权限
- **平台管理员(platform_admin)** - 等同管理员权限
- **商户(merchant)** - 商户后台功能权限

## 🌐 路由配置

- `/login` - 登录页面
- `/admin/*` - 管理员后台路由
- `/merchant/*` - 商户后台路由
- `/unauthorized` - 未授权页面
- `*` - 404页面

## 📱 响应式设计

支持多种设备尺寸：

- 🖥️ 桌面端 (>= 1200px)
- 💻 笔记本 (992px - 1199px)
- 📱 平板 (768px - 991px)
- 📱 手机 (< 768px)

## 🔄 状态管理

使用Zustand进行状态管理：

- `useAuthStore` - 用户认证状态
- `useAppStore` - 应用全局状态
- `useDataStore` - 数据缓存状态

## 🚀 性能优化

- 代码分割和懒加载
- 组件级缓存
- API请求去重
- 图片懒加载
- Gzip压缩

## 🐛 问题排查

### 常见问题

1. **登录后页面空白**
   - 检查路由配置
   - 确认用户角色权限

2. **API请求失败**
   - 检查后端服务状态
   - 确认API地址配置

3. **构建失败**
   - 清除node_modules重新安装
   - 检查Node.js版本兼容性

## 📄 许可证

MIT License