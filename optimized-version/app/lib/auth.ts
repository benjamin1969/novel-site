import { api } from './api-client'
import { User } from '@/app/types'

// JWT工具函数
export class AuthService {
  private static readonly TOKEN_KEY = 'novel_platform_token'
  private static readonly USER_KEY = 'novel_platform_user'
  
  // 登录
  static async login(username: string, password: string): Promise<User> {
    try {
      const result = await api.login({ username, password })
      
      // 保存token和用户信息
      localStorage.setItem(this.TOKEN_KEY, result.token)
      localStorage.setItem(this.USER_KEY, JSON.stringify(result.user))
      
      return result.user
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }
  
  // 注册
  static async register(username: string, password: string, email?: string): Promise<User> {
    try {
      const user = await api.register({ username, password, email })
      
      // 自动登录
      const loginResult = await api.login({ username, password })
      localStorage.setItem(this.TOKEN_KEY, loginResult.token)
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))
      
      return user
    } catch (error) {
      console.error('注册失败:', error)
      throw error
    }
  }
  
  // 登出
  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    api.logout()
  }
  
  // 获取当前用户
  static getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY)
      if (!userStr) return null
      
      return JSON.parse(userStr)
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  }
  
  // 获取token
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }
  
  // 检查是否已登录
  static isLoggedIn(): boolean {
    return !!this.getToken()
  }
  
  // 检查是否是管理员
  static isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.role === 'admin'
  }
  
  // 验证token有效性（简单检查）
  static validateToken(): boolean {
    const token = this.getToken()
    if (!token) return false
    
    // 简单检查token格式（实际应该解析JWT检查过期时间）
    return token.length > 10
  }
  
  // 初始化认证状态
  static initialize(): void {
    // 检查token有效性
    if (!this.validateToken()) {
      this.logout()
    }
    
    // 设置API token
    const token = this.getToken()
    if (token) {
      api.setToken(token)
    }
  }
  
  // 获取用户显示名称
  static getUserDisplayName(): string {
    const user = this.getCurrentUser()
    return user?.username || '游客'
  }
  
  // 获取用户角色显示
  static getUserRoleDisplay(): string {
    const user = this.getCurrentUser()
    if (!user) return '未登录'
    
    return user.role === 'admin' ? '管理员' : '普通用户'
  }
}

// 初始化认证
if (typeof window !== 'undefined') {
  AuthService.initialize()
}

export default AuthService