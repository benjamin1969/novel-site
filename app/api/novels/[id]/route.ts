import { NextRequest, NextResponse } from 'next/server'
import { getNovelById, updateNovel, deleteNovel } from '@/app/lib/novels'
import { createChapter, updateChapter } from '@/app/lib/novels'

// GET /api/novels/[id] - 获取特定小说
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const novelId = params.id
    
    // 获取小说详情
    const novel = await getNovelById(novelId)
    
    if (!novel) {
      return NextResponse.json(
        { error: '小说不存在' },
        { status: 404 }
      )
    }
    
    // 格式化返回数据
    const formattedNovel = {
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
    }
    
    return NextResponse.json(formattedNovel)
    
  } catch (error) {
    console.error('获取小说详情错误:', error)
    return NextResponse.json(
      { error: '获取小说详情失败' },
      { status: 500 }
    )
  }
}

// PUT /api/novels/[id] - 更新小说
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const novelId = params.id
    const body = await request.json()
    
    // 检查小说是否存在
    const existingNovel = await getNovelById(novelId)
    if (!existingNovel) {
      return NextResponse.json(
        { error: '小说不存在' },
        { status: 404 }
      )
    }
    
    // 更新小说基本信息
    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage
    if (body.status !== undefined) updateData.status = body.status
    
    const updatedNovel = await updateNovel(novelId, updateData)
    
    // 如果传入了content字段，更新第一章内容
    if (body.content !== undefined) {
      const chapters = existingNovel.chapters
      
      if (chapters.length > 0) {
        // 更新第一章内容
        const firstChapter = chapters[0]
        await updateChapter(firstChapter.id, {
          content: body.content.trim()
        })
        console.log(`第一章内容已更新: 小说 ${novelId}, 内容长度: ${body.content.length}`)
      } else {
        // 如果没有第一章，创建第一章
        await createChapter({
          novelId: novelId,
          title: '第一章',
          content: body.content.trim(),
          chapterNumber: 1
        })
        console.log(`第一章已创建: 小说 ${novelId}, 内容长度: ${body.content.length}`)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: '小说更新成功',
      novel: updatedNovel
    })
    
  } catch (error) {
    console.error('更新小说错误:', error)
    return NextResponse.json(
      { error: '更新小说失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/novels/[id] - 删除小说
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const novelId = params.id
    
    // 检查小说是否存在
    const existingNovel = await getNovelById(novelId)
    if (!existingNovel) {
      return NextResponse.json(
        { error: '小说不存在' },
        { status: 404 }
      )
    }
    
    // 删除小说
    await deleteNovel(novelId)
    
    return NextResponse.json({
      success: true,
      message: '小说删除成功'
    })
    
  } catch (error) {
    console.error('删除小说错误:', error)
    return NextResponse.json(
      { error: '删除小说失败' },
      { status: 500 }
    )
  }
}