// 服务器测试页面
export default function TestServerPage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ color: '#2563eb', marginBottom: '1rem' }}>
        ✅ 服务器测试页面
      </h1>
      <p style={{ marginBottom: '1rem' }}>
        如果能看到这个页面，说明服务器正在正常运行。
      </p>
      <div style={{ 
        backgroundColor: '#f0f9ff', 
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem'
      }}>
        <p><strong>服务器状态:</strong> 🟢 运行中</p>
        <p><strong>端口:</strong> 3000</p>
        <p><strong>时间:</strong> {new Date().toLocaleString('zh-CN')}</p>
      </div>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <a 
          href="/"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none'
          }}
        >
          返回首页
        </a>
        <a 
          href="/login"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#10b981',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none'
          }}
        >
          测试登录
        </a>
      </div>
    </div>
  )
}