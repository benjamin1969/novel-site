// 用户管理页面
'use client'

import { useState, useEffect } from 'react'

// 从API获取用户数据
async function fetchUsers() {
  try {
    const response = await fetch('/api/admin/users');
    if (!response.ok) {
      throw new Error('获取用户数据失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取用户数据错误:', error);
    return [];
  }
}

export default function UsersManagement() {
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [filter, setFilter] = useState('all') // all, active, inactive
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  // 禁言设置模态框状态
  const [muteModalOpen, setMuteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [muteDuration, setMuteDuration] = useState('permanent') // permanent, 1, 7, 30
  const [customDuration, setCustomDuration] = useState('')
  const [muteReason, setMuteReason] = useState('违反社区规则')

  // 加载用户数据
  useEffect(() => {
    async function loadUsers() {
      setIsLoading(true)
      const users = await fetchUsers()
      setAllUsers(users)
      setIsLoading(false)
    }
    loadUsers()
  }, [])

  // 过滤用户
  const filteredUsers = allUsers.filter(user => {
    // 状态过滤
    if (filter !== 'all' && user.status !== filter) return false
    
    // 搜索过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      return user.username.toLowerCase().includes(term)
    }
    
    return true
  })

  // 打开禁言设置模态框
  const handleOpenMuteModal = (userId: string, username: string, currentMuted: boolean) => {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;
    
    // 如果用户已经是禁言状态，直接解禁
    if (currentMuted) {
      handleToggleMute(userId, username, true); // 解禁
      return;
    }
    
    // 否则打开禁言设置模态框
    setSelectedUser({ id: userId, username });
    setMuteModalOpen(true);
  }

  // 执行禁言操作
  const handleToggleMute = async (userId: string, username: string, currentMuted: boolean) => {
    const action = currentMuted ? '解禁' : '禁言';
    
    // 如果是解禁，直接执行
    if (currentMuted) {
      if (!confirm(`确定要解禁用户 "${username}" 吗？`)) {
        return;
      }
      
      try {
        const response = await fetch('/api/admin/users', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            isMuted: false,
            muteReason: null
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `${action}用户失败`);
        }
        
        // 更新本地状态
        const updatedUsers = allUsers.map(user => {
          if (user.id === userId) {
            return {
              ...user,
              isMuted: false,
              mutedUntil: null,
              muteReason: null
            };
          }
          return user;
        });
        
        setAllUsers(updatedUsers);
        alert(`用户已${action}！`);
      } catch (error) {
        console.error(`${action}用户错误:`, error);
        alert(`${action}失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
      return;
    }
    
    // 如果是禁言，需要从模态框获取参数
    // 这部分在handleConfirmMute中处理
  }

  // 确认禁言设置
  const handleConfirmMute = async () => {
    if (!selectedUser) return;
    
    // 计算禁言期限
    let mutedUntil = null;
    if (muteDuration !== 'permanent') {
      const days = muteDuration === 'custom' ? parseInt(customDuration) : parseInt(muteDuration);
      if (isNaN(days) || days <= 0) {
        alert('请输入有效的禁言天数');
        return;
      }
      
      const now = new Date();
      now.setDate(now.getDate() + days);
      mutedUntil = now.toISOString();
    }
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          isMuted: true,
          mutedUntil: mutedUntil,
          muteReason: muteReason
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '禁言用户失败');
      }
      
      // 更新本地状态
      const updatedUsers = allUsers.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            isMuted: true,
            mutedUntil: mutedUntil,
            muteReason: muteReason
          };
        }
        return user;
      });
      
      setAllUsers(updatedUsers);
      setMuteModalOpen(false);
      setSelectedUser(null);
      setMuteDuration('permanent');
      setCustomDuration('');
      setMuteReason('违反社区规则');
      
      alert(`用户 "${selectedUser.username}" 已被禁言！`);
    } catch (error) {
      console.error('禁言用户错误:', error);
      alert(`禁言失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  // 切换用户状态（活跃/未激活）
  const handleToggleStatus = async (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;
    
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? '激活' : '停用';
    
    if (!confirm(`确定要${action}用户 "${user.username}" 吗？${newStatus === 'inactive' ? '该用户将无法登录系统。' : '该用户可以正常登录系统。'}`)) {
      return;
    }
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          status: newStatus
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `${action}用户失败`);
      }
      
      // 更新本地状态
      const updatedUsers = allUsers.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            status: newStatus
          };
        }
        return u;
      });
      
      setAllUsers(updatedUsers);
      alert(`用户已${action}！`);
    } catch (error) {
      console.error(`${action}用户错误:`, error);
      alert(`${action}失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  // 删除用户
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('确定要删除这个用户吗？此操作不可撤销，用户的所有数据将被删除。')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '删除用户失败');
      }
      
      // 从本地状态中移除用户
      const updatedUsers = allUsers.filter(user => user.id !== userId);
      setAllUsers(updatedUsers);
      
      alert('用户已删除！');
    } catch (error) {
      console.error('删除用户错误:', error);
      alert(`删除失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  // 获取状态标签样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return { backgroundColor: '#d1fae5', color: '#047857' }
      case 'inactive':
        return { backgroundColor: '#f3f4f6', color: '#6b7280' }
      default:
        return { backgroundColor: '#f3f4f6', color: '#6b7280' }
    }
  }

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '活跃'
      case 'inactive': return '未激活'
      default: return '未知'
    }
  }

  // 获取角色标签样式
  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return { backgroundColor: '#fef3c7', color: '#92400e' }
      case 'USER':
        return { backgroundColor: '#dbeafe', color: '#1e40af' }
      default:
        return { backgroundColor: '#f3f4f6', color: '#6b7280' }
    }
  }

  // 获取角色文本
  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN': return '管理员'
      case 'USER': return '普通用户'
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
          用户管理
        </h1>
        <p style={{ color: '#6b7280' }}>
          管理所有用户账号和权限
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
                <option value="all">全部用户</option>
                <option value="active">活跃用户</option>
                <option value="inactive">未激活用户</option>
              </select>
            </div>

            <div>
              <input
                type="text"
                placeholder="搜索用户名..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  width: '200px'
                }}
              />
            </div>
          </div>

          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            共 {filteredUsers.length} 位用户
            {filter !== 'all' && ` (${filteredUsers.length} 位${getStatusText(filter)})`}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            提示：点击状态按钮可以切换用户激活状态
          </div>
        </div>
      </div>

      {/* 用户列表 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        {/* 表头 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr auto auto',
          padding: '0.75rem 1rem',
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          fontWeight: '500',
          color: '#374151',
          alignItems: 'center'
        }}>
          <div>用户名</div>
          <div>角色</div>
          <div>注册时间</div>
          <div>状态</div>
          <div>禁言状态</div>
          <div>禁言期限</div>
          <div>操作</div>
        </div>

        {/* 用户行 */}
        {filteredUsers.length === 0 ? (
          <div style={{
            padding: '3rem 1rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            {searchTerm ? '没有找到匹配的用户' : '暂无用户'}
          </div>
        ) : (
          filteredUsers.map(user => (
            <div
              key={user.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr auto auto',
                padding: '1rem',
                borderBottom: '1px solid #f3f4f6',
                alignItems: 'center'
              }}
            >
              {/* 用户名 */}
              <div>
                <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{user.username}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  ID: {user.id}
                </div>
              </div>

              {/* 角色 */}
              <div>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  ...getRoleStyle(user.role)
                }}>
                  {getRoleText(user.role)}
                </span>
              </div>

              {/* 注册时间 */}
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                {new Date(user.createdAt).toLocaleDateString()}
              </div>

              {/* 状态 */}
              <div>
                <button
                  onClick={() => handleToggleStatus(user.id)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                    ...getStatusStyle(user.status)
                  }}
                >
                  {getStatusText(user.status)}
                </button>
              </div>

              {/* 禁言状态 */}
              <div>
                <button
                  onClick={() => handleOpenMuteModal(user.id, user.username, user.isMuted || false)}
                  disabled={user.role === 'ADMIN'}
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    border: 'none',
                    cursor: user.role === 'ADMIN' ? 'not-allowed' : 'pointer',
                    backgroundColor: user.isMuted ? '#fef3c7' : '#d1fae5',
                    color: user.isMuted ? '#92400e' : '#047857'
                  }}
                >
                  {user.isMuted ? '已禁言' : '正常'}
                </button>
              </div>

              {/* 禁言期限 */}
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {user.isMuted ? (
                  user.mutedUntil ? (
                    <div>
                      <div>至: {new Date(user.mutedUntil).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        {(() => {
                          const now = new Date();
                          const muteUntil = new Date(user.mutedUntil);
                          const diffMs = muteUntil.getTime() - now.getTime();
                          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                          return diffDays > 0 ? `剩余 ${diffDays} 天` : '已过期';
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div>永久禁言</div>
                  )
                ) : (
                  <div>-</div>
                )}
              </div>

              {/* 操作按钮 */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={user.role === 'ADMIN'}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: user.role === 'ADMIN' ? '#f3f4f6' : '#f3f4f6',
                    color: user.role === 'ADMIN' ? '#9ca3af' : '#374151',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: user.role === 'ADMIN' ? 'not-allowed' : 'pointer'
                  }}
                >
                  {user.role === 'ADMIN' ? '不可删除' : '删除'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 禁言设置模态框 */}
      {muteModalOpen && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            width: '400px',
            maxWidth: '90%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              禁言用户: {selectedUser.username}
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>
                禁言期限
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="muteDuration"
                    value="permanent"
                    checked={muteDuration === 'permanent'}
                    onChange={(e) => setMuteDuration(e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  永久禁言
                </label>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="muteDuration"
                    value="1"
                    checked={muteDuration === '1'}
                    onChange={(e) => setMuteDuration(e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  1天
                </label>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="muteDuration"
                    value="7"
                    checked={muteDuration === '7'}
                    onChange={(e) => setMuteDuration(e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  7天
                </label>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="muteDuration"
                    value="30"
                    checked={muteDuration === '30'}
                    onChange={(e) => setMuteDuration(e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  30天
                </label>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="muteDuration"
                    value="custom"
                    checked={muteDuration === 'custom'}
                    onChange={(e) => setMuteDuration(e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  自定义天数:
                  <input
                    type="number"
                    min="1"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    disabled={muteDuration !== 'custom'}
                    style={{
                      marginLeft: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      width: '80px'
                    }}
                  />
                </label>
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>
                禁言原因
              </label>
              <textarea
                value={muteReason}
                onChange={(e) => setMuteReason(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  resize: 'vertical'
                }}
                placeholder="请输入禁言原因..."
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setMuteModalOpen(false);
                  setSelectedUser(null);
                  setMuteDuration('permanent');
                  setCustomDuration('');
                  setMuteReason('违反社区规则');
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
              <button
                onClick={handleConfirmMute}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                确认禁言
              </button>
            </div>
          </div>
        </div>
      )}

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
          👥 用户管理说明
        </h3>
        <ul style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, paddingLeft: '1.5rem' }}>
          <li>管理员账号不可删除，只能修改状态</li>
          <li>未激活用户无法登录系统</li>
          <li>点击状态按钮可以在"活跃"和"未激活"之间切换</li>
          <li>点击禁言状态按钮可以禁言/解禁用户（管理员不可被禁言）</li>
          <li>被禁言的用户无法发表评论</li>
          <li>删除用户会同时删除该用户的所有数据</li>
          <li>普通用户可以删除，但需要二次确认</li>
        </ul>
      </div>
    </div>
  )
}