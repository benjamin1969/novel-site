import { NextRequest, NextResponse } from 'next/server'
import { getStorage } from '@/app/lib/storage'
import { 
  successResponse, 
  errorResponse, 
  validateAuth,
  validateRequestBody,
  handleApiError,
  notFoundResponse
} from '../../utils'
import { Novel } from '@/app/types'

interface RouteParams {
  params: {
    id: string
  }
}

// 验证小说更新数据
function validateNovelUpdateData(data: any): data is Partial<Novel> {
  if (typeof data !== 'object') return false
  
  // 允许更新的字段
  const allowedFields = ['title', 'description', 'status', 'tags', 'coverImage']
  
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
      case 'description':
        if (typeof data[key] !== 'string' || data[key].length > 1000) {
          return false
        }
        break
      case 'status':
        if (!['draft', 'published'].includes(data[key])) {
          return false
        }
        break
      case 'tags':
        if (!Array.isArray(data[key])) {
          return false
        }
        break
      case 'coverImage':
        if (typeof data[key] !== 'string') {
          return false
        }
        break
    }
  }
  
  return true
}

// GET /api/novels/[id] - 获取小说详情
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params
    
    const storage = getStorage()
    const novel = await storage.getNovelById(id)
    
    if (!novel) {
      return notFoundResponse('小说未找到')
    }
    
    // 检查权限：非管理员只能查看已发布的小说
    const authResult = validateAuth(request)
    const isAdmin = !(authResult instanceof NextResponse) && authResult.username === 'admin'
    
    if (!isAdmin && novel.status !== 'published') {
      return errorResponse('无权访问此小说', 403)
    }
    
    // 获取章节信息
    const chapters = await storage.getChapters(id)
    
    // 返回小说详情和章节
    const novelWithChapters = {
      ...novel,
      chapters
    }
    
    return successResponse(novelWithChapters)
    
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/novels/[id] - 更新小说
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params
    
    // 验证用户认证
    const authResult = validateAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    // 验证请求体
    const body = await validateRequestBody(request, validateNovelUpdateData)
    if (body instanceof NextResponse) return body
    
    const storage = getStorage()
    
    // 获取当前小说
    const novel = await storage.getNovelById(id)
    if (!novel) {
      return notFoundResponse('小说未找到')
    }
    
    // 检查权限：只有作者或管理员可以更新
    const isAuthor = novel.authorId === authResult.userId
    const isAdmin = authResult.username === 'admin'
    
    if (!isAuthor && !isAdmin) {
      return errorResponse('无权更新此小说', 403)
    }
    
    // 更新小说
    const updatedNovel = await storage.updateNovel(id, body)
    if (!updatedNovel) {
      return errorResponse('更新失败', 500)
    }
    
    return successResponse(updatedNovel)
    
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/novels/[id] - 删除小说
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params
    
    // 验证用户认证
    const authResult = validateAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    const storage = getStorage()
    
    // 获取当前小说
    const novel = await storage.getNovelById(id)
    if (!novel) {
      return notFoundResponse('小说未找到')
    }
    
    // 检查权限：只有作者或管理员可以删除
    const isAuthor = novel.authorId === authResult.userId
    const isAdmin = authResult.username === 'admin'
    
    if (!isAuthor && !isAdmin) {
      return errorResponse('无权删除此小说', 403)
    }
    
    // 删除小说
    const success = await storage.deleteNovel(id)
    if (!success) {
      return errorResponse('删除失败', 500)
    }
    
    // 同时删除相关章节
    const chapters = await storage.getChapters(id)
    for (const chapter of chapters) {
      await storage.deleteChapter(id, chapter.id)
    }
    
    return successResponse({ message: '小说删除成功' })
    
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
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}