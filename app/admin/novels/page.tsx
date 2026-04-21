// 小说管理页面
'use client'

import { useState, useEffect } from 'react'

// 从API获取小说数据
async function fetchNovels() {
  try {
    const response = await fetch('/api/admin/novels');
    if (!response.ok) {
      throw new Error('获取小说数据失败');
    }
    const novels = await response.json();
    
    // 为每本小说获取第一章内容
    const novelsWithContent = await Promise.all(
      novels.map(async (novel: any) => {
        try {
          // 获取章节数据
          const chaptersResponse = await fetch(`/api/novels/${novel.id}/chapters`);
          if (chaptersResponse.ok) {
            const chapters = await chaptersResponse.json();
            // 获取第一章内容
            const firstChapter = chapters.find((ch: any) => ch.number === 1);
            return {
              ...novel,
              content: firstChapter?.content || novel.description || '暂无内容'
            };
          }
        } catch (error) {
          console.error(`获取小说 ${novel.id} 章节数据错误:`, error);
        }
        return {
          ...novel,
          content: novel.description || '暂无内容'
        };
      })
    );
    
    return novelsWithContent;
  } catch (error) {
    console.error('获取小说数据错误:', error);
    // 返回静态数据作为后备
    return [
      {
        id: 'novel_1',
        title: '魔法森林的冒险',
        author: '小明',
        content: '这是一个关于魔法森林的故事...',
        views: 156,
        likes: 67,
        status: 'published',
        createdAt: '2024-03-10T10:00:00Z'
      },
      {
        id: 'novel_2',
        title: '太空探险记',
        author: '小红',
        content: '探索宇宙的奥秘...',
        views: 98,
        likes: 45,
        status: 'published',
        createdAt: '2024-03-11T14:30:00Z'
      },
      {
        id: 'novel_3',
        title: '海底两万里',
        author: '小华',
        content: '深海探险的故事...',
        views: 156,
        likes: 89,
        status: 'draft',
        createdAt: '2024-03-12T09:15:00Z'
      }
    ];
  }
}

export default function NovelsManagement() {
  const [allNovels, setAllNovels] = useState<any[]>([])
  const [filter, setFilter] = useState('all') // all, published, draft
  const [selectedNovels, setSelectedNovels] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // 加载小说数据
  useEffect(() => {
    async function loadNovels() {
      setIsLoading(true)
      try {
        const novels = await fetchNovels()
        setAllNovels(novels)
      } catch (error) {
        console.error('加载小说数据错误:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadNovels()
  }, [])

  // 过滤小说
  const filteredNovels = allNovels.filter(novel => {
    // 状态过滤
    if (filter !== 'all' && novel.status !== filter) return false
    
    // 搜索过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      return (
        novel.title.toLowerCase().includes(term) ||
        novel.author.toLowerCase().includes(term) ||
        (novel.content && novel.content.toLowerCase().includes(term)) ||
        (novel.description && novel.description.toLowerCase().includes(term))
      )
    }
    
    return true
  })

  // 处理选择小说
  const handleSelectNovel = (novelId: string) => {
    setSelectedNovels(prev => {
      if (prev.includes(novelId)) {
        return prev.filter(id => id !== novelId)
      } else {
        return [...prev, novelId]
      }
    })
  }

  // 处理全选
  const handleSelectAll = () => {
    if (selectedNovels.length === filteredNovels.length) {
      setSelectedNovels([])
    } else {
      setSelectedNovels(filteredNovels.map(novel => novel.id))
    }
  }

  // 导出选定小说
  const handleExportSelected = () => {
    if (selectedNovels.length === 0) {
      alert('请先选择要导出的小说')
      return
    }

    const selectedNovelsData = allNovels.filter(novel => selectedNovels.includes(novel.id))
    
    // 创建导出数据
    const exportData = {
      exportDate: new Date().toISOString(),
      totalNovels: selectedNovels.length,
      novels: selectedNovelsData.map(novel => ({
        id: novel.id,
        title: novel.title,
        author: novel.author,
        content: novel.content || novel.description || '暂无内容',
        views: novel.views,
        likes: novel.likes,
        status: novel.status,
        createdAt: novel.createdAt
      }))
    }

    // 创建并下载JSON文件
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `novels_export_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    alert(`已导出 ${selectedNovels.length} 篇小说`)
  }

  // 删除小说
  const handleDeleteNovel = async (novelId: string) => {
    if (!confirm('确定要删除这篇小说吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/novels?id=${novelId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '删除小说失败');
      }
      
      // 从本地状态中移除小说
      const updatedNovels = allNovels.filter(novel => novel.id !== novelId);
      setAllNovels(updatedNovels);
      setSelectedNovels(prev => prev.filter(id => id !== novelId));
      
      alert('小说已删除！');
    } catch (error) {
      console.error('删除小说错误:', error);
      alert(`删除失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  // 批量删除小说
  const handleBatchDelete = async () => {
    if (selectedNovels.length === 0) {
      alert('请先选择要删除的小说');
      return;
    }

    if (!confirm(`确定要删除选中的 ${selectedNovels.length} 篇小说吗？此操作不可撤销。`)) {
      return;
    }
    
    try {
      // 批量删除选中的小说
      const deletePromises = selectedNovels.map(async (novelId) => {
        const response = await fetch(`/api/admin/novels?id=${novelId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`删除小说 ${novelId} 失败: ${errorData.error || '未知错误'}`);
        }
        
        return novelId;
      });
      
      // 等待所有删除操作完成
      await Promise.all(deletePromises);
      
      // 从本地状态中移除已删除的小说
      const updatedNovels = allNovels.filter(novel => !selectedNovels.includes(novel.id));
      setAllNovels(updatedNovels);
      setSelectedNovels([]);
      
      alert('小说已删除！');
    } catch (error) {
      console.error('批量删除小说错误:', error);
      alert(`删除失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  // 切换小说状态
  const handleToggleStatus = (novelId: string) => {
    const updatedNovels = allNovels.map(novel => {
      if (novel.id === novelId) {
        return {
          ...novel,
          status: novel.status === 'published' ? 'draft' : 'published'
        }
      }
      return novel
    })
    
    setAllNovels(updatedNovels)
  }

  // 获取状态标签样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'published':
        return { backgroundColor: '#d1fae5', color: '#047857' }
      case 'draft':
        return { backgroundColor: '#fef3c7', color: '#92400e' }
      default:
        return { backgroundColor: '#f3f4f6', color: '#6b7280' }
    }
  }

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return '已发布'
      case 'draft': return '草稿'
      default: return '未知'
    }
  }

  return (
    <div>
      {/* 页面标题 */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '0.5rem'
        }}>
          小说管理
        </h1>
        <p style={{ color: '#6b7280' }}>
          管理所有小说，支持批量导出和删除
        </p>
      </div>

      {/* 操作工具栏 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#6b7280', marginRight: '0.5rem' }}>状态:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white'
                }}
              >
                <option value="all">全部小说</option>
                <option value="published">已发布</option>
                <option value="draft">草稿</option>
              </select>
            </div>

            <div>
              <input
                type="text"
                placeholder="搜索小说标题、作者或内容..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  width: '300px'
                }}
              />
            </div>
          </div>

          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            共 {filteredNovels.length} 篇小说
            {filter !== 'all' && ` (${filteredNovels.length} 篇${getStatusText(filter)})`}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleExportSelected}
            disabled={selectedNovels.length === 0}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: selectedNovels.length === 0 ? '#9ca3af' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: selectedNovels.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            导出选定小说 ({selectedNovels.length})
          </button>
          <button
            onClick={handleBatchDelete}
            disabled={selectedNovels.length === 0}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: selectedNovels.length === 0 ? '#9ca3af' : '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: selectedNovels.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            批量删除 ({selectedNovels.length})
          </button>
        </div>
      </div>

      {/* 小说列表 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        {/* 表头 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 2fr 1fr 1fr 1fr auto auto',
          padding: '0.75rem 1rem',
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          fontWeight: '500',
          color: '#374151',
          alignItems: 'center'
        }}>
          <div>
            <input
              type="checkbox"
              checked={selectedNovels.length === filteredNovels.length && filteredNovels.length > 0}
              onChange={handleSelectAll}
              style={{ width: '1rem', height: '1rem' }}
            />
          </div>
          <div>标题</div>
          <div>作者</div>
          <div>阅读</div>
          <div>喜欢</div>
          <div>状态</div>
          <div>操作</div>
        </div>

        {/* 小说行 */}
        {filteredNovels.length === 0 ? (
          <div style={{
            padding: '3rem 1rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            {searchTerm ? '没有找到匹配的小说' : '暂无小说'}
          </div>
        ) : (
          filteredNovels.map(novel => (
            <div
              key={novel.id}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 2fr 1fr 1fr 1fr auto auto',
                padding: '1rem',
                borderBottom: '1px solid #f3f4f6',
                alignItems: 'center',
                backgroundColor: selectedNovels.includes(novel.id) ? '#f0f9ff' : 'white'
              }}
            >
              {/* 选择框 */}
              <div>
                <input
                  type="checkbox"
                  checked={selectedNovels.includes(novel.id)}
                  onChange={() => handleSelectNovel(novel.id)}
                  style={{ width: '1rem', height: '1rem' }}
                />
              </div>

              {/* 标题 */}
              <div>
                <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{novel.title}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {novel.content ? novel.content.substring(0, 50) + '...' : '暂无内容'}
                </div>
              </div>

              {/* 作者 */}
              <div style={{ fontWeight: '500' }}>{novel.author}</div>

              {/* 阅读数 */}
              <div style={{ color: '#6b7280' }}>{novel.views}</div>

              {/* 喜欢数 */}
              <div style={{ color: '#6b7280' }}>{novel.likes}</div>

              {/* 状态 */}
              <div>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  ...getStatusStyle(novel.status)
                }}>
                  {getStatusText(novel.status)}
                </span>
              </div>

              {/* 操作按钮 */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleToggleStatus(novel.id)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: novel.status === 'published' ? '#f59e0b' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  {novel.status === 'published' ? '设为草稿' : '发布'}
                </button>
                <button
                  onClick={() => handleDeleteNovel(novel.id)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 使用说明 */}
      <div style={{
        backgroundColor: '#f0f9ff',
        borderRadius: '8px',
        padding: '1.5rem',
        marginTop: '1.5rem',
        border: '1px solid #dbeafe'
      }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: '#1e40af',
          marginBottom: '0.5rem'
        }}>
          📚 小说管理说明
        </h3>
        <ul style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, paddingLeft: '1.5rem' }}>
          <li>选择小说后可以批量导出为JSON文件</li>
          <li>删除操作需要二次确认，避免误操作</li>
          <li>可以在"已发布"和"草稿"状态之间切换</li>
          <li>已发布的小说会在网站上显示给所有用户</li>
          <li>草稿只有作者和管理员可以查看</li>
          <li>导出文件包含小说的完整内容</li>
        </ul>
      </div>
    </div>
  )
}