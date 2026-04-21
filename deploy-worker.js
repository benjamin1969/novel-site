// 超精简部署版本 - 直接部署到 Cloudflare Pages
import { PrismaClient } from '@prisma/client/edge'

const prisma = new PrismaClient()

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    
    // 健康检查
    if (url.pathname === '/health') {
      return new Response('OK', { status: 200 })
    }
    
    // API 路由
    if (url.pathname.startsWith('/api/')) {
      return handleAPI(request, url)
    }
    
    // 返回简单的前端页面
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>简阅小说平台</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            .status { background: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .success { color: green; }
            .endpoints { margin-top: 30px; }
            .endpoint { background: #e8f4f8; padding: 10px; margin: 10px 0; border-radius: 3px; }
          </style>
        </head>
        <body>
          <h1>简阅小说平台</h1>
          <div class="status">
            <p class="success">✅ 系统运行正常</p>
            <p>数据库: Neon.tech PostgreSQL</p>
            <p>部署平台: Cloudflare Pages</p>
            <p>域名: dskxx.ccwu.cc</p>
          </div>
          
          <div class="endpoints">
            <h3>API 端点:</h3>
            <div class="endpoint"><strong>GET</strong> /api/novels - 获取所有小说</div>
            <div class="endpoint"><strong>POST</strong> /api/auth/login - 用户登录</div>
            <div class="endpoint"><strong>GET</strong> /api/comments?novelId=1 - 获取评论</div>
            <div class="endpoint"><strong>GET</strong> /health - 健康检查</div>
          </div>
          
          <div style="margin-top: 40px; font-size: 14px; color: #666;">
            <p>测试账号:</p>
            <ul>
              <li>管理员: admin / admin123</li>
              <li>普通用户: 张三 / password123</li>
              <li>普通用户: 李四 / password123</li>
            </ul>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })
  }
}

async function handleAPI(request, url) {
  const path = url.pathname
  
  try {
    // 获取所有小说
    if (path === '/api/novels' && request.method === 'GET') {
      const novels = await prisma.novel.findMany({
        where: { status: 'PUBLISHED' },
        include: { author: true },
        take: 20
      })
      return Response.json(novels)
    }
    
    // 用户登录
    if (path === '/api/auth/login' && request.method === 'POST') {
      const body = await request.json()
      const { username, password } = body
      
      const user = await prisma.user.findFirst({
        where: { username }
      })
      
      if (user) {
        return Response.json({
          success: true,
          token: 'demo-token-' + Date.now(),
          user: {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            role: user.role
          }
        })
      }
      
      return Response.json({ error: '用户不存在' }, { status: 401 })
    }
    
    // 获取评论
    if (path === '/api/comments' && request.method === 'GET') {
      const novelId = url.searchParams.get('novelId')
      const where = novelId ? { novelId: parseInt(novelId) } : {}
      
      const comments = await prisma.comment.findMany({
        where,
        include: { user: true },
        take: 50
      })
      return Response.json(comments)
    }
    
    // 默认返回 404
    return new Response('API 端点不存在', { status: 404 })
    
  } catch (error) {
    console.error('API 错误:', error)
    return Response.json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}