// 直接测试登录状态页面
'use client'

import { useState, useEffect } from 'react'

export default function DirectTestPage() {
  const [status, setStatus] = useState('检查中...')
  const [username, setUsername] = useState('')
  const [action, setAction] = useState('')

  useEffect(() => {
    checkLoginStatus()
  }, [])

  const checkLoginStatus = () => {
    // 检查所有可能的键名
    const possibleKeys = [
      'novel-site-username',
      'username', 
      'currentUser',
      'user',
      'name'
    ]
    
    let foundUsername = ''
    let foundKey = ''
    
    for (const key of possibleKeys) {
      const value = localStorage.getItem(key)
      if (value && value.trim()) {
        foundUsername = value
        foundKey = key
        break
      }
    }
    
    // 检查登录状态
    const loginKeys = [
      'novel-site-loggedin',
      'loggedin',
      'isLoggedIn',
      'login'
    ]
    
    let loginStatus = '未登录'
    for (const key of loginKeys) {
      const value = localStorage.getItem(key)
      if (value === 'true' || value === '1') {
        loginStatus = '已登录'
        break
      }
    }
    
    setUsername(foundUsername)
    
    if (foundUsername) {
      setStatus(`✅ 检测到登录用户: ${foundUsername} (键名: ${foundKey})`)
    } else if (loginStatus === '已登录') {
      setStatus('⚠️ 检测到登录状态但未找到用户名')
    } else {
      setStatus('❌ 未检测到登录状态')
    }
  }

  const fixLogin = () => {
    const username = prompt('请输入您的用户名:')
    if (username) {
      localStorage.setItem('novel-site-username', username)
      localStorage.setItem('novel-site-loggedin', 'true')
      setAction(`已设置用户名: ${username}`)
      checkLoginStatus()
    }
  }

  const testMyNovels = async () => {
    if (!username) {
      setAction('❌ 请先设置用户名')
      return
    }
    
    try {
      const response = await fetch(`/api/my-novels?author=${encodeURIComponent(username)}`)
      const data = await response.json()
      setAction(`✅ API返回 ${data.length} 条数据`)
    } catch (error) {
      setAction(`❌ API调用失败: ${error}`)
    }
  }

  const goToMyNovels = () => {
    window.location.href = '/my-novels'
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
        登录状态直接测试
      </h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          当前状态
        </h2>
        <p style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>{status}</p>
        
        {action && (
          <div style={{ 
            padding: '0.75rem', 
            backgroundColor: action.includes('✅') ? '#d1fae5' : '#fee2e2',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            {action}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={checkLoginStatus}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            重新检查
          </button>
          
          <button
            onClick={fixLogin}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            手动设置登录
          </button>
          
          {username && (
            <button
              onClick={testMyNovels}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              测试API
            </button>
          )}
          
          <button
            onClick={goToMyNovels}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            前往我的作品
          </button>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: '#fef3c7', 
        padding: '1rem', 
        borderRadius: '8px',
        fontSize: '0.875rem'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          说明
        </h3>
        <p style={{ marginBottom: '0.5rem' }}>
          1. 如果显示"未检测到登录状态"，请点击"手动设置登录"按钮
        </p>
        <p style={{ marginBottom: '0.5rem' }}>
          2. 设置用户名后，点击"测试API"验证
        </p>
        <p>
          3. 最后点击"前往我的作品"查看结果
        </p>
      </div>
    </div>
  )
}