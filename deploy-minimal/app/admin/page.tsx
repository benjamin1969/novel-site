// 管理员仪表盘
'use client'

import { useState, useEffect } from 'react'

  // 从API获取统计数据
async function fetchStats() {
  try {
    const response = await fetch('/api/admin/stats');
    if (!response.ok) {
      throw new Error('获取统计数据失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取统计数据错误:', error);
    return {
      totalUsers: 0,
      totalNovels: 0,
      totalComments: 0
    };
  }
}

// 从API获取最近用户
async function fetchRecentUsers() {
  try {
    const response = await fetch('/api/admin/users?limit=4');
    if (!response.ok) {
      throw new Error('获取用户数据失败');
    }
    const users = await response.json();
    return users.map((user: any) => ({
      id: user.id,
      username: user.username,
      email: `${user.username}@example.com`,
      joined: new Date(user.createdAt).toISOString().split('T')[0],
      status: user.status || 'active'
    }));
  } catch (error) {
    console.error('获取最近用户错误:', error);
    return [];
  }
}

// 从API获取最近小说（暂时返回静态数据）
async function fetchRecentNovels() {
  try {
    const response = await fetch('/api/admin/novels?limit=3');
    if (!response.ok) {
      throw new Error('获取小说数据失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取最近小说错误:', error);
    // 返回静态数据作为后备
    return [
      {
        id: 'novel_1',
        title: '魔法森林的冒险',
        author: '小明',
        views: 156,
        likes: 67,
        status: 'published'
      },
      {
        id: 'novel_2',
        title: '太空探险记',
        author: '小红',
        views: 98,
        likes: 45,
        status: 'published'
      },
      {
        id: 'novel_3',
        title: '海底两万里',
        author: '小华',
        views: 156,
        likes: 89,
        status: 'draft'
      }
    ];
  }
}

// 网站设置（暂时使用内存存储）
let siteConfig = {
  siteName: '简阅小说平台',
  siteDescription: '小学生专属的原创小说天地',
  maintenanceMode: false
};

// 更新网站设置
function updateSiteConfig(newConfig: any) {
  siteConfig = { ...siteConfig, ...newConfig };
  return siteConfig;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNovels: 0,
    totalComments: 0
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentNovels, setRecentNovels] = useState<any[]>([]);
  const [currentSiteConfig, setCurrentSiteConfig] = useState(siteConfig);
  const [isLoading, setIsLoading] = useState(true);

  // 加载数据
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [statsData, usersData, novelsData] = await Promise.all([
          fetchStats(),
          fetchRecentUsers(),
          fetchRecentNovels()
        ]);
        setStats(statsData);
        setRecentUsers(usersData);
        setRecentNovels(novelsData);
      } catch (error) {
        console.error('加载数据错误:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveSiteConfig = () => {
    // 更新网站设置
    updateSiteConfig(currentSiteConfig);
    alert('网站设置已保存！');
    
    // 刷新页面以应用设置
    window.location.reload();
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
          管理员仪表盘
        </h1>
        <p style={{ color: '#6b7280' }}>
          欢迎回来，管理员！这里是网站的管理中心。
        </p>
      </div>

      {/* 统计卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* 用户统计 */}
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '1.5rem',
          borderRadius: '12px',
          borderLeft: '4px solid #2563eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dbeafe',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              👥
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af' }}>
                {stats.totalUsers}
              </div>
              <div style={{ color: '#6b7280' }}>总用户数</div>
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            今日新增: +3
          </div>
        </div>

        {/* 小说统计 */}
        <div style={{
          backgroundColor: '#f0fdf4',
          padding: '1.5rem',
          borderRadius: '12px',
          borderLeft: '4px solid #10b981'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#d1fae5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              📚
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#047857' }}>
                {stats.totalNovels}
              </div>
              <div style={{ color: '#6b7280' }}>总小说数</div>
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            今日新增: +2
          </div>
        </div>

        {/* 评论统计 */}
        <div style={{
          backgroundColor: '#fef3c7',
          padding: '1.5rem',
          borderRadius: '12px',
          borderLeft: '4px solid #f59e0b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fef3c7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              💬
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#92400e' }}>
                {stats.totalComments}
              </div>
              <div style={{ color: '#6b7280' }}>总评论数</div>
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            今日新增: +12
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* 最近用户 */}
        <div>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#111827'
          }}>
            最近注册用户
          </h2>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr auto',
              padding: '0.75rem 1rem',
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontWeight: '500',
              color: '#374151'
            }}>
              <div>用户名</div>
              <div>邮箱</div>
              <div>注册时间</div>
              <div>状态</div>
            </div>
            {recentUsers.map(user => (
              <div
                key={user.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr auto',
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid #f3f4f6',
                  alignItems: 'center'
                }}
              >
                <div style={{ fontWeight: '500' }}>{user.username}</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{user.email}</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{user.joined}</div>
                <div>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: user.status === 'active' ? '#d1fae5' : '#f3f4f6',
                    color: user.status === 'active' ? '#047857' : '#6b7280'
                  }}>
                    {user.status === 'active' ? '活跃' : '未激活'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'right', marginTop: '1rem' }}>
            <a
              href="/admin/users"
              style={{
                color: '#2563eb',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              查看所有用户 →
            </a>
          </div>
        </div>

        {/* 最近小说 */}
        <div>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#111827'
          }}>
            最近发布小说
          </h2>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
              padding: '0.75rem 1rem',
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontWeight: '500',
              color: '#374151'
            }}>
              <div>标题</div>
              <div>作者</div>
              <div>阅读</div>
              <div>喜欢</div>
              <div>状态</div>
            </div>
            {recentNovels.map(novel => (
              <div
                key={novel.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid #f3f4f6',
                  alignItems: 'center'
                }}
              >
                <div style={{ fontWeight: '500' }}>{novel.title}</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{novel.author}</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{novel.views}</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{novel.likes}</div>
                <div>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: novel.status === 'published' ? '#d1fae5' : '#fef3c7',
                    color: novel.status === 'published' ? '#047857' : '#92400e'
                  }}>
                    {novel.status === 'published' ? '已发布' : '草稿'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'right', marginTop: '1rem' }}>
            <a
              href="/admin/novels"
              style={{
                color: '#2563eb',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              查看所有小说 →
            </a>
          </div>
        </div>
      </div>

      {/* 网站设置 */}
      <div>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '1rem',
          color: '#111827'
        }}>
          网站设置
        </h2>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          padding: '1.5rem'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              网站名称
            </label>
            <input
              type="text"
              value={currentSiteConfig.siteName}
              onChange={(e) => setCurrentSiteConfig({ ...currentSiteConfig, siteName: e.target.value })}
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
              网站描述
            </label>
            <textarea
              value={currentSiteConfig.siteDescription}
              onChange={(e) => setCurrentSiteConfig({ ...currentSiteConfig, siteDescription: e.target.value })}
              rows={3}
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={currentSiteConfig.maintenanceMode}
                onChange={(e) => setCurrentSiteConfig({ ...currentSiteConfig, maintenanceMode: e.target.checked })}
                style={{ width: '1rem', height: '1rem' }}
              />
              <span style={{ fontWeight: '500', color: '#374151' }}>
                维护模式（开启后普通用户无法访问）
              </span>
            </label>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
              开启后只有管理员可以访问网站
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              onClick={() => setCurrentSiteConfig({
                siteName: '简阅小说平台',
                siteDescription: '小学生专属的原创小说天地',
                maintenanceMode: false
              })}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              重置
            </button>
            <button
              onClick={handleSaveSiteConfig}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              保存设置
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}