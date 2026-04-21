import { NextRequest, NextResponse } from 'next/server'
import { getStorage } from '@/app/lib/storage'
import { 
  successResponse, 
  errorResponse, 
  validateRequestBody,
  handleApiError 
} from '../../utils'
import { LoginCredentials } from '@/app/types'

// 简单的JWT生成函数（实际应该使用专业的JWT库）
function generateToken(userId: string, username: string, role: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({
    userId,
    username,
    role,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24小时过期
  }))
  const signature = btoa('mock-signature') // 实际应该使用密钥签名
  
  return `${header}.${payload}.${signature}`
}

// 验证登录凭据
function validateLoginData(data: any): data is LoginCredentials {
  return (
    typeof data === 'object' &&
    typeof data.username === 'string' &&
    typeof data.password === 'string' &&
    data.username.trim().length > 0 &&
    data.password.length > 0
  )
}

export async function POST(request: NextRequest) {
  try {
    // 验证请求体
    const body = await validateRequestBody(request, validateLoginData)
    if (body instanceof NextResponse) return body
    
    const { username, password } = body
    
    // 获取存储实例
    const storage = getStorage()
    
    // 查找用户
    const user = await storage.getUserByUsername(username)
    
    if (!user) {
      return errorResponse('用户名或密码错误', 401)
    }
    
    // 验证密码（实际应该使用bcrypt等哈希算法）
    if (user.password !== password) {
      return errorResponse('用户名或密码错误', 401)
    }
    
    // 生成token
    const token = generateToken(user.id, user.username, user.role)
    
    // 返回用户信息和token（不返回密码）
    const { password: _, ...userWithoutPassword } = user
    
    return successResponse({
      user: userWithoutPassword,
      token
    })
    
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