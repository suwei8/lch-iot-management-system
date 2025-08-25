# IoT管理系统 发布说明

## 版本 v1.0.0 (2025-01-15)

### 🎉 重大里程碑

这是IoT管理系统的第一个正式发布版本，标志着系统核心功能的完整实现。

### ✨ 新功能

#### 后端系统 (NestJS + TypeScript)
- **用户认证系统**
  - JWT令牌认证机制
  - 基于角色的访问控制 (RBAC)
  - 支持Admin和Merchant两种角色
  - 安全的密码加密存储

- **设备管理模块**
  - 设备注册与配置
  - 实时设备状态监控
  - 设备数据采集与存储
  - 设备分组管理

- **商户管理系统**
  - 商户信息CRUD操作
  - 商户状态管理
  - 商户设备关联
  - 商户数据统计

- **数据管理服务**
  - 实时数据处理
  - 历史数据查询
  - 数据统计分析
  - 数据导出功能

- **API文档集成**
  - 完整的Swagger/OpenAPI文档
  - 交互式API测试界面
  - 自动生成的接口说明

#### 前端系统 (React + TypeScript + Ant Design)
- **管理员界面**
  - Dashboard仪表板
  - 设备管理页面
  - 商户管理页面
  - 数据分析页面

- **商户界面**
  - 商户专用Dashboard
  - 设备监控页面
  - 数据报表页面
  - 个人资料管理
  - 系统设置页面

- **通用功能**
  - 响应式设计，支持多种屏幕尺寸
  - 现代化UI组件库
  - 实时数据更新
  - 状态管理与数据持久化

### 🛠️ 技术栈

#### 后端技术
- **框架**: NestJS 10.x
- **语言**: TypeScript 4.9.x
- **数据库**: MySQL 8.0
- **ORM**: TypeORM
- **认证**: JWT
- **文档**: Swagger/OpenAPI
- **容器化**: Docker

#### 前端技术
- **框架**: React 18.x
- **语言**: TypeScript 4.9.x
- **UI库**: Ant Design 5.x
- **状态管理**: Zustand
- **构建工具**: Create React App + Craco
- **HTTP客户端**: Axios

### 🚀 部署信息

#### 开发环境
- **前端服务**: http://localhost:3000
- **后端API**: http://localhost:8000
- **API文档**: http://localhost:8000/api-docs
- **数据库**: MySQL (Docker容器)

#### 默认账户
- **管理员**: admin / admin123
- **商户**: merchant / merchant123

### 📋 系统要求

- **Node.js**: >= 16.x
- **npm**: >= 8.x
- **Docker**: >= 20.x (可选)
- **MySQL**: >= 8.0
- **浏览器**: Chrome >= 90, Firefox >= 88, Safari >= 14

### 🔧 安装与运行

#### 快速启动
```bash
# 克隆项目
git clone <repository-url>
cd iot_root/lch

# 安装依赖
npm install

# 启动后端服务
cd backend
npm install
npm run start:dev

# 启动前端服务
cd ../frontend
npm install
npm start
```

#### Docker部署
```bash
# 使用Docker Compose启动所有服务
docker-compose up -d
```

### 📊 功能特性

- ✅ 用户认证与授权
- ✅ 设备管理与监控
- ✅ 实时数据采集
- ✅ 数据可视化分析
- ✅ 商户管理系统
- ✅ 响应式Web界面
- ✅ RESTful API设计
- ✅ 完整的API文档
- ✅ 类型安全的代码
- ✅ 容器化部署支持

### 🐛 已知问题

- 前端页面存在Ant Design组件弃用警告（不影响功能）
- 开发环境下的代理连接警告（后端服务端口配置相关）

### 🔮 后续计划

- [ ] 单元测试覆盖
- [ ] 集成测试实现
- [ ] 性能优化
- [ ] 安全加固
- [ ] 监控告警系统
- [ ] CI/CD流水线
- [ ] 生产环境部署
- [ ] 用户手册编写

### 📝 更新日志

#### v1.0.0 (2025-01-15)
- 🎉 首次正式发布
- ✨ 完整的前后端功能实现
- 🔐 用户认证与权限管理
- 📱 设备管理与监控
- 📊 数据可视化分析
- 🏢 商户管理系统
- 📋 API文档集成
- 🐳 Docker容器化支持

---

**开发团队**: IoT管理系统开发组  
**发布日期**: 2025年1月15日  
**版本类型**: 正式版本  
**Git标签**: v1.0.0