import { NextRequest, NextResponse } from 'next/server';
import { novels } from '../cf-unified-data';

// GET /api/my-novels - 获取当前用户的小说
export async function GET(request: NextRequest) {
  try {
    // 从查询参数获取用户名
    const { searchParams } = new URL(request.url);
    const author = searchParams.get('author');
    
    if (!author) {
      return NextResponse.json(
        { error: '需要作者参数' },
        { status: 400 }
      );
    }
    
    // 获取所有小说，然后按作者过滤
    const allNovels = novels.getAll();
    const userNovels = allNovels.filter(novel => novel.author === author);
    
    return NextResponse.json(userNovels, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('获取用户小说错误:', error);
    return NextResponse.json(
      { error: '获取用户小说失败' },
      { status: 500 }
    );
  }
}