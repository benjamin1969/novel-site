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
import { Comment } from '@/app/types'

interface RouteParams {
  params: {
    id: string
  }
}

// 验证评论更新数据
function validateCommentUpdateData(data: any): data is Partial<Comment> {
  return (
    typeof data === 'object' &&
    typeof data.content === 'string' &&
    data.content.trim().length > 0 &&
    data.content.trim().length <= 1000
  )
}

// GET /api/comments/[id] - 获取评论详情
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params
    
    const storage = getStorage()
    const comment = await storage.getCommentById(id)
    
    if (!comment) {
      return notFoundResponse('评论未找到')
    }
    
    // 检查权限：非管理员只能查看已发布小说的评论
    const novel = await storage.getNovelById(comment.novelId)
    if (!novel) {
      return notFoundResponse('关联的小说不存在')
    }
    
    const authResult = validateAuth(request)
    const isAdmin = !(authResult instanceof NextResponse) && authResult.username === 'admin'
    
    if (!isAdmin && novel.status !== 'published') {
      return errorResponse('无权查看此评论', 403)
    }
    
    return successResponse(comment)
    
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/comments/[id] - 更新评论
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
    const body = await validateRequestBody(request, validateCommentUpdateData)
    if (body instanceof NextResponse) return body
    
    const storage = getStorage()
    
    // 检查评论是否存在
    const comment = await storage.getCommentById(id)
    if (!comment) {
      return notFoundResponse('评论未找到')
    }
    
    // 检查权限：只有评论作者或管理员可以更新
    const isAuthor = comment.userId === authResult.userId
    const isAdmin = authResult.username === 'admin'
    
    if (!isAuthor && !isAdmin) {
      return errorResponse('无权更新此评论', 403)
    }
    
    // 更新评论
    const updatedComment = await storage.updateComment(id, body)
    if (!updatedComment) {
      return errorResponse('更新失败', 500)
    }
    
    return successResponse(updatedComment)
    
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/comments/[id] - 删除评论
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
    
    // 检查评论是否存在
    const comment = await storage.getCommentById(id)
    if (!comment) {
      return notFoundResponse('评论未找到')
    }
    
    // 检查权限：评论作者、小说作者或管理员可以删除
    const isCommentAuthor = comment.userId === authResult.userId
    const isAdmin = authResult.username === 'admin'
    
    // 检查是否是小说作者
    const novel = await storage.getNovelById(comment.novelId)
    const isNovelAuthor = novel?.authorId === authResult.userId
    
    if (!isCommentAuthor && !isNovelAuthor && !isAdmin) {
      return errorResponse('无权删除此评论', 403)
    }
    
    // 删除评论
    const success = await storage.deleteComment(id)
    if (!success) {
      return errorResponse('删除失败', 500)
    }
    
    return successResponse({ message: '评论删除成功' })
    
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