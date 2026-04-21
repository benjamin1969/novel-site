// 客户端导航栏组件 - 处理登录状态
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function NavbarClient() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  // 检查本地存储中的登录状态
  useEffect(() => {
    const savedUsername = localStorage.getItem('novel-site-username')
    const savedIsLoggedIn = localStorage.getItem('novel-site-loggedin')
    
    if (savedUsername && savedIsLoggedIn === 'true') {
      setUsername(savedUsername)
      setIsLoggedIn(true)
    }
  }, [])

  // 处理登录
  const handleLogin = (user: string) => {
    setUsername(user)
    setIsLoggedIn(true)
    localStorage.setItem('novel-site-username', user)
    localStorage.setItem('novel-site-loggedin', 'true')
  }

  // 处理登出
  const handleLogout = () => {
    setUsername('')
    setIsLoggedIn(false)
    localStorage.removeItem('novel-site-username')
    localStorage.removeItem('novel-site-loggedin')
    window.location.href = '/'
  }

  return (
    <header className="navbar">
      <div className="container">
        <div className="nav-content">
          {/* Logo */}
          <Link href="/" className="logo">
            <div className="logo-box">阅</div>
            <div className="logo-text">
              <h1>简阅</h1>
              <p>小说创作平台</p>
            </div>
          </Link>
          
          {/* 导航链接 */}
          <nav className="nav-links">
            <Link href="/" className="nav-link">首页</Link>
            <Link href="/novels" className="nav-link">发现</Link>
            <Link href="/novels/new" className="nav-link">创作</Link>
            <Link href="/my-novels" className="nav-link">我的作品</Link>
          </nav>
          
          {/* 用户操作 */}
          <div className="nav-actions">
            {isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    👤
                  </div>
                  <span style={{ color: '#374151', fontWeight: '500' }}>
                    {username}
                  </span>
                </div>
                
                {/* 管理员入口 */}
                {username.toLowerCase().includes('admin') && (
                  <a
                    href="/admin"
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      textDecoration: 'none'
                    }}
                  >
                    管理后台
                  </a>
                )}
                
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  退出
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/login" className="btn btn-login">
                  登录
                </Link>
                <Link href="/register" className="btn btn-register">
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}