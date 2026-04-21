// 登录状态诊断页面
'use client'

import { useState, useEffect } from 'react'

export default function LoginDiagnosticPage() {
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>({})
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    // 检查登录状态
    const checkLoginStatus = () => {
      const currentUsername = localStorage.getItem('novel-site-username') || ''
      const loggedIn = localStorage.getItem('novel-site-loggedin') || 'false'
      
      setUsername(currentUsername)
      setIsLoggedIn(loggedIn === 'true' || currentUsername !== '')
      
      // 收集诊断信息
      const info = {
        username: currentUsername,
        loggedIn: loggedIn,
        localStorageKeys: Object.keys(localStorage),
        localStorageValues: {} as Record<string, string>
      }
      
      // 获取所有localStorage值（排除敏感信息）
      Object.keys(localStorage).forEach(key => {
        if (!key.includes('password') && !key.includes('token')) {
          info.localStorageValues[key] = localStorage.getItem(key) || ''
        }
      })
      
      setDiagnosticInfo(info)
    }
    
    checkLoginStatus()
    
    // 监听localStorage变化
    const handleStorageChange = () => {
      checkLoginStatus()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleManualLogin = () => {
    const username = prompt('请输入用户名:')
    if (username) {
      localStorage.setItem('novel-site-username', username)
      localStorage.setItem('novel-site-loggedin', 'true')
      alert(`已手动设置为登录状态，用户名: ${username}`)
      window.location.reload()
    }
  }

  const handleClearLogin = () => {
    if (confirm('确定要清除登录状态吗？')) {
      localStorage.removeItem('novel-site-username')
      localStorage.removeItem('novel-site-loggedin')
      alert('登录状态已清除')
      window.location.reload()
    }
  }

  const handleTestMyNovels = () => {
    if (!username) {
      alert('请先登录')
      return
    }
    
    // 测试API调用
    fetch(`/api/my-novels?author=${encodeURIComponent(username)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`API返回错误: ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        alert(`API调用成功！返回 ${data.length} 条数据\n\n数据预览: ${JSON.stringify(data.slice(0, 2), null, 2)}`)
      })
      .catch(error => {
        alert(`API调用失败: ${error.message}`)
      })
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        登录状态诊断
      </h1>
      
      <div style={{ 
        backgroundColor: isLoggedIn ? '#d1fae5' : '#fee2e2', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          当前状态: {isLoggedIn ? '✅ 已登录' : '❌ 未登录'}
        </h2>
        {username && (
          <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
            用户名: <strong>{username}</strong>
          </p>
        )}
        <p style={{ color: '#6b7280' }}>
          如果显示未登录但您确实已登录，请尝试以下解决方案
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
          解决方案
        </h3>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleManualLogin}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            手动设置登录状态
          </button>
          
          <button
            onClick={handleClearLogin}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            清除登录状态
          </button>
          
          {username && (
            <button
              onClick={handleTestMyNovels}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              测试"我的作品"API
            </button>
          )}
          
          <button
            onClick={() => window.location.href = '/my-novels'}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            前往"我的作品"页面
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
          诊断信息
        </h3>
        
        <div style={{ 
          backgroundColor: '#f3f4f6', 
          padding: '1.5rem', 
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          overflow: 'auto'
        }}>
          <pre>{JSON.stringify(diagnosticInfo, null, 2)}</pre>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#fef3c7', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          常见问题解决
        </h3>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '0' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>问题1:</strong> 已登录但显示未登录<br/>
            <strong>解决:</strong> 点击"手动设置登录状态"按钮
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>问题2:</strong> 登录状态丢失<br/>
            <strong>解决:</strong> 重新登录，然后检查localStorage
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>问题3:</strong> "我的作品"页面显示空白<br/>
            <strong>解决:</strong> 点击"测试'我的作品'API"按钮检查API是否正常
          </li>
          <li>
            <strong>问题4:</strong> 浏览器缓存问题<br/>
            <strong>解决:</strong> 按Ctrl+F5强制刷新页面
          </li>
        </ul>
      </div>

      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
        <p>如果问题仍未解决，请打开浏览器开发者工具(F12)，查看控制台(Console)中的错误信息</p>
        <button
          onClick={() => {
            console.log('=== 手动诊断信息 ===')
            console.log('localStorage:', localStorage)
            console.log('当前URL:', window.location.href)
            console.log('用户代理:', navigator.userAgent)
            alert('诊断信息已输出到控制台，请按F12查看')
          }}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          输出控制台诊断信息
        </button>
      </div>
    </div>
  )
}