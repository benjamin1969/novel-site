import { NextRequest, NextResponse } from 'next/server';
import { novels } from '../cf-unified-data';

// 章节存储引用
declare global {
  var __chapters_store: any[] | undefined;
}

// POST /api/novels - 创建新小说
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { title, description, author, content, status } = body;
    
    if (!title || !description || !author) {
      return NextResponse.json(
        { error: '标题、描述和作者不能为空' },
        { status: 400 }
      );
    }
    
    // 创建新小说，支持草稿状态
    const newNovel = novels.add({
      title,
      description,
      author,
      status: status || 'published',   // 支持草稿状态，默认直接发布
      views: 0,
      likes: 0,
      chapters: 1,
      createdAt: new Date().toISOString().split('T')[0]
    });
    
    // 自动创建第一章
    if (!global.__chapters_store) {
      global.__chapters_store = [];
    }
    
    const newChapter = {
      id: `chapter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      novelId: newNovel.id,
      number: 1,
      title: '第一章',
      content: content || description || '',
      createdAt: new Date().toISOString(),
      views: 0
    };
    
    global.__chapters_store.push(newChapter);
    
    console.log(`新小说已创建: 《${title}》 by ${author}, 第一章内容长度: ${(content || description || '').length}`);
    console.log(`第一章已自动创建: ${newChapter.title}, 章节ID: ${newChapter.id}`);
    
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
    // 只返回已发布的小说
    const publishedNovels = novels.getPublished();
    
    return NextResponse.json(publishedNovels, {
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