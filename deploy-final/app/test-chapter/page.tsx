// 章节功能测试页面
export default function TestChapterPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
        📖 章节功能测试
      </h1>
      
      <div style={{ backgroundColor: '#f0f9ff', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1e40af' }}>
          新功能说明
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
              创作页面改进
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1rem', color: '#6b7280' }}>
              <li>支持创作新小说</li>
              <li>支持为已有小说添加新章节</li>
              <li>自动计算下一章编号</li>
              <li>模式切换功能</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
              小说详情页面
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1rem', color: '#6b7280' }}>
              <li>显示完整章节列表</li>
              <li>章节导航（上一章/下一章）</li>
              <li>章节内容阅读</li>
              <li>续写新章节按钮</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
          测试链接
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a 
            href="/novels/new"
            style={{
              display: 'block',
              padding: '1rem',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              textAlign: 'center',
              fontWeight: '500'
            }}
          >
            ✏️ 测试创作页面（支持章节）
          </a>
          
          <a 
            href="/novels/1"
            style={{
              display: 'block',
              padding: '1rem',
              backgroundColor: '#10b981',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              textAlign: 'center',
              fontWeight: '500'
            }}
          >
            📚 测试小说详情（带章节）
          </a>
          
          <a 
            href="/"
            style={{
              display: 'block',
              padding: '1rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              borderRadius: '8px',
              textDecoration: 'none',
              textAlign: 'center',
              fontWeight: '500'
            }}
          >
            🏠 返回首页
          </a>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fef3c7', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#92400e' }}>
          💡 测试步骤
        </h3>
        <ol style={{ margin: 0, paddingLeft: '1.5rem', color: '#92400e' }}>
          <li>点击"测试创作页面"</li>
          <li>尝试"创作新小说"模式</li>
          <li>切换到"添加新章节"模式</li>
          <li>选择已有小说</li>
          <li>点击"测试小说详情"查看章节效果</li>
          <li>测试章节导航功能</li>
        </ol>
      </div>
    </div>
  )
}