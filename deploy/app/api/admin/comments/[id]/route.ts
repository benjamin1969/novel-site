import { NextRequest, NextResponse } from 'next/server';
import { comments } from '../../../cf-unified-data';

// DELETE /api/admin/comments/[id] - 删除单个评论
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commentId = params.id;
    
    if (!commentId) {
      return NextResponse.json(
        { error: '评论ID不能为空' },
        { status: 400 }
      );
    }
    
    // 使用统一数据删除评论
    const success = comments.delete(commentId);
    
    if (!success) {
      return NextResponse.json(
        { error: '评论不存在' },
        { status: 404 }
      );
    }
    
    console.log(`评论已删除 (ID: ${commentId})`);
    
    return NextResponse.json({
      success: true,
      message: '评论已删除',
      commentId: commentId
    });
  } catch (error) {
    console.error('删除评论错误:', error);
    return NextResponse.json(
      { error: '删除评论失败' },
      { status: 500 }
    );
  }
}

// GET /api/admin/comments/[id] - 获取单个评论详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commentId = params.id;
    
    if (!commentId) {
      return NextResponse.json(
        { error: '评论ID不能为空' },
        { status: 400 }
      );
    }
    
    // 获取评论详情
    const comment = comments.getById(commentId);
    
    if (!comment) {
      return NextResponse.json(
        { error: '评论不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(comment, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('获取评论详情错误:', error);
    return NextResponse.json(
      { error: '获取评论详情失败' },
      { status: 500 }
    );
  }
}