// 网站设置页面
'use client'

import { useState, useEffect } from 'react'

export default function SiteSettings() {
  const [currentConfig, setCurrentConfig] = useState({
    siteName: '简阅小说平台',
    siteDescription: '小学生专属的原创小说天地',
    maintenanceMode: false
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // 加载当前设置
  useEffect(() => {
    const fetchSiteConfig = async () => {
      try {
        const response = await fetch('/api/site-config')
        const data = await response.json()
        if (data.success) {
          setCurrentConfig(data.config)
        }
      } catch (error) {
        console.error('加载网站设置失败:', error)
      }
    }
    
    fetchSiteConfig()
  }, [])

  // 保存设置
  const handleSaveSettings = async () => {
    setIsSaving(true)
    setSaveMessage('')
    
    try {
      const response = await fetch('/api/site-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentConfig)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSaveMessage('设置已保存！网站名称和描述已立即生效')
        
        // 立即刷新页面以应用新设置
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        setSaveMessage(`保存失败: ${data.error}`)
      }
    } catch (error) {
      console.error('保存设置失败:', error)
      setSaveMessage('保存失败，请检查网络连接')
    } finally {
      setIsSaving(false)
    }
  }

  // 重置设置
  const handleResetSettings = async () => {
    if (confirm('确定要重置所有设置为默认值吗？')) {
      const defaultConfig = {
        siteName: '简阅小说平台',
        siteDescription: '小学生专属的原创小说天地',
        maintenanceMode: false
      }
      
      try {
        const response = await fetch('/api/site-config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(defaultConfig)
        })
        
        const data = await response.json()
        
        if (data.success) {
          setCurrentConfig(defaultConfig)
          setSaveMessage('设置已重置为默认值，页面将刷新...')
          
          // 立即刷新页面以应用默认设置
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        } else {
          setSaveMessage(`重置失败: ${data.error}`)
        }
      } catch (error) {
        console.error('重置设置失败:', error)
        setSaveMessage('重置失败，请检查网络连接')
      }
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
          网站设置
        </h1>
        <p style={{ color: '#6b7280' }}>
          配置网站的基本信息和功能
        </p>
      </div>

      {/* 保存状态提示 */}
      {saveMessage && (
        <div style={{
          backgroundColor: '#d1fae5',
          color: '#047857',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '1px solid #34d399',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>✅</span>
          <span>{saveMessage}</span>
        </div>
      )}

      {/* 基本设置 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          color: '#111827',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>🌐</span>
          <span>基本设置</span>
        </h2>

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
            value={currentConfig.siteName}
            onChange={(e) => setCurrentConfig({ ...currentConfig, siteName: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
            placeholder="输入网站名称"
          />
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
            显示在网站标题和浏览器标签页
          </p>
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
            value={currentConfig.siteDescription}
            onChange={(e) => setCurrentConfig({ ...currentConfig, siteDescription: e.target.value })}
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              resize: 'vertical'
            }}
            placeholder="输入网站描述"
          />
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
            显示在网站首页和搜索引擎结果中
          </p>
        </div>
      </div>

      {/* 功能设置 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          color: '#111827',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⚙️</span>
          <span>功能设置</span>
        </h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            marginBottom: '0.5rem'
          }}>
            <input
              type="checkbox"
              checked={currentConfig.maintenanceMode}
              onChange={(e) => setCurrentConfig({ ...currentConfig, maintenanceMode: e.target.checked })}
              style={{ width: '1rem', height: '1rem' }}
            />
            <span style={{ fontWeight: '500', color: '#374151' }}>
              维护模式
            </span>
          </label>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '1.5rem' }}>
            开启后只有管理员可以访问网站，普通用户会看到维护页面
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            marginBottom: '0.5rem'
          }}>
            <input
              type="checkbox"
              checked={true}
              disabled
              style={{ width: '1rem', height: '1rem' }}
            />
            <span style={{ fontWeight: '500', color: '#6b7280' }}>
              评论审核（强制开启）
            </span>
          </label>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '1.5rem' }}>
            所有用户评论都需要管理员审核后才能显示
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            marginBottom: '0.5rem'
          }}>
            <input
              type="checkbox"
              checked={true}
              disabled
              style={{ width: '1rem', height: '1rem' }}
            />
            <span style={{ fontWeight: '500', color: '#6b7280' }}>
              用户注册（已开启）
            </span>
          </label>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '1.5rem' }}>
            允许新用户注册账号
          </p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        padding: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          设置修改后需要保存才能生效
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleResetSettings}
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
            重置设置
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: isSaving ? '#93c5fd' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? '保存中...' : '保存设置'}
          </button>
        </div>
      </div>

      {/* 设置说明 */}
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
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>📝</span>
          <span>设置说明</span>
        </h3>
        <ul style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, paddingLeft: '1.5rem' }}>
          <li>网站名称和描述保存后会立即生效，页面会自动刷新</li>
          <li>维护模式开启后，普通用户无法访问网站内容</li>
          <li>评论审核功能强制开启，确保内容安全</li>
          <li>用户注册功能默认开启，可以随时关闭</li>
          <li>设置保存在服务器内存中，重启服务器会重置为默认值</li>
        </ul>
      </div>
    </div>
  )
}