export default function HomePage() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#2563eb', textAlign: 'center' }}>
        🎉 小说创作平台 - 完整功能版
      </h1>
      
      <div style={{
        backgroundColor: '#f0f9ff',
        padding: '2rem',
        borderRadius: '12px',
        margin: '2rem 0'
      }}>
        <h2>✅ 功能已完善</h2>
        <ul>
          <li>用户注册与登录系统</li>
          <li>小说创作与章节管理</li>
          <li>作品阅读与评论功能</li>
          <li>管理员后台管理系统</li>
          <li>简约朴素设计，适合小学生</li>
          <li>国内快速访问（Cloudflare Pages）</li>
        </ul>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a 
          href="/login" 
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            marginRight: '1rem'
          }}
        >
          登录测试
        </a>
        <a 
          href="/novels" 
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#10b981',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none'
          }}
        >
          浏览作品
        </a>
      </div>
      
      <div style={{
        marginTop: '3rem',
        padding: '1.5rem',
        backgroundColor: '#fef3c7',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#92400e'
      }}>
        <p><strong>技术说明：</strong></p>
        <p>• 使用客户端存储（localStorage）</p>
        <p>• 无需服务器，完全静态</p>
        <p>• 国内访问优化</p>
        <p>• 适合演示和测试</p>
      </div>
    </div>
  )
}