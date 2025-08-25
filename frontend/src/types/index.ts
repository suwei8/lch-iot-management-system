// 用户相关类型定义
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'merchant';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: number;
  realName?: string;
  phone?: string;
  avatar?: string;
  company?: string;
  address?: string;
}

// 商户相关类型定义
export interface Merchant {
  id: number;
  name: string;
  code: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  website?: string;
  address: string;
  description?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  deviceCount?: number;
  activeDevices?: number;
  todayDataCount?: number;
}

// 设备相关类型定义
export interface Device {
  id: number;
  deviceId: string;
  name: string;
  type: string;
  model: string;
  merchantId: number;
  merchant?: Merchant;
  status: 'online' | 'offline' | 'maintenance';
  location?: string;
  lastOnlineTime?: string;
  createdAt: string;
  updatedAt: string;
  dataCount?: number;
  onlineHours?: number;
  lastReportTime?: string;
  todayDataCount?: number;
  totalDataCount?: number;
  specifications?: DeviceSpecification[];
  signalStrength?: number;
}

export interface DeviceSpecification {
  id: number;
  deviceId: number;
  key: string;
  value: string;
  unit?: string;
  description?: string;
}

// 数据记录相关类型定义
export interface DataRecord {
  id: number;
  deviceId: number;
  device?: Device;
  deviceName: string;
  dataType: string;
  value: string;
  unit?: string;
  timestamp: string;
  createdAt: string;
}

// API响应类型定义
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  code: number;
  total?: number;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  message: string;
  code: number;
}

// 分页查询参数
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// 登录相关类型定义
export interface LoginRequest {
  username: string;
  password: string;
  role: 'admin' | 'merchant';
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
}

// 表单相关类型定义
export interface CreateMerchantRequest {
  name: string;
  code: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
}

export interface UpdateMerchantRequest extends Partial<CreateMerchantRequest> {
  status?: 'active' | 'inactive' | 'pending';
}

export interface CreateDeviceRequest {
  deviceId: string;
  name: string;
  type: string;
  model: string;
  merchantId: number;
  location?: string;
  specifications?: Omit<DeviceSpecification, 'id' | 'deviceId'>[];
}

export interface UpdateDeviceRequest extends Partial<CreateDeviceRequest> {
  status?: 'online' | 'offline' | 'maintenance';
}

// 统计数据类型定义
export interface DashboardStats {
  totalMerchants: number;
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  maintenanceDevices: number;
  activeDevices: number;
  totalDataCount: number;
  todayDataCount: number;
  todayDataRecords: number;
  todayAlerts: number;
  recentDataRecords: DataRecord[];
  deviceStatusDistribution: {
    online: number;
    offline: number;
    maintenance: number;
  };
  merchantStatusDistribution: {
    active: number;
    inactive: number;
    pending: number;
  };
  systemStats?: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
  };
}

// 路由相关类型定义
export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  title: string;
  icon?: string;
  children?: RouteConfig[];
  roles?: ('admin' | 'merchant')[];
  hidden?: boolean;
}

// 菜单项类型定义
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  path?: string;
  roles?: ('admin' | 'merchant')[];
}

// 表格列配置类型
export interface TableColumn {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  sorter?: boolean;
  render?: (value: any, record: any, index: number) => React.ReactNode;
}

// 筛选器类型定义
export interface FilterParams {
  keyword?: string;
  status?: string;
  merchantId?: number;
  deviceType?: string;
  dateRange?: [string, string];
}

// 导出数据类型定义
export interface ExportParams {
  format: 'excel' | 'csv';
  filters?: FilterParams;
  columns?: string[];
}

// 应用状态类型定义
export interface AppState {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

// 用户角色类型定义
export type UserRole = 'admin' | 'merchant';