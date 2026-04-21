// 作品库页面 - 简约朴素风格（匹配首页设计）
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function NovelsPage() {
  const [novels, setNovels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 获取小说列表
  useEffect(() => {
    const fetchNovels = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/novels')
        if (!response.ok) {
          throw new Error('获取作品失败')
        }
        const data = await response.json()
        setNovels(data)
        setLoading(false)
      } catch (err) {
        setError('获取作品失败')
        setLoading(false)
      }
    }

    fetchNovels()
  }, [])

  // 检查用户登录状态
  useEffect(() => {
    const checkLoginStatus = () => {
      console.log('检查登录状态...')
      // 尝试所有可能的键名来获取用户名
      const possibleKeys = [
        'novel-site-username',
        'username',
        'currentUser',
        'user',
        'name'
      ]
      
      for (const key of possibleKeys) {
        const value = localStorage.getItem(key)
        console.log(`检查键 ${key}:`, value)
        if (value && value.trim() && value.trim() !== '匿名用户') {
          // 特殊处理：如果键名是'user'，可能是JSON格式
          if (key === 'user') {
            try {
              const userData = JSON.parse(value.trim())
              // 尝试从JSON对象中提取用户名
              const username = userData.username || userData.name || userData.displayName || ''
              if (username) {
                console.log('找到用户（JSON格式）:', username)
                setIsLoggedIn(true)
                return
              }
            } catch (e) {
              console.log('找到用户（字符串格式）:', value.trim())
              setIsLoggedIn(true)
              return
            }
          } else {
            console.log('找到用户（字符串格式）:', value.trim())
            setIsLoggedIn(true)
            return
          }
        }
      }
      
      // 再检查登录标记
      const loginKeys = ['novel-site-loggedin', 'loggedin', 'isLoggedIn', 'login']
      for (const key of loginKeys) {
        const value = localStorage.getItem(key)
        console.log(`检查登录标记 ${key}:`, value)
        if (value && (value === 'true' || value === '1')) {
          console.log('找到登录标记')
          setIsLoggedIn(true)
          return
        }
      }
      
      console.log('未找到用户或登录标记，设置为未登录')
      setIsLoggedIn(false)
    }
    
    checkLoginStatus()
    
    // 监听storage变化
    const handleStorageChange = () => {
      console.log('storage变化，重新检查登录状态')
      checkLoginStatus()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // 过滤小说
  const filteredNovels = novels.filter(novel => {
    const matchesSearch = novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         novel.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         novel.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || novel.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // 加载状态
  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e5e7eb',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          margin: '0 auto 1rem',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#6b7280' }}>正在加载作品...</p>
      </div>
    )
  }

  // 错误状态
  if (error) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* 页面标题区域 */}
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
          <span>📚</span>
          <span style={{ fontWeight: '500' }}>作品库</span>
        </div>
        
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#111827'
        }}>
          发现精彩故事
        </h1>
        
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          共 {novels.length} 部作品
        </p>
      </div>

      {/* 搜索和筛选区域 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* 搜索框 */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="搜索小说、作者或关键词..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              color: '#374151'
            }}
          />
        </div>

        {/* 分类筛选 */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: selectedCategory === 'all' ? '#2563eb' : '#f3f4f6',
              color: selectedCategory === 'all' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            全部
          </button>
          <button 
            onClick={() => setSelectedCategory('adventure')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: selectedCategory === 'adventure' ? '#2563eb' : '#f3f4f6',
              color: selectedCategory === 'adventure' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            冒险
          </button>
          <button 
            onClick={() => setSelectedCategory('fantasy')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: selectedCategory === 'fantasy' ? '#2563eb' : '#f3f4f6',
              color: selectedCategory === 'fantasy' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            奇幻
          </button>
          <button 
            onClick={() => setSelectedCategory('school')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: selectedCategory === 'school' ? '#2563eb' : '#f3f4f6',
              color: selectedCategory === 'school' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            校园
          </button>
        </div>
      </div>

      {/* 作品列表 */}
      {filteredNovels.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            暂无作品
          </p>
          <p style={{ color: '#9ca3af', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
            还没有同学发布作品
          </p>
        </div>
      ) : (
        <div>
          {/* 网格容器 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredNovels.map(novel => (
              <div key={novel.id}>
                {/* 小说卡片容器 */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  padding: '1.5rem',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  {/* 小说封面/图标区域 */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ fontSize: '2rem' }}>📖</div>
                  </div>

                  {/* 小说信息 */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      marginBottom: '0.75rem',
                      color: '#111827'
                    }}>
                      {novel.title}
                    </h3>
                    
                    {/* 作者信息 */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.5rem',
                        fontSize: '0.75rem'
                      }}>
                        👤
                      </div>
                      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        {novel.author}
                      </span>
                    </div>
                    
                    <p style={{ 
                      color: '#6b7280', 
                      marginBottom: '1rem',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {novel.description}
                    </p>
                    
                    {/* 统计信息 */}
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: '0.75rem', 
                      fontSize: '0.75rem', 
                      color: '#9ca3af',
                      marginTop: 'auto'
                    }}>
                      <span>📖 {novel.chapters || 0} 章</span>
                      <span>👁️ {novel.views || 0} 阅读</span>
                      <span>❤️ {novel.likes || 0} 喜欢</span>
                      <span>📅 {novel.createdAt || '刚刚'}</span>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                    <Link 
                      href={`/novels/${novel.id}`}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        flex: 1,
                        textAlign: 'center'
                      }}
                    >
                      阅读
                    </Link>
                    
                    {novel.canContinue && (
                      <Link 
                        href={`/novels/new?mode=chapter&novel=${novel.id}`}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#10b981',
                          color: 'white',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          flex: 1,
                          textAlign: 'center'
                        }}
                      >
                        续写
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 创作按钮已移除 */}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}