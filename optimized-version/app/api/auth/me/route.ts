import { NextRequest, NextResponse } from 'next/server'
import { getStorage } from '@/app/lib/storage'
import { 
  successResponse, 
  errorResponse, 
  validateAuth,
  handleApiError
} from '../../utils'

// GET /api/auth/me - 获取当前用户信息
export async function GET(request: NextRequest) {
  try {
    // 验证用户认证
    const authResult = validateAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    const storage = getStorage()
    
    // 获取用户信息
    const user = await storage.getUserById(authResult.userId)
    if (!user) {
      return errorResponse('用户不存在', 404)
    }
    
    // 不返回密码
    const { password: _, ...userWithoutPassword } = user
    
    return successResponse(userWithoutPassword)
    
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/auth/me - 更新当前用户信息
export async function PUT(request: NextRequest) {
  try {
    // 验证用户认证
    const authResult = validateAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    // 解析请求体
    let body
    try {
      body = await request.json()
    } catch (error) {
      return errorResponse('无法解析请求数据')
    }
    
    // 验证更新数据
    const allowedUpdates = ['email']
    const updates: Record<string, any> = {}
    
    for (const key in body) {
      if (allowedUpdates.includes(key)) {
        updates[key] = body[key]
      }
    }
    
    // 不允许更新用户名和密码（需要单独接口）
    if (Object.keys(updates).length === 0) {
      return errorResponse('没有有效的更新字段', 400)
    }
    
    const storage = getStorage()
    
    // 更新用户信息
    const updatedUser = await storage.updateUser(authResult.userId, updates)
    if (!updatedUser) {
      return errorResponse('更新失败', 500)
    }
    
    // 不返回密码
    const { password: _, ...userWithoutPassword } = updatedUser
    
    return successResponse(userWithoutPassword)
    
  } catch (error) {
    return handleApiError(error)
  }
}

// 支持OPTIONS请求（CORS）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}