import { NextRequest, NextResponse } from 'next/server';
import { getUserNovels } from '@/app/lib/novels';
import { getUserByUsername } from '@/app/lib/auth';

// GET /api/my-novels - 获取当前用户的小说
export async function GET(request: NextRequest) {
  try {
    // 从查询参数获取用户名
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('author');
    
    if (!username) {
      return NextResponse.json(
        { error: '需要作者参数' },
        { status: 400 }
      );
    }
    
    // 获取用户信息
    const user = await getUserByUsername(username);
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 获取用户的小说
    const userNovels = await getUserNovels(user.id);
    
    // 格式化返回数据
    const formattedNovels = userNovels.map(novel => ({
      id: novel.id,
      title: novel.title,
      description: novel.description,
      author: novel.author.displayName || novel.author.username,
      authorId: novel.author.id,
      coverImage: novel.coverImage || '/default-cover.jpg',
      status: novel.status,
      views: novel.views,
      likes: novel.likes,
      chapterCount: novel.chapters.length,
      chapters: novel.chapters.map(chapter => ({
        id: chapter.id,
        title: chapter.title,
        chapterNumber: chapter.chapterNumber,
        content: chapter.content,
        createdAt: chapter.createdAt
      })),
      createdAt: novel.createdAt
    }));
    
    return NextResponse.json(formattedNovels, {
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