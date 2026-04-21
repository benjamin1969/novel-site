import { NextRequest, NextResponse } from 'next/server'
import { getStorage } from '@/app/lib/storage'
import { 
  successResponse, 
  errorResponse, 
  validateRequestBody,
  handleApiError 
} from '../../utils'
import { RegisterData } from '@/app/types'

// 验证注册数据
function validateRegisterData(data: any): data is RegisterData {
  return (
    typeof data === 'object' &&
    typeof data.username === 'string' &&
    typeof data.password === 'string' &&
    data.username.trim().length >= 3 &&
    data.username.trim().length <= 20 &&
    data.password.length >= 6 &&
    data.password.length <= 50 &&
    (!data.email || typeof data.email === 'string')
  )
}

// 简单的密码强度检查
function validatePasswordStrength(password: string): boolean {
  // 至少6个字符
  if (password.length < 6) return false
  
  // 可以添加更多规则
  return true
}

// 简单的用户名检查
function validateUsername(username: string): boolean {
  // 只允许字母、数字、下划线
  const usernameRegex = /^[a-zA-Z0-9_]+$/
  return usernameRegex.test(username)
}

export async function POST(request: NextRequest) {
  try {
    // 验证请求体
    const body = await validateRequestBody(request, validateRegisterData)
    if (body instanceof NextResponse) return body
    
    const { username, password, email } = body
    
    // 验证用户名格式
    if (!validateUsername(username)) {
      return errorResponse('用户名只能包含字母、数字和下划线', 400)
    }
    
    // 验证密码强度
    if (!validatePasswordStrength(password)) {
      return errorResponse('密码至少需要6个字符', 400)
    }
    
    // 获取存储实例
    const storage = getStorage()
    
    // 检查用户名是否已存在
    const existingUser = await storage.getUserByUsername(username)
    if (existingUser) {
      return errorResponse('用户名已存在', 409)
    }
    
    // 创建用户
    const user = await storage.createUser({
      username,
      password, // 实际应该存储哈希值
      email,
      role: 'user' // 默认普通用户
    })
    
    // 初始化存储
    await storage.initialize()
    
    // 返回用户信息（不返回密码）
    const { password: _, ...userWithoutPassword } = user
    
    return successResponse(userWithoutPassword, 201)
    
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}