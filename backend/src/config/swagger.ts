import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

/**
 * Swagger配置选项
 */
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IoT数据管理平台 API',
      version: '1.0.0',
      description: '物联网数据管理平台的RESTful API文档',
      contact: {
        name: 'API支持',
        email: 'support@iot-platform.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: '开发环境'
      },
      {
        url: 'https://api.iot-platform.com',
        description: '生产环境'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT认证令牌'
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API密钥认证'
        }
      },
      schemas: {
        // 通用响应模式
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: '请求是否成功'
            },
            message: {
              type: 'string',
              description: '响应消息'
            },
            data: {
              type: 'object',
              description: '响应数据'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: '响应时间戳'
            }
          }
        },
        // 分页响应模式
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'object',
              properties: {
                items: {
                  type: 'array',
                  items: {}
                },
                total: {
                  type: 'integer',
                  description: '总记录数'
                },
                page: {
                  type: 'integer',
                  description: '当前页码'
                },
                pageSize: {
                  type: 'integer',
                  description: '每页记录数'
                },
                totalPages: {
                  type: 'integer',
                  description: '总页数'
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        // 错误响应模式
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: '错误消息'
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: '错误代码'
                },
                details: {
                  type: 'string',
                  description: '错误详情'
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        // 用户模式
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: '用户ID'
            },
            username: {
              type: 'string',
              description: '用户名'
            },
            email: {
              type: 'string',
              format: 'email',
              description: '邮箱地址'
            },
            role: {
              type: 'string',
              enum: ['admin', 'merchant'],
              description: '用户角色'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'suspended'],
              description: '用户状态'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '创建时间'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: '更新时间'
            }
          }
        },
        // 商户模式
        Merchant: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: '商户ID'
            },
            name: {
              type: 'string',
              description: '商户名称'
            },
            code: {
              type: 'string',
              description: '商户编码'
            },
            contact: {
              type: 'string',
              description: '联系人'
            },
            phone: {
              type: 'string',
              description: '联系电话'
            },
            email: {
              type: 'string',
              format: 'email',
              description: '邮箱地址'
            },
            industry: {
              type: 'string',
              description: '所属行业'
            },
            address: {
              type: 'string',
              description: '地址'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'suspended'],
              description: '商户状态'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        // 设备模式
        Device: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: '设备ID'
            },
            name: {
              type: 'string',
              description: '设备名称'
            },
            code: {
              type: 'string',
              description: '设备编码'
            },
            type: {
              type: 'string',
              description: '设备类型'
            },
            model: {
              type: 'string',
              description: '设备型号'
            },
            manufacturer: {
              type: 'string',
              description: '制造商'
            },
            location: {
              type: 'string',
              description: '设备位置'
            },
            status: {
              type: 'string',
              enum: ['online', 'offline', 'maintenance', 'error'],
              description: '设备状态'
            },
            merchantId: {
              type: 'string',
              description: '所属商户ID'
            },
            lastDataTime: {
              type: 'string',
              format: 'date-time',
              description: '最后数据时间'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        // 数据模式
        DeviceData: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: '数据ID'
            },
            deviceId: {
              type: 'string',
              description: '设备ID'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: '数据时间戳'
            },
            data: {
              type: 'object',
              description: '设备数据',
              additionalProperties: true
            },
            quality: {
              type: 'string',
              enum: ['good', 'bad', 'uncertain'],
              description: '数据质量'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        // 登录请求模式
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: '用户名或邮箱'
            },
            password: {
              type: 'string',
              description: '密码'
            }
          }
        },
        // 登录响应模式
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  description: 'JWT访问令牌'
                },
                refreshToken: {
                  type: 'string',
                  description: '刷新令牌'
                },
                user: {
                  $ref: '#/components/schemas/User'
                },
                expiresIn: {
                  type: 'integer',
                  description: '令牌过期时间（秒）'
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      },
      parameters: {
        // 分页参数
        PageParam: {
          name: 'page',
          in: 'query',
          description: '页码，从1开始',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          }
        },
        PageSizeParam: {
          name: 'pageSize',
          in: 'query',
          description: '每页记录数',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10
          }
        },
        // 排序参数
        SortParam: {
          name: 'sort',
          in: 'query',
          description: '排序字段',
          required: false,
          schema: {
            type: 'string'
          }
        },
        OrderParam: {
          name: 'order',
          in: 'query',
          description: '排序方向',
          required: false,
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'desc'
          }
        },
        // 搜索参数
        SearchParam: {
          name: 'search',
          in: 'query',
          description: '搜索关键词',
          required: false,
          schema: {
            type: 'string'
          }
        },
        // 状态参数
        StatusParam: {
          name: 'status',
          in: 'query',
          description: '状态筛选',
          required: false,
          schema: {
            type: 'string'
          }
        },
        // 时间范围参数
        StartTimeParam: {
          name: 'startTime',
          in: 'query',
          description: '开始时间',
          required: false,
          schema: {
            type: 'string',
            format: 'date-time'
          }
        },
        EndTimeParam: {
          name: 'endTime',
          in: 'query',
          description: '结束时间',
          required: false,
          schema: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      responses: {
        // 通用响应
        Success: {
          description: '操作成功',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiResponse'
              }
            }
          }
        },
        BadRequest: {
          description: '请求参数错误',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        Unauthorized: {
          description: '未授权访问',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        Forbidden: {
          description: '禁止访问',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        NotFound: {
          description: '资源不存在',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        InternalServerError: {
          description: '服务器内部错误',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Auth',
        description: '认证相关接口'
      },
      {
        name: 'Users',
        description: '用户管理接口'
      },
      {
        name: 'Merchants',
        description: '商户管理接口'
      },
      {
        name: 'Devices',
        description: '设备管理接口'
      },
      {
        name: 'Data',
        description: '数据管理接口'
      },
      {
        name: 'Analytics',
        description: '数据分析接口'
      },
      {
        name: 'Reports',
        description: '报表管理接口'
      },
      {
        name: 'Settings',
        description: '系统设置接口'
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/models/*.ts'
  ]
};

/**
 * 生成Swagger规范
 */
const specs = swaggerJSDoc(options);

/**
 * 设置Swagger UI
 * @param app Express应用实例
 */
export const setupSwagger = (app: Application): void => {
  // Swagger UI配置选项
  const swaggerUiOptions = {
    explorer: true,
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      showCommonExtensions: true,
      tryItOutEnabled: true
    },
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #1890ff; }
      .swagger-ui .scheme-container { background: #f8f9fa; }
    `,
    customSiteTitle: 'IoT平台 API文档',
    customfavIcon: '/favicon.ico'
  };

  // 设置API文档路由
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));
  
  // 提供JSON格式的API规范
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log('📚 Swagger文档已启用:');
  console.log('   - UI界面: http://localhost:3000/api-docs');
  console.log('   - JSON规范: http://localhost:3000/api-docs.json');
};

export default specs;