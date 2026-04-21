import { NextRequest, NextResponse } from 'next/server'
import { getStorage } from '@/app/lib/storage'
import { 
  successResponse, 
  errorResponse, 
  validateAdmin,
  handleApiError,
  getPaginationParams,
  paginatedResponse
} from '../../utils'
import { Comment } from '@/app/types'

// GET /api/admin/comments - 获取所有评论（管理员）
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const authResult = validateAdmin(request)
    if (authResult instanceof NextResponse) return authResult
    
    const storage = getStorage()
    
    // 获取所有评论
    const allComments = await storage.getCollection<Comment>('comments')
    
    // 按创建时间倒序排序
    const sortedComments = allComments.sort((a, b) => 
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

// 支持OPTIONS请求（CORS）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}