// 客户端API钩子
import { api } from '../lib/client-storage';

export function useAuth() {
  const login = async (username: string, password: string) => {
    try {
      const result = await api.login(username, password);
      // 保存登录状态到localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('current_user', JSON.stringify(result.user));
      }
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const result = await api.register(username, password);
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('current_user', JSON.stringify(result.user));
      }
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
    }
  };

  const getCurrentUser = () => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  };

  return {
    login,
    register,
    logout,
    getCurrentUser,
    isAuthenticated
  };
}

export function useNovels() {
  const getNovels = async () => {
    return await api.getNovels();
  };

  const getNovel = async (id: string) => {
    return await api.getNovel(id);
  };

  const createNovel = async (novelData: any) => {
    return await api.createNovel(novelData);
  };

  return {
    getNovels,
    getNovel,
    createNovel
  };
}

export function useComments() {
  const getComments = async () => {
    return await api.getComments();
  };

  const createComment = async (commentData: any) => {
    return await api.createComment(commentData);
  };

  return {
    getComments,
    createComment
  };
}

export function useSiteConfig() {
  const getConfig = async () => {
    return await api.getSiteConfig();
  };

  const updateConfig = async (config: any) => {
    return await api.updateSiteConfig(config);
  };

  return {
    getConfig,
    updateConfig
  };
}