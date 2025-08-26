import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';
import { LoginResponse } from '@/types';

// 认证状态接口
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (loginData: LoginResponse) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// 应用状态接口
interface AppState {
  collapsed: boolean;
  theme: 'light' | 'dark';
  loading: boolean;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (loading: boolean) => void;
}

// 认证状态管理
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      // 登录方法
      login: (loginData: LoginResponse) => {
        const { token, user } = loginData;
        set({
          user,
          token,
          isAuthenticated: true,
        });
        
        // 设置axios默认请求头
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
      },
      
      // 登出方法
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        
        // 清除本地存储
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('auth-storage');
        }
      },
      
      // 更新用户信息
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// 应用状态管理
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      collapsed: false,
      theme: 'light',
      loading: false,
      
      // 切换侧边栏
      toggleSidebar: () => {
        set((state) => ({ collapsed: !state.collapsed }));
      },
      
      // 设置侧边栏状态
      setCollapsed: (collapsed: boolean) => {
        set({ collapsed });
      },
      
      // 设置主题
      setTheme: (theme: 'light' | 'dark') => {
        set({ theme });
      },
      
      // 设置加载状态
      setLoading: (loading: boolean) => {
        set({ loading });
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        collapsed: state.collapsed,
        theme: state.theme,
      }),
    }
  )
);

// 数据缓存状态管理
interface DataState {
  merchants: any[];
  devices: any[];
  dataRecords: any[];
  dashboardStats: any;
  setMerchants: (merchants: any[]) => void;
  setDevices: (devices: any[]) => void;
  setDataRecords: (dataRecords: any[]) => void;
  setDashboardStats: (stats: any) => void;
  clearCache: () => void;
}

export const useDataStore = create<DataState>()((set) => ({
  merchants: [],
  devices: [],
  dataRecords: [],
  dashboardStats: null,
  
  // 设置商户数据
  setMerchants: (merchants: any[]) => {
    set({ merchants });
  },
  
  // 设置设备数据
  setDevices: (devices: any[]) => {
    set({ devices });
  },
  
  // 设置数据记录
  setDataRecords: (dataRecords: any[]) => {
    set({ dataRecords });
  },
  
  // 设置仪表板统计数据
  setDashboardStats: (dashboardStats: any) => {
    set({ dashboardStats });
  },
  
  // 清除缓存
  clearCache: () => {
    set({
      merchants: [],
      devices: [],
      dataRecords: [],
      dashboardStats: null,
    });
  },
}));