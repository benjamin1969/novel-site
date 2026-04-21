import { NextRequest, NextResponse } from 'next/server'
import { getStorage } from '@/app/lib/storage'
import { 
  successResponse, 
  errorResponse, 
  validateAuth,
  validateRequestBody,
  handleApiError,
  notFoundResponse
} from '../../../utils'
import { Chapter } from '@/app/types'

interface RouteParams {
  params: {
    id: string // novelId
  }
}

// 验证章节数据
function validateChapterData(data: any): data is Omit<Chapter, 'id' | 'createdAt' | 'updatedAt' | 'novelId'> {
  return (
    typeof data === 'object' &&
    typeof data.title === 'string' &&
    typeof data.content === 'string' &&
    typeof data.order === 'number' &&
    data.title.trim().length > 0 &&
    data.title.trim().length <= 100 &&
    data.content.trim().length > 0 &&
    data.order >= 1
  )
}

// 验证章节更新数据
function validateChapterUpdateData(data: any): data is Partial<Chapter> {
  if (typeof data !== 'object') return false
  
  // 允许更新的字段
  const allowedFields = ['title', 'content', 'order']
  
  for (const key in data) {
    if (!allowedFields.includes(key)) {
      return false
    }
    
    // 验证字段类型
    switch (key) {
      case 'title':
        if (typeof data[key] !== 'string' || data[key].trim().length === 0 || data[key].length > 100) {
          return false
        }
        break
      case 'content':
        if (typeof data[key] !== 'string' || data[key].trim().length === 0) {
          return false
        }
        break
      case 'order':
        if (typeof data[key] !== 'number' || data[key] < 1) {
          return false
        }
        break
    }
  }
  
  return true
}

// GET /api/novels/[id]/chapters - 获取小说所有章节
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: novelId } = params
    
    const storage = getStorage()
    
    // 检查小说是否存在
    const novel = await storage.getNovelById(novelId)
    if (!novel) {
      return notFoundResponse('小说未找到')
    }
    
    // 检查权限：非管理员只能查看已发布小说的章节
    const authResult = validateAuth(request)
    const isAdmin = !(authResult instanceof NextResponse) && authResult.username === 'admin'
    
    if (!isAdmin && novel.status !== 'published') {
      return errorResponse('无权访问此小说的章节', 403)
    }
    
    // 获取章节
    const chapters = await storage.getChapters(novelId)
    
    // 按order排序
    const sortedChapters = chapters.sort((a, b) => a.order - b.order)
    
    return successResponse(sortedChapters)
    
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/novels/[id]/chapters - 创建章节
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: novelId } = params
    
    // 验证用户认证
    const authResult = validateAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    // 验证请求体
    const body = await validateRequestBody(request, validateChapterData)
    if (body instanceof NextResponse) return body
    
    const storage = getStorage()
    
    // 检查小说是否存在
    const novel = await storage.getNovelById(novelId)
    if (!novel) {
      return notFoundResponse('小说未找到')
    }
    
    // 检查权限：只有作者或管理员可以添加章节
    const isAuthor = novel.authorId === authResult.userId
    const isAdmin = authResult.username === 'admin'
    
    if (!isAuthor && !isAdmin) {
      return errorResponse('无权为此小说添加章节', 403)
    }
    
    // 计算字数
    const wordCount = body.content.trim().length
    
    // 创建章节
    const chapter = await storage.createChapter({
      ...body,
      novelId,
      wordCount
    })
    
    return successResponse(chapter, 201)
    
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