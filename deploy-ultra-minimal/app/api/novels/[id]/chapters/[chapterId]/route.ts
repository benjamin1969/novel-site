import { NextRequest, NextResponse } from 'next/server'

// 使用全局变量避免热重载时数据丢失
declare global {
  var __chapters_store: any[] | undefined
}

// 初始化一些示例章节数据
const initialChapters = [
  {
    id: 'chapter_1',
    novelId: 'novel_1',
    number: 1,
    title: '第一章：冒险的开始',
    content: '这是一个关于小明冒险的故事...小明在森林里发现了一个神秘的洞穴。',
    createdAt: '2024-01-15T10:30:00Z',
    views: 50
  },
  {
    id: 'chapter_2',
    novelId: 'novel_1',
    number: 2,
    title: '第二章：洞穴的秘密',
    content: '小明进入洞穴，发现里面布满了发光的宝石...',
    createdAt: '2024-01-16T14:20:00Z',
    views: 35
  },
  {
    id: 'chapter_3',
    novelId: 'novel_1',
    number: 3,
    title: '第三章：守护者',
    content: '突然，一个巨大的守护者出现了...',
    createdAt: '2024-01-17T09:45:00Z',
    views: 25
  },
  {
    id: 'chapter_4',
    novelId: 'novel_2',
    number: 1,
    title: '第一章：太空启程',
    content: '小红和她的团队准备开始太空探险...',
    createdAt: '2024-01-20T14:45:00Z',
    views: 40
  },
  {
    id: 'chapter_5',
    novelId: 'novel_2',
    number: 2,
    title: '第二章：未知星球',
    content: '他们降落在一个未知的星球上...',
    createdAt: '2024-01-21T11:30:00Z',
    views: 30
  },
  {
    id: 'chapter_6',
    novelId: 'novel_3',
    number: 1,
    title: '第一章：未完成的故事',
    content: '这是一个还在创作中的故事...',
    createdAt: '2024-02-01T09:15:00Z',
    views: 12
  }
]

if (!global.__chapters_store) {
  global.__chapters_store = [...initialChapters]
}

// GET /api/novels/[id]/chapters/[chapterId] - 获取特定章节
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string, chapterId: string } }
) {
  try {
    const novelId = params.id
    const chapterId = params.chapterId
    
    // 从全局存储获取章节数据
    const allChapters = global.__chapters_store || initialChapters
    
    // 查找特定章节
    const chapter = allChapters.find(c => c.id === chapterId && c.novelId === novelId)
    
    if (!chapter) {
      return NextResponse.json(
        { error: '章节不存在' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(chapter)
    
  } catch (error) {
    console.error('获取章节错误:', error)
    return NextResponse.json(
      { error: '获取章节失败' },
      { status: 500 }
    )
  }
}

// PUT /api/novels/[id]/chapters/[chapterId] - 更新章节
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string, chapterId: string } }
) {
  try {
    const novelId = params.id
    const chapterId = params.chapterId
    const body = await request.json()
    
    // 验证必需字段
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: '章节标题和内容不能为空' },
        { status: 400 }
      )
    }
    
    // 获取当前章节数据
    if (!global.__chapters_store) {
      global.__chapters_store = [...initialChapters]
    }
    
    // 查找章节
    const chapterIndex = global.__chapters_store.findIndex(c => c.id === chapterId && c.novelId === novelId)
    
    if (chapterIndex === -1) {
      return NextResponse.json(
        { error: '章节不存在' },
        { status: 404 }
      )
    }
    
    // 更新章节（保持章节编号不变）
    const updatedChapter = {
      ...global.__chapters_store[chapterIndex],
      title: body.title.trim(),
      content: body.content.trim(),
      updatedAt: new Date().toISOString()
    }
    
    global.__chapters_store[chapterIndex] = updatedChapter
    
    console.log(`章节已更新: ${updatedChapter.title} (第${updatedChapter.number}章)`)
    
    return NextResponse.json({
      success: true,
      message: '章节更新成功',
      chapter: updatedChapter
    })
    
  } catch (error) {
    console.error('更新章节错误:', error)
    return NextResponse.json(
      { error: '更新章节失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/novels/[id]/chapters/[chapterId] - 删除章节
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string, chapterId: string } }
) {
  try {
    const novelId = params.id
    const chapterId = params.chapterId
    
    // 获取当前章节数据
    if (!global.__chapters_store) {
      global.__chapters_store = [...initialChapters]
    }
    
    // 查找章节
    const chapterIndex = global.__chapters_store.findIndex(c => c.id === chapterId && c.novelId === novelId)
    
    if (chapterIndex === -1) {
      return NextResponse.json(
        { error: '章节不存在' },
        { status: 404 }
      )
    }
    
    const deletedChapter = global.__chapters_store[chapterIndex]
    
    // 删除章节
    global.__chapters_store.splice(chapterIndex, 1)
    
    console.log(`章节已删除: ${deletedChapter.title} (第${deletedChapter.number}章)`)
    
    // 重新排序剩余章节（如果需要）
    const remainingChapters = global.__chapters_store.filter(c => c.novelId === novelId)
    remainingChapters.sort((a, b) => a.number - b.number)
    
    // 更新章节编号（如果需要）
    remainingChapters.forEach((chapter, index) => {
      if (chapter.number !== index + 1) {
        chapter.number = index + 1
        console.log(`更新章节编号: ${chapter.title} -> 第${chapter.number}章`)
      }
    })
    
    return NextResponse.json({
      success: true,
      message: '章节删除成功'
    })
    
  } catch (error) {
    console.error('删除章节错误:', error)
    return NextResponse.json(
      { error: '删除章节失败' },
      { status: 500 }
    )
  }
}