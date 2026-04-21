// 小说详情页面 - 支持真实数据
'use client'

import { useState, useEffect } from 'react'

export default function NovelDetailPage() {
  const [selectedChapter, setSelectedChapter] = useState(0)
  const [novel, setNovel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // 从localStorage获取小说数据
    const fetchNovelData = () => {
      try {
        setLoading(true)
        
        // 从localStorage获取小说数据
        const savedNovels = JSON.parse(localStorage.getItem('novel-site-novels') || '[]')
        const savedChapters = JSON.parse(localStorage.getItem('novel-site-chapters') || '[]')
        
        // 使用ID 1的小说作为示例，或者使用第一个小说
        let novelData = savedNovels.find((n: any) => n.id === '1')
        
        if (!novelData && savedNovels.length > 0) {
          novelData = savedNovels[0]
        }
        
        if (!novelData) {
          // 使用默认数据
          novelData = {
            id: '1',
            title: '魔法森林的冒险',
            author: '小明',
            description: '一个关于勇气和友谊的魔法森林冒险故事。',
            category: '奇幻',
            chapters: 3,
            views: 156,
            likes: 67,
            createdAt: '2024-03-10'
          }
        }
        
        // 获取该小说的章节
        const novelChapters = savedChapters.filter((c: any) => c.novelId === novelData.id)
        
        // 如果没有章节，使用默认章节
        let chapterList = novelChapters
        if (novelChapters.length === 0) {
          chapterList = [
            {
              id: '1',
              title: '第一章：神秘的森林',
              number: 1,
              content: '从前，有一个叫小明的小男孩，他住在一个宁静的小村庄旁边。有一天，小明在村庄后面的森林里玩耍时，发现了一条他从未见过的小路。这条小路被五彩斑斓的花朵包围，空气中弥漫着甜甜的香气。',
              createdAt: '2024-03-10',
              views: 156
            },
            {
              id: '2',
              title: '第二章：会说话的小兔子',
              number: 2,
              content: '小兔子名叫小白，它告诉小明很多关于魔法森林的秘密。突然，远处传来一阵奇怪的声音。小白紧张地竖起耳朵："不好，是巫师的巡逻队！快躲起来！"',
              createdAt: '2024-03-11',
              views: 98
            },
            {
              id: '3',
              title: '第三章：黑暗城堡的挑战',
              number: 3,
              content: '在前往黑暗城堡的路上，小明和小白遇到了很多挑战。首先是一片食人花森林，那些花会突然张开大嘴想要吃掉他们。小白教小明唱一首魔法歌谣，食人花听到歌谣就会安静下来。',
              createdAt: '2024-03-12',
              views: 76
            }
          ]
        }
        
        setNovel({
          ...novelData,
          chapterList
        })
      } catch (err) {
        console.error('获取小说数据失败:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchNovelData()
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
        <p style={{ color: '#6b7280' }}>正在加载小说...</p>
      </div>
    )
  }
  
  if (!novel) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
          小说不存在
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          找不到你要阅读的小说
        </p>
        <a
          href="/"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          返回首页
        </a>
      </div>
    )
  }

  return (
    <div>
      {/* 小说头部信息 */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '9999px', marginBottom: '1rem' }}>
          <span>📚</span>
          <span style={{ fontWeight: '500' }}>{novel.category || '奇幻'}</span>
        </div>
        
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#111827'
        }}>
          {novel.title}
        </h1>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#f0f9ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              👤
            </div>
            <span style={{ color: '#6b7280' }}>{novel.author || '作者'}</span>
          </div>
          
          <div style={{ color: '#6b7280' }}>
            <span>📖 {novel.chapterList?.length || 0} 章</span>
            <span style={{ marginLeft: '1rem' }}>👁️ {novel.views || 0} 阅读</span>
            <span style={{ marginLeft: '1rem' }}>❤️ {novel.likes || 0} 喜欢</span>
          </div>
        </div>
        
        <p style={{
          color: '#4b5563',
          maxWidth: '600px',
          margin: '0 auto 2rem',
          lineHeight: '1.6'
        }}>
          {novel.description}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
        {/* 左侧：章节导航 */}
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1rem 1.5rem',
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontWeight: '600',
              color: '#374151'
            }}>
              章节列表 ({novel.chapterList?.length || 0}章)
            </div>
            
            <div>
              {novel.chapterList?.map((chapter: any, index: number) => (
                <button
                  key={chapter.id}
                  onClick={() => setSelectedChapter(index)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid #f3f4f6',
                    textAlign: 'left',
                    backgroundColor: selectedChapter === index ? '#f0f9ff' : 'white',
                    color: selectedChapter === index ? '#1e40af' : '#374151',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>{chapter.title}</div>
                      <div style={{ fontSize: '0.875rem', color: selectedChapter === index ? '#60a5fa' : '#6b7280', marginTop: '0.25rem' }}>
                        第 {chapter.number} 章 · {chapter.views || 0} 阅读
                      </div>
                    </div>
                    {selectedChapter === index && (
                      <span style={{ color: '#3b82f6' }}>▶</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {/* 添加新章节按钮 */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb' }}>
              <a
                href="/novels/new"
                style={{
                  display: 'block',
                  padding: '0.75rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'center'
                }}
              >
                ✏️ 续写新章节
              </a>
            </div>
          </div>
        </div>

        {/* 右侧：章节内容 */}
        <div>
          {novel.chapterList?.[selectedChapter] && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '2rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#111827',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #e5e7eb'
              }}>
                {novel.chapterList[selectedChapter].title}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                <span>第 {novel.chapterList[selectedChapter].number} 章</span>
                <span>•</span>
                <span>{novel.chapterList[selectedChapter].createdAt}</span>
                <span>•</span>
                <span>{novel.chapterList[selectedChapter].views || 0} 阅读</span>
              </div>
              
              <div style={{
                color: '#374151',
                lineHeight: '1.8',
                fontSize: '1.125rem',
                whiteSpace: 'pre-line'
              }}>
                {novel.chapterList[selectedChapter].content}
              </div>
              
              {/* 章节导航 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '2rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #e5e7eb'
              }}>
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
                    cursor: selectedChapter === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  ← 上一章
                </button>
                
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
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
                    cursor: selectedChapter === novel.chapterList.length - 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  下一章 →
                </button>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>❤️</span>
              <span>喜欢 ({novel.likes || 0})</span>
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
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>✏️</span>
              <span>续写新章节</span>
            </a>
            
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>💬</span>
              <span>评论</span>
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}