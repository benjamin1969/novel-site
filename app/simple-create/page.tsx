'use client'

import { useState, useEffect } from 'react'

export default function SimpleCreatePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: ''
  })
  const [loading, setLoading] = useState(false)
  const [author, setAuthor] = useState('')

  // 页面加载时获取用户名
  useEffect(() => {
    // 尝试多种可能的键名
    const possibleKeys = ['novel-site-username', 'username', 'currentUser', 'user', 'name']
    
    for (const key of possibleKeys) {
      const value = localStorage.getItem(key)
      if (value && value.trim()) {
        if (key === 'user') {
          try {
            const userData = JSON.parse(value.trim())
            setAuthor(userData.username || userData.name || userData.displayName || '')
          } catch {
            setAuthor(value.trim())
          }
        } else {
          setAuthor(value.trim())
        }
        break
      }
    }
    
    if (!author) {
      alert('请先登录！')
      window.location.href = '/simple-login'
    }
  }, [author])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!author) {
      alert('请先登录！')
      window.location.href = '/simple-login'
      return
    }
    
    if (!formData.title.trim()) {
      alert('请输入小说标题')
      return
    }
    
    if (!formData.description.trim()) {
      alert('请输入小说简介')
      return
    }
    
    if (!formData.content.trim()) {
      alert('请输入小说内容')
      return
    }
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/novels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          author: author,  // 使用确定的作者名
          content: formData.content.trim()
        })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        alert(`✅ 小说创建成功！\n标题: 《${formData.title}》\n作者: ${author}`)
        // 跳转到作品库
        window.location.href = '/novels'
      } else {
        alert(`❌ 创建失败: ${result.error}`)
      }
    } catch (error) {
      alert(`❌ 请求失败: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  if (!author) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <p>正在检查登录状态...</p>
        <button onClick={() => window.location.href = '/simple-login'}>
          去登录
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>创建小说</h1>
      
      <div style={{ 
        backgroundColor: '#d1fae5', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <p><strong>当前登录用户：</strong> {author}</p>
        <p><small>小说作者将自动设置为：{author}</small></p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            小说标题 *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="请输入小说标题"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            小说简介 *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="请输入小说简介"
            rows={3}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              resize: 'vertical'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            小说内容 *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            placeholder="请输入小说内容"
            rows={10}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              resize: 'vertical'
            }}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            backgroundColor: loading ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '创建中...' : '创建小说'}
        </button>
      </form>
    </div>
  )
}