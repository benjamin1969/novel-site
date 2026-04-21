// 评论管理页面 - 简化版（评论无需审核）
'use client'

import { useState, useEffect } from 'react'

// 从API获取评论数据
async function fetchComments() {
  try {
    const response = await fetch('/api/admin/comments');
    if (!response.ok) {
      throw new Error('获取评论数据失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取评论数据错误:', error);
    // 返回静态数据作为后备
    return [
      {
        id: 'comment_1',
        novelId: 'novel_1',
        userId: 'user_2',
        username: '小明',
        content: '这个故事太精彩了！',
        status: 'approved',
        createdAt: '2024-03-10T11:30:00Z'
      },
      {
        id: 'comment_2',
        novelId: 'novel_1',
        userId: 'user_1',
        username: '小红',
        content: '我喜欢里面的魔法元素',
        status: 'approved',
        createdAt: '2024-03-10T15:45:00Z'
      },
      {
        id: 'comment_3',
        novelId: 'novel_2',
        userId: 'user_3',
        username: '小华',
        content: '太空旅行真有趣！',
        status: 'approved',
        createdAt: '2024-03-11T16:20:00Z'
      }
    ];
  }
}

// 删除评论
async function deleteComment(commentId: string) {
  try {
    const response = await fetch(`/api/admin/comments/${commentId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('删除评论失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('删除评论错误:', error);
    return { success: false, error: '删除评论失败' };
  }
}

export default function CommentsManagementPage() {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedComments, setSelectedComments] = useState<string[]>([])

  // 加载评论数据
  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    setLoading(true)
    try {
      const data = await fetchComments()
      setComments(data)
    } catch (error) {
      console.error('加载评论失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 处理选择评论
  const handleSelectComment = (commentId: string) => {
    if (selectedComments.includes(commentId)) {
      setSelectedComments(selectedComments.filter(id => id !== commentId))
    } else {
      setSelectedComments([...selectedComments, commentId])
    }
  }

  // 处理全选/取消全选
  const handleSelectAll = () => {
    if (selectedComments.length === comments.length) {
      setSelectedComments([])
    } else {
      setSelectedComments(comments.map(comment => comment.id))
    }
  }

  // 删除单个评论
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('确定要删除这条评论吗？')) return
    
    const result = await deleteComment(commentId)
    if (result.success) {
      alert('评论已删除')
      loadComments() // 重新加载评论
      // 从选中列表中移除
      setSelectedComments(selectedComments.filter(id => id !== commentId))
    } else {
      alert('删除失败: ' + (result.error || '未知错误'))
    }
  }

  // 批量删除评论
  const handleBatchDelete = async () => {
    if (selectedComments.length === 0) {
      alert('请先选择要删除的评论')
      return
    }
    
    if (!confirm(`确定要删除选中的 ${selectedComments.length} 条评论吗？`)) return
    
    try {
      const response = await fetch(`/api/admin/comments?ids=${selectedComments.join(',')}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('批量删除失败');
      }
      
      const result = await response.json();
      alert(result.message || `批量删除完成：成功 ${result.successCount} 条，失败 ${result.failCount} 条`)
      loadComments() // 重新加载评论
      setSelectedComments([]) // 清空选中列表
    } catch (error) {
      console.error('批量删除评论错误:', error);
      alert('批量删除失败');
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
        minute: '2-digit'
      })
    } catch (error) {
      return dateString
    }
  }

  // 获取小说标题（简化版，实际应该从API获取）
  const getNovelTitle = (novelId: string) => {
    const novelTitles: Record<string, string> = {
      'novel_1': '小明的冒险',
      'novel_2': '小红的花园',
      'novel_3': '未完成的故事'
    }
    return novelTitles[novelId] || `小说 ${novelId}`
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>评论管理</h1>
        <p>加载中...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        评论管理
      </h1>
      
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button
            onClick={handleSelectAll}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              marginRight: '0.5rem',
              cursor: 'pointer'
            }}
          >
            {selectedComments.length === comments.length ? '取消全选' : '全选'}
          </button>
          
          <button
            onClick={handleBatchDelete}
            disabled={selectedComments.length === 0}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: selectedComments.length === 0 ? '#f3f4f6' : '#ef4444',
              color: selectedComments.length === 0 ? '#9ca3af' : 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: selectedComments.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            批量删除 ({selectedComments.length})
          </button>
        </div>
        
        <button
          onClick={loadComments}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          刷新
        </button>
      </div>
      
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', width: '40px' }}>
                <input
                  type="checkbox"
                  checked={selectedComments.length === comments.length && comments.length > 0}
                  onChange={handleSelectAll}
                  style={{ width: '16px', height: '16px' }}
                />
              </th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', minWidth: '300px', maxWidth: '600px' }}>评论内容</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', width: '150px' }}>小说</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', width: '120px' }}>作者</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', width: '180px' }}>发布时间</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', width: '100px' }}>状态</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', width: '100px' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {comments.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  暂无评论
                </td>
              </tr>
            ) : (
              comments.map((comment) => (
                <tr key={comment.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <input
                      type="checkbox"
                      checked={selectedComments.includes(comment.id)}
                      onChange={() => handleSelectComment(comment.id)}
                      style={{ width: '16px', height: '16px' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem 1rem', minWidth: '300px', maxWidth: '600px' }}>
                    <div style={{ 
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      whiteSpace: 'normal',
                      lineHeight: '1.5',
                      color: '#1f2937',
                      fontSize: '0.95rem'
                    }}>
                      {comment.content}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {getNovelTitle(comment.novelId)}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {comment.username || comment.author || '匿名用户'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {formatDate(comment.createdAt)}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      backgroundColor: comment.status === 'approved' ? '#d1fae5' : '#fef3c7',
                      color: comment.status === 'approved' ? '#065f46' : '#92400e'
                    }}>
                      {comment.status === 'approved' ? '已发布' : comment.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
        共 {comments.length} 条评论
      </div>
      
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>说明</h3>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#4b5563' }}>
          <li>评论无需审核，用户发表后立即显示</li>
          <li>管理员可以删除不当评论</li>
          <li>支持批量删除操作</li>
        </ul>
      </div>
    </div>
  )
}