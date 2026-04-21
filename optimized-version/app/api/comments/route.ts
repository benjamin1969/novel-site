import { NextRequest, NextResponse } from 'next/server'
import { getStorage } from '@/app/lib/storage'
import { 
  successResponse, 
  errorResponse, 
  validateAuth,
  validateRequestBody,
  handleApiError,
  getPaginationParams,
  paginatedResponse,
  notFoundResponse
} from '../utils'
import { Comment } from '@/app/types'

// 验证评论数据
function validateCommentData(data: any): data is Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'username'> {
  return (
    typeof data === 'object' &&
    typeof data.novelId === 'string' &&
    typeof data.content === 'string' &&
    data.content.trim().length > 0 &&
    data.content.trim().length <= 1000 &&
    (!data.parentId || typeof data.parentId === 'string')
  )
}

// GET /api/comments - 获取评论列表（支持按小说筛选）
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const novelId = url.searchParams.get('novelId')
    
    const storage = getStorage()
    
    let comments: Comment[] = []
    
    if (novelId) {
      // 获取特定小说的评论
      comments = await storage.getComments(novelId)
      
      // 检查小说是否存在且已发布（非管理员）
      const novel = await storage.getNovelById(novelId)
      if (novel) {
        const authResult = validateAuth(request)
        const isAdmin = !(authResult instanceof NextResponse) && authResult.username === 'admin'
        
        if (!isAdmin && novel.status !== 'published') {
          return errorResponse('无权查看此小说的评论', 403)
        }
      }
    } else {
      // 获取所有评论（需要管理员权限）
      const authResult = validateAuth(request)
      if (authResult instanceof NextResponse) return authResult
      
      if (authResult.username !== 'admin') {
        return errorResponse('需要管理员权限', 403)
      }
      
      // 获取所有评论（简化实现）
      const allComments = await storage.getCollection<Comment>('comments')
      comments = allComments
    }
    
    // 按创建时间倒序排序
    const sortedComments = comments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    // 分页
    const pagination = getPaginationParams(request)
    const start = (pagination.page - 1) * pagination.limit
    const end = start + pagination.limit
    const paginatedData = sortedComments.slice(start, end)
    
    return paginatedResponse(paginatedData, sortedComments.length, pagination)
    
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/comments - 创建评论
export async function POST(request: NextRequest) {
  try {
    // 验证用户认证
    const authResult = validateAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    // 验证请求体
    const body = await validateRequestBody(request, validateCommentData)
    if (body instanceof NextResponse) return body
    
    const { novelId, content, parentId } = body
    
    const storage = getStorage()
    
    // 检查小说是否存在且已发布
    const novel = await storage.getNovelById(novelId)
    if (!novel) {
      return notFoundResponse('小说未找到')
    }
    
    if (novel.status !== 'published') {
      return errorResponse('无法对未发布的小说发表评论', 403)
    }
    
    // 检查父评论是否存在（如果是回复）
    if (parentId) {
      const parentComment = await storage.getCommentById(parentId)
      if (!parentComment) {
        return notFoundResponse('回复的评论不存在')
      }
      
      if (parentComment.novelId !== novelId) {
        return errorResponse('回复的评论不属于该小说', 400)
      }
    }
    
    // 创建评论
    const comment = await storage.createComment({
      novelId,
      userId: authResult.userId,
      username: authResult.username,
      content: content.trim(),
      parentId
    })
    
    return successResponse(comment, 201)
    
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