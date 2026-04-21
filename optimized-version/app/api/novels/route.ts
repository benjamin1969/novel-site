import { NextRequest, NextResponse } from 'next/server'
import { getStorage } from '@/app/lib/storage'
import { 
  successResponse, 
  errorResponse, 
  validateAuth,
  validateRequestBody,
  handleApiError,
  getPaginationParams,
  paginatedResponse
} from '../utils'
import { Novel } from '@/app/types'

// 验证小说数据
function validateNovelData(data: any): data is Omit<Novel, 'id' | 'createdAt' | 'updatedAt' | 'authorId'> {
  return (
    typeof data === 'object' &&
    typeof data.title === 'string' &&
    typeof data.description === 'string' &&
    data.title.trim().length > 0 &&
    data.title.trim().length <= 100 &&
    data.description.trim().length <= 1000 &&
    (!data.tags || Array.isArray(data.tags)) &&
    (!data.status || ['draft', 'published'].includes(data.status))
  )
}

// GET /api/novels - 获取小说列表
export async function GET(request: NextRequest) {
  try {
    const storage = getStorage()
    const novels = await storage.getNovels()
    
    // 过滤只显示已发布的小说（非管理员）
    const authResult = validateAuth(request)
    const isAdmin = !(authResult instanceof NextResponse) && authResult.username === 'admin'
    
    let filteredNovels = novels
    if (!isAdmin) {
      filteredNovels = novels.filter(novel => novel.status === 'published')
    }
    
    // 分页
    const pagination = getPaginationParams(request)
    const start = (pagination.page - 1) * pagination.limit
    const end = start + pagination.limit
    const paginatedData = filteredNovels.slice(start, end)
    
    return paginatedResponse(paginatedData, filteredNovels.length, pagination)
    
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/novels - 创建小说
export async function POST(request: NextRequest) {
  try {
    // 验证用户认证
    const authResult = validateAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    // 验证请求体
    const body = await validateRequestBody(request, validateNovelData)
    if (body instanceof NextResponse) return body
    
    const storage = getStorage()
    
    // 创建小说
    const novel = await storage.createNovel({
      ...body,
      author: authResult.username,
      authorId: authResult.userId,
      status: body.status || 'published', // 默认直接发布
      chapters: [],
      tags: body.tags || []
    })
    
    return successResponse(novel, 201)
    
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}