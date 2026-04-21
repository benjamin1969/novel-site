// 张三专用测试页面
'use client'

import { useState } from 'react'

export default function ZhangSanTestPage() {
  const [status, setStatus] = useState('')
  const [username, setUsername] = useState('')

  const checkLogin = () => {
    // 使用与小说创建页面相同的逻辑
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
      if (value && value.trim() && value.trim() !== '匿名用户') {
        foundUsername = value.trim()
        foundKey = key
        break
      }
    }
    
    setUsername(foundUsername)
    
    if (foundUsername) {
      setStatus(`✅ 检测到登录用户: ${foundUsername} (键名: ${foundKey})`)
    } else {
      // 检查登录状态
      const loginKeys = ['novel-site-loggedin', 'loggedin', 'isLoggedIn', 'login']
      let isLoggedIn = false
      
      for (const key of loginKeys) {
        const value = localStorage.getItem(key)
        if (value === 'true' || value === '1') {
          isLoggedIn = true
          break
        }
      }
      
      if (isLoggedIn) {
        setStatus('⚠️ 检测到登录状态但未找到用户名')
      } else {
        setStatus('❌ 未检测到登录状态')
      }
    }
  }

  const setZhangSanLogin = () => {
    localStorage.setItem('novel-site-username', '张三')
    localStorage.setItem('novel-site-loggedin', 'true')
    setUsername('张三')
    setStatus('✅ 已设置张三登录状态')
  }

  const testMyNovels = async () => {
    if (!username) {
      setStatus('❌ 请先设置登录状态')
      return
    }
    
    try {
      const response = await fetch(`/api/my-novels?author=${encodeURIComponent(username)}`)
      const novels = await response.json()
      setStatus(`✅ 张三有 ${novels.length} 本小说`)
      
      if (novels.length > 0) {
        alert(`张三的小说列表:\n${novels.map((n: any) => `• 《${n.title}》 - 作者: ${n.author}`).join('\n')}`)
      }
    } catch (error) {
      setStatus(`❌ 测试失败: ${error}`)
    }
  }

  const createTestNovel = async () => {
    if (!username) {
      setStatus('❌ 请先设置登录状态')
      return
    }
    
    const novelData = {
      title: '张三的测试小说',
      description: '这是张三的测试小说描述',
      author: username,
      content: '这是张三的测试小说内容...'
    }
    
    try {
      const response = await fetch('/api/novels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novelData)
      })
      
      if (response.ok) {
        setStatus(`✅ 测试小说创建成功！作者: ${username}`)
        setTimeout(() => testMyNovels(), 1000)
      } else {
        setStatus(`❌ 创建失败: ${response.status}`)
      }
    } catch (error) {
      setStatus(`❌ 创建失败: ${error}`)
    }
  }

  const goToCreateNovel = () => {
    window.location.href = '/novels/new'
  }

  const goToMyNovels = () => {
    window.location.href = '/my-novels'
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
        张三专用测试页面
      </h1>
      
      <div style={{ 
        backgroundColor: '#f3f4f6', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          当前状态
        </h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <button
            onClick={checkLogin}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              marginRight: '0.5rem'
            }}
          >
            检查登录状态
          </button>
          
          <button
            onClick={setZhangSanLogin}
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
            设置张三登录
          </button>
        </div>
        
        {status && (
          <div style={{ 
            padding: '0.75rem', 
            backgroundColor: status.includes('✅') ? '#d1fae5' : 
                           status.includes('⚠️') ? '#fef3c7' : '#fee2e2',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            {status}
          </div>
        )}
        
        {username && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
              测试"我的作品"
            </button>
            
            <button
              onClick={createTestNovel}
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
              创建测试小说
            </button>
            
            <button
              onClick={goToCreateNovel}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ec4899',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              去创建小说
            </button>
            
            <button
              onClick={goToMyNovels}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#14b8a6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              去"我的作品"
            </button>
          </div>
        )}
      </div>
      
      <div style={{ 
        backgroundColor: '#fef3c7', 
        padding: '1rem', 
        borderRadius: '8px',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          问题解决方案
        </h3>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>问题：</strong>张三发布的小说作者显示为"匿名用户"，导致在"我的作品"中看不见。
        </p>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>原因：</strong>小说创建时没有正确获取登录用户名。
        </p>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>修复：</strong>已增强用户名查找逻辑，支持多种键名。
        </p>
        <p>
          <strong>测试步骤：</strong>
        </p>
        <ol style={{ paddingLeft: '1.5rem', margin: '0' }}>
          <li>1. 点击"设置张三登录"</li>
          <li>2. 点击"创建测试小说"</li>
          <li>3. 点击"测试'我的作品'"验证</li>
          <li>4. 点击"去'我的作品'"查看结果</li>
        </ol>
      </div>
      
      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
        <p><strong>注意：</strong>如果仍有问题，请：</p>
        <p>1. 按Ctrl+F5强制刷新浏览器</p>
        <p>2. 检查浏览器控制台(F12)是否有错误</p>
        <p>3. 重启服务器清除混乱数据</p>
      </div>
    </div>
  )
}