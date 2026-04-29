import { useState, useEffect } from 'react'

interface Comment {
  id: string
  novelId: string
  content: string
  author: string
  authorId: string
  createdAt: string
  likes?: number
  likedBy?: string
  replies?: Comment[]
  user: {
    id: string
    username: string
    displayName: string
  }
}

interface CommentSectionProps {
  novelId: string
  currentUser: string | null
}

export default function CommentSection({ novelId, currentUser }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [visibleCount, setVisibleCount] = useState(15)
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set())
  const [likingComments, setLikingComments] = useState<Set<string>>(new Set())

  // 点赞/取消点赞评论
  const handleLikeComment = async (commentId: string) => {
    if (!currentUser) {
      alert('请先登录再点赞')
      return
    }
    if (likingComments.has(commentId)) return
    setLikingComments(prev => new Set(prev).add(commentId))
    try {
      const res = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like', username: currentUser, commentId })
      })
      const data = await res.json()
      if (data.success) {
        // 更新本地评论数据
        setComments(prev => prev.map(c => {
          if (c.id === commentId) {
            const newLiked = data.liked
            const newLikes = data.likeCount
            if (newLiked) {
              setLikedComments(prev2 => new Set(prev2).add(commentId))
            } else {
              setLikedComments(prev2 => {
                const next = new Set(prev2)
                next.delete(commentId)
                return next
              })
            }
            return { ...c, likes: newLikes }
          }
          // 如果有回复，遍历回复
          if (c.replies) {
            const updatedReplies = c.replies.map(r => {
              if (r.id === commentId) {
                const newLiked = data.liked
                const newLikes = data.likeCount
                if (newLiked) {
                  setLikedComments(prev2 => new Set(prev2).add(commentId))
                } else {
                  setLikedComments(prev2 => {
                    const next = new Set(prev2)
                    next.delete(commentId)
                    return next
                  })
                }
                return { ...r, likes: newLikes }
              }
              if (r.replies) {
                return {
                  ...r,
                  replies: r.replies.map(gc => {
                    if (gc.id === commentId) {
                      const newLiked = data.liked
                      const newLikes = data.likeCount
                      if (newLiked) {
                        setLikedComments(prev2 => new Set(prev2).add(commentId))
                      } else {
                        setLikedComments(prev2 => {
                          const next = new Set(prev2)
                          next.delete(commentId)
                          return next
                        })
                      }
                      return { ...gc, likes: newLikes }
                    }
                    return gc
                  })
                }
              }
              return r
            })
            return { ...c, replies: updatedReplies }
          }
          return c
        }))
      }
    } catch (err) {
      console.error('点赞评论失败:', err)
    }
    setLikingComments(prev => {
      const next = new Set(prev)
      next.delete(commentId)
      return next
    })
  }

  // 加载评论
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?novelId=${novelId}`)
        if (response.ok) {
          const data = await response.json()
          const loadedComments = data.comments || []
          setComments(loadedComments)
          // 初始化点赞状态
          if (currentUser) {
            const liked = new Set<string>()
            const scanComments = (cmts: Comment[]) => {
              cmts.forEach(c => {
                if (c.likedBy) {
                  try {
                    const arr = JSON.parse(c.likedBy)
                    if (Array.isArray(arr) && arr.includes(currentUser)) {
                      liked.add(c.id)
                    }
                  } catch {}
                }
                if (c.replies) scanComments(c.replies)
              })
            }
            scanComments(loadedComments)
            setLikedComments(liked)
          }
        }
      } catch (err) {
        console.error('获取评论失败:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchComments()
  }, [novelId])

  // 提交评论
  const handleSubmit = async () => {
    const content = newComment.trim()
    if (!content) return
    if (content.length > 50) {
      setError('评论内容不能超过50个字符')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-current-user': encodeURIComponent(currentUser || '')
        },
        body: JSON.stringify({
          novelId,
          content
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '发表评论失败')
      }

      // 将新评论添加到列表顶部
      if (data.comment) {
        setComments(prev => [data.comment, ...prev])
      } else {
        // 重新加载评论
        const refreshResponse = await fetch(`/api/comments?novelId=${novelId}`)
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json()
          setComments(refreshData.comments || [])
        }
      }

      setNewComment('')
    } catch (err: any) {
      setError(err.message || '发表评论失败')
    } finally {
      setSubmitting(false)
    }
  }

  // 删除评论（允许作者或管理员在页面内删除）
  const handleDelete = async (commentId: string) => {
    if (!confirm('确定要删除这条评论吗？')) return

    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setComments(prev => prev.filter(c => c.id !== commentId))
      } else {
        alert('删除失败')
      }
    } catch (err) {
      console.error('删除评论失败:', err)
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const minutes = Math.floor(diff / 60000)
      if (minutes < 1) return '刚刚'
      if (minutes < 60) return `${minutes}分钟前`
      const hours = Math.floor(minutes / 60)
      if (hours < 24) return `${hours}小时前`
      const days = Math.floor(hours / 24)
      if (days < 30) return `${days}天前`
      return date.toLocaleDateString('zh-CN')
    } catch {
      return dateString
    }
  }

  return (
    <div style={{
      marginTop: '32px',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      padding: '24px'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '20px',
        paddingBottom: '12px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        评论 {comments.length > 0 && `(${comments.length})`}
      </h3>

      {/* 发表评论 */}
      {currentUser ? (
        <div style={{
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px'
        }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的评论..."
            maxLength={50}
            rows={3}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              lineHeight: '1.5',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit'
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '8px'
          }}>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>
              {newComment.length}/50
            </span>
            <button
              onClick={handleSubmit}
              disabled={submitting || !newComment.trim()}
              style={{
                padding: '8px 20px',
                backgroundColor: submitting || !newComment.trim() ? '#93c5fd' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: submitting || !newComment.trim() ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              {submitting ? '发表中...' : '发表评论'}
            </button>
          </div>
          {error && (
            <div style={{
              marginTop: '8px',
              padding: '8px 12px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              borderRadius: '6px',
              fontSize: '13px'
            }}>
              {error}
            </div>
          )}
        </div>
      ) : (
        <div style={{
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          <a href="/login" style={{ color: '#2563eb', textDecoration: 'underline' }}>登录</a>
          {' '}后即可发表评论
        </div>
      )}

      {/* 评论列表 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}>
          加载评论中...
        </div>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: '14px' }}>
          暂无评论，快来抢沙发吧～
        </div>
      ) : (
        <div>
          {/* 固定高度滚动容器 */}
          <div style={{
            maxHeight: '480px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            paddingRight: '4px'
          }}>
            {comments.slice(0, visibleCount).map((comment) => (
              <div
                key={comment.id}
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #f3f4f6'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {(comment.user?.displayName || comment.author || '?')[0]}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                      {comment.user?.displayName || comment.author}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                      {formatDate(comment.createdAt)}
                    </span>
                    {currentUser && (currentUser === comment.author || currentUser === 'admin') && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#9ca3af',
                          fontSize: '12px',
                          cursor: 'pointer',
                          padding: '2px 4px'
                        }}
                        title="删除"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                <div style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#374151',
                  wordBreak: 'break-word'
                }}>
                  {comment.content}
                </div>
                {/* 点赞按钮 */}
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    disabled={likingComments.has(comment.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: currentUser ? 'pointer' : 'default',
                      fontSize: '13px',
                      color: likedComments.has(comment.id) ? '#2563eb' : '#9ca3af',
                      padding: '2px 4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    {likedComments.has(comment.id) ? '👍' : '👍'} {comment.likes || 0}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 查看更多按钮 */}
          {visibleCount < comments.length && (
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                onClick={() => setVisibleCount(prev => prev + 20)}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                查看更多评论（还有 {comments.length - visibleCount} 条）
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
