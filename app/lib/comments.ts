// app/lib/comments.ts - 评论数据工具
import { prisma } from './db'

// 获取小说的评论
export async function getNovelComments(novelId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        novelId,
        status: 'APPROVED'
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            isMuted: true,
            mutedUntil: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return comments
  } catch (error) {
    console.error('获取评论错误:', error)
    return []
  }
}

// 创建评论
export async function createComment(data: {
  novelId: string
  userId: string
  content: string
}) {
  try {
    // 检查用户是否被禁言
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      select: {
        isMuted: true,
        mutedUntil: true
      }
    })
    
    if (user?.isMuted && user.mutedUntil) {
      const now = new Date()
      if (now < user.mutedUntil) {
        throw new Error('用户已被禁言，无法发表评论')
      }
    }
    
    const comment = await prisma.comment.create({
      data: {
        novelId: data.novelId,
        userId: data.userId,
        content: data.content,
        status: 'APPROVED' // 直接批准，无需审核
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true
          }
        }
      }
    })
    
    return comment
  } catch (error) {
    console.error('创建评论错误:', error)
    throw error
  }
}

// 删除评论
export async function deleteComment(id: string) {
  try {
    const comment = await prisma.comment.delete({
      where: { id }
    })
    
    return comment
  } catch (error) {
    console.error('删除评论错误:', error)
    throw error
  }
}

// 获取所有评论（管理员用）
export async function getAllComments() {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true
          }
        },
        novel: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return comments
  } catch (error) {
    console.error('获取所有评论错误:', error)
    return []
  }
}

// 更新评论状态
export async function updateCommentStatus(id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') {
  try {
    const comment = await prisma.comment.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date()
      }
    })
    
    return comment
  } catch (error) {
    console.error('更新评论状态错误:', error)
    throw error
  }
}