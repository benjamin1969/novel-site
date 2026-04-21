// 小说阅读页面 - 简约朴素左右布局（无图标版）
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import CommentList from '../../components/CommentList'

export default function NovelDetailPage() {
  const [selectedChapter, setSelectedChapter] = useState(0)
  const [novel, setNovel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState('')
  const params = useParams()
  
  // 格式化日期的辅助函数
  const formatDate = (dateString: string) => {
    if (!dateString) return '未知日期'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch (e) {
      // 尝试从ISO格式中提取日期部分
      const dateMatch = dateString.match(/^(\d{4}-\d{2}-\d{2})/)
      return dateMatch ? dateMatch[1] : '未知日期'
    }
  }
  
  // 获取当前登录用户
  useEffect(() => {
    const getCurrentUser = () => {
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
        if (value && value.trim() && value.trim() !== '匿名用户') {
          // 特殊处理：如果键名是'user'，可能是JSON格式
          if (key === 'user') {
            try {
              const userData = JSON.parse(value.trim())
              // 尝试从JSON对象中提取用户名
              return userData.username || userData.name || userData.displayName || ''
            } catch (e) {
              return value.trim()
            }
          } else {
            return value.trim()
          }
        }
      }
      return ''
    }
    
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  useEffect(() => {
    const fetchNovel = async () => {
      try {
        setLoading(true)
        const novelId = params.id as string
        
        // 尝试从API获取小说基本信息
        const novelResponse = await fetch(`/api/novels/${novelId}`)
        
        if (novelResponse.ok) {
          const novelData = await novelResponse.json()
          
          // 获取章节数据
          const chaptersResponse = await fetch(`/api/novels/${novelId}/chapters`)
          let chapterList = []
          
          if (chaptersResponse.ok) {
            const chaptersData = await chaptersResponse.json()
            chapterList = chaptersData.map((chapter: any, index: number) => ({
              id: chapter.id,
              title: chapter.title || `第${index + 1}章`,
              number: chapter.number || index + 1,
              content: chapter.content || '',
              createdAt: chapter.createdAt || new Date().toISOString().split('T')[0],
              views: chapter.views || 0
            }))
          }
          
          setNovel({
            ...novelData,
            chapters: chapterList.length,
            chapterList: chapterList
          })
          setLoading(false)
        } else {
          setLoading(false)
        }
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }

    fetchNovel()
  }, [params.id])

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
        <p style={{ color: '#6b7280' }}>正在获取小说内容...</p>
      </div>
    )
  }

  if (!novel) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          小说不存在
        </div>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          找不到您要阅读的小说
        </p>
        <Link 
          href="/novels"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            display: 'inline-block'
          }}
        >
          返回作品库
        </Link>
      </div>
    )
  }

  const isAuthor = currentUser === novel.author
  const currentChapter = novel.chapterList?.[selectedChapter]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f6f6',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* 返回链接 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link 
            href="/novels" 
            style={{
              color: '#2563eb',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            ← 返回作品库
          </Link>
        </div>

        {/* 小说基本信息 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  {novel.category || '小说'}
                </span>
              </div>
              
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '1rem'
              }}>{novel.title}</h1>
              
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                color: '#6b7280',
                marginBottom: '1.5rem',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: '500' }}>作者：{novel.author}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>{novel.chapters} 章</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>{novel.status === 'published' ? '已发布' : '草稿'}</span>
                  </div>
                </div>
              </div>
              
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                border: '1px solid #f3f4f6'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.75rem'
                }}>作品简介</h3>
                <p style={{
                  color: '#4b5563',
                  lineHeight: '1.75',
                  whiteSpace: 'pre-line'
                }}>{novel.description}</p>
              </div>
            </div>
            
            {/* 作者操作按钮 */}
            {isAuthor && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <Link 
                  href={`/novels/edit/${novel.id}`}
                  style={{
                    padding: '0.75rem 1.25rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textAlign: 'center',
                    transition: 'background-color 0.2s'
                  }}
                >
                  编辑小说信息
                </Link>
                <Link 
                  href={`/novels/new?mode=chapter&novel=${novel.id}`}
                  style={{
                    padding: '0.75rem 1.25rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textAlign: 'center',
                    transition: 'background-color 0.2s'
                  }}
                >
                  添加新章节
                </Link>
                <Link 
                  href={`/novels/${novel.id}/chapters`}
                  style={{
                    padding: '0.75rem 1.25rem',
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textAlign: 'center',
                    transition: 'background-color 0.2s'
                  }}
                >
                  管理章节
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 左右分栏布局 */}
        <div className="novel-layout-grid">
          {/* 左侧：章节列表 */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid #e5e7eb'
              }}>
                章节列表 ({novel.chapters})
              </h2>
              
              {novel.chapterList && novel.chapterList.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {novel.chapterList.map((chapter: any, index: number) => (
                    <button
                      key={chapter.id}
                      onClick={() => setSelectedChapter(index)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        transition: 'all 0.2s',
                        border: selectedChapter === index ? '1px solid #93c5fd' : '1px solid transparent',
                        backgroundColor: selectedChapter === index ? '#eff6ff' : 'transparent',
                        color: selectedChapter === index ? '#1e40af' : '#4b5563',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                        {chapter.title}
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.875rem',
                        color: selectedChapter === index ? '#3b82f6' : '#6b7280'
                      }}>
                        <span>第{chapter.number}章</span>
                        <span>{formatDate(chapter.createdAt)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{ color: '#9ca3af', marginBottom: '0.75rem' }}>暂无章节</div>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    这部小说还没有任何章节内容。
                  </p>
                  {isAuthor && (
                    <Link 
                      href={`/novels/new?mode=chapter&novel=${novel.id}`}
                      style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      添加第一个章节
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 右侧：章节内容 */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              {currentChapter ? (
                <>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '0.75rem'
                    }}>
                      {currentChapter.title}
                    </h2>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      marginBottom: '1rem',
                      gap: '1rem'
                    }}>
                      <span>第{currentChapter.number}章</span>
                      <span>发布于 {formatDate(currentChapter.createdAt)}</span>
                      <span>阅读量：{currentChapter.views}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{
                      color: '#374151',
                      lineHeight: '1.75',
                      whiteSpace: 'pre-line',
                      fontSize: '1.125rem'
                    }}>
                      {currentChapter.content || '本章节暂无内容'}
                    </div>
                  </div>
                  
                  {/* 章节导航 */}
                  <div style={{
                    marginTop: '2rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <button
                        onClick={() => setSelectedChapter(Math.max(0, selectedChapter - 1))}
                        disabled={selectedChapter === 0}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          transition: 'all 0.2s',
                          backgroundColor: selectedChapter === 0 ? '#f3f4f6' : '#f3f4f6',
                          color: selectedChapter === 0 ? '#9ca3af' : '#4b5563',
                          border: 'none',
                          cursor: selectedChapter === 0 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        上一章
                      </button>
                      <button
                        onClick={() => setSelectedChapter(Math.min(novel.chapterList.length - 1, selectedChapter + 1))}
                        disabled={selectedChapter === novel.chapterList.length - 1}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          transition: 'all 0.2s',
                          backgroundColor: selectedChapter === novel.chapterList.length - 1 ? '#f3f4f6' : '#f3f4f6',
                          color: selectedChapter === novel.chapterList.length - 1 ? '#9ca3af' : '#4b5563',
                          border: 'none',
                          cursor: selectedChapter === novel.chapterList.length - 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        下一章
                      </button>
                    </div>
                    
                    <div style={{
                      marginTop: '1rem',
                      textAlign: 'center',
                      color: '#6b7280',
                      fontSize: '0.875rem'
                    }}>
                      {selectedChapter + 1} / {novel.chapterList.length}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div style={{ color: '#9ca3af', marginBottom: '1rem' }}>暂无章节内容</div>
                  <p style={{
                    color: '#6b7280',
                    marginBottom: '1.5rem',
                    maxWidth: '28rem',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}>
                    这部小说还没有任何章节内容。
                    {isAuthor ? '作为作者，您可以点击左侧的"添加第一个章节"按钮开始创作。' : '请等待作者添加章节内容。'}
                  </p>
                  {isAuthor && (
                    <Link 
                      href={`/novels/new?mode=chapter&novel=${novel.id}`}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'background-color 0.2s',
                        display: 'inline-block'
                      }}
                    >
                      开始创作第一个章节
                    </Link>
                  )}
                </div>
              )}
            </div>
            
            {/* 阅读提示 */}
            <div style={{
              marginTop: '1rem',
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              点击左侧章节列表中的章节可以切换阅读内容
            </div>
          </div>
        </div>
      </div>
      
      {/* 评论区域 */}
      <div style={{ maxWidth: '800px', margin: '3rem auto 0' }}>
        <CommentList novelId={novel.id} currentUser={currentUser} />
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .novel-layout-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        
        @media (min-width: 1024px) {
          .novel-layout-grid {
            grid-template-columns: 1fr 3fr;
          }
        }
      `}</style>
    </div>
  )
}