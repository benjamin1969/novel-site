// 小说详情页面 - 动态获取数据
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { checkLogin } from '../../utils/auth-unified'
import CommentSection from './CommentSection'

export default function NovelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [novel, setNovel] = useState<any>(null)
  const [chapters, setChapters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedChapter, setSelectedChapter] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [isAuthor, setIsAuthor] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [liking, setLiking] = useState(false)

  // 点赞/取消点赞
  const handleLike = async () => {
    if (!currentUser) {
      alert('请先登录再点赞')
      return
    }
    if (liking) return
    setLiking(true)
    try {
      const res = await fetch(`/api/novels/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like', username: currentUser })
      })
      const data = await res.json()
      if (data.success) {
        setLiked(data.liked)
        setLikeCount(data.likes)
      }
    } catch (err) {
      console.error('点赞失败:', err)
    }
    setLiking(false)
  }

  useEffect(() => {
    const fetchNovel = async () => {
      try {
        const novelId = params.id
        console.log('正在获取小说详情, ID:', novelId)
        
        // 获取小说信息
        const response = await fetch(`/api/novels/${novelId}`)
        if (!response.ok) {
          throw new Error('获取小说失败')
        }
        const novelData = await response.json()
        console.log('获取到的小说数据:', novelData)
        setNovel(novelData)
        
        // 判断当前用户是否是作者
        const username = checkLogin()
        setCurrentUser(username)
        setIsAuthor(username === novelData.author)
        // 初始化点赞状态
        setLikeCount(novelData.likes || 0)
        if (username) {
          const likedBy = novelData.liked_by ? JSON.parse(novelData.liked_by) : []
          setLiked(likedBy.includes(username))
        }
        
        // 获取章节列表
        const chaptersResponse = await fetch(`/api/novels/${novelId}/chapters`)
        if (chaptersResponse.ok) {
          const chaptersData = await chaptersResponse.json()
          console.log('获取到的章节数据:', chaptersData)
          setChapters(Array.isArray(chaptersData) ? chaptersData : [])
          if (Array.isArray(chaptersData) && chaptersData.length > 0) {
            setSelectedChapter(chaptersData[0])
          }
        }
        
        setLoading(false)
      } catch (err) {
        console.error('获取小说详情错误:', err)
        setError('获取小说失败')
        setLoading(false)
      }
    }
    
    fetchNovel()
  }, [params.id])

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: '#666' }}>正在获取小说内容...</p>
      </div>
    )
  }

  if (error || !novel) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: '#c00' }}>{error || '小说不存在'}</p>
        <button
          onClick={() => router.back()}
          style={{
            marginTop: '20px',
            padding: '10px 24px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          返回
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      {/* 返回按钮 */}
      <button
        onClick={() => router.back()}
        style={{
          background: 'none',
          border: 'none',
          color: '#2563eb',
          fontSize: '16px',
          cursor: 'pointer',
          padding: '8px 0',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        ← 返回
      </button>

      {/* 小说信息 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          {novel.title}
        </h1>
        <div style={{ display: 'flex', gap: '16px', color: '#6b7280', fontSize: '14px', flexWrap: 'wrap' }}>
          <span>作者: {novel.author}</span>
          {novel.category && <span>分类: {novel.category}</span>}
          <span>📖 {chapters.length} 章</span>
          <span>👁️ {novel.views || 0} 阅读</span>
          <span onClick={handleLike} style={{ cursor: currentUser ? 'pointer' : 'default', userSelect: 'none' }}>
            {liked ? '❤️' : '🤍'} {likeCount} 喜欢
          </span>
        </div>
        {novel.description && (
          <p style={{ marginTop: '12px', color: '#374151', lineHeight: '1.6', fontSize: '15px' }}>
            {novel.description}
          </p>
        )}
      </div>

      {/* 左右布局：左侧章节列表 + 右侧内容 */}
      <div style={{
        display: 'flex',
        gap: '20px',
        minHeight: '500px'
      }}>
        {/* 左侧章节列表 */}
        <div style={{
          width: '280px',
          flexShrink: 0,
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          padding: '16px'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151', marginBottom: '12px' }}>
            章节列表
          </h2>
          {chapters.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>暂无章节</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.id || index}
                  onClick={() => setSelectedChapter(chapter)}
                  style={{
                    padding: '10px 12px',
                    backgroundColor: selectedChapter?.id === chapter.id ? '#2563eb' : 'transparent',
                    color: selectedChapter?.id === chapter.id ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  {chapter.title || `第${chapter.number || index + 1}章`}
                </button>
              ))}
            </div>
          )}
          {/* 续写新章节 - 放在章节列表下方 */}
          {isAuthor && chapters.length > 0 && (
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
              <button
                onClick={() => router.push(`/novels/new?mode=chapter&novel=${novel.id}`)}
                style={{
                  width: '100%',
                  padding: '10px 0',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                续写新章节
              </button>
            </div>
          )}
        </div>

        {/* 右侧章节内容 */}
        <div style={{
          flex: 1,
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          padding: '24px',
          minHeight: '400px'
        }}>
          {selectedChapter ? (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                {selectedChapter.title || `第${selectedChapter.number}章`}
              </h2>
              <div style={{
                lineHeight: '2',
                fontSize: '20px',
                color: '#374151',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedChapter.content}
              </div>
              {/* 上一章/下一章按钮 */}
              {chapters.length > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '32px',
                  paddingTop: '20px',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <button
                    onClick={() => {
                      const currentIndex = chapters.findIndex(c => c.id === selectedChapter.id)
                      if (currentIndex > 0) setSelectedChapter(chapters[currentIndex - 1])
                    }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: chapters.findIndex(c => c.id === selectedChapter.id) > 0 ? '#f3f4f6' : '#f3f4f6',
                      color: chapters.findIndex(c => c.id === selectedChapter.id) > 0 ? '#374151' : '#d1d5db',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: chapters.findIndex(c => c.id === selectedChapter.id) > 0 ? 'pointer' : 'not-allowed'
                    }}
                    disabled={chapters.findIndex(c => c.id === selectedChapter.id) <= 0}
                  >
                    ← 上一章
                  </button>
                  <span style={{ fontSize: '14px', color: '#9ca3af', alignSelf: 'center' }}>
                    {chapters.findIndex(c => c.id === selectedChapter.id) + 1} / {chapters.length}
                  </span>
                  <button
                    onClick={() => {
                      const currentIndex = chapters.findIndex(c => c.id === selectedChapter.id)
                      if (currentIndex < chapters.length - 1) setSelectedChapter(chapters[currentIndex + 1])
                    }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: chapters.findIndex(c => c.id === selectedChapter.id) < chapters.length - 1 ? '#f3f4f6' : '#f3f4f6',
                      color: chapters.findIndex(c => c.id === selectedChapter.id) < chapters.length - 1 ? '#374151' : '#d1d5db',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: chapters.findIndex(c => c.id === selectedChapter.id) < chapters.length - 1 ? 'pointer' : 'not-allowed'
                    }}
                    disabled={chapters.findIndex(c => c.id === selectedChapter.id) >= chapters.length - 1}
                  >
                    下一章 →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', paddingTop: '80px', color: '#9ca3af' }}>
              <p style={{ fontSize: '16px' }}>请从左侧选择一个章节开始阅读</p>
            </div>
          )}
        </div>
      </div>

      {/* 评论区 */}
      <CommentSection novelId={params.id as string} currentUser={currentUser} />
    </div>
  )
}
