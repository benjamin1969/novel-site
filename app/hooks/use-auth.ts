// app/hooks/use-auth.ts - 统一认证hook（使用数据库API）
import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  username: string;
  displayName: string;
  role: string;
  isMuted?: boolean;
  mutedUntil?: string | null;
  muteReason?: string | null;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// 从localStorage获取用户信息
const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('current_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// 保存用户信息到localStorage
const setStoredUser = (user: User | null) => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('current_user');
  }
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  // 初始化时从localStorage加载用户信息
  useEffect(() => {
    const user = getStoredUser();
    setAuthState(prev => ({
      ...prev,
      user,
      loading: false
    }));
  }, []);

  // 登录函数
  const login = useCallback(async (username: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '登录失败');
      }
      
      if (data.success && data.user) {
        setStoredUser(data.user);
        setAuthState({
          user: data.user,
          loading: false,
          error: null
        });
        return { success: true, user: data.user };
      } else {
        throw new Error('登录响应格式错误');
      }
    } catch (error: any) {
      const errorMsg = error.message || '登录失败，请稍后重试';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMsg
      }));
      return { success: false, error: errorMsg };
    }
  }, []);

  // 注册函数
  const register = useCallback(async (username: string, password: string, displayName?: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, displayName })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '注册失败');
      }
      
      if (data.success && data.user) {
        setStoredUser(data.user);
        setAuthState({
          user: data.user,
          loading: false,
          error: null
        });
        return { success: true, user: data.user };
      } else {
        throw new Error('注册响应格式错误');
      }
    } catch (error: any) {
      const errorMsg = error.message || '注册失败，请稍后重试';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMsg
      }));
      return { success: false, error: errorMsg };
    }
  }, []);

  // 登出函数
  const logout = useCallback(() => {
    setStoredUser(null);
    setAuthState({
      user: null,
      loading: false,
      error: null
    });
    return { success: true };
  }, []);

  // 检查是否已登录
  const isAuthenticated = useCallback(() => {
    return !!authState.user;
  }, [authState.user]);

  // 获取当前用户
  const getCurrentUser = useCallback(() => {
    return authState.user;
  }, [authState.user]);

  // 检查用户角色
  const isAdmin = useCallback(() => {
    return authState.user?.role === 'ADMIN';
  }, [authState.user]);

  // 检查用户是否被禁言
  const isMuted = useCallback(() => {
    if (!authState.user?.isMuted) return false;
    
    if (authState.user.mutedUntil) {
      const now = new Date();
      const mutedUntil = new Date(authState.user.mutedUntil);
      return now < mutedUntil;
    }
    
    return authState.user.isMuted;
  }, [authState.user]);

  return {
    ...authState,
    login,
    register,
    logout,
    isAuthenticated,
    getCurrentUser,
    isAdmin,
    isMuted
  };
}