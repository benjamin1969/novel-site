// 小说创作页面 - 简化版支持章节
'use client'

import { useState, useEffect } from 'react'
import { requireLogin, redirectToLogin } from '../../utils/auth'

export default function NewNovelPage() {
  // 在页面加载时检查登录状态
  useEffect(() => {
    const username = requireLogin()
    if (!username) {
      // 如果未登录，requireLogin会自动重定向到登录页面
      return
    }
  }, [])
  const [mode, setMode] = useState<'new' | 'chapter'>('new')
  const [selectedNovel, setSelectedNovel] = useState('1')
  const [isLoading, setIsLoading] = useState(false)
  const [fromUrl, setFromUrl] = useState(false) // 是否从URL参数获取小说ID
  const [existingNovels, setExistingNovels] = useState<any[]>([]) // 从API获取的小说列表
  const [loadingNovels, setLoadingNovels] = useState(true) // 小说列表加载状态

  // 从URL参数读取模式
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlMode = params.get('mode')
    const novelId = params.get('novel')
    
    if (urlMode === 'chapter') {
      setMode('chapter')
    }
    
    if (novelId) {
      setSelectedNovel(novelId)
      // 如果从URL获取了小说ID，自动设置为章节模式
      setMode('chapter')
      setFromUrl(true) // 标记为从URL获取
    }
  }, [])

  // 表单数据
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    chapterTitle: '',
    chapterNumber: 1,
    content: ''
  })

  // 草稿相关状态
  const [drafts, setDrafts] = useState<any[]>([])
  const [showDrafts, setShowDrafts] = useState(false)
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null)

  // 从API获取已有小说
  useEffect(() => {
    const fetchNovels = async () => {
      try {
        setLoadingNovels(true)
        const response = await fetch('/api/novels')
        if (response.ok) {
          const novelsData = await response.json()
          // 过滤出已发布的小说
          const publishedNovels = novelsData.filter((novel: any) => novel.status === 'published')
          setExistingNovels(publishedNovels.map((novel: any) => ({
            id: novel.id,
            title: novel.title,
            chapters: novel.chapters || 1
          })))
        }
      } catch (error) {
        console.error('获取小说列表失败:', error)
        // 保持原有的模拟数据作为回退
      } finally {
        setLoadingNovels(false)
      }
    }
    
    fetchNovels()
  }, [])

  // 获取当前用户名（用于草稿存储）
  const getCurrentUsername = () => {
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
        if (key === 'user') {
          try {
            const userData = JSON.parse(value.trim())
            return userData.username || userData.name || userData.displayName || ''
          } catch (e) {
            return value.trim()
          }
        }
        return value.trim()
      }
    }
    return ''
  }

  // 加载草稿列表
  const loadDrafts = () => {
    const username = getCurrentUsername()
    if (!username) return
    
    const storageKey = `novel-drafts-${username}`
    try {
      const draftsData = localStorage.getItem(storageKey)
      if (draftsData) {
        const parsedDrafts = JSON.parse(draftsData)
        setDrafts(parsedDrafts)
      }
    } catch (error) {
      console.error('加载草稿失败:', error)
    }
  }

  // 保存草稿
  const saveDraft = () => {
    const username = getCurrentUsername()
    if (!username) {
      alert('请先登录才能保存草稿！')
      return
    }

    if (!formData.title.trim() && !formData.content.trim()) {
      alert('请至少填写标题或内容才能保存草稿')
      return
    }

    const draft = {
      id: currentDraftId || `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title.trim() || '未命名草稿',
      description: formData.description.trim() || '',
      chapterTitle: formData.chapterTitle.trim() || '第一章',
      content: formData.content.trim() || '',
      createdAt: currentDraftId 
        ? drafts.find(d => d.id === currentDraftId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft'
    }

    const storageKey = `novel-drafts-${username}`
    let updatedDrafts = [...drafts]
    
    if (currentDraftId) {
      // 更新现有草稿
      updatedDrafts = drafts.map(d => d.id === currentDraftId ? draft : d)
    } else {
      // 添加新草稿
      updatedDrafts = [draft, ...drafts]
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedDrafts))
      setDrafts(updatedDrafts)
      setCurrentDraftId(draft.id)
      alert(`✅ 草稿已保存！\\n标题: ${draft.title}\\n保存时间: ${new Date().toLocaleString()}`)
    } catch (error) {
      console.error('保存草稿失败:', error)
      alert('保存草稿失败，请检查存储空间')
    }
  }

  // 加载草稿到表单
  const loadDraft = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId)
    if (draft) {
      setFormData({
        title: draft.title === '未命名草稿' ? '' : draft.title,
        description: draft.description,
        chapterTitle: draft.chapterTitle,
        chapterNumber: 1,
        content: draft.content
      })
      setCurrentDraftId(draftId)
      setShowDrafts(false)
      alert(`📝 已加载草稿: ${draft.title}`)
    }
  }

  // 删除草稿
  const deleteDraft = (draftId: string) => {
    if (!confirm('确定要删除这个草稿吗？')) return
    
    const username = getCurrentUsername()
    if (!username) return
    
    const updatedDrafts = drafts.filter(d => d.id !== draftId)
    const storageKey = `novel-drafts-${username}`
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedDrafts))
      setDrafts(updatedDrafts)
      
      if (currentDraftId === draftId) {
        setCurrentDraftId(null)
        setFormData({
          title: '',
          description: '',
          chapterTitle: '',
          chapterNumber: 1,
          content: ''
        })
      }
      
      alert('🗑️ 草稿已删除')
    } catch (error) {
      console.error('删除草稿失败:', error)
      alert('删除草稿失败')
    }
  }

  // 组件加载时加载草稿
  useEffect(() => {
    loadDrafts()
  }, [])

  // 自动保存草稿（防抖处理）
  useEffect(() => {
    if (!formData.title.trim() && !formData.content.trim()) return
    
    const timeoutId = setTimeout(() => {
      if (currentDraftId) {
        // 如果有当前草稿ID，自动更新
        const username = getCurrentUsername()
        if (username && (formData.title.trim() || formData.content.trim())) {
          saveDraft()
        }
      }
    }, 3000) // 3秒后自动保存
    
    return () => clearTimeout(timeoutId)
  }, [formData.title, formData.description, formData.content, currentDraftId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === 'new') {
        // === 终极解决方案：确保获取正确的用户名 ===
        // 尝试所有可能的键名来获取用户名
        const possibleKeys = [
          'novel-site-username',  // 主要键名
          'username',             // 备用键名1
          'currentUser',          // 备用键名2
          'user',                 // 备用键名3
          'name'                  // 备用键名4
        ]
        
        let currentUsername = ''
        let foundKey = ''
        
        for (const key of possibleKeys) {
          const value = localStorage.getItem(key)
          if (value && value.trim() && value.trim() !== '匿名用户') {
            // 特殊处理：如果键名是'user'，可能是JSON格式
            if (key === 'user') {
              try {
                const userData = JSON.parse(value.trim())
                // 尝试从JSON对象中提取用户名
                currentUsername = userData.username || userData.name || userData.displayName || ''
                if (currentUsername) {
                  foundKey = key
                  console.log('从JSON中提取用户名:', currentUsername)
                  break
                }
              } catch (e) {
                // 如果不是JSON，直接使用
                currentUsername = value.trim()
                foundKey = key
                break
              }
            } else {
              currentUsername = value.trim()
              foundKey = key
              break
            }
          }
        }
        
        console.log('找到的用户名:', currentUsername, '键名:', foundKey)
        console.log('localStorage所有内容:', Object.keys(localStorage).map(k => `${k}: ${localStorage.getItem(k)}`))
        
        // 如果还是没找到，检查是否有登录标记
        if (!currentUsername) {
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
            // 有登录标记但没有用户名，让用户输入
            const input = prompt('检测到您已登录，但未找到用户名。请输入您的用户名:')
            if (input && input.trim()) {
              currentUsername = input.trim()
              // 保存到localStorage以便下次使用
              localStorage.setItem('novel-site-username', currentUsername)
            }
          }
        }
        
        // 如果未登录，强制跳转到登录页面
        if (!currentUsername || currentUsername.trim() === '') {
          alert('请先登录才能发表小说！')
          window.location.href = '/login'
          setIsLoading(false)
          return
        }
        
        // 验证表单数据
        if (!formData.title.trim()) {
          alert('请输入小说标题！')
          setIsLoading(false)
          return
        }
        
        if (!formData.description.trim()) {
          alert('请输入小说简介！')
          setIsLoading(false)
          return
        }
        
        if (!formData.content.trim()) {
          alert('请输入小说内容！')
          setIsLoading(false)
          return
        }
        
        console.log('创建小说，作者:', currentUsername, '标题:', formData.title)
        
        // 调用API创建新小说
        const response = await fetch('/api/novels', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.title.trim(),
            description: formData.description.trim(),
            author: currentUsername,  // 确保使用正确的用户名
            content: formData.content.trim(),
            status: 'published'  // 直接发布
          })
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `创建失败: ${response.status}`)
        }

        const result = await response.json()
        
        // 显示成功消息，明确显示作者
        alert(`🎉 小说创建成功！\\n标题: 《${formData.title}》\\n作者: ${currentUsername}\\n状态: 已直接发布\\n第一章已自动创建`)
        
        // 如果是从草稿发布的，删除对应的草稿
        if (currentDraftId) {
          deleteDraft(currentDraftId)
        }
        
        // 跳转到作品库页面
        window.location.href = '/novels'
      } else {
        // 添加新章节 - 使用API
        const novel = existingNovels.find(n => n.id === selectedNovel)
        if (!novel) {
          alert('未找到对应的小说')
          setIsLoading(false)
          return
        }
        
        // 调用API添加章节
        const response = await fetch(`/api/novels/${selectedNovel}/chapters`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.chapterTitle.trim(),
            content: formData.content.trim(),
            number: formData.chapterNumber
          })
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `添加章节失败: ${response.status}`)
        }

        const result = await response.json()
        
        // 更新本地小说列表的章节数
        const updatedNovels = existingNovels.map(n => {
          if (n.id === selectedNovel) {
            return { ...n, chapters: n.chapters + 1 }
          }
          return n
        })
        setExistingNovels(updatedNovels)
        
        alert(`🎉 第 ${formData.chapterNumber} 章 "${formData.chapterTitle}" 已添加到《${novel.title}》！`)
        setFormData({ ...formData, chapterTitle: '', chapterNumber: formData.chapterNumber + 1, content: '' })
      }
    } catch (error) {
      console.error('操作失败:', error)
      alert(`操作失败: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111827' }}>
          {mode === 'new' ? '创作新小说' : '添加新章节'}
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          {mode === 'new' ? '开始全新的故事创作' : '为已有小说续写新章节'}
        </p>

        <div style={{ display: 'inline-flex', backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '0.25rem' }}>
          <button
            onClick={() => setMode('new')}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: mode === 'new' ? '#2563eb' : 'transparent',
              color: mode === 'new' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            新小说
          </button>
          <button
            onClick={() => setMode('chapter')}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: mode === 'chapter' ? '#2563eb' : 'transparent',
              color: mode === 'chapter' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            新章节
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {mode === 'chapter' && (
          <div style={{ marginBottom: '1.5rem' }}>
            {fromUrl ? (
              // 从URL获取小说ID时，显示小说信息
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <div style={{ fontWeight: '500', color: '#0369a1', marginBottom: '0.5rem' }}>
                  正在为以下小说添加新章节：
                </div>
                <div style={{ color: '#0c4a6e' }}>
                  {loadingNovels ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #e5e7eb',
                        borderTopColor: '#2563eb',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      加载中...
                    </div>
                  ) : (
                    (() => {
                      const novel = existingNovels.find(n => n.id === selectedNovel)
                      return novel ? `《${novel.title}》 (共 ${novel.chapters} 章)` : '小说不存在'
                    })()
                  )}
                </div>
              </div>
            ) : (
              // 正常情况，显示选择下拉菜单
              <>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                  选择小说
                </label>
                <select
                  value={selectedNovel}
                  onChange={(e) => {
                    setSelectedNovel(e.target.value)
                    const novel = existingNovels.find(n => n.id === e.target.value)
                    if (novel) {
                      setFormData(prev => ({ ...prev, chapterNumber: novel.chapters + 1 }))
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white'
                  }}
                >
                  {existingNovels.map(novel => (
                    <option key={novel.id} value={novel.id}>
                      {novel.title} (共 {novel.chapters} 章)
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        )}

        {mode === 'new' ? (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                小说标题
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
                小说简介
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
                第一章标题
              </label>
              <input
                type="text"
                value={formData.chapterTitle}
                onChange={(e) => setFormData({ ...formData, chapterTitle: e.target.value })}
                placeholder="请输入第一章标题（可选，默认为'第一章'）"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                章节标题
              </label>
              <input
                type="text"
                value={formData.chapterTitle}
                onChange={(e) => setFormData({ ...formData, chapterTitle: e.target.value })}
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
                章节编号
              </label>
              <input
                type="number"
                value={formData.chapterNumber}
                onChange={(e) => setFormData({ ...formData, chapterNumber: parseInt(e.target.value) || 1 })}
                min="1"
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
          </>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
            {mode === 'new' ? '小说内容（第一章）' : '章节内容'}
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder={mode === 'new' ? '开始创作你的小说第一章...' : '开始创作本章内容...'}
            rows={10}
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

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.875rem',
            backgroundColor: isLoading ? '#93c5fd' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? '处理中...' : mode === 'new' ? '开始创作小说' : '添加章节'}
        </button>

        {/* 草稿功能区域 */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={saveDraft}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                flex: 1
              }}
            >
              💾 保存草稿
            </button>
            
            <button
              type="button"
              onClick={() => setShowDrafts(!showDrafts)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                flex: 1
              }}
            >
              {showDrafts ? '📂 隐藏草稿' : `📂 查看草稿 (${drafts.length})`}
            </button>
          </div>

          {/* 草稿列表 */}
          {showDrafts && drafts.length > 0 && (
            <div style={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1rem',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.75rem' }}>
                我的草稿 ({drafts.length})
              </div>
              
              {drafts.map((draft, index) => (
                <div key={draft.id} style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#111827', marginBottom: '0.25rem' }}>
                      {draft.title}
                      {currentDraftId === draft.id && (
                        <span style={{
                          marginLeft: '0.5rem',
                          backgroundColor: '#dbeafe',
                          color: '#1e40af',
                          padding: '0.125rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem'
                        }}>
                          当前编辑
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      {draft.description || '暂无简介'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      最后更新: {new Date(draft.updatedAt).toLocaleString()}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => loadDraft(draft.id)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      加载
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteDraft(draft.id)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showDrafts && drafts.length === 0 && (
            <div style={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
              <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                暂无草稿
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                开始创作并保存草稿，它们会显示在这里
              </div>
            </div>
          )}

          {/* 草稿使用说明 */}
          {showDrafts && (
            <div style={{
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '6px',
              padding: '0.75rem',
              marginTop: '1rem',
              fontSize: '0.875rem',
              color: '#0369a1'
            }}>
              <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>💡 草稿功能说明</div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                <li>草稿保存在浏览器本地，仅当前用户可见</li>
                <li>点击"保存草稿"保存当前编辑内容</li>
                <li>点击"加载"将草稿内容恢复到编辑区</li>
                <li>发布小说后，对应的草稿会自动删除</li>
              </ul>
            </div>
          )}
        </div>
      </form>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}