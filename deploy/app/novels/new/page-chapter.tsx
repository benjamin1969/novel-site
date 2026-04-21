'use client'

import { useState } from 'react'

export default function CreateChapterPage() {
  const [chapterData, setChapterData] = useState({
    chapterTitle: '',
    chapterNumber: 1,
    content: '',
    summary: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('提交章节数据:', chapterData)
    alert('章节创建成功！')
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: '#111827'
      }}>
        创建新章节
      </h1>

      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#374151'
          }}>
            章节标题 *
          </label>
          <input
            type="text"
            value={chapterData.chapterTitle}
            onChange={(e) => setChapterData({ ...chapterData, chapterTitle: e.target.value })}
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

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#374151'
          }}>
            章节编号 *
          </label>
          <input
            type="number"
            value={chapterData.chapterNumber}
            onChange={(e) => setChapterData({ ...chapterData, chapterNumber: parseInt(e.target.value) })}
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

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#374151'
          }}>
            章节内容 *
          </label>
          <textarea
            value={chapterData.content}
            onChange={(e) => setChapterData({ ...chapterData, content: e.target.value })}
            placeholder="请输入章节内容..."
            required
            rows={10}
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

        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#374151'
          }}>
            章节概要
          </label>
          <textarea
            value={chapterData.summary}
            onChange={(e) => setChapterData({ ...chapterData, summary: e.target.value })}
            placeholder="简要描述本章节内容（可选）"
            rows={4}
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

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={() => window.history.back()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            取消
          </button>
          <button
            type="submit"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            创建章节
          </button>
        </div>
      </form>
    </div>
  )
}
