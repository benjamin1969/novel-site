import { NextRequest, NextResponse } from 'next/server'

// 章节数据存储（模拟数据库）
let chaptersData: any[] = []

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

// 使用全局变量避免热重载时数据丢失
declare global {
  var __chapters_store: any[] | undefined
}

if (!global.__chapters_store) {
  global.__chapters_store = [...initialChapters]
}

// GET /api/novels/[id]/chapters - 获取小说的所有章节
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const novelId = params.id
    
    // 从全局存储获取章节数据
    const allChapters = global.__chapters_store || initialChapters
    
    // 过滤出该小说的章节
    const novelChapters = allChapters
      .filter(chapter => chapter.novelId === novelId)
      .sort((a, b) => a.number - b.number) // 按章节号排序
    
    return NextResponse.json(novelChapters)
    
  } catch (error) {
    console.error('获取章节错误:', error)
    return NextResponse.json(
      { error: '获取章节失败' },
      { status: 500 }
    )
  }
}

// POST /api/novels/[id]/chapters - 添加新章节
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const novelId = params.id
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
    
    // 计算下一章编号
    const existingChapters = global.__chapters_store.filter(chapter => chapter.novelId === novelId)
    const nextChapterNumber = existingChapters.length > 0 
      ? Math.max(...existingChapters.map(c => c.number)) + 1
      : 1
    
    // 创建新章节
    const newChapter = {
      id: `chapter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      novelId,
      number: nextChapterNumber, // 强制使用自动计算的章节编号
      title: body.title.trim(),
      content: body.content.trim(),
      createdAt: new Date().toISOString(),
      views: 0
    }
    
    // 添加到存储
    global.__chapters_store.push(newChapter)
    
    console.log(`新章节已添加: ${newChapter.title} (第${newChapter.number}章) 到小说 ${novelId}`)
    
    return NextResponse.json({
      success: true,
      message: '章节添加成功',
      chapter: newChapter
    })
    
  } catch (error) {
    console.error('添加章节错误:', error)
    return NextResponse.json(
      { error: '添加章节失败' },
      { status: 500 }
    )
  }
}