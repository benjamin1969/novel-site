// app/lib/auth.ts - 数据库认证工具
import { hash, compare } from 'bcryptjs'
import { prisma } from './db'

// 密码加密
const SALT_ROUNDS = 12

// 用户认证
export async function authenticateUser(username: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username }
    })
    
    if (!user) {
      console.log('用户不存在:', username)
      return null
    }
    
    // 验证密码
    const isValid = await compare(password, user.password)
    if (!isValid) {
      console.log('密码错误:', username)
      return null
    }
    
    // 更新最后登录时间
    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() }
    })
    
    // 移除密码字段
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
    
  } catch (error) {
    console.error('认证错误:', error)
    return null
  }
}

// 创建用户
export async function createUser(username: string, password: string, displayName?: string) {
  try {
    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })
    
    if (existingUser) {
      throw new Error('用户已存在')
    }
    
    // 加密密码
    const hashedPassword = await hash(password, SALT_ROUNDS)
    
    // 创建用户
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        displayName: displayName || username,
        role: 'USER'
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        createdAt: true
      }
    })
    
    return user
    
  } catch (error) {
    console.error('创建用户错误:', error)
    throw error
  }
}

// 获取用户信息
export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        isMuted: true,
        mutedUntil: true,
        muteReason: true,
        createdAt: true
      }
    })
    
    return user
  } catch (error) {
    console.error('获取用户错误:', error)
    return null
  }
}

// 获取用户信息（通过用户名）
export async function getUserByUsername(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        isMuted: true,
        mutedUntil: true,
        muteReason: true,
        createdAt: true
      }
    })
    
    return user
  } catch (error) {
    console.error('获取用户错误:', error)
    return null
  }
}

// 更新用户信息
export async function updateUser(id: string, data: any) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    return user
  } catch (error) {
    console.error('更新用户错误:', error)
    throw error
  }
}

// 禁言用户
export async function muteUser(userId: string, days: number, reason: string = '违反社区规则') {
  try {
    const mutedUntil = new Date()
    mutedUntil.setDate(mutedUntil.getDate() + days)
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        isMuted: true,
        mutedUntil,
        muteReason: reason,
        updatedAt: new Date()
      }
    })
    
    return user
  } catch (error) {
    console.error('禁言用户错误:', error)
    throw error
  }
}

// 解禁用户
export async function unmuteUser(userId: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        isMuted: false,
        mutedUntil: null,
        muteReason: null,
        updatedAt: new Date()
      }
    })
    
    return user
  } catch (error) {
    console.error('解禁用户错误:', error)
    throw error
  }
}

// 检查用户是否被禁言
export async function isUserMuted(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isMuted: true,
        mutedUntil: true
      }
    })
    
    if (!user) return false
    
    // 检查禁言是否已过期
    if (user.isMuted && user.mutedUntil) {
      const now = new Date()
      if (now > user.mutedUntil) {
        // 自动解禁
        await unmuteUser(userId)
        return false
      }
      return true
    }
    
    return false
  } catch (error) {
    console.error('检查禁言状态错误:', error)
    return false
  }
}