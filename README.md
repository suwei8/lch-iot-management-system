亮车惠 · 自助洗车系统 - 项目技术与开发上下文 (V2 - 架构增强版)
1. 项目概述
本项目旨在打造“亮车惠 · 自助洗车系统”。
系统通过微信公众号 H5 页面，为用户（车主）提供自助洗车、支付结算、订单查询服务；为加盟商户和平台管理员提供统一的 PC端 + H5端运营后台，实现设备管理、收益统计、多门店运营。

整个系统分为三大角色：用户、商户、平台，并基于 智链物联设备 (cloud.hbzhilian.com) 实现 IoT 化运营。


2. 业务场景描述 (IoT 实际运行流程)
亮车惠 · 自助洗车系统基于智链物联设备（官网：hbzhilian.com，API文档：hbzhilian.com/xy
），通过开放的 API 与物联网回调机制，实现用户、商户、设备三方的高效协同。
下面是与设备厂商控制设备的API接口：
ZL_APP_ID=9418027365
ZL_TOKEN=06D2ofasFJcXQgV7kLhZqNPGjyI54YUbwx3
ZL_API_URL=https://cloud.hbzhilian.com/AC/Cmd

请你打开浏览器阅读文档：https://cloud.hbzhilian.com/xy

设备接入与状态上报
设备联网启动时，上报 上线通知 (cmd: online) → 系统标记为“可用”。

设备掉线时，上报 下线通知 (cmd: offline) → 系统及时更新状态，避免无效订单。

设备运行中，周期性上报 ICCID + 配置参数 (cmd: 13)，后台保存 SIM 卡号、最大工作时长、恒温参数等运行配置。

用户验证与启动设备
用户通过微信公众号 H5 登录（手机号+密码 / 微信授权），绑定账号。

登录成功后，用户扫码选择设备，点击“启动洗车”。

平台调用智链 API 下发 启动指令 (cmd: 09)，设备执行后上报 启动成功反馈（含订单号、启动结果）。

设备运行与异常监控
设备运行时，可能上报 缺水/缺液告警 (cmd: 19)。

后台系统接收告警 → 推送通知给商户运维人员，保证耗材及时补充。

结算与订单生成
用户完成洗车 → 设备主动上报 结算信息 (cmd: 10)，包括消费金额、用水用液时长等。

平台生成订单，调用 微信支付 API 自动扣费。

订单归属到对应的 商户与设备，支持 多加盟店分账管理。

通过此流程，系统实现了：
✅ 扫码即用，自助完成洗车
✅ 设备实时监控 + 异常告警
✅ 自动生成结算订单并完成支付
✅ 多商户分账与收益透明化

3. 核心用户角色
用户（车主）: 通过 H5 端扫码使用设备、支付订单、管理个人消费记录。

商户（加盟店主）: 通过 PC/H5 后台管理名下门店、设备状态、员工账户、营收报表。

平台管理员: 统一监管全平台商户、设备、财务和活动运营。

4. 架构关键点 (Architectural Considerations)
4.1. API 设计规范
版本化: 所有API都应包含版本号，例如 /api/v1。

角色隔离: 不同角色的API使用不同的路由前缀，便于统一鉴权和管理。

平台管理员: /api/v1/admin/...

商户: /api/v1/merchant/...

普通用户: /api/v1/user/...

RESTful风格: 遵循标准的RESTful设计原则。

4.2. 用户认证与鉴权 (Auth)
注册: 手机号 + 密码，密码在Service层使用 bcryptjs 加密存储。

登录: 手机号 + 密码验证成功后，生成 JWT Token 返回。

JWT Payload: Token 的载荷 (payload) 中必须包含 userId 和 role ('user' | 'merchant' | 'platform_admin')，用于后续的鉴权。

多角色鉴权: 所有需要登录的接口统一使用 NestJS 的 AuthGuard 进行保护。守卫会解析 JWT 中的 role 字段，判断当前用户是否有权访问目标路由（例如，访问 /api/v1/admin 开头的接口，role 必须是 platform_admin）。

4.3. 数据校验 (DTOs)
所有写入型操作（POST, PATCH）的 Controller 方法，都必须使用 DTO (Data Transfer Object) 来接收和校验请求体。

DTO 文件中必须使用 class-validator 装饰器来定义详细的校验规则。

在 main.ts 中必须全局启用 ValidationPipe，以实现自动化的请求体验证。

4.4. 数据库事务
对于涉及多个数据表写入的操作（例如：创建订单、更新用户余额、生成分账记录），必须在 Service 层使用数据库事务（如 TypeORM 的 transaction）来确保操作的原子性，保证数据一致性。

4.5. 全局异常处理与日志
异常过滤器: 建议创建一个全局的异常过滤器 (Exception Filter)，捕获所有未处理的异常，将其格式化为统一的JSON错误响应返回给前端。

日志记录: 引入日志模块（如 NestJS 内置的 Logger 或 pino），对关键操作（如用户登录、支付、设备指令）、错误异常和设备回调数据进行详细记录，便于问题排查和审计。

5. 技术栈方案
前端 (Frontend): Vue 3

H5 端 → Vant UI

PC 管理端 → Element Plus

后端 (Backend): NestJS + TypeScript

数据库 (Database): MySQL 8.0（主库），Redis 7（缓存、Session、限流）

部署 (Deployment): Docker + Docker Compose

IoT 通信: 调用智链物联 RESTful API 完成设备指令下发与数据回调对接。

6. 项目结构 (Monorepo)
/lch/
├── backend/         # NestJS 后端项目
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── frontend/        # Vue 3 前端项目
└── docker-compose.yml

7. 后端核心模块规划
UserModule: 用户（车主）的注册、登录、信息管理。

AuthModule: JWT 策略、全局认证守卫、多角色鉴权逻辑。

MerchantModule: 商户的注册、登录、门店与员工管理。

PlatformModule: 平台管理员的账号、角色与权限管理。

DeviceModule: 设备状态管理、指令下发、数据回调统一处理。

OrderModule: 订单创建、支付结算、分账与对账。

SharedModule: 存放全局共享的服务，如日志、配置等。

8. 开发环境与工作流 (关键点)
不使用 Volume 挂载: 为保证开发环境的绝对纯净，避免因本地 node_modules 污染导致的“找不到模块”问题，docker-compose.yml 中不挂载 volumes。

开发流程: 本地修改代码后 → 执行 docker compose build 重新构建镜像 → 执行 docker compose up -d 重启服务。

日志查看: docker compose logs -f backend。

9. 首要开发任务 (MVP 阶段)
实现 UserModule + AuthModule，完整打通“手机号+密码”注册与登录流程，并返回包含正确 userId 和 role 的 JWT Token。

实现多角色 AuthGuard，并分别创建受保护的测试接口（如 /api/v1/admin/test, /api/v1/user/test）来验证鉴权有效性。

实现 设备回调统一接收接口 (/api/v1/device/callback)，能接收智链物联上报的各类数据（如上线、下线、结算）并打印日志。

实现 设备启动接口 (/api/v1/user/device/start)，在通过鉴权后，能模拟调用智链 API 下发启动指令。

10. 功能清单 (四大端)
10.1. 平台后台管理系统 (Platform Admin)
目标: 平台运营方的全局管理与监管

使用端: PC + H5 (Element Plus)

功能:

账号与权限: 管理员账号、RBAC角色与权限、安全审计日志。

用户管理: 用户列表与高级检索、用户详情（基础信息、订单、设备使用、风险记录）、批量操作（禁用/打标）、统计看板。

门店商户管理: 入驻审核、资料与结算账户管理、门店概况、商户风控。

设备管理: 全量设备台账、回调日志与运行数据、远程控制（停用/重启/参数下发）。

订单与财务: 订单全局查询、分账结算、退款处理。

运营与营销: 平台券、活动配置、效果分析。

系统配置: 对接配置（IoT/微信）、审计与监控。

10.2. 商户管理系统 (Merchant Admin)
目标: 加盟商户的门店与设备运营管理

使用端: PC + H5 (Element Plus)

功能:

账号与权限: 商户管理员/员工账号、权限分级。

门店管理: 门店信息维护、下属设备列表。

设备管理: 实时状态查看、告警接收、远程操作。

订单与财务: 门店订单明细、收益统计、提现申请。

营销工具: 商户级优惠券配置。

数据报表: 营收趋势、用户活跃、设备使用率。

10.3. 商户前端 (Merchant H5)
目标: 方便商户在移动端随时查看与管理

使用端: 微信 H5 (Vant)

功能:

快捷功能: 登录、实时查看门店设备状态、当日营收统计。

设备运维: 接收设备告警推送、一键通知补充耗材。

财务: 查看余额、提现操作。

简版订单查询: 快速查看近期订单。

10.4. 用户前端 (User H5)
目标: 车主用户的自助洗车体验

使用端: 微信服务号 H5 (Vant)

功能:

用户认证: 手机号+密码注册/登录、微信一键授权登录。

扫码洗车: 扫码绑定设备、确认支付、启动设备、实时倒计时。

订单管理: 我的订单列表、订单详情、发票申请。

支付与结算: 微信支付、支付记录。

通知与提醒: 洗车完成、结算成功通知。

个人中心: 我的账号、优惠券、会员权益。



补充：

环境变量与密钥（新增一节 .env 模板）
建议新增一段标准 .env 模板，包含：
MYSQL_HOST/PORT/DB/USER/PASSWORD、REDIS_URL（注意mysql的root密码请帮我设置PASSWORD为"sw63828"，开发用 redis://redis:6379/0）、JWT_SECRET、JWT_EXPIRES_IN、ZL_APP_ID、ZL_TOKEN、ZL_API_URL=https://cloud.hbzhilian.com/AC/Cmd（或你在 README 里标注的云端地址），以及多商户隔离用的 PLATFORM_ID/TENANT_MODE 等。这一节与“技术栈/开发流程/MVP”相呼应，便于一次跑通后端与联调 。


IoT 指令映射与幂等（新增一表一策略）
在“业务场景描述”后面追加一个指令与回调对照表，标注最小入库字段：

online/offline：设备状态心跳；入库 device_id/status/ts。

cmd:13（配置+ICCID）：入库 iccid/config/version/ts。

cmd:09（启动结果回执）：入库 order_no/result/ts。

cmd:10（结算）：入库 order_no/amount/durations/detail/ts，以 order_no 做幂等键避免重复记账。

cmd:19（缺水/缺液）：入库 device_id/error_code/result/ts 并触发通知。
这几类事件与你现有描述完全一致，只是把“怎么落库、如何去重”写清楚，方便 Trae 直写代码与表结构 。

Redis 使用规范（开发与生产差异）
你当前是无密码 Redis（开发 OK），建议在 README 标注“生产环境必须开启 requirepass/TLS，或使用私有网段隔离 + ACL”，同时补一条限流键（例如用户启动设备接口 rate_limit:user:{id}）的约定，契合你“Redis 7（缓存/Session/限流）”的定位 。

Docker Compose 约束与选择
你写了“不使用 Volume 挂载（保证纯净）”，这在 Windows 下会牺牲热更新；建议在 README 里明确两个模式：

纯容器模式（无挂载）：完全干净，CI/CD 与验收用。

开发模式（只挂载 src）：启用 tsx/nodemon 热重载，更适合日常开发。
可保留默认“纯容器”，另附注切换方式（给 Trae 明确执行路径）。

最小数据库表（MVP 版）
建议在 README 中追加 6 张最小表定义说明（哪怕先写成表结构要点即可）：
users、merchants、devices、orders、device_logs、iot_events（或把事件合到 device_logs）。并标注关键索引：

orders(order_no) 唯一；

device_logs(devid, ts) 复合索引；

users(phone) 唯一；
这样 Trae 就能直接 scaffold 初版 SQL。

对外/对内 API 最小清单（落地路径）
在“首要任务(MVP)”下面加一个最小路由表：

POST /api/v1/user/auth/register|login；

GET /api/v1/user/me（校验 JWT）；

POST /api/v1/user/device/start（透传到智链开放 API，落订单草稿）；

POST /api/v1/device/callback（统一接收 online/offline/13/09/10/19）；

GET /api/v1/admin/test（role=platform_admin 才能通过）。
这些与 README 既有“鉴权与多角色”“MVP 任务”是一致的，只是把落地接口列成清单，Trae 更好执行 。

以上建议都是在你现有 README 的框架上做“工程化落地增强”，不改变你的路线，只是把“能跑起来”的关键信息补齐，方便 AI 代理一次生成项目骨架并跑通第一个 E2E 流程。