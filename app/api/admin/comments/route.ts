import { NextRequest, NextResponse } from 'next/server';
import { getAllComments, deleteComment, updateCommentStatus } from '@/app/lib/comments';

// GET /api/admin/comments - 获取所有评论（管理员用）
export async function GET(request: NextRequest) {
  try {
    // 获取所有评论
    const allComments = await getAllComments();
    
    // 格式化返回数据
    const formattedComments = allComments.map(comment => ({
      id: comment.id,
      novelId: comment.novelId,
      novelTitle: comment.novel?.title || '未知小说',
      content: comment.content,
      author: comment.user?.displayName || comment.user?.username || '未知用户',
      authorId: comment.user?.id,
      status: comment.status,
      likes: comment.likes,
      createdAt: comment.createdAt,
      user: comment.user ? {
        id: comment.user.id,
        username: comment.user.username,
        displayName: comment.user.displayName
      } : null
    }));

    // 按时间倒序排序（最新的在前）
    formattedComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // 返回评论数据
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

// DELETE /api/admin/comments - 批量删除评论（通过查询参数）
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commentIds = searchParams.get('ids');
    
    if (!commentIds) {
      return NextResponse.json(
        { error: '评论ID不能为空' },
        { status: 400 }
      );
    }

    const ids = commentIds.split(',');
    let successCount = 0;
    let failCount = 0;
    
    // 批量删除评论
    for (const commentId of ids) {
      try {
        await deleteComment(commentId);
        successCount++;
        console.log(`评论已删除 (ID: ${commentId})`);
      } catch (error) {
        failCount++;
        console.log(`删除评论失败 (ID: ${commentId}):`, error);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `批量删除完成：成功 ${successCount} 条，失败 ${failCount} 条`,
      successCount,
      failCount
    });
  } catch (error) {
    console.error('批量删除评论错误:', error);
    return NextResponse.json(
      { error: '批量删除评论失败' },
      { status: 500 }
    );
  }
}

// POST /api/admin/comments - 更新评论状态
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证必需字段
    if (!body.commentId || !body.action) {
      return NextResponse.json(
        { error: '缺少必需字段: commentId, action' },
        { status: 400 }
      );
    }

    // 验证操作类型
    const validActions = ['approve', 'reject'];
    if (!validActions.includes(body.action)) {
      return NextResponse.json(
        { error: '无效的操作类型' },
        { status: 400 }
      );
    }

    // 更新评论状态
    const newStatus = body.action === 'approve' ? 'APPROVED' : 'REJECTED';
    const updatedComment = await updateCommentStatus(body.commentId, newStatus);
    
    if (!updatedComment) {
      return NextResponse.json(
        { error: '更新评论状态失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      commentId: body.commentId,
      newStatus: newStatus
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('更新评论状态错误:', error);
    return NextResponse.json(
      { error: '更新评论状态失败' },
      { status: 500 }
    );
  }
}