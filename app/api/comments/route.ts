import { NextRequest, NextResponse } from 'next/server';
import { getNovelComments, createComment } from '@/app/lib/comments';
import { getUserByUsername } from '@/app/lib/auth';

// GET /api/comments - 获取评论（可按小说ID过滤）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const novelId = searchParams.get('novelId');
    
    if (!novelId) {
      return NextResponse.json(
        { error: '需要小说ID参数' },
        { status: 400 }
      );
    }
    
    // 获取小说的评论
    const allComments = await getNovelComments(novelId);
    
    // 格式化返回数据
    const formattedComments = allComments.map(comment => ({
      id: comment.id,
      novelId: comment.novelId,
      content: comment.content,
      author: comment.user.displayName || comment.user.username,
      authorId: comment.user.id,
      status: comment.status,
      likes: comment.likes,
      createdAt: comment.createdAt,
      user: {
        id: comment.user.id,
        username: comment.user.username,
        displayName: comment.user.displayName,
        isMuted: comment.user.isMuted,
        mutedUntil: comment.user.mutedUntil
      }
    }));
    
    return NextResponse.json(formattedComments, {
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
    
    // 获取用户信息
    const user = await getUserByUsername(currentUser);
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
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
    
    if (body.content.length > 500) {
      return NextResponse.json(
        { error: '评论内容不能超过500个字符' },
        { status: 400 }
      );
    }
    
    // 创建新评论
    const newComment = await createComment({
      novelId: body.novelId,
      userId: user.id,
      content: body.content.trim()
    });
    
    console.log(`新评论已添加: ${user.username} 评论了小说 ${body.novelId}`);
    
    return NextResponse.json({
      success: true,
      message: '评论已发布',
      comment: {
        id: newComment.id,
        novelId: newComment.novelId,
        content: newComment.content,
        author: newComment.user.displayName || newComment.user.username,
        authorId: newComment.user.id,
        status: newComment.status,
        likes: newComment.likes,
        createdAt: newComment.createdAt,
        user: {
          id: newComment.user.id,
          username: newComment.user.username,
          displayName: newComment.user.displayName
        }
      }
    }, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('发表评论错误:', error);
    
    if (error.message === '用户已被禁言，无法发表评论') {
      return NextResponse.json(
        { error: '您已被禁言，无法发表评论' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: '发表评论失败' },
      { status: 500 }
    );
  }
}