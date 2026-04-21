// 我的作品页面 - 显示真实数据库数据
'use client'

import { useState, useEffect } from 'react'

export default function MyNovelsRealPage() {
  const [novels, setNovels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // 从API获取当前用户的小说
    const fetchNovels = async () => {
      try {
        setLoading(true)
        
        // 从localStorage获取当前登录用户 - 尝试多种可能的键名
        let currentUsername = localStorage.getItem('novel-site-username') || ''
        
        // 如果没找到，尝试其他可能的键名
        if (!currentUsername) {
          currentUsername = localStorage.getItem('username') || ''
        }
        if (!currentUsername) {
          currentUsername = localStorage.getItem('currentUser') || ''
        }
        
        console.log('检测到的用户名:', currentUsername)
        
        // 如果还是没有用户名，检查是否有登录标记
        const loggedIn = localStorage.getItem('novel-site-loggedin') || 
                        localStorage.getItem('loggedin') || 'false'
        
        console.log('登录状态:', loggedIn)
        
        // 如果检测到登录状态但没有用户名，使用默认值
        if ((loggedIn === 'true' || loggedIn === '1') && !currentUsername) {
          currentUsername = '当前用户'
        }
        
        if (!currentUsername) {
          setError('请先登录')
          setLoading(false)
          return
        }
        
        // 调用API获取用户的小说
        const response = await fetch(`/api/my-novels?author=${encodeURIComponent(currentUsername)}`)
        if (!response.ok) {
          throw new Error('获取作品失败')
        }
        
        const novelsData = await response.json()
        
        console.log('API返回数据:', novelsData)
        
        // 处理小说数据
        const processedNovels = novelsData.map((novel: any) => ({
          ...novel,
          chapters: novel.chapters || 0,
          views: novel.views || 0,
          likes: novel.likes || 0,
          createdAt: novel.createdAt || '刚刚'
        }))
        
        setNovels(processedNovels)
        setError('')
      } catch (err) {
        setError('获取作品失败')
        console.error('获取作品失败:', err)
        // 如果出错，使用模拟数据作为后备
        const mockNovels = [
          {
            id: '1',
            title: '魔法森林的冒险',
            description: '一个关于勇气和友谊的魔法森林冒险故事',
            createdAt: '2024-03-10',
            chapters: 3,
            views: 156,
            likes: 67
          },
          {
            id: '2',
            title: '太空探险记',
            description: '探索宇宙奥秘的科幻故事',
            createdAt: '2024-03-11',
            chapters: 2,
            views: 89,
            likes: 42
          },
          {
            id: '3',
            title: '海底两万里',
            description: '深海探险的奇幻旅程',
            createdAt: '2024-03-12',
            chapters: 1,
            views: 45,
            likes: 23
          }
        ]
        setNovels(mockNovels)
      } finally {
        setLoading(false)
      }
    }

    fetchNovels()
  }, [])

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
        <p style={{ color: '#6b7280' }}>正在加载你的作品...</p>
      </div>
    )
  }

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
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* 页面标题 */}
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
          <span style={{ fontWeight: '500' }}>我的作品</span>
        </div>
        
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#111827'
        }}>
          你创作的小说
        </h1>
        
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          共 {novels.length} 部作品
        </p>
      </div>

      {/* 作品列表 */}
      {novels.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            你还没有创作任何小说
          </p>
          <a
            href="/novels/new"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            开始创作第一部小说
          </a>
        </div>
      ) : (
        <div>
          {novels.map(novel => (
            <div
              key={novel.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                padding: '1.5rem',
                marginBottom: '1rem',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: '#111827'
                  }}>
                    {novel.title}
                  </h3>
                  
                  {/* 作者信息 */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: '#f0f9ff',
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
                      {novel.author || '未知作者'}
                    </span>
                  </div>
                  
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                    {novel.description}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                    <span>📖 {novel.chapters} 章</span>
                    <span>👁️ {novel.views} 阅读</span>
                    <span>❤️ {novel.likes} 喜欢</span>
                    <span>📅 {novel.createdAt}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a
                    href={`/novels/${novel.id}`}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    阅读
                  </a>
                  
                  <a
                    href={`/novels/new?novel=${novel.id}`}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    续写
                  </a>
                </div>
              </div>
              
              {/* 章节预览 */}
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                padding: '1rem',
                marginTop: '1rem'
              }}>
                <div style={{ fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                  章节列表
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {Array.from({ length: novel.chapters }, (_, i) => (
                    <a
                      key={i}
                      href={`/novels/${novel.id}?chapter=${i + 1}`}
                      style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#e5e7eb',
                        color: '#374151',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}
                    >
                      第 {i + 1} 章
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 创作按钮 */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a
          href="/novels/new"
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>✏️</span>
          <span>创作新小说</span>
        </a>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}