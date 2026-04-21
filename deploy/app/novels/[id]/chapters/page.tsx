// 章节管理页面
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { requireLogin, canEditNovel, redirectToLogin } from '../../../utils/auth'

export default function ChaptersManagementPage() {
  const [chapters, setChapters] = useState<any[]>([])
  const [novel, setNovel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState('')
  const [deletingChapterId, setDeletingChapterId] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()

  // 获取当前登录用户
  useEffect(() => {
    const username = requireLogin()
    if (!username) {
      // 如果未登录，requireLogin会自动重定向到登录页面
      return
    }
    setCurrentUser(username)
  }, [])

  // 获取小说和章节数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const novelId = params.id as string
        
        // 获取小说信息
        const novelResponse = await fetch(`/api/novels/${novelId}`)
        if (!novelResponse.ok) {
          alert('小说不存在或加载失败')
          router.push('/novels')
          return
        }
        
        const novelData = await novelResponse.json()
        setNovel(novelData)
        
        // 检查权限：只有作者本人可以管理章节
        if (currentUser && novelData.author !== currentUser) {
          alert('只有作者本人可以管理章节！')
          router.push(`/novels/${novelId}`)
          return
        }
        
        // 获取章节列表
        const chaptersResponse = await fetch(`/api/novels/${novelId}/chapters`)
        if (chaptersResponse.ok) {
          const chaptersData = await chaptersResponse.json()
          setChapters(chaptersData.sort((a: any, b: any) => a.number - b.number))
        }
      } catch (error) {
        console.error('获取数据失败:', error)
        alert('加载数据失败')
        router.push('/novels')
      } finally {
        setLoading(false)
      }
    }
    
    if (params.id && currentUser) {
      fetchData()
    }
  }, [params.id, currentUser, router])

  // 删除章节
  const handleDeleteChapter = async (chapterId: string, chapterTitle: string) => {
    if (!confirm(`确定要删除章节 "${chapterTitle}" 吗？\n\n注意：删除后无法恢复！`)) {
      return
    }
    
    setDeletingChapterId(chapterId)
    
    try {
      const novelId = params.id as string
      const response = await fetch(`/api/novels/${novelId}/chapters/${chapterId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `删除失败: ${response.status}`)
      }
      
      // 从列表中移除已删除的章节
      setChapters(chapters.filter(chapter => chapter.id !== chapterId))
      
      // 更新小说章节数
      if (novel) {
        setNovel({
          ...novel,
          chapters: chapters.length - 1
        })
      }
      
      alert(`章节 "${chapterTitle}" 已删除`)
      
    } catch (error) {
      console.error('删除章节失败:', error)
      alert(`删除失败: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setDeletingChapterId(null)
    }
  }

  // 添加新章节
  const handleAddChapter = () => {
    const novelId = params.id as string
    router.push(`/novels/new?mode=chapter&novel=${novelId}`)
  }

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          加载中...
        </div>
      </div>
    )
  }

  if (!novel) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          小说不存在
        </div>
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
            cursor: 'pointer',
            display: 'inline-block'
          }}
        >
          返回作品库
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
            📚 章节管理
          </h1>
          <Link
            href={`/novels/${novel.id}`}
            style={{
              color: '#2563eb',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            ← 返回小说详情
          </Link>
        </div>
        <div style={{ color: '#6b7280', marginBottom: '1rem' }}>
          正在管理：{novel.title} · 作者：{novel.author} · 共 {chapters.length} 章
        </div>
      </div>
      
      {/* 操作按钮 */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        padding: '1.5rem',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <button
          onClick={handleAddChapter}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ➕ 添加新章节
        </button>
        
        <Link
          href={`/novels/edit/${novel.id}`}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ✏️ 编辑小说信息
        </Link>
      </div>
      
      {/* 章节列表 */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
          章节列表
        </h2>
        
        {chapters.length === 0 ? (
          <div style={{
            padding: '2rem',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            暂无章节，点击上方按钮添加新章节
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                style={{
                  padding: '1.25rem',
                  borderBottom: index < chapters.length - 1 ? '1px solid #e5e7eb' : 'none',
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      第{chapter.number}章
                    </span>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {chapter.title}
                    </h3>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    创建时间：{new Date(chapter.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#4b5563',
                    lineHeight: '1.5',
                    maxHeight: '3em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {chapter.content || '暂无内容'}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                  <Link
                    href={`/novels/${novel.id}/chapters/${chapter.id}/edit`}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    编辑
                  </Link>
                  <button
                    onClick={() => handleDeleteChapter(chapter.id, chapter.title)}
                    disabled={deletingChapterId === chapter.id}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: deletingChapterId === chapter.id ? '#fca5a5' : '#fee2e2',
                      color: deletingChapterId === chapter.id ? '#7f1d1d' : '#dc2626',
                      border: '1px solid #fca5a5',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: deletingChapterId === chapter.id ? 'not-allowed' : 'pointer',
                      opacity: deletingChapterId === chapter.id ? 0.7 : 1
                    }}
                  >
                    {deletingChapterId === chapter.id ? '删除中...' : '删除'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 说明 */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: '#f0f9ff', 
        borderRadius: '8px',
        border: '1px solid #bae6fd'
      }}>
        <div style={{ fontWeight: '600', color: '#0369a1', marginBottom: '0.5rem' }}>
          💡 章节管理说明
        </div>
        <div style={{ fontSize: '0.875rem', color: '#0369a1' }}>
          1. 所有章节（包括第一章）都存储在统一的章节系统中<br/>
          2. 删除章节后无法恢复，请谨慎操作<br/>
          3. 章节编号会自动重新排序<br/>
          4. 第一章内容也可以在小说编辑页面修改
        </div>
      </div>
    </div>
  )
}