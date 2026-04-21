// 章节编辑页面
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { requireLogin, canEditNovel, redirectToLogin } from '../../../../../utils/auth'

export default function EditChapterPage() {
  const [chapter, setChapter] = useState<any>(null)
  const [novel, setNovel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState('')
  const params = useParams()
  const router = useRouter()

  // 表单数据
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })

  // 获取当前登录用户
  useEffect(() => {
    const username = requireLogin()
    if (!username) {
      // 如果未登录，requireLogin会自动重定向到登录页面
      return
    }
    setCurrentUser(username)
  }, [])

  // 获取章节和小说数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const novelId = params.id as string
        const chapterId = params.chapterId as string
        
        // 获取小说信息
        const novelResponse = await fetch(`/api/novels/${novelId}`)
        if (!novelResponse.ok) {
          alert('小说不存在或加载失败')
          router.push('/novels')
          return
        }
        
        const novelData = await novelResponse.json()
        setNovel(novelData)
        
        // 检查权限：只有作者本人可以编辑章节
        if (currentUser && novelData.author !== currentUser) {
          alert('只有作者本人可以编辑章节！')
          router.push(`/novels/${novelId}`)
          return
        }
        
        // 获取章节信息
        const chapterResponse = await fetch(`/api/novels/${novelId}/chapters/${chapterId}`)
        if (!chapterResponse.ok) {
          alert('章节不存在或加载失败')
          router.push(`/novels/${novelId}/chapters`)
          return
        }
        
        const chapterData = await chapterResponse.json()
        setChapter(chapterData)
        
        // 设置表单数据
        setFormData({
          title: chapterData.title || '',
          content: chapterData.content || ''
        })
        
      } catch (error) {
        console.error('获取数据失败:', error)
        alert('加载数据失败')
        router.push('/novels')
      } finally {
        setLoading(false)
      }
    }
    
    if (params.id && params.chapterId && currentUser) {
      fetchData()
    }
  }, [params.id, params.chapterId, currentUser, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证权限
    if (!currentUser) {
      alert('请先登录！')
      router.push('/login')
      return
    }
    
    if (novel && novel.author !== currentUser) {
      alert('只有作者本人可以编辑章节！')
      return
    }
    
    // 验证表单数据
    if (!formData.title.trim()) {
      alert('请输入章节标题！')
      return
    }
    
    if (!formData.content.trim()) {
      alert('请输入章节内容！')
      return
    }
    
    setIsLoading(true)
    
    try {
      const novelId = params.id as string
      const chapterId = params.chapterId as string
      
      // 调用API更新章节
      const response = await fetch(`/api/novels/${novelId}/chapters/${chapterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim()
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `更新失败: ${response.status}`)
      }
      
      const result = await response.json()
      
      // 显示成功消息
      alert(`🎉 章节更新成功！\n标题: ${formData.title}`)
      
      // 跳转回章节管理页面
      router.push(`/novels/${novelId}/chapters`)
      
    } catch (error) {
      console.error('更新章节失败:', error)
      alert(`更新失败: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setIsLoading(false)
    }
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

  if (!chapter || !novel) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          章节不存在
        </div>
        <button
          onClick={() => router.push(`/novels/${params.id}/chapters`)}
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
          返回章节管理
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
            ✏️ 编辑章节
          </h1>
          <button
            onClick={() => router.push(`/novels/${novel.id}/chapters`)}
            style={{
              color: '#2563eb',
              background: 'none',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            ← 返回章节管理
          </button>
        </div>
        <div style={{ color: '#6b7280', marginBottom: '1rem' }}>
          正在编辑：{novel.title} · 第{chapter.number}章 · 作者：{novel.author}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
            章节标题 *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="请输入章节标题"
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
            章节内容 *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="请输入章节内容"
            rows={12}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '0.875rem 1.75rem',
              backgroundColor: isLoading ? '#93c5fd' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              flex: 1
            }}
          >
            {isLoading ? '保存中...' : '保存修改'}
          </button>
          
          <button
            type="button"
            onClick={() => router.push(`/novels/${novel.id}/chapters`)}
            style={{
              padding: '0.875rem 1.75rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              flex: 1
            }}
          >
            取消
          </button>
        </div>
      </form>
      
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: '#fef3c7', 
        borderRadius: '8px',
        border: '1px solid #fbbf24'
      }}>
        <div style={{ fontWeight: '600', color: '#92400e', marginBottom: '0.5rem' }}>
          ⚠️ 编辑说明
        </div>
        <div style={{ fontSize: '0.875rem', color: '#92400e' }}>
          1. 章节标题和内容不能为空<br/>
          2. 章节编号（第{chapter.number}章）不能修改<br/>
          3. 修改后立即生效，读者会看到更新后的内容<br/>
          4. 如需修改章节编号，请删除后重新创建
        </div>
      </div>
    </div>
  )
}