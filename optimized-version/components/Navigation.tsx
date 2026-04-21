'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // 检查localStorage中的登录状态
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const userData = JSON.parse(user)
        setIsLoggedIn(true)
        setUsername(userData.username)
        setIsAdmin(userData.role === 'admin')
      } catch (error) {
        console.error('解析用户数据失败:', error)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setUsername('')
    setIsAdmin(false)
    window.location.href = '/'
  }

  return (
    <nav style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/" style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#2563eb',
            textDecoration: 'none'
          }}>
            小说创作平台
          </Link>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/novels" style={{
              color: '#4b5563',
              textDecoration: 'none',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px'
            }}>
              作品库
            </Link>
            
            {isLoggedIn && (
              <>
                <Link href="/my-novels" style={{
                  color: '#4b5563',
                  textDecoration: 'none',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px'
                }}>
                  我的作品
                </Link>
                <Link href="/novels/new" style={{
                  color: '#4b5563',
                  textDecoration: 'none',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px'
                }}>
                  创作小说
                </Link>
              </>
            )}
            
            {isAdmin && (
              <Link href="/admin" style={{
                color: '#dc2626',
                textDecoration: 'none',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                backgroundColor: '#fef2f2'
              }}>
                后台管理
              </Link>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isLoggedIn ? (
            <>
              <span style={{ color: '#4b5563' }}>
                欢迎，{username} {isAdmin && '(管理员)'}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                退出登录
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                color: '#4b5563',
                textDecoration: 'none',
                borderRadius: '6px'
              }}>
                登录
              </Link>
              <Link href="/register" style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#2563eb',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px'
              }}>
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}