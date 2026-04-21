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

// GET /api/admin/novels - 获取所有小说（管理员）
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const authResult = validateAdmin(request)
    if (authResult instanceof NextResponse) return authResult
    
    const storage = getStorage()
    const novels = await storage.getNovels()
    
    // 获取每本小说的章节数
    const novelsWithChapterCount = await Promise.all(
      novels.map(async (novel) => {
        const chapters = await storage.getChapters(novel.id)
        return {
          ...novel,
          chapterCount: chapters.length
        }
      })
    )
    
    // 分页
    const pagination = getPaginationParams(request)
    const start = (pagination.page - 1) * pagination.limit
    const end = start + pagination.limit
    const paginatedData = novelsWithChapterCount.slice(start, end)
    
    return paginatedResponse(paginatedData, novelsWithChapterCount.length, pagination)
    
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