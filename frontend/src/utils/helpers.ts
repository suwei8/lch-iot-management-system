import { message } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';

// 配置dayjs
dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

/**
 * 日期格式化工具
 */
export const formatDate = {
  /**
   * 格式化为标准日期时间
   */
  datetime: (date: string | Date, format = 'YYYY-MM-DD HH:mm:ss'): string => {
    return dayjs(date).format(format);
  },

  /**
   * 格式化为日期
   */
  date: (date: string | Date, format = 'YYYY-MM-DD'): string => {
    return dayjs(date).format(format);
  },

  /**
   * 格式化为时间
   */
  time: (date: string | Date, format = 'HH:mm:ss'): string => {
    return dayjs(date).format(format);
  },

  /**
   * 相对时间（如：2小时前）
   */
  relative: (date: string | Date): string => {
    return dayjs(date).fromNow();
  },

  /**
   * 判断是否为今天
   */
  isToday: (date: string | Date): boolean => {
    return dayjs(date).isSame(dayjs(), 'day');
  },

  /**
   * 获取时间差（分钟）
   */
  diffMinutes: (date1: string | Date, date2: string | Date): number => {
    return dayjs(date1).diff(dayjs(date2), 'minute');
  },
};

/**
 * 数据验证工具
 */
export const validate = {
  /**
   * 验证邮箱格式
   */
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * 验证手机号格式
   */
  phone: (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  },

  /**
   * 验证身份证号格式
   */
  idCard: (idCard: string): boolean => {
    const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return idCardRegex.test(idCard);
  },

  /**
   * 验证密码强度（至少8位，包含字母和数字）
   */
  password: (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  },

  /**
   * 验证URL格式
   */
  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};

/**
 * 状态转换工具
 */
export const statusMap = {
  /**
   * 用户状态映射
   */
  userStatus: {
    active: { text: '正常', color: 'green' },
    inactive: { text: '禁用', color: 'red' },
  },

  /**
   * 商户状态映射
   */
  merchantStatus: {
    active: { text: '正常', color: 'green' },
    inactive: { text: '禁用', color: 'red' },
    pending: { text: '待审核', color: 'orange' },
  },

  /**
   * 设备状态映射
   */
  deviceStatus: {
    online: { text: '在线', color: 'green' },
    offline: { text: '离线', color: 'red' },
    maintenance: { text: '维护中', color: 'orange' },
  },

  /**
   * 用户角色映射
   */
  userRole: {
    admin: { text: '管理员', color: 'blue' },
    merchant: { text: '商户', color: 'purple' },
  },
};

/**
 * 数据处理工具
 */
export const dataUtils = {
  /**
   * 深拷贝对象
   */
  deepClone: <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * 防抖函数
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  },

  /**
   * 节流函数
   */
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), wait);
      }
    };
  },

  /**
   * 生成随机ID
   */
  generateId: (length = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * 数组去重
   */
  unique: <T>(array: T[], key?: keyof T): T[] => {
    if (!key) {
      return Array.from(new Set(array));
    }
    const seen = new Set();
    return array.filter((item) => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  },

  /**
   * 数组分组
   */
  groupBy: <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },
};

/**
 * 文件处理工具
 */
export const fileUtils = {
  /**
   * 格式化文件大小
   */
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * 获取文件扩展名
   */
  getFileExtension: (filename: string): string => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  },

  /**
   * 验证文件类型
   */
  validateFileType: (file: File, allowedTypes: string[]): boolean => {
    const fileType = file.type;
    const fileExtension = fileUtils.getFileExtension(file.name).toLowerCase();
    return allowedTypes.some(
      (type) => fileType.includes(type) || type.includes(fileExtension)
    );
  },

  /**
   * 验证文件大小
   */
  validateFileSize: (file: File, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  },
};

/**
 * 消息提示工具
 */
export const messageUtils = {
  /**
   * 成功提示
   */
  success: (content: string, duration = 3): void => {
    message.success(content, duration);
  },

  /**
   * 错误提示
   */
  error: (content: string, duration = 3): void => {
    message.error(content, duration);
  },

  /**
   * 警告提示
   */
  warning: (content: string, duration = 3): void => {
    message.warning(content, duration);
  },

  /**
   * 信息提示
   */
  info: (content: string, duration = 3): void => {
    message.info(content, duration);
  },

  /**
   * 加载提示
   */
  loading: (content: string, duration = 0): () => void => {
    return message.loading(content, duration);
  },
};

/**
 * 本地存储工具
 */
export const storage = {
  /**
   * 设置localStorage
   */
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('localStorage设置失败:', error);
    }
  },

  /**
   * 获取localStorage
   */
  get: <T = any>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('localStorage获取失败:', error);
      return defaultValue || null;
    }
  },

  /**
   * 删除localStorage
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('localStorage删除失败:', error);
    }
  },

  /**
   * 清空localStorage
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('localStorage清空失败:', error);
    }
  },
};