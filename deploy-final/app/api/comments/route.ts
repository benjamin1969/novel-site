import { NextRequest, NextResponse } from 'next/server';
import { comments } from '../cf-unified-data';
import { users } from '../auth/cf-adapter';

// GET /api/comments - 获取评论（可按小说ID过滤）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const novelId = searchParams.get('novelId');
    
    let allComments = comments.getApproved(); // 获取所有已发布的评论
    
    // 按小说ID过滤
    if (novelId) {
      allComments = allComments.filter(comment => comment.novelId === novelId);
    }
    
    // 按时间倒序排序（最新的在前）
    allComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json(allComments, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('获取评论数据错误:', error);
    return NextResponse.json(
      { error: '获取评论数据失败' },
      { status: 500 }
    );
  }
}

// POST /api/comments - 发表新评论
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 从请求头获取当前用户（前端应该在登录后设置）
    const encodedUser = request.headers.get('x-current-user') || body.author;
    
    // 解码用户名（前端可能对中文进行了编码）
    let currentUser = encodedUser;
    try {
      currentUser = decodeURIComponent(encodedUser);
    } catch (e) {
      // 如果解码失败，使用原始值
      console.log('用户名解码失败，使用原始值:', encodedUser);
    }
    
    // 验证用户是否登录
    if (!currentUser) {
      return NextResponse.json(
        { error: '请先登录后再发表评论' },
        { status: 401 }
      );
    }
    
    // 检查用户是否被禁言
    const user = users.find(u => u.username === currentUser);
    if (user && user.isMuted) {
      // 检查是否有禁言期限
      if (user.mutedUntil) {
        const muteUntil = new Date(user.mutedUntil);
        const now = new Date();
        if (now < muteUntil) {
          // 还在禁言期内
          const remainingHours = Math.ceil((muteUntil.getTime() - now.getTime()) / (1000 * 60 * 60));
          return NextResponse.json(
            { error: `您已被禁言，剩余时间：${remainingHours}小时。原因：${user.muteReason || '违反社区规则'}` },
            { status: 403 }
          );
        } else {
          // 禁言期已过，自动解禁
          user.isMuted = false;
          user.mutedUntil = null;
          user.muteReason = null;
        }
      } else {
        // 永久禁言
        return NextResponse.json(
          { error: `您已被永久禁言。原因：${user.muteReason || '违反社区规则'}` },
          { status: 403 }
        );
      }
    }
    
    // 验证必需字段
    if (!body.novelId || !body.content) {
      return NextResponse.json(
        { error: '缺少必需字段: novelId, content' },
        { status: 400 }
      );
    }
    
    // 验证内容长度
    if (body.content.trim().length < 1) {
      return NextResponse.json(
        { error: '评论内容不能为空' },
        { status: 400 }
      );
    }
    
    if (body.content.length > 50) {
      return NextResponse.json(
        { error: '评论内容不能超过50个字符' },
        { status: 400 }
      );
    }
    
    // 创建新评论 - 使用从请求头获取的用户名
    const newComment = comments.add({
      novelId: body.novelId,
      content: body.content.trim(),
      author: currentUser,
      authorId: currentUser, // 使用当前用户名作为ID
      status: 'approved', // 评论直接发布，无需审核
      likes: 0
    });
    
    console.log(`新评论已添加: ${newComment.author} 评论了小说 ${newComment.novelId}`);
    
    return NextResponse.json({
      success: true,
      message: '评论已发布',
      comment: newComment
    }, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('发表评论错误:', error);
    return NextResponse.json(
      { error: '发表评论失败' },
      { status: 500 }
    );
  }
}
