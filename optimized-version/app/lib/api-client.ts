import { User, Novel, Chapter, Comment, LoginCredentials, RegisterData, ApiResponse } from '@/app/types'

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ApiClient {
  private baseUrl = '/api'
  
  // 认证相关
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    return this.fetch('/auth/login', 'POST', credentials)
  }
  
  async register(userData: RegisterData): Promise<User> {
    return this.fetch('/auth/register', 'POST', userData)
  }
  
  async logout(): Promise<void> {
    // 客户端清理token
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
  
  // 用户相关
  async getCurrentUser(): Promise<User | null> {
    try {
      return await this.fetch('/auth/me', 'GET')
    } catch (error) {
      return null
    }
  }
  
  // 小说相关
  async getNovels(): Promise<Novel[]> {
    return this.fetch('/novels', 'GET')
  }
  
  async getNovelById(id: string): Promise<Novel> {
    return this.fetch(`/novels/${id}`, 'GET')
  }
  
  async getMyNovels(): Promise<Novel[]> {
    return this.fetch('/novels/my', 'GET')
  }
  
  async createNovel(novelData: Omit<Novel, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>): Promise<Novel> {
    return this.fetch('/novels', 'POST', novelData)
  }
  
  async updateNovel(id: string, updates: Partial<Novel>): Promise<Novel> {
    return this.fetch(`/novels/${id}`, 'PUT', updates)
  }
  
  async deleteNovel(id: string): Promise<void> {
    await this.fetch(`/novels/${id}`, 'DELETE')
  }
  
  // 章节相关
  async getChapters(novelId: string): Promise<Chapter[]> {
    return this.fetch(`/novels/${novelId}/chapters`, 'GET')
  }
  
  async getChapter(novelId: string, chapterId: string): Promise<Chapter> {
    return this.fetch(`/novels/${novelId}/chapters/${chapterId}`, 'GET')
  }
  
  async createChapter(novelId: string, chapterData: Omit<Chapter, 'id' | 'createdAt' | 'updatedAt' | 'novelId'>): Promise<Chapter> {
    return this.fetch(`/novels/${novelId}/chapters`, 'POST', {
      ...chapterData,
      novelId
    })
  }
  
  async updateChapter(novelId: string, chapterId: string, updates: Partial<Chapter>): Promise<Chapter> {
    return this.fetch(`/novels/${novelId}/chapters/${chapterId}`, 'PUT', updates)
  }
  
  async deleteChapter(novelId: string, chapterId: string): Promise<void> {
    await this.fetch(`/novels/${novelId}/chapters/${chapterId}`, 'DELETE')
  }
  
  // 评论相关
  async getComments(novelId: string): Promise<Comment[]> {
    return this.fetch(`/novels/${novelId}/comments`, 'GET')
  }
  
  async createComment(novelId: string, content: string): Promise<Comment> {
    return this.fetch(`/novels/${novelId}/comments`, 'POST', { content })
  }
  
  async deleteComment(commentId: string): Promise<void> {
    await this.fetch(`/comments/${commentId}`, 'DELETE')
  }
  
  // 统计数据
  async getStats(): Promise<{
    totalUsers: number
    totalNovels: number
    totalChapters: number
    totalComments: number
  }> {
    return this.fetch('/stats', 'GET')
  }
  
  // 管理员功能
  async getAllUsers(): Promise<User[]> {
    return this.fetch('/admin/users', 'GET')
  }
  
  async getAllComments(): Promise<Comment[]> {
    return this.fetch('/admin/comments', 'GET')
  }
  
  // 私有方法
  private async fetch<T = any>(
    endpoint: string,
    method: string = 'GET',
    data?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const token = localStorage.getItem('token')
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const options: RequestInit = {
      method,
      headers,
      credentials: 'include'
    }
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data)
    }
    
    try {
      const response = await fetch(url, options)
      const result: ApiResponse<T> = await response.json()
      
      if (!response.ok) {
        throw new ApiError(
          result.error || `请求失败: ${response.status}`,
          response.status,
          result
        )
      }
      
      if (!result.success) {
        throw new ApiError(result.error || '请求失败', response.status, result)
      }
      
      return result.data as T
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      if (error instanceof Error) {
        throw new ApiError(`网络错误: ${error.message}`)
      }
      
      throw new ApiError('未知错误')
    }
  }
  
  // 工具方法
  setToken(token: string): void {
    localStorage.setItem('token', token)
  }
  
  getToken(): string | null {
    return localStorage.getItem('token')
  }
  
  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

// 导出单例实例
export const api = new ApiClient()