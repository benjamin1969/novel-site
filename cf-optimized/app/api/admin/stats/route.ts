import { NextRequest, NextResponse } from 'next/server';
import { users } from '../../auth/cf-adapter';
import { novels, comments } from '../../cf-unified-data';

export async function GET(request: NextRequest) {
  try {
    // 计算统计数据
    const activeUsers = users.filter(user => (user.status || 'active') === 'active').length;
    const novelStats = novels.getStats();
    const commentStats = comments.getStats();
    
    return NextResponse.json({
      totalUsers: activeUsers,
      totalNovels: novelStats.total, // 返回所有小说数量
      publishedNovels: novelStats.published, // 新增：已发布小说数量
      totalComments: commentStats.total, // 返回所有评论数量
      approvedComments: commentStats.approved // 新增：已批准评论数量
    });
  } catch (error) {
    console.error('获取统计数据错误:', error);
    return NextResponse.json(
      { error: '获取统计数据失败' },
      { status: 500 }
    );
  }
}