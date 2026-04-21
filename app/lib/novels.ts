// app/lib/novels.ts - 小说数据工具
import { prisma } from './db'

// 获取所有已发布小说
export async function getAllPublishedNovels() {
  try {
    const novels = await prisma.novel.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true
          }
        },
        chapters: {
          where: {
            status: 'PUBLISHED'
          },
          orderBy: {
            chapterNumber: 'asc'
          },
          select: {
            id: true,
            title: true,
            chapterNumber: true,
            content: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return novels
  } catch (error) {
    console.error('获取小说列表错误:', error)
    return []
  }
}

// 获取用户的小说
export async function getUserNovels(authorId: string) {
  try {
    const novels = await prisma.novel.findMany({
      where: {
        authorId
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true
          }
        },
        chapters: {
          where: {
            status: 'PUBLISHED'
          },
          orderBy: {
            chapterNumber: 'asc'
          },
          select: {
            id: true,
            title: true,
            chapterNumber: true,
            content: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return novels
  } catch (error) {
    console.error('获取用户小说错误:', error)
    return []
  }
}

// 获取小说详情
export async function getNovelById(id: string) {
  try {
    const novel = await prisma.novel.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true
          }
        },
        chapters: {
          where: {
            status: 'PUBLISHED'
          },
          orderBy: {
            chapterNumber: 'asc'
          },
          select: {
            id: true,
            title: true,
            chapterNumber: true,
            content: true,
            createdAt: true
          }
        }
      }
    })
    
    return novel
  } catch (error) {
    console.error('获取小说详情错误:', error)
    return null
  }
}

// 创建小说
export async function createNovel(data: {
  title: string
  description: string
  authorId: string
  coverImage?: string
}) {
  try {
    const novel = await prisma.novel.create({
      data: {
        title: data.title,
        description: data.description,
        authorId: data.authorId,
        coverImage: data.coverImage || '/default-cover.jpg',
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true
          }
        }
      }
    })
    
    return novel
  } catch (error) {
    console.error('创建小说错误:', error)
    throw error
  }
}

// 更新小说
export async function updateNovel(id: string, data: any) {
  try {
    const novel = await prisma.novel.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true
          }
        }
      }
    })
    
    return novel
  } catch (error) {
    console.error('更新小说错误:', error)
    throw error
  }
}

// 删除小说
export async function deleteNovel(id: string) {
  try {
    // 先删除所有章节
    await prisma.chapter.deleteMany({
      where: { novelId: id }
    })
    
    // 删除小说
    const novel = await prisma.novel.delete({
      where: { id }
    })
    
    return novel
  } catch (error) {
    console.error('删除小说错误:', error)
    throw error
  }
}

// 创建章节
export async function createChapter(data: {
  novelId: string
  title: string
  content: string
  chapterNumber: number
}) {
  try {
    const chapter = await prisma.chapter.create({
      data: {
        novelId: data.novelId,
        title: data.title,
        content: data.content,
        chapterNumber: data.chapterNumber,
        status: 'PUBLISHED'
      }
    })
    
    return chapter
  } catch (error) {
    console.error('创建章节错误:', error)
    throw error
  }
}

// 获取章节详情
export async function getChapterById(id: string) {
  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        novel: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true
              }
            }
          }
        }
      }
    })
    
    return chapter
  } catch (error) {
    console.error('获取章节详情错误:', error)
    return null
  }
}

// 更新章节
export async function updateChapter(id: string, data: any) {
  try {
    const chapter = await prisma.chapter.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })
    
    return chapter
  } catch (error) {
    console.error('更新章节错误:', error)
    throw error
  }
}

// 删除章节
export async function deleteChapter(id: string) {
  try {
    const chapter = await prisma.chapter.delete({
      where: { id }
    })
    
    return chapter
  } catch (error) {
    console.error('删除章节错误:', error)
    throw error
  }
}

// 获取小说的章节列表
export async function getNovelChapters(novelId: string) {
  try {
    const chapters = await prisma.chapter.findMany({
      where: {
        novelId,
        status: 'PUBLISHED'
      },
      orderBy: {
        chapterNumber: 'asc'
      },
      select: {
        id: true,
        title: true,
        chapterNumber: true,
        content: true,
        createdAt: true
      }
    })
    
    return chapters
  } catch (error) {
    console.error('获取章节列表错误:', error)
    return []
  }
}

// 获取所有小说（管理员用）
export async function getAllNovels() {
  try {
    const novels = await prisma.novel.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true
          }
        },
        chapters: {
          orderBy: {
            chapterNumber: 'asc'
          },
          select: {
            id: true,
            title: true,
            chapterNumber: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return novels
  } catch (error) {
    console.error('获取所有小说错误:', error)
    return []
  }
}