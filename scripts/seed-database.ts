#!/usr/bin/env tsx
// scripts/seed-database.ts - 数据库种子脚本
import { hash } from 'bcryptjs'
import { prisma } from '../app/lib/db'

async function seedDatabase() {
  console.log('🚀 开始初始化数据库...')
  
  try {
    // 清除现有数据（按依赖顺序）
    console.log('🗑️  清除现有数据...')
    await prisma.comment.deleteMany()
    await prisma.chapter.deleteMany()
    await prisma.novel.deleteMany()
    await prisma.user.deleteMany()
    await prisma.siteSetting.deleteMany()
    
    console.log('👥 创建用户...')
    
    // 创建管理员用户
    const adminPassword = await hash('admin123', 12)
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        password: adminPassword,
        displayName: '管理员',
        role: 'ADMIN'
      }
    })
    
    // 创建普通用户
    const user1Password = await hash('password123', 12)
    const user1 = await prisma.user.create({
      data: {
        username: '张三',
        password: user1Password,
        displayName: '张三',
        role: 'USER'
      }
    })
    
    const user2Password = await hash('password123', 12)
    const user2 = await prisma.user.create({
      data: {
        username: '李四',
        password: user2Password,
        displayName: '李四',
        role: 'USER'
      }
    })
    
    console.log('📚 创建小说和章节...')
    
    // 创建小说1 - 张三的故事
    const novel1 = await prisma.novel.create({
      data: {
        title: '张三的冒险故事',
        description: '一个关于勇气和友谊的冒险故事，适合小学生阅读。',
        authorId: user1.id,
        coverImage: '/default-cover.jpg',
        status: 'PUBLISHED',
        category: '冒险'
      }
    })
    
    // 为小说1创建章节
    await prisma.chapter.create({
      data: {
        novelId: novel1.id,
        title: '第一章：神秘的森林',
        content: '在一个阳光明媚的早晨，张三和他的朋友们决定去森林探险。森林里充满了各种神奇的事物...',
        chapterNumber: 1,
        status: 'PUBLISHED',
        wordCount: 156
      }
    })
    
    await prisma.chapter.create({
      data: {
        novelId: novel1.id,
        title: '第二章：遇见小精灵',
        content: '在森林深处，张三发现了一个闪闪发光的小精灵。小精灵告诉他们一个秘密...',
        chapterNumber: 2,
        status: 'PUBLISHED',
        wordCount: 142
      }
    })
    
    // 创建小说2 - 李四的科幻故事
    const novel2 = await prisma.novel.create({
      data: {
        title: '李四的太空冒险',
        description: '一个关于太空探索和科学发现的科幻故事，激发孩子们的想象力。',
        authorId: user2.id,
        coverImage: '/default-cover.jpg',
        status: 'PUBLISHED',
        category: '科幻'
      }
    })
    
    await prisma.chapter.create({
      data: {
        novelId: novel2.id,
        title: '第一章：火箭发射',
        content: '李四站在发射台上，看着巨大的火箭准备升空。这是他第一次参加太空任务...',
        chapterNumber: 1,
        status: 'PUBLISHED',
        wordCount: 178
      }
    })
    
    console.log('💬 创建评论...')
    
    // 为小说1创建评论
    await prisma.comment.create({
      data: {
        novelId: novel1.id,
        userId: user2.id,
        content: '这个故事真有趣！我喜欢森林探险的部分。',
        status: 'APPROVED',
        likes: 3
      }
    })
    
    await prisma.comment.create({
      data: {
        novelId: novel1.id,
        userId: admin.id,
        content: '写得很好，适合小学生阅读。继续加油！',
        status: 'APPROVED',
        likes: 5
      }
    })
    
    // 为小说2创建评论
    await prisma.comment.create({
      data: {
        novelId: novel2.id,
        userId: user1.id,
        content: '太空冒险太酷了！我也想当宇航员。',
        status: 'APPROVED',
        likes: 2
      }
    })
    
    console.log('⚙️ 创建站点设置...')
    
    // 创建站点设置
    await prisma.siteSetting.createMany({
      data: [
        {
          key: 'site_name',
          value: '简阅小说平台',
          description: '网站名称'
        },
        {
          key: 'site_description',
          value: '小学生专属的原创小说天地',
          description: '网站描述'
        },
        {
          key: 'welcome_message',
          value: '欢迎来到简阅小说平台！在这里，你可以阅读和创作属于你自己的故事。',
          description: '欢迎消息'
        },
        {
          key: 'max_comment_length',
          value: '500',
          description: '评论最大长度'
        },
        {
          key: 'allow_registration',
          value: 'true',
          description: '是否允许注册'
        }
      ]
    })
    
    console.log('✅ 数据库初始化完成！')
    console.log('\n📋 测试账号:')
    console.log('   管理员: admin / admin123')
    console.log('   普通用户: 张三 / password123')
    console.log('   普通用户: 李四 / password123')
    console.log('\n📚 测试小说:')
    console.log('   1. 张三的冒险故事 (2章)')
    console.log('   2. 李四的太空冒险 (1章)')
    console.log('\n💬 测试评论: 3条')
    
  } catch (error) {
    console.error('❌ 初始化失败:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// 运行种子脚本
seedDatabase().catch((error) => {
  console.error('❌ 脚本执行失败:', error)
  process.exit(1)
})