'use client'

import { useState } from 'react'

export default function SimpleLoginPage() {
  const [username, setUsername] = useState('')

  const handleLogin = () => {
    if (!username.trim()) {
      alert('请输入用户名')
      return
    }
    
    // 直接设置登录状态
    localStorage.setItem('novel-site-username', username.trim())
    localStorage.setItem('novel-site-loggedin', 'true')
    localStorage.setItem('user', JSON.stringify({
      username: username.trim(),
      role: 'USER',
      createdAt: new Date().toISOString()
    }))
    
    alert(`登录成功！用户名: ${username.trim()}`)
    window.location.href = '/novels/new'
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>简单登录</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="输入用户名（如：张三）"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
        />
      </div>
      <button
        onClick={handleLogin}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        直接登录
      </button>
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>说明：</p>
        <ul>
          <li>输入用户名后点击"直接登录"</li>
          <li>系统会设置正确的登录状态</li>
          <li>然后跳转到小说创建页面</li>
          <li>作者字段会自动设置为输入的用户名</li>
        </ul>
      </div>
    </div>
  )
}