/**
 * 用户角色枚举
 */
export type UserRole = 'platform_admin' | 'admin' | 'merchant' | 'user';

/**
 * 用户状态枚举
 */
export type UserStatus = 'active' | 'inactive';

/**
 * 用户实体接口
 */
export interface User {
  /** 用户ID */
  id: number;
  
  /** 手机号 */
  phone: string;
  
  /** 用户昵称 */
  nickname: string;
  
  /** 用户角色 */
  role: UserRole;
  
  /** 用户状态 */
  status: UserStatus;
  
  /** 账户余额 */
  balance: number;
  
  /** 关联门店ID（商户用户） */
  storeId?: number;
  
  /** 创建时间 */
  createdAt: string;
  
  /** 更新时间 */
  updatedAt: string;
  
  /** 最后登录时间 */
  lastLoginAt?: string;
}

/**
 * 创建用户DTO
 */
export interface CreateUserDto {
  /** 手机号 */
  phone: string;
  
  /** 密码 */
  password: string;
  
  /** 用户昵称 */
  nickname: string;
  
  /** 用户角色 */
  role?: UserRole;
  
  /** 用户状态 */
  status?: UserStatus;
  
  /** 账户余额 */
  balance?: number;
  
  /** 关联门店ID */
  storeId?: number;
}

/**
 * 更新用户DTO
 */
export interface UpdateUserDto {
  /** 用户昵称 */
  nickname?: string;
  
  /** 用户角色 */
  role?: UserRole;
  
  /** 用户状态 */
  status?: UserStatus;
  
  /** 账户余额 */
  balance?: number;
  
  /** 关联门店ID */
  storeId?: number;
}

/**
 * 用户登录DTO
 */
export interface LoginDto {
  /** 手机号 */
  phone: string;
  
  /** 密码 */
  password: string;
}

/**
 * 用户注册DTO
 */
export interface RegisterDto {
  /** 手机号 */
  phone: string;
  
  /** 密码 */
  password: string;
  
  /** 用户昵称 */
  nickname: string;
}

/**
 * 用户搜索参数
 */
export interface UserSearchParams {
  /** 搜索关键词（手机号、昵称） */
  keyword?: string;
  
  /** 用户角色筛选 */
  role?: UserRole;
  
  /** 用户状态筛选 */
  status?: UserStatus;
  
  /** 页码 */
  page?: number;
  
  /** 每页数量 */
  limit?: number;
  
  /** 排序字段 */
  sortBy?: string;
  
  /** 排序方向 */
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * 用户统计信息
 */
export interface UserStatistics {
  /** 总用户数 */
  total: number;
  
  /** 活跃用户数 */
  active: number;
  
  /** 禁用用户数 */
  inactive: number;
  
  /** 按角色统计 */
  byRole: Record<UserRole, number>;
  
  /** 最近注册用户数（7天内） */
  recentRegistrations: number;
  
  /** 今日新增用户数 */
  todayRegistrations: number;
  
  /** 本月新增用户数 */
  monthRegistrations: number;
}

/**
 * 用户详情（包含额外信息）
 */
export interface UserDetail extends User {
  /** 订单总数 */
  orderCount?: number;
  
  /** 总消费金额 */
  totalSpent?: number;
  
  /** 关联商户信息 */
  merchant?: {
    id: number;
    name: string;
    code: string;
  };
  
  /** 关联门店信息 */
  store?: {
    id: number;
    name: string;
    address: string;
  };
}

/**
 * 用户操作日志
 */
export interface UserLog {
  /** 日志ID */
  id: number;
  
  /** 用户ID */
  userId: number;
  
  /** 操作类型 */
  action: string;
  
  /** 操作描述 */
  description: string;
  
  /** IP地址 */
  ipAddress?: string;
  
  /** 用户代理 */
  userAgent?: string;
  
  /** 创建时间 */
  createdAt: string;
}