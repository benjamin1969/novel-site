// 小说创作页面 - 简化版支持章节
'use client'

import { useState } from 'react'

export default function NewNovelPage() {
  const [mode, setMode] = useState<'new' | 'chapter'>('new')
  const [selectedNovel, setSelectedNovel] = useState('1')
  const [isLoading, setIsLoading] = useState(false)

  // 表单数据
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    chapterTitle: '',
    chapterNumber: 1,
    content: ''
  })

  // 模拟已有小说
  const existingNovels = [
    { id: '1', title: '魔法森林的冒险', chapters: 3 },
    { id: '2', title: '太空探险记', chapters: 2 },
    { id: '3', title: '海底两万里', chapters: 1 }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      if (mode === 'new') {
        alert(`🎉 小说 "${formData.title}" 创建成功！`)
        setFormData({ title: '', description: '', chapterTitle: '', chapterNumber: 1, content: '' })
        setMode('chapter')
      } else {
        const novelTitle = existingNovels.find(n => n.id === selectedNovel)?.title || '小说'
        alert(`✅ 第 ${formData.chapterNumber} 章已添加到 "${novelTitle}"！`)
        setFormData(prev => ({ ...prev, chapterTitle: '', chapterNumber: prev.chapterNumber + 1, content: '' }))
      }
    }, 1000)
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
                  {novel.title} (已有{novel.chapters}章)
                </option>
              ))}
            </select>
          </div>
        )}

        {mode === 'new' ? (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                小说标题 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="给你的故事起一个吸引人的标题"
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
                placeholder="简单介绍一下你的故事"
                rows={3}
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
          </>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                  章节编号 *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.chapterNumber}
                  onChange={(e) => setFormData({ ...formData, chapterNumber: parseInt(e.target.value) || 1 })}
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

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                  章节标题 *
                </label>
                <input
                  type="text"
                  value={formData.chapterTitle}
                  onChange={(e) => setFormData({ ...formData, chapterTitle: e.target.value })}
                  placeholder="如：第一章 神秘的森林"
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
            </div>
          </>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
            内容 *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder={mode === 'new' ? "写下你的故事开头..." : "写下这一章的内容..."}
            rows={10}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              resize: 'vertical',
              lineHeight: '1.6'
            }}
          />
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            字数: {formData.content.length} 字
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            * 为必填项
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: isLoading ? '#9ca3af' : (mode === 'new' ? '#2563eb' : '#10b981'),
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                {mode === 'new' ? '创建中...' : '发布中...'}
              </>
            ) : (
              mode === 'new' ? '创建小说' : '发布章节'
            )}
          </button>
        </div>
      </form>

      <div style={{
        backgroundColor: '#f0f9ff',
        padding: '1.5rem',
        borderRadius: '12px',
        marginTop: '2rem'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1e40af' }}>
          💡 创作说明
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <li><strong>创作新小说</strong>: 先创建小说基本信息，然后可以连续添加章节</li>
          <li><strong>添加新章节</strong>: 选择已有小说，系统会自动计算下一章编号</li>
          <li><strong>连续创作</strong>: 发布一章后，可以立即开始写下一章</li>
          <li><strong>章节管理</strong>: 可以在"我的作品"中管理所有章节</li>
        </ul>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}