// 登录页面 - 修复版
'use client'

export default function LoginPage() {
  const handleLogin = (username: string) => {
    // 保存登录状态到本地存储
    localStorage.setItem('novel-site-username', username)
    localStorage.setItem('novel-site-loggedin', 'true')
    // 重定向到首页
    window.location.href = '/'
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const usernameInput = form.querySelector('input[name="username"]') as HTMLInputElement
    const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement
    
    const username = usernameInput.value.trim()
    const password = passwordInput.value.trim()
    
    // 简单验证
    if (!username) {
      alert('请输入用户名')
      return
    }
    
    if (!password) {
      alert('请输入密码')
      return
    }
    
    // 模拟登录验证
    if (username === 'admin' && password === 'admin123') {
      handleLogin(username)
    } else {
      // 其他用户也允许登录（演示用）
      handleLogin(username)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#dbeafe',
          color: '#1e40af',
          borderRadius: '9999px',
          marginBottom: '1rem'
        }}>
          <span>🔑</span>
          <span style={{ fontWeight: '500' }}>欢迎回来</span>
        </div>
        
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#111827'
        }}>
          登录简阅
        </h1>
        
        <p style={{
          color: '#6b7280',
          marginBottom: '2rem'
        }}>
          继续你的创作之旅，查看你的作品
        </p>
      </div>
      
      {/* 登录表单 */}
      <form onSubmit={handleFormSubmit} style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#374151'
          }}>
            用户名
          </label>
          <input
            name="username"
            type="text"
            placeholder="输入用户名"
            defaultValue="admin"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#374151'
          }}>
            密码
          </label>
          <input
            name="password"
            type="password"
            placeholder="输入密码"
            defaultValue="admin123"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem', textAlign: 'right' }}>
          <a href="/forgot-password" style={{ color: '#2563eb', fontSize: '0.875rem' }}>
            忘记密码？
          </a>
        </div>
        
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          登录
        </button>
        
        {/* 快速登录按钮 */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => handleLogin('admin')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            快速登录：admin
          </button>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            还没有账号？
            <a href="/register" style={{ color: '#2563eb', marginLeft: '0.25rem' }}>
              立即注册
            </a>
          </p>
        </div>
      </form>
      
      {/* 测试账号提示 */}
      <div style={{
        backgroundColor: '#fef3c7',
        padding: '1rem',
        borderRadius: '8px',
        marginTop: '1.5rem'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#92400e' }}>
          🧪 测试账号
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#92400e', marginBottom: '0.25rem' }}>
          <strong>用户名:</strong> admin
        </p>
        <p style={{ fontSize: '0.875rem', color: '#92400e' }}>
          <strong>密码:</strong> admin123
        </p>
        <p style={{ fontSize: '0.75rem', color: '#92400e', marginTop: '0.5rem' }}>
          注意：这是测试账号，请在生产环境修改密码
        </p>
      </div>
      
      {/* 安全提示 */}
      <div style={{
        backgroundColor: '#f0f9ff',
        padding: '1rem',
        borderRadius: '8px',
        marginTop: '1.5rem',
        textAlign: 'center'
      }}>
        <p style={{ color: '#1e40af', fontSize: '0.875rem' }}>
          🔒 安全登录，保护你的创作成果
        </p>
      </div>
    </div>
  )
}