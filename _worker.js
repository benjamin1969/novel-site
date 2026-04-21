// 超精简版本 - 直接部署到 Cloudflare Pages
// 这个版本移除了所有复杂依赖，只保留核心功能

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    
    // 健康检查
    if (url.pathname === '/health') {
      return new Response('OK', { status: 200 })
    }
    
    // API 路由
    if (url.pathname.startsWith('/api/')) {
      return handleAPI(request, url, env)
    }
    
    // 静态文件或前端页面（由 Cloudflare Pages 处理）
    return new Response('小说平台正在运行...', {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })
  }
}

async function handleAPI(request, url, env) {
  const path = url.pathname
  
  try {
    // 简单的 API 路由处理
    if (path === '/api/novels' && request.method === 'GET') {
      return Response.json([
        { id: 1, title: '示例小说1', author: '张三', content: '这是一个示例小说内容。' },
        { id: 2, title: '示例小说2', author: '李四', content: '这是另一个示例小说内容。' }
      ])
    }
    
    if (path === '/api/auth/login' && request.method === 'POST') {
      const body = await request.json()
      const { username, password } = body
      
      // 简单的认证逻辑
      if (username === 'admin' && password === 'admin') {
        return Response.json({
          success: true,
          token: 'demo-token',
          user: {
            id: 1,
            username: 'admin',
            displayName: '管理员',
            role: 'admin'
          }
        })
      }
      
      return Response.json({ error: '用户不存在' }, { status: 401 })
    }
    
    // 默认返回 404
    return new Response('API 端点不存在', { status: 404 })
    
  } catch (error) {
    console.error('API 错误:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}