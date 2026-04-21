// 评论列表组件 - 简约朴素风格
'use client'

import { useState, useEffect } from 'react'

interface Comment {
  id: string
  novelId: string
  author: string
  content: string
  likes: number
  createdAt: string
  status: 'approved' | 'pending' | 'rejected'
}

interface CommentListProps {
  novelId: string
  currentUser: string
}

export default function CommentList({ novelId, currentUser }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [currentUserState, setCurrentUserState] = useState('')

  // 获取评论和当前用户
  useEffect(() => {
    fetchComments()
    checkCurrentUser()
    
    // 添加localStorage变化监听
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'novel-site-username' || 
          e.key === 'username' || 
          e.key === 'currentUser' || 
          e.key === 'user' || 
          e.key === 'name') {
        checkCurrentUser()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [novelId])

  // 定期检查当前用户状态
  useEffect(() => {
    const interval = setInterval(() => {
      checkCurrentUser()
    }, 5000) // 每5秒检查一次用户状态

    return () => clearInterval(interval)
  }, [])

  const checkCurrentUser = () => {
    // 从localStorage检查当前用户 - 检查所有可能的键
    const possibleKeys = [
      'novel-site-username',
      'username',
      'currentUser',
      'user',
      'name'
    ]
    
    let username = ''
    for (const key of possibleKeys) {
      const value = localStorage.getItem(key)
      if (value && value.trim() && value.trim() !== '匿名用户') {
        // 特殊处理：如果键名是'user'，可能是JSON格式
        if (key === 'user') {
          try {
            const userData = JSON.parse(value.trim())
            // 尝试从JSON对象中提取用户名
            username = userData.username || userData.name || userData.displayName || ''
          } catch (e) {
            username = value.trim()
          }
        } else {
          username = value.trim()
        }
        break // 找到第一个有效的用户名就停止
      }
    }
    
    if (username !== currentUserState) {
      setCurrentUserState(username)
    }
  }

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/comments?novelId=${novelId}`)
      if (!response.ok) {
        throw new Error('获取评论失败')
      }
      const data = await response.json()
      setComments(data)
      setError('')
    } catch (err) {
      console.error('获取评论错误:', err)
      setError('获取评论失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 提交评论
  const handleSubmitComment = async () => {
    // 每次提交前都重新检查当前用户
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
          } else {
            return value.trim()
          }
        }
      }
      return ''
    }
    
    const currentUsername = getCurrentUsername()
    if (!currentUsername) {
      alert('请先登录后再发表评论')
      return
    }

    if (!newComment.trim()) {
      alert('评论内容不能为空')
      return
    }

    if (newComment.length > 50) {
      alert('评论内容不能超过50个字符')
      return
    }

    try {
      setSubmitting(true)
      
      // 注意：currentUsername 已经在上面获取了
      if (!currentUsername) {
        alert('请先登录后再发表评论')
        setSubmitting(false)
        return
      }
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-current-user': encodeURIComponent(currentUsername), // 编码中文用户名
        },
        body: JSON.stringify({
          novelId,
          content: newComment.trim(),
          // 不再传递 author 字段，后端会从请求头获取
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '发表评论失败')
      }

      alert('评论已提交，等待审核通过后显示')
      setNewComment('')
      fetchComments() // 刷新评论列表
    } catch (err) {
      console.error('发表评论错误:', err)
      alert(err instanceof Error ? err.message : '发表评论失败')
    } finally {
      setSubmitting(false)
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch (error) {
      return dateString
    }
  }

  // 点赞评论
  const handleLikeComment = async (commentId: string) => {
    // 注意：这里需要实现点赞API，暂时先不实现
    alert('点赞功能即将推出！')
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e5e7eb',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          margin: '0 auto 1rem',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#6b7280' }}>正在加载评论...</p>
      </div>
    )
  }

  return (
    <div style={{ marginTop: '3rem' }}>
      {/* 评论标题 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          backgroundColor: '#f0f9ff',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem'
        }}>
          💬
        </div>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#111827',
          margin: 0
        }}>
          读者评论
        </h3>
        <span style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          marginLeft: 'auto'
        }}>
          {comments.length} 条评论
        </span>
      </div>

      {/* 错误提示 */}
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}

      {/* 发表评论区域 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: '600',
          marginBottom: '1rem',
          color: '#111827'
        }}>
          {currentUserState ? `发表评论 (当前用户: ${currentUserState})` : '请先登录后发表评论'}
        </h4>
        
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="写下你的想法... (最多50字)"
          disabled={!currentUserState || submitting}
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '1rem',
            color: '#374151',
            resize: 'vertical',
            marginBottom: '1rem',
            backgroundColor: !currentUserState ? '#f9fafb' : 'white'
          }}
        />
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            {newComment.length}/50 字符
          </span>
          
          <button
            onClick={handleSubmitComment}
            disabled={!currentUserState || submitting || !newComment.trim()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: !currentUserState || submitting || !newComment.trim() ? '#f3f4f6' : '#2563eb',
              color: !currentUserState || submitting || !newComment.trim() ? '#9ca3af' : 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: !currentUserState || submitting || !newComment.trim() ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {submitting ? '提交中...' : '发表评论'}
          </button>
        </div>
      </div>

      {/* 评论列表 */}
      {comments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          backgroundColor: '#f9fafb',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💬</div>
          <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
            还没有评论
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            {currentUserState ? '成为第一个评论者吧！' : '登录后即可发表评论'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              {/* 评论头部 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem'
                  }}>
                    👤
                  </div>
                  <div>
                    <div style={{
                      fontWeight: '600',
                      color: '#111827',
                      fontSize: '0.875rem'
                    }}>
                      {comment.author}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>
                </div>
                
                {/* 评论状态标签 */}
                <div style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  backgroundColor: comment.status === 'approved' ? '#d1fae5' : '#fef3c7',
                  color: comment.status === 'approved' ? '#065f46' : '#92400e'
                }}>
                  {comment.status === 'approved' ? '已发布' : '审核中'}
                </div>
              </div>

              {/* 评论内容 */}
              <div style={{
                color: '#374151',
                lineHeight: '1.6',
                marginBottom: '1rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {comment.content}
              </div>

              {/* 评论底部 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.75rem',
                borderTop: '1px solid #f3f4f6'
              }}>
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6'
                  }}
                >
                  <span>❤️</span>
                  <span>点赞 ({comment.likes})</span>
                </button>
                
                <div style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af'
                }}>
                  评论ID: {comment.id.substring(0, 8)}...
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}