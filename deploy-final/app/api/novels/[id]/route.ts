import { NextRequest, NextResponse } from 'next/server'
import { novels } from '../../cf-unified-data'

// 章节存储引用
declare global {
  var __chapters_store: any[] | undefined
}

// GET /api/novels/[id] - 获取特定小说
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const novelId = params.id
    
    // 获取所有小说
    const allNovels = novels.getAll()
    
    // 查找特定小说
    const novel = allNovels.find(n => n.id === novelId)
    
    if (!novel) {
      return NextResponse.json(
        { error: '小说不存在' },
        { status: 404 }
      )
    }
    
    // 检查小说状态：如果是草稿，需要验证用户权限
    if (novel.status === 'draft') {
      // 这里可以添加登录验证逻辑
      // 暂时允许访问，但前端会检查权限
    }
    
    return NextResponse.json(novel)
    
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
    
    // 查找小说
    const allNovels = novels.getAll()
    const novelIndex = allNovels.findIndex(n => n.id === novelId)
    
    if (novelIndex === -1) {
      return NextResponse.json(
        { error: '小说不存在' },
        { status: 404 }
      )
    }
    
    // 更新小说
    const updatedNovel = {
      ...allNovels[novelIndex],
      ...body,
      id: novelId // 保持ID不变
    }
    
    // 保存更新
    novels.update(novelId, updatedNovel)
    
    // 如果传入了content字段，更新第一章内容
    if (body.content !== undefined && global.__chapters_store) {
      // 查找小说的第一章
      const chapterIndex = global.__chapters_store.findIndex(
        c => c.novelId === novelId && c.number === 1
      )
      
      if (chapterIndex !== -1) {
        // 更新第一章内容
        global.__chapters_store[chapterIndex] = {
          ...global.__chapters_store[chapterIndex],
          content: body.content.trim(),
          updatedAt: new Date().toISOString()
        }
        
        console.log(`第一章内容已更新: 小说 ${novelId}, 内容长度: ${body.content.length}`)
      } else {
        // 如果没有第一章，创建第一章
        const newChapter = {
          id: `chapter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          novelId,
          number: 1,
          title: '第一章',
          content: body.content.trim(),
          createdAt: new Date().toISOString(),
          views: 0
        }
        
        global.__chapters_store.push(newChapter)
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
    
    // 删除小说
    const deleted = novels.delete(novelId)
    
    if (!deleted) {
      return NextResponse.json(
        { error: '小说不存在' },
        { status: 404 }
      )
    }
    
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