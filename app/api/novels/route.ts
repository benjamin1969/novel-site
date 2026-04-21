import { NextRequest, NextResponse } from 'next/server';
import { getAllPublishedNovels, createNovel, getNovelById } from '@/app/lib/novels';
import { createChapter } from '@/app/lib/novels';

// POST /api/novels - 创建新小说
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { title, description, authorId, content } = body;
    
    if (!title || !description || !authorId) {
      return NextResponse.json(
        { error: '标题、描述和作者不能为空' },
        { status: 400 }
      );
    }
    
    // 创建新小说
    const newNovel = await createNovel({
      title,
      description,
      authorId,
      coverImage: '/default-cover.jpg'
    });
    
    // 自动创建第一章（如果有内容）
    if (content && content.trim()) {
      await createChapter({
        novelId: newNovel.id,
        title: '第一章',
        content: content,
        chapterNumber: 1
      });
    }
    
    console.log(`新小说已创建: 《${title}》 by ${authorId}, 小说ID: ${newNovel.id}`);
    
    return NextResponse.json({
      success: true,
      message: '小说创建成功',
      novel: newNovel
    }, { status: 201 });
    
  } catch (error) {
    console.error('创建小说错误:', error);
    return NextResponse.json(
      { error: '创建小说失败' },
      { status: 500 }
    );
  }
}

// GET /api/novels - 获取所有已发布的小说（供作品库页面使用）
export async function GET(request: NextRequest) {
  try {
    // 获取所有已发布的小说
    const publishedNovels = await getAllPublishedNovels();
    
    // 格式化返回数据
    const formattedNovels = publishedNovels.map(novel => ({
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
    console.error('获取小说数据错误:', error);
    return NextResponse.json(
      { error: '获取小说数据失败' },
      { status: 500 }
    );
  }
}