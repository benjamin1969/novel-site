'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { checkLogin, isLoggedIn } from './utils/auth-unified';
// import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [siteConfig, setSiteConfig] = useState({
    siteName: '简阅小说平台',
    siteDescription: '小学生专属的原创小说天地',
    maintenanceMode: false
  });

  useEffect(() => {
    // 从 localStorage 加载用户信息（使用统一认证工具）
    const username = checkLogin()
    const loggedIn = isLoggedIn()
    
    console.log('布局检查登录状态 - 用户名:', username, '已登录:', loggedIn)
    
    if (username || loggedIn) {
      // 尝试获取完整的用户信息
      const currentUserStr = localStorage.getItem('current_user')
      if (currentUserStr) {
        try {
          const userData = JSON.parse(currentUserStr)
          console.log('从current_user解析用户数据:', userData)
          setUser(userData)
        } catch (error) {
          console.error('解析current_user数据失败:', error)
          // 如果无法解析JSON，创建一个简单的用户对象
          setUser({ username: username || '已登录用户', role: 'USER' })
        }
      } else if (username) {
        // 只有用户名，没有完整的用户对象
        setUser({ username, role: 'USER' })
      } else if (loggedIn) {
        // 只有登录标记，没有用户名
        setUser({ username: '已登录用户', role: 'USER' })
      }
    }

    // 获取网站设置
    const fetchSiteConfig = async () => {
      try {
        console.log('开始获取网站设置...')
        const response = await fetch('/api/site-config')
        const data = await response.json()
        console.log('网站设置API响应:', data)
        if (data.success) {
          console.log('更新网站设置状态:', data.config)
          setSiteConfig(data.config)
          
          // 立即更新DOM元素
          const siteNameElement = document.querySelector('h1')
          const siteDescElement = document.querySelector('h1')?.nextElementSibling
          const titleElement = document.querySelector('title')
          
          if (siteNameElement && data.config.siteName !== '简阅小说平台') {
            siteNameElement.textContent = data.config.siteName
          }
          if (siteDescElement && data.config.siteDescription !== '小学生专属的原创小说天地') {
            siteDescElement.textContent = data.config.siteDescription
          }
          if (titleElement && data.config.siteName !== '简阅小说平台') {
            titleElement.textContent = data.config.siteName
          }
        }
      } catch (error) {
        console.error('获取网站设置失败:', error)
      }
    }

    fetchSiteConfig()
    setIsLoading(false)
  }, []);

  const handleLogout = () => {
    // 使用统一的登出函数
    import('./utils/auth-unified').then(({ logout }) => {
      logout()
    }).catch(() => {
      // 如果导入失败，手动清除
      const userKeys = [
        'auth_token',
        'current_user',
        'user',
        'novel-site-username',
        'novel-site-loggedin',
        'novel-site-isAdmin',
        'username',
        'currentUser',
        'name',
        'loggedin',
        'isAdmin',
        'login'
      ];
      
      userKeys.forEach(key => localStorage.removeItem(key));
      setUser(null);
      window.location.href = '/';
    });
  };

  const isAdmin = user?.role === 'ADMIN';

  // 检查维护模式
  if (siteConfig.maintenanceMode && !isAdmin) {
    return (
      <html lang="zh-CN">
        <body style={{
          backgroundColor: '#f0f6f6',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            maxWidth: '600px'
          }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#374151',
              marginBottom: '1rem'
            }}>
              🚧 网站维护中
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              marginBottom: '2rem'
            }}>
              网站正在进行维护，请稍后再访问。
            </p>
            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              padding: '1rem',
              color: '#92400e'
            }}>
              <p style={{ margin: 0 }}>
                预计维护时间：30分钟
              </p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="zh-CN">
      <head>
        <title>{siteConfig.siteName}</title>
        <meta name="description" content={siteConfig.siteDescription} />
      </head>
      <body style={{
        backgroundColor: '#f0f6f6',
        minHeight: '100vh',
        margin: 0,
        padding: 0
      }}>
        <header style={{
          backgroundColor: '#87CEEB',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 2rem'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#2563eb',
                margin: 0
              }}>
                {siteConfig.siteName}
              </h1>
              <span style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                backgroundColor: '#f3f4f6',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px'
              }}>
                {siteConfig.siteDescription}
              </span>
            </div>
            
            <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <Link 
                href="/" 
                style={{
                  color: pathname === '/' ? '#2563eb' : '#374151',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                首页
              </Link>
              <Link 
                href="/novels" 
                style={{
                  color: pathname === '/novels' ? '#2563eb' : '#374151',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                作品库
              </Link>
              
              {user && (
                <>
                  <Link 
                    href="/my-novels" 
                    style={{
                      color: pathname === '/my-novels' ? '#2563eb' : '#374151',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    我的作品
                  </Link>
                  
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      style={{
                        color: pathname === '/admin' ? '#2563eb' : '#374151',
                        textDecoration: 'none',
                        fontWeight: '500',
                        backgroundColor: '#fef3c7',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px'
                      }}
                    >
                      后台管理
                    </Link>
                  )}
                </>
              )}
              
              {isLoading ? (
                <div style={{ width: '100px', textAlign: 'center' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>加载中...</span>
                </div>
              ) : user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#dbeafe',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1e40af',
                      fontWeight: '500'
                    }}>
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ color: '#374151', fontWeight: '500' }}>
                      {user.username}
                      {isAdmin && (
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#92400e',
                          backgroundColor: '#fef3c7',
                          padding: '0.125rem 0.375rem',
                          borderRadius: '4px',
                          marginLeft: '0.5rem'
                        }}>
                          管理员
                        </span>
                      )}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#dc2626',
                      border: '1px solid #fca5a5',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    退出
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link 
                    href="/login" 
                    style={{
                      color: pathname === '/login' ? '#2563eb' : '#374151',
                      textDecoration: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px'
                    }}
                  >
                    登录
                  </Link>
                  <Link 
                    href="/register" 
                    style={{
                      backgroundColor: '#2563eb',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      fontWeight: '500'
                    }}
                  >
                    注册
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </header>
        
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1rem',
          minHeight: 'calc(100vh - 140px)'
        }}>
          {children}
        </main>
        
        <footer style={{
          backgroundColor: '#1f2937',
          color: 'white',
          padding: '2rem 1rem',
          marginTop: 'auto'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <p style={{ marginBottom: '1rem', color: '#9ca3af' }}>
              © 2024 简阅 - 小学生小说创作平台
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              专为5-6年级学生设计 | 简约界面 | 高对比度 | 响应式设计
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}