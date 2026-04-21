import { NextRequest, NextResponse } from 'next/server'
import { getStorage } from '@/app/lib/storage'
import { 
  successResponse, 
  errorResponse, 
  validateAuth,
  handleApiError
} from '../utils'

// GET /api/stats - 获取平台统计数据
export async function GET(request: NextRequest) {
  try {
    const storage = getStorage()
    
    // 获取基础统计数据
    const stats = await storage.getStats()
    
    // 获取更多详细统计
    const novels = await storage.getNovels()
    const users = await storage.getUsers()
    
    // 计算发布状态统计
    const publishedNovels = novels.filter(n => n.status === 'published').length
    const draftNovels = novels.filter(n => n.status === 'draft').length
    
    // 计算用户角色统计
    const adminUsers = users.filter(u => u.role === 'admin').length
    const regularUsers = users.filter(u => u.role === 'user').length
    
    // 计算最近活动
    const recentNovels = novels
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(novel => ({
        id: novel.id,
        title: novel.title,
        author: novel.author,
        createdAt: novel.createdAt
      }))
    
    // 计算热门小说（按评论数）
    // 这里简化实现，实际应该从评论数据统计
    const popularNovels = novels
      .slice(0, 5)
      .map(novel => ({
        id: novel.id,
        title: novel.title,
        author: novel.author,
        chapterCount: novel.chapters?.length || 0
      }))
    
    const detailedStats = {
      ...stats,
      novelStatus: {
        published: publishedNovels,
        draft: draftNovels,
        total: stats.totalNovels
      },
      userRoles: {
        admin: adminUsers,
        user: regularUsers,
        total: stats.totalUsers
      },
      recentActivity: {
        novels: recentNovels,
        // 这里可以添加更多活动数据
      },
      popularNovels,
      // 平台信息
      platformInfo: {
        name: '小说创作平台',
        version: '1.0.0',
        lastUpdated: new Date().toISOString()
      }
    }
    
    // 检查是否需要管理员权限（详细统计）
    const url = new URL(request.url)
    const detailed = url.searchParams.get('detailed') === 'true'
    
    if (detailed) {
      const authResult = validateAuth(request)
      if (authResult instanceof NextResponse) return authResult
      
      if (authResult.username !== 'admin') {
        return errorResponse('需要管理员权限查看详细统计', 403)
      }
      
      // 管理员可以看到更多数据
      const adminStats = {
        ...detailedStats,
        // 添加管理员专属数据
        userList: users.map(user => ({
          id: user.id,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt
        })),
        novelList: novels.map(novel => ({
          id: novel.id,
          title: novel.title,
          author: novel.author,
          status: novel.status,
          createdAt: novel.createdAt
        }))
      }
      
      return successResponse(adminStats)
    }
    
    return successResponse(detailedStats)
    
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