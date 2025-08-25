# 亮车惠 IoT 管理系统后端

## 项目简介

亮车惠 IoT 管理系统是一个基于 NestJS 的企业级后端服务，为智能设备管理、商户门店运营和平台管理提供完整的解决方案。

## 技术栈

- **框架**: NestJS 10.x
- **数据库**: MySQL 8.0
- **缓存**: Redis 7.x
- **ORM**: TypeORM
- **认证**: JWT
- **文档**: Swagger/OpenAPI
- **容器化**: Docker & Docker Compose

## 功能特性

### 🏢 平台管理系统 (Admin)
- **仪表盘**: 实时数据统计和可视化图表
- **用户管理**: 用户账户、角色权限管理
- **商户管理**: 商户注册审核、资质管理
- **门店管理**: 门店信息、员工配置
- **设备管理**: 设备注册、状态监控、远程控制
- **订单管理**: 订单查询、状态跟踪、数据分析
- **库存告警**: 库存监控、自动告警、补货提醒
- **审计日志**: 操作记录、安全审计
- **系统工具**: 数据导出、系统配置

### 🏪 商户门店系统 (Merchant)
- **门店资料**: 门店信息管理、营业设置
- **员工管理**: 员工账户、权限分配
- **设备监控**: 设备状态、运行数据、故障报警
- **库存管理**: 库存查询、告警设置、补货申请
- **订单报表**: 销售统计、收益分析、趋势图表
- **数据导出**: 报表下载、数据备份

### 🔐 权限系统 (RBAC)
- **平台管理员** (platform_admin): 全系统管理权限
- **商户** (merchant): 商户级数据管理权限
- **门店经理** (store_manager): 门店级管理权限
- **门店员工** (store_staff): 基础操作权限

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose
- MySQL 8.0+
- Redis 7.0+

### 安装依赖

```bash
npm install
```

### 环境配置

复制环境配置文件并修改相关配置：

```bash
cp .env.example .env
```

配置说明：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=sw63828
DB_DATABASE=iot_management

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT配置
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# 应用配置
APP_PORT=8000
APP_ENV=development
```

### 启动服务

#### 使用 Docker Compose (推荐)

```bash
# 启动数据库和缓存服务
docker-compose up -d

# 启动开发服务器
npm run start:dev
```

#### 手动启动

```bash
# 确保 MySQL 和 Redis 服务已启动

# 运行数据库迁移
npm run migration:run

# 启动开发服务器
npm run start:dev
```

### 访问服务

- **API 服务**: http://localhost:8000
- **API 文档**: http://localhost:8000/api/docs
- **phpMyAdmin**: http://localhost:8080 (用户名: root, 密码: sw63828)

## API 文档

### 平台管理 API

#### 仪表盘统计
```http
GET /api/v1/admin/dashboard/stats
```

#### 用户管理
```http
GET    /api/v1/admin/users          # 获取用户列表
POST   /api/v1/admin/users          # 创建用户
GET    /api/v1/admin/users/:id      # 获取用户详情
PUT    /api/v1/admin/users/:id      # 更新用户
DELETE /api/v1/admin/users/:id      # 删除用户
```

#### 商户管理
```http
GET    /api/v1/admin/merchants      # 获取商户列表
POST   /api/v1/admin/merchants      # 创建商户
GET    /api/v1/admin/merchants/:id  # 获取商户详情
PUT    /api/v1/admin/merchants/:id  # 更新商户
```

#### 设备管理
```http
GET    /api/v1/admin/devices        # 获取设备列表
POST   /api/v1/admin/devices        # 注册设备
GET    /api/v1/admin/devices/:id    # 获取设备详情
PUT    /api/v1/admin/devices/:id    # 更新设备
GET    /api/v1/admin/devices/:id/logs # 获取设备日志
```

### 商户门店 API

#### 门店管理
```http
GET    /api/v1/merchant/stores      # 获取门店列表
POST   /api/v1/merchant/stores      # 创建门店
GET    /api/v1/merchant/stores/:id  # 获取门店详情
PUT    /api/v1/merchant/stores/:id  # 更新门店
```

#### 员工管理
```http
GET    /api/v1/merchant/staff       # 获取员工列表
POST   /api/v1/merchant/staff       # 添加员工
PUT    /api/v1/merchant/staff/:id   # 更新员工
```

#### 设备监控
```http
GET    /api/v1/merchant/devices     # 获取设备列表
GET    /api/v1/merchant/devices/:id/status # 获取设备状态
```

## 数据库结构

### 核心实体

- **users**: 用户账户信息
- **merchants**: 商户信息
- **stores**: 门店信息
- **devices**: 设备信息
- **orders**: 订单数据
- **inventory**: 库存信息
- **alerts**: 告警记录
- **audit_logs**: 审计日志

### 关系说明

```
users (1:N) merchants (1:N) stores (1:N) devices
                                    ↓
                              orders (N:1) users
                                    ↓
                              inventory (1:1) stores
```

## 开发指南

### 项目结构

```
src/
├── modules/
│   ├── admin/           # 平台管理模块
│   ├── merchant/        # 商户门店模块
│   ├── auth/           # 认证授权模块
│   ├── audit/          # 审计日志模块
│   └── common/         # 公共模块
├── entities/           # 数据库实体
├── config/            # 配置文件
├── guards/            # 路由守卫
├── interceptors/      # 拦截器
├── decorators/        # 装饰器
└── utils/             # 工具函数
```

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 和 Prettier 规范
- 使用 Swagger 注解生成 API 文档
- 编写单元测试和集成测试

### 常用命令

```bash
# 开发
npm run start:dev      # 启动开发服务器
npm run build          # 构建项目
npm run test           # 运行测试

# 数据库
npm run migration:generate  # 生成迁移文件
npm run migration:run       # 执行迁移
npm run migration:revert    # 回滚迁移

# 代码质量
npm run lint           # 代码检查
npm run format         # 代码格式化
```

## 部署说明

### Docker 部署

```bash
# 构建镜像
docker build -t lch-backend .

# 运行容器
docker run -d -p 8000:8000 --name lch-backend lch-backend
```

### 生产环境配置

1. 设置环境变量 `NODE_ENV=production`
2. 配置生产数据库连接
3. 设置强密码和安全密钥
4. 启用 HTTPS
5. 配置日志收集
6. 设置监控告警

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查数据库服务是否启动
   - 验证连接配置是否正确
   - 确认网络连通性

2. **Redis 连接失败**
   - 检查 Redis 服务状态
   - 验证连接参数
   - 检查防火墙设置

3. **端口占用**
   - 使用 `netstat -ano | findstr :8000` 查找占用进程
   - 终止占用进程或更换端口

4. **权限问题**
   - 检查用户角色配置
   - 验证 JWT Token 有效性
   - 确认 API 权限设置

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码变更
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

- 项目维护者: 开发团队
- 邮箱: dev@liangchehui.com
- 文档: [项目文档](https://docs.liangchehui.com)