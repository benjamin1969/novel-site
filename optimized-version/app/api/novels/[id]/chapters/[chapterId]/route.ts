import { NextRequest, NextResponse } from 'next/server'
import { getStorage } from '@/app/lib/storage'
import { 
  successResponse, 
  errorResponse, 
  validateAuth,
  validateRequestBody,
  handleApiError,
  notFoundResponse
} from '../../../../utils'
import { Chapter } from '@/app/types'

interface RouteParams {
  params: {
    id: string // novelId
    chapterId: string
  }
}

// GET /api/novels/[id]/chapters/[chapterId] - 获取章节详情
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: novelId, chapterId } = params
    
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
    const chapter = await storage.getChapterById(novelId, chapterId)
    if (!chapter) {
      return notFoundResponse('章节未找到')
    }
    
    return successResponse(chapter)
    
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/novels/[id]/chapters/[chapterId] - 更新章节
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: novelId, chapterId } = params
    
    // 验证用户认证
    const authResult = validateAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    // 验证请求体
    const body = await validateRequestBody(request, (data: any): data is Partial<Chapter> => {
      // 简化验证，只检查基本结构
      if (typeof data !== 'object') return false
      
      const allowedFields = ['title', 'content', 'order']
      for (const key in data) {
        if (!allowedFields.includes(key)) return false
      }
      
      return true
    })
    
    if (body instanceof NextResponse) return body
    
    const storage = getStorage()
    
    // 检查小说是否存在
    const novel = await storage.getNovelById(novelId)
    if (!novel) {
      return notFoundResponse('小说未找到')
    }
    
    // 检查权限：只有作者或管理员可以更新章节
    const isAuthor = novel.authorId === authResult.userId
    const isAdmin = authResult.username === 'admin'
    
    if (!isAuthor && !isAdmin) {
      return errorResponse('无权更新此章节', 403)
    }
    
    // 检查章节是否存在
    const existingChapter = await storage.getChapterById(novelId, chapterId)
    if (!existingChapter) {
      return notFoundResponse('章节未找到')
    }
    
    // 计算字数（如果更新了内容）
    const updates: Partial<Chapter> = { ...body }
    if (body.content) {
      updates.wordCount = body.content.trim().length
    }
    
    // 更新章节
    const updatedChapter = await storage.updateChapter(novelId, chapterId, updates)
    if (!updatedChapter) {
      return errorResponse('更新失败', 500)
    }
    
    return successResponse(updatedChapter)
    
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/novels/[id]/chapters/[chapterId] - 删除章节
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: novelId, chapterId } = params
    
    // 验证用户认证
    const authResult = validateAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    const storage = getStorage()
    
    // 检查小说是否存在
    const novel = await storage.getNovelById(novelId)
    if (!novel) {
      return notFoundResponse('小说未找到')
    }
    
    // 检查权限：只有作者或管理员可以删除章节
    const isAuthor = novel.authorId === authResult.userId
    const isAdmin = authResult.username === 'admin'
    
    if (!isAuthor && !isAdmin) {
      return errorResponse('无权删除此章节', 403)
    }
    
    // 检查章节是否存在
    const chapter = await storage.getChapterById(novelId, chapterId)
    if (!chapter) {
      return notFoundResponse('章节未找到')
    }
    
    // 删除章节
    const success = await storage.deleteChapter(novelId, chapterId)
    if (!success) {
      return errorResponse('删除失败', 500)
    }
    
    return successResponse({ message: '章节删除成功' })
    
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