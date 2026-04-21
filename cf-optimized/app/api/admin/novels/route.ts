import { NextRequest, NextResponse } from 'next/server';
import { novels } from '../../cf-unified-data';

// GET /api/admin/novels - 获取所有小说
export async function GET(request: NextRequest) {
  try {
    // 从查询参数中获取过滤条件
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'all', 'published', 'draft'
    const search = searchParams.get('search'); // 搜索关键词
    
    // 从统一数据存储获取小说
    let filteredNovels = novels.getAll();
    
    // 按状态过滤
    if (status && status !== 'all') {
      filteredNovels = filteredNovels.filter(novel => novel.status === status);
    }
    
    // 按搜索关键词过滤
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredNovels = filteredNovels.filter(novel => 
        novel.title.toLowerCase().includes(searchTerm) ||
        novel.author.toLowerCase().includes(searchTerm) ||
        novel.content.toLowerCase().includes(searchTerm)
      );
    }
    
    // 返回小说数据
    return NextResponse.json(filteredNovels, {
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

// DELETE /api/admin/novels - 删除小说
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const novelId = searchParams.get('id');
    
    if (!novelId) {
      return NextResponse.json(
        { error: '小说ID不能为空' },
        { status: 400 }
      );
    }
    
    // 使用统一数据存储删除小说
    const success = novels.delete(novelId);
    
    if (!success) {
      return NextResponse.json(
        { error: '小说不存在' },
        { status: 404 }
      );
    }
    
    console.log(`小说已删除 (ID: ${novelId})`);
    
    return NextResponse.json({
      success: true,
      message: '小说已删除',
      novelId: novelId
    });
  } catch (error) {
    console.error('删除小说错误:', error);
    return NextResponse.json(
      { error: '删除小说失败' },
      { status: 500 }
    );
  }
}

// POST /api/admin/novels - 创建新小说
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证必需字段
    if (!body.title || !body.author || !body.content) {
      return NextResponse.json(
        { error: '缺少必需字段: title, author, content' },
        { status: 400 }
      );
    }
    
    // 创建新小说
    const newNovel = {
      id: `novel_${Date.now()}`,
      title: body.title,
      author: body.author,
      content: body.content,
      views: 0,
      likes: 0,
      status: body.status || 'draft',
      createdAt: new Date().toISOString(),
    };
    
    // 注意：这里只是示例，实际应该保存到数据库
    // novels.push(newNovel);
    
    return NextResponse.json(newNovel, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('创建小说错误:', error);
    return NextResponse.json(
      { error: '创建小说失败' },
      { status: 500 }
    );
  }
}