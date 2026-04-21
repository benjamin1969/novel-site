// 全新的简化首页
export default function HomePage() {
  return (
    <div>
      {/* 英雄区域 */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#dbeafe',
          color: '#1e40af',
          borderRadius: '9999px',
          marginBottom: '1.5rem'
        }}>
          <span>✨</span>
          <span style={{ fontWeight: '500' }}>简约阅读，纯粹创作</span>
        </div>
        
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#111827'
        }}>
          欢迎来到<span style={{ color: '#2563eb' }}>简阅</span>
        </h1>
        
        <p style={{
          fontSize: '1.125rem',
          color: '#4b5563',
          maxWidth: '600px',
          margin: '0 auto 2rem',
          lineHeight: '1.6'
        }}>
          一个专为小学生设计的简约小说创作平台，让每个故事都能被看见，让每次创作都变得简单愉快。
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="/register" 
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              display: 'inline-block'
            }}
          >
            立即注册
          </a>
          <a 
            href="/novels" 
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'white',
              color: '#2563eb',
              border: '1px solid #2563eb',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              display: 'inline-block'
            }}
          >
            浏览作品
          </a>
        </div>
      </div>
      
      {/* 功能特色 */}
      <div style={{ marginTop: '4rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          平台特色
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dbeafe',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>👶</span>
            </div>
            <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              适合小学生
            </h3>
            <p style={{ color: '#6b7280' }}>
              界面简洁易懂，操作简单，专为5-6年级学生设计，无需复杂操作。
            </p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🎨</span>
            </div>
            <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              高对比度设计
            </h3>
            <p style={{ color: '#6b7280' }}>
              米色背景搭配深色文字，保护视力，适合长时间阅读和创作。
            </p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>📱</span>
            </div>
            <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              响应式设计
            </h3>
            <p style={{ color: '#6b7280' }}>
              自动适应各种屏幕尺寸，在电脑、平板、手机上都能完美显示。
            </p>
          </div>
        </div>
      </div>
      
      {/* 快速开始指南 */}
      <div style={{
        backgroundColor: '#f0f9ff',
        padding: '2rem',
        borderRadius: '12px',
        marginTop: '3rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          🚀 快速开始
        </h2>
        <ol style={{ paddingLeft: '1.5rem', color: '#4b5563' }}>
          <li style={{ marginBottom: '0.5rem' }}>1. 点击右上角"注册"按钮创建账号</li>
          <li style={{ marginBottom: '0.5rem' }}>2. 登录后点击"创作"开始写故事</li>
          <li style={{ marginBottom: '0.5rem' }}>3. 发布作品，让其他同学阅读</li>
          <li>4. 浏览"发现"页面，阅读其他同学的作品</li>
        </ol>
      </div>
      
      {/* 统计数据 */}
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>100+</div>
            <div style={{ color: '#6b7280' }}>注册用户</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>50+</div>
            <div style={{ color: '#6b7280' }}>原创作品</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>500+</div>
            <div style={{ color: '#6b7280' }}>阅读次数</div>
          </div>
        </div>
      </div>
    </div>
  )
}