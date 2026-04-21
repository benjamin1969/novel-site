'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  // 检查登录状态和权限
  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      // 未登录，重定向到登录页面
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      setUsername(user.username);
      
      // 检查是否是管理员
      const isAdminUser = user.role === 'ADMIN';
      setIsAdmin(isAdminUser);
      
      if (!isAdminUser) {
        // 不是管理员，重定向到首页
        router.push('/');
      }
    } catch (error) {
      console.error('解析用户数据失败:', error);
      localStorage.removeItem('user');
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    // 清除所有可能的用户相关键
    const userKeys = [
      'user',
      'novel-site-username',
      'novel-site-loggedin',
      'username',
      'currentUser',
      'name'
    ];
    
    userKeys.forEach(key => localStorage.removeItem(key));
    router.push('/login');
  }

  // 如果未验证权限，显示加载中
  if (!isAdmin) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f6f6'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTopColor: '#2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#6b7280' }}>验证管理员权限中...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f6f6' }}>
      {/* 侧边栏 */}
      <aside style={{
        width: '250px',
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* 管理员信息 */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#f0f9ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              👑
            </div>
            <div>
              <div style={{ fontWeight: '600', color: '#111827' }}>{username}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>管理员</div>
            </div>
          </div>
          
          <div style={{
            padding: '0.5rem 0.75rem',
            backgroundColor: '#fef3c7',
            color: '#92400e',
            borderRadius: '6px',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            🛡️ 管理员权限
          </div>
        </div>
        
        {/* 导航菜单 */}
        <nav style={{ flex: 1 }}>
          <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>
            管理面板
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link 
                href="/admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  color: pathname === '/admin' ? '#2563eb' : '#374151',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  backgroundColor: pathname === '/admin' ? '#f0f9ff' : 'transparent',
                  fontWeight: pathname === '/admin' ? '600' : '400'
                }}
              >
                <span>📊</span>
                <span>仪表盘</span>
              </Link>
            </li>
            
            <li style={{ marginBottom: '0.5rem' }}>
              <Link 
                href="/admin/users"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  color: pathname === '/admin/users' ? '#2563eb' : '#374151',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  backgroundColor: pathname === '/admin/users' ? '#f0f9ff' : 'transparent',
                  fontWeight: pathname === '/admin/users' ? '600' : '400',
                  transition: 'background-color 0.2s'
                }}
              >
                <span>👥</span>
                <span>用户管理</span>
              </Link>
            </li>
            
            <li style={{ marginBottom: '0.5rem' }}>
              <Link 
                href="/admin/novels"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  color: pathname === '/admin/novels' ? '#2563eb' : '#374151',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  backgroundColor: pathname === '/admin/novels' ? '#f0f9ff' : 'transparent',
                  fontWeight: pathname === '/admin/novels' ? '600' : '400',
                  transition: 'background-color 0.2s'
                }}
              >
                <span>📚</span>
                <span>小说管理</span>
              </Link>
            </li>
            
            <li style={{ marginBottom: '0.5rem' }}>
              <Link 
                href="/admin/comments"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  color: pathname === '/admin/comments' ? '#2563eb' : '#374151',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  backgroundColor: pathname === '/admin/comments' ? '#f0f9ff' : 'transparent',
                  fontWeight: pathname === '/admin/comments' ? '600' : '400',
                  transition: 'background-color 0.2s'
                }}
              >
                <span>💬</span>
                <span>评论管理</span>
              </Link>
            </li>
            
            <li style={{ marginBottom: '0.5rem' }}>
              <Link 
                href="/admin/settings"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  color: pathname === '/admin/settings' ? '#2563eb' : '#374151',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  backgroundColor: pathname === '/admin/settings' ? '#f0f9ff' : 'transparent',
                  fontWeight: pathname === '/admin/settings' ? '600' : '400',
                  transition: 'background-color 0.2s'
                }}
              >
                <span>⚙️</span>
                <span>网站设置</span>
              </Link>
            </li>
          </ul>
          
          <div style={{ marginTop: '2rem', marginBottom: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>
            快捷操作
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link 
                href="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  color: '#374151',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span>🏠</span>
                <span>返回首页</span>
              </Link>
            </li>
            
            <li>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  color: '#ef4444',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span>🚪</span>
                <span>退出登录</span>
              </button>
            </li>
          </ul>
        </nav>
        
        {/* 版本信息 */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb',
          fontSize: '0.75rem',
          color: '#9ca3af'
        }}>
          <div>简阅管理后台 v1.0</div>
          <div>© 2024 简阅平台</div>
        </div>
      </aside>
      
      {/* 主内容区域 */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          minHeight: 'calc(100vh - 4rem)',
          padding: '2rem'
        }}>
          {children}
        </div>
      </main>
    </div>
  )
}