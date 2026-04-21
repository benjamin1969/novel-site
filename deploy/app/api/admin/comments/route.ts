import { NextRequest, NextResponse } from 'next/server';
import { comments } from '../../cf-unified-data';

// GET /api/admin/comments - 获取所有评论（无需审核，直接返回所有评论）
export async function GET(request: NextRequest) {
  try {
    // 获取所有评论（现在所有评论都是已发布的）
    const allComments = [...comments.getAll()];
    
    // 按时间倒序排序（最新的在前）
    allComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // 返回评论数据
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
      const success = comments.delete(commentId);
      if (success) {
        successCount++;
        console.log(`评论已删除 (ID: ${commentId})`);
      } else {
        failCount++;
        console.log(`删除评论失败 (ID: ${commentId})`);
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
    
    // 查找并更新评论状态
    const comment = comments.getById(body.commentId);
    if (!comment) {
      return NextResponse.json(
        { error: '评论不存在' },
        { status: 404 }
      );
    }
    
    // 更新评论状态
    const validActions = ['approve', 'reject'];
    if (!validActions.includes(body.action)) {
      return NextResponse.json(
        { error: '无效的操作类型' },
        { status: 400 }
      );
    }
    
    const newStatus = body.action === 'approve' ? 'approved' : 'rejected';
    const updatedComment = comments.update(body.commentId, { status: newStatus });
    
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