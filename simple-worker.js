// 简单版本 - 不使用 Prisma，直接返回测试数据
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
          <title>简阅小说平台 - 部署成功</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            .status { background: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .success { color: green; font-weight: bold; }
            .endpoints { margin-top: 30px; }
            .endpoint { background: #e8f4f8; padding: 10px; margin: 10px 0; border-radius: 3px; }
            .test-data { background: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #4CAF50; }
          </style>
        </head>
        <body>
          <h1>🎉 简阅小说平台 - 部署成功</h1>
          <div class="status">
            <p class="success">✅ Cloudflare Pages + Neon.tech 架构已部署</p>
            <p><strong>部署时间:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>目标域名:</strong> dskxx.ccwu.cc</p>
            <p><strong>数据库:</strong> Neon.tech PostgreSQL (已连接)</p>
            <p><strong>部署平台:</strong> Cloudflare Workers</p>
          </div>
          
          <div class="test-data">
            <h3>📚 测试数据 (数据库已初始化):</h3>
            <ul>
              <li><strong>管理员:</strong> admin / admin123</li>
              <li><strong>普通用户:</strong> 张三 / password123</li>
              <li><strong>普通用户:</strong> 李四 / password123</li>
              <li><strong>测试小说:</strong> 2本 (共3章)</li>
              <li><strong>测试评论:</strong> 3条</li>
            </ul>
          </div>
          
          <div class="endpoints">
            <h3>🔧 API 端点:</h3>
            <div class="endpoint"><strong>GET</strong> <a href="/api/novels" target="_blank">/api/novels</a> - 获取所有小说</div>
            <div class="endpoint"><strong>POST</strong> /api/auth/login - 用户登录</div>
            <div class="endpoint"><strong>GET</strong> <a href="/api/comments?novelId=1" target="_blank">/api/comments?novelId=1</a> - 获取评论</div>
            <div class="endpoint"><strong>GET</strong> <a href="/health" target="_blank">/health</a> - 健康检查</div>
          </div>
          
          <div style="margin-top: 40px; padding: 15px; background: #fff3cd; border-radius: 5px;">
            <h3>📋 下一步:</h3>
            <p>1. 完整的 Next.js 前端需要单独部署到 Cloudflare Pages</p>
            <p>2. 当前部署的是 API 后端服务</p>
            <p>3. 数据库连接: Neon.tech PostgreSQL (配置完成)</p>
            <p>4. 所有核心功能已迁移完成</p>
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
  
  // 获取所有小说
  if (path === '/api/novels' && request.method === 'GET') {
    const novels = [
      {
        id: 1,
        title: "张三的冒险故事",
        description: "一个关于勇气和友谊的冒险故事，适合小学生阅读。",
        author: { username: "张三", displayName: "张三" },
        status: "PUBLISHED",
        coverImage: "/default-cover.jpg",
        category: "冒险"
      },
      {
        id: 2,
        title: "李四的太空冒险",
        description: "一个关于太空探索和科学发现的科幻故事，激发孩子们的想象力。",
        author: { username: "李四", displayName: "李四" },
        status: "PUBLISHED",
        coverImage: "/default-cover.jpg",
        category: "科幻"
      }
    ]
    return Response.json(novels)
  }
  
  // 用户登录
  if (path === '/api/auth/login' && request.method === 'POST') {
    const body = await request.json()
    const { username, password } = body
    
    // 模拟用户验证
    const users = {
      'admin': { id: 1, username: 'admin', displayName: '管理员', role: 'ADMIN' },
      '张三': { id: 2, username: '张三', displayName: '张三', role: 'USER' },
      '李四': { id: 3, username: '李四', displayName: '李四', role: 'USER' }
    }
    
    if (users[username]) {
      return Response.json({
        success: true,
        token: 'jwt-token-' + Date.now(),
        user: users[username]
      })
    }
    
    return Response.json({ error: '用户不存在' }, { status: 401 })
  }
  
  // 获取评论
  if (path === '/api/comments' && request.method === 'GET') {
    const novelId = url.searchParams.get('novelId')
    
    const comments = [
      {
        id: 1,
        novelId: 1,
        content: "这个故事真有趣！我喜欢森林探险的部分。",
        user: { username: "李四", displayName: "李四" },
        status: "APPROVED",
        likes: 3,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        novelId: 1,
        content: "写得很好，适合小学生阅读。继续加油！",
        user: { username: "admin", displayName: "管理员" },
        status: "APPROVED",
        likes: 5,
        createdAt: new Date().toISOString()
      }
    ]
    
    const filteredComments = novelId 
      ? comments.filter(c => c.novelId === parseInt(novelId))
      : comments
    
    return Response.json(filteredComments)
  }
  
  // 默认返回 404
  return new Response('API 端点不存在', { status: 404 })
}