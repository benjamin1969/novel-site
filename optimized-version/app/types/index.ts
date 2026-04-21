export interface User {
  id: string
  username: string
  password: string // 实际存储应该是hash
  email?: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface Novel {
  id: string
  title: string
  author: string
  authorId: string
  description: string
  coverImage?: string
  status: 'draft' | 'published'
  chapters: Chapter[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Chapter {
  id: string
  novelId: string
  title: string
  content: string
  order: number
  wordCount: number
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  novelId: string
  userId: string
  username: string
  content: string
  parentId?: string // 回复评论的ID
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  password: string
  email?: string
}