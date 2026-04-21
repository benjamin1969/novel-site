// 小说编辑页面
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { requireLogin, canEditNovel, redirectToLogin } from '../../../utils/auth'

export default function EditNovelPage() {
  const [novel, setNovel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState('')
  const params = useParams()
  const router = useRouter()
  
  // 检查登录状态和权限
  useEffect(() => {
    const username = requireLogin()
    if (!username) {
      // 如果未登录，requireLogin会自动重定向到登录页面
      return
    }
    setCurrentUser(username)
  }, [])
  
  // 表单数据
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: ''
  })
  
  // 获取当前登录用户（使用auth工具函数）
  useEffect(() => {
    const username = requireLogin()
    if (!username) {
      // 如果未登录，requireLogin会自动重定向到登录页面
      return
    }
    setCurrentUser(username)
  }, [])
  
  // 获取小说数据
  useEffect(() => {
    const fetchNovel = async () => {
      try {
        setLoading(true)
        const novelId = params.id as string
        
        // 从API获取小说基本信息
        const novelResponse = await fetch(`/api/novels/${novelId}`)
        
        if (novelResponse.ok) {
          const novelData = await novelResponse.json()
          setNovel(novelData)
          
          // 获取第一章内容
          let firstChapterContent = ''
          try {
            const chaptersResponse = await fetch(`/api/novels/${novelId}/chapters`)
            if (chaptersResponse.ok) {
              const chaptersData = await chaptersResponse.json()
              const firstChapter = chaptersData.find((c: any) => c.number === 1)
              if (firstChapter) {
                firstChapterContent = firstChapter.content || ''
              }
            }
          } catch (error) {
            console.error('获取章节数据失败:', error)
          }
          
          // 设置表单数据
          setFormData({
            title: novelData.title || '',
            description: novelData.description || '',
            content: firstChapterContent
          })
          
          // 检查权限：只有作者本人可以编辑
          if (currentUser && novelData.author !== currentUser) {
            alert('只有作者本人可以编辑小说！')
            router.push(`/novels/${novelId}`)
          }
        } else {
          alert('小说不存在或加载失败')
          router.push('/novels')
        }
      } catch (error) {
        console.error('获取小说详情失败:', error)
        alert('加载小说失败')
        router.push('/novels')
      } finally {
        setLoading(false)
      }
    }
    
    if (params.id && currentUser) {
      fetchNovel()
    }
  }, [params.id, currentUser, router])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证权限
    if (!currentUser) {
      alert('请先登录！')
      router.push('/login')
      return
    }
    
    if (novel.author !== currentUser) {
      alert('只有作者本人可以编辑小说！')
      return
    }
    
    // 验证表单数据
    if (!formData.title.trim()) {
      alert('请输入小说标题！')
      return
    }
    
    if (!formData.description.trim()) {
      alert('请输入小说简介！')
      return
    }
    
    setIsLoading(true)
    
    try {
      const novelId = params.id as string
      
      // 调用API更新小说
      const response = await fetch(`/api/novels/${novelId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          content: formData.content.trim()
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `更新失败: ${response.status}`)
      }
      
      const result = await response.json()
      
      // 显示成功消息
      alert(`🎉 小说更新成功！\n标题: 《${formData.title}》`)
      
      // 跳转回小说详情页
      router.push(`/novels/${novelId}`)
      
    } catch (error) {
      console.error('更新小说失败:', error)
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
        <a
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
        </a>
      </div>
    )
  }
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111827' }}>
          ✏️ 编辑小说
        </h1>
        <div style={{ color: '#6b7280', marginBottom: '1rem' }}>
          正在编辑：{novel.title} · 作者：{novel.author}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
            小说标题 *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="请输入小说标题"
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
            小说简介 *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="请简要描述你的小说内容"
            rows={4}
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
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
            小说内容（第一章）
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="小说第一章内容"
            rows={8}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            注意：修改第一章内容不会影响已创建的章节
          </div>
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
            onClick={() => router.push(`/novels/${params.id}`)}
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
          1. 可以修改小说标题、简介和第一章内容<br/>
          2. 第一章内容已迁移到统一的章节系统<br/>
          3. 修改后立即生效，读者会看到更新后的内容<br/>
          4. 如需编辑其他章节，请使用章节管理功能
        </div>
      </div>
    </div>
  )
}