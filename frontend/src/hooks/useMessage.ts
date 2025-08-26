import { App } from 'antd';

/**
 * 消息提示hooks
 * 使用App.useApp()获取message实例，解决静态方法上下文问题
 */
export const useMessage = () => {
  const { message } = App.useApp();

  return {
    /**
     * 成功提示
     */
    success: (content: string, duration = 3) => {
      message.success(content, duration);
    },

    /**
     * 错误提示
     */
    error: (content: string, duration = 3) => {
      message.error(content, duration);
    },

    /**
     * 警告提示
     */
    warning: (content: string, duration = 3) => {
      message.warning(content, duration);
    },

    /**
     * 信息提示
     */
    info: (content: string, duration = 3) => {
      message.info(content, duration);
    },

    /**
     * 加载提示
     */
    loading: (content: string, duration = 0) => {
      return message.loading(content, duration);
    },
  };
};