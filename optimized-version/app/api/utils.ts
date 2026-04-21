import { NextRequest, NextResponse } from 'next/server'
import { getStorage } from '@/app/lib/storage'
import { ApiResponse } from '@/app/types'

// 环境变量类型
interface Env {
  KV_STORE?: KVNamespace
}

// 获取存储实例
function getStorageFromRequest(request: NextRequest) {
  // 在生产环境中，env会通过Cloudflare Pages注入
  const env = (process.env as unknown as Env)
  return getStorage(env)
}

// 临时添加getCollection方法到StorageAdapter接口
declare module '@/app/lib/storage/adapter' {
  interface StorageAdapter {
    getCollection<T>(key: string, defaultValue?: T[]): Promise<T[]>
  }
}

// 成功响应
export function successResponse<T = any>(data: T, status = 200): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data
  }
  
  return NextResponse.json(response, { status })
}

// 错误响应
export function errorResponse(message: string, status = 400): NextResponse {
  const response: ApiResponse = {
    success: false,
    error: message
  }
  
  return NextResponse.json(response, { status })
}

// 未授权响应
export function unauthorizedResponse(message = '未授权访问'): NextResponse {
  return errorResponse(message, 401)
}

// 禁止访问响应
export function forbiddenResponse(message = '禁止访问'): NextResponse {
  return errorResponse(message, 403)
}

// 未找到响应
export function notFoundResponse(message = '资源未找到'): NextResponse {
  return errorResponse(message, 404)
}

// 服务器错误响应
export function serverErrorResponse(message = '服务器内部错误'): NextResponse {
  return errorResponse(message, 500)
}

// 验证请求体
export async function validateRequestBody<T>(
  request: NextRequest,
  validator: (data: any) => data is T
): Promise<T | NextResponse> {
  try {
    const body = await request.json()
    
    if (!validator(body)) {
      return errorResponse('请求数据格式错误')
    }
    
    return body
  } catch (error) {
    return errorResponse('无法解析请求数据')
  }
}

// 验证用户认证
export function validateAuth(request: NextRequest): { userId: string; username: string } | NextResponse {
  // 从请求头获取token
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorizedResponse('需要认证')
  }
  
  const token = authHeader.substring(7)
  
  // 简单验证token（实际应该解析JWT）
  if (!token || token.length < 10) {
    return unauthorizedResponse('无效的token')
  }
  
  // 这里应该解析JWT获取用户信息
  // 暂时使用简单实现
  try {
    // 模拟从token解析用户信息
    // 实际应该使用JWT库解析
    const userInfo = JSON.parse(atob(token.split('.')[1] || ''))
    
    if (!userInfo.userId || !userInfo.username) {
      return unauthorizedResponse('无效的token数据')
    }
    
    return {
      userId: userInfo.userId,
      username: userInfo.username
    }
  } catch (error) {
    return unauthorizedResponse('无法解析token')
  }
}

// 验证管理员权限
export function validateAdmin(request: NextRequest): { userId: string; username: string } | NextResponse {
  const authResult = validateAuth(request)
  
  if (authResult instanceof NextResponse) {
    return authResult
  }
  
  // 这里应该检查用户是否是管理员
  // 暂时使用简单实现
  const storage = getStorageFromRequest(request)
  
  // 在实际实现中，应该从数据库检查用户角色
  // 这里简单检查用户名
  if (authResult.username !== 'admin') {
    return forbiddenResponse('需要管理员权限')
  }
  
  return authResult
}

// 处理API错误
export function handleApiError(error: any): NextResponse {
  console.error('API错误:', error)
  
  if (error instanceof Error) {
    return errorResponse(error.message)
  }
  
  return serverErrorResponse()
}

// 分页参数
export interface PaginationParams {
  page: number
  limit: number
}

// 获取分页参数
export function getPaginationParams(request: NextRequest): PaginationParams {
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '20')
  
  return {
    page: Math.max(1, page),
    limit: Math.min(Math.max(1, limit), 100) // 限制最大100条
  }
}

// 分页响应
export function paginatedResponse<T>(
  data: T[],
  total: number,
  pagination: PaginationParams
): NextResponse {
  const response = {
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
      hasNext: pagination.page * pagination.limit < total,
      hasPrev: pagination.page > 1
    }
  }
  
  return successResponse(response)
}