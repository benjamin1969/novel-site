// 小说详情页面 - 最简单版本
'use client'

import { useState } from 'react'

export default function NovelDetailPage() {
  const [selectedChapter, setSelectedChapter] = useState(0)
  
  // 简单的小说数据
  const novel = {
    id: '1',
    title: '魔法森林的冒险',
    author: '小明',
    description: '一个关于勇气和友谊的魔法森林冒险故事。',
    category: '奇幻',
    chapters: 3,
    views: 156,
    likes: 67,
    createdAt: '2024-03-10',
    
    // 章节内容
    chapterList: [
      {
        id: '1',
        title: '第一章：神秘的森林',
        number: 1,
        content: '从前，有一个叫小明的小男孩，他住在一个宁静的小村庄旁边。',
        createdAt: '2024-03-10',
        views: 156
      },
      {
        id: '2',
        title: '第二章：会说话的小兔子',
        number: 2,
        content: '小兔子名叫小白，它告诉小明很多关于魔法森林的秘密。',
        createdAt: '2024-03-11',
        views: 98
      },
      {
        id: '3',
        title: '第三章：黑暗城堡的挑战',
        number: 3,
        content: '在前往黑暗城堡的路上，小明和小白遇到了很多挑战。',
        createdAt: '2024-03-12',
        views: 76
      }
    ]
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111827' }}>
          {novel.title}
        </h1>
        
        <div style={{ color: '#6b7280', marginBottom: '1rem' }}>
          <span>作者: {novel.author}</span>
          <span style={{ marginLeft: '1rem' }}>📖 {novel.chapters} 章</span>
        </div>
        
        <p style={{ color: '#4b5563', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
          {novel.description}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
        {/* 左侧：章节导航 */}
        <div>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem' }}>
            <div style={{ fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
              章节列表
            </div>
            
            <div>
              {novel.chapterList.map((chapter, index) => (
                <button
                  key={chapter.id}
                  onClick={() => setSelectedChapter(index)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    textAlign: 'left',
                    backgroundColor: selectedChapter === index ? '#f0f9ff' : 'white',
                    color: selectedChapter === index ? '#1e40af' : '#374151',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: '500' }}>{chapter.title}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    第 {chapter.number} 章
                  </div>
                </button>
              ))}
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <a
                href="/novels/new"
                style={{
                  display: 'block',
                  padding: '0.75rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontWeight: '500'
                }}
              >
                续写新章节
              </a>
            </div>
          </div>
        </div>

        {/* 右侧：章节内容 */}
        <div>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
              {novel.chapterList[selectedChapter].title}
            </h2>
            
            <div style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              第 {novel.chapterList[selectedChapter].number} 章 · {novel.chapterList[selectedChapter].views} 阅读
            </div>
            
            <div style={{ color: '#374151', lineHeight: '1.8', fontSize: '1.125rem' }}>
              {novel.chapterList[selectedChapter].content}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
              <button
                onClick={() => setSelectedChapter(prev => Math.max(0, prev - 1))}
                disabled={selectedChapter === 0}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: selectedChapter === 0 ? '#f3f4f6' : '#2563eb',
                  color: selectedChapter === 0 ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: selectedChapter === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                上一章
              </button>
              
              <div style={{ color: '#6b7280', fontSize: '0.875rem', alignSelf: 'center' }}>
                {selectedChapter + 1} / {novel.chapterList.length}
              </div>
              
              <button
                onClick={() => setSelectedChapter(prev => Math.min(novel.chapterList.length - 1, prev + 1))}
                disabled={selectedChapter === novel.chapterList.length - 1}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: selectedChapter === novel.chapterList.length - 1 ? '#f3f4f6' : '#2563eb',
                  color: selectedChapter === novel.chapterList.length - 1 ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: selectedChapter === novel.chapterList.length - 1 ? 'not-allowed' : 'pointer'
                }}
              >
                下一章
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              喜欢 ({novel.likes})
            </button>
            
            <a
              href="/novels/new"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              续写新章节
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}