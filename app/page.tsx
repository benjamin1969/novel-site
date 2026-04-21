'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './hooks/use-auth';
import { useNovels } from './hooks/use-novels';

// 全新的增强首页
export default function HomePage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const { getNovels, loading: novelsLoading } = useNovels();
  
  const [novelsCount, setNovelsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 加载小说数据
    const loadData = async () => {
      try {
        const novels = await getNovels();
        setNovelsCount(novels.length);
      } catch (error) {
        console.error('加载小说数据失败:', error);
      }
      
      setLoading(false);
    };
    
    if (!authLoading) {
      loadData();
    }
  }, [getNovels, authLoading]);

  const userGreeting = currentUser 
    ? `欢迎回来，${currentUser.username}！`
    : '欢迎来到简阅小说创作平台';

  if (loading || authLoading) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>正在加载...</div>
      </div>
    );
  }

  return (
    <div>
      {/* 个性化欢迎区域 */}
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
          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
            {userGreeting}
          </span>
        </div>

        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          简阅小说创作平台
        </h1>

        <p style={{
          fontSize: '1.125rem',
          color: '#6b7280',
          maxWidth: '36rem',
          margin: '0 auto 2rem'
        }}>
          专为5-6年级小学生设计的简约小说创作空间
        </p>
      </div>

      {/* 平台概览卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '0.75rem',
          border: '1px solid #bae6fd'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0369a1', marginBottom: '0.5rem' }}>
            {novelsCount}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '500', color: '#0c4a6e' }}>
            已发布小说
          </div>
          <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.5rem' }}>
            来自小作者们的精彩作品
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fef2f2',
          borderRadius: '0.75rem',
          border: '1px solid #fecaca'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '0.5rem' }}>
            免费
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '500', color: '#991b1b' }}>
            完全免费使用
          </div>
          <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.5rem' }}>
            为小学生提供零成本创作环境
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f0fdf4',
          borderRadius: '0.75rem',
          border: '1px solid #bbf7d0'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#15803d', marginBottom: '0.5rem' }}>
            简约
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '500', color: '#166534' }}>
            界面简洁易用
          </div>
          <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.5rem' }}>
            专为小学生设计的友好界面
          </div>
        </div>
      </div>

      {/* 快速行动区域 */}
      <div style={{
        backgroundColor: '#f8fafc',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '3rem'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          color: '#1e293b'
        }}>
          快速开始
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <a href="/novels" style={{
            display: 'block',
            padding: '1rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '0.5rem',
            textAlign: 'center',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}>
            浏览作品库
          </a>

          {currentUser ? (
            <>
              <a href="/my-novels" style={{
                display: 'block',
                padding: '1rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                borderRadius: '0.5rem',
                textAlign: 'center',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}>
                我的作品
              </a>
              <a href="/novels/new" style={{
                display: 'block',
                padding: '1rem 1.5rem',
                backgroundColor: '#8b5cf6',
                color: 'white',
                borderRadius: '0.5rem',
                textAlign: 'center',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}>
                创作新小说
              </a>
            </>
          ) : (
            <>
              <a href="/login" style={{
                display: 'block',
                padding: '1rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                borderRadius: '0.5rem',
                textAlign: 'center',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}>
                登录账号
              </a>
              <a href="/register" style={{
                display: 'block',
                padding: '1rem 1.5rem',
                backgroundColor: '#8b5cf6',
                color: 'white',
                borderRadius: '0.5rem',
                textAlign: 'center',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}>
                注册账号
              </a>
            </>
          )}
        </div>
      </div>

      {/* 平台特色介绍 */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          color: '#1e293b',
          textAlign: 'center'
        }}>
          平台特色
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem'
          }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e40af' }}>
              🎨 简约设计
            </div>
            <div style={{ color: '#4b5563' }}>
              界面简洁明了，没有复杂装饰，适合小学生专注创作
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem'
          }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#059669' }}>
              📚 章节管理
            </div>
            <div style={{ color: '#4b5563' }}>
              轻松添加和管理章节，支持草稿保存和继续创作
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem'
          }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#7c3aed' }}>
              💬 互动评论
            </div>
            <div style={{ color: '#4b5563' }}>
              读者可以给喜欢的小说留言，作者可以回复交流
            </div>
          </div>
        </div>
      </div>

      {/* 使用指南 */}
      <div style={{
        backgroundColor: '#fefce8',
        border: '1px solid #fde047',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        marginBottom: '3rem'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#854d0e'
        }}>
          📝 使用指南
        </h3>
        <ol style={{ paddingLeft: '1.5rem', color: '#713f12' }}>
          <li style={{ marginBottom: '0.5rem' }}>注册账号（支持中文用户名）</li>
          <li style={{ marginBottom: '0.5rem' }}>登录后点击"创作新小说"开始写作</li>
          <li style={{ marginBottom: '0.5rem' }}>为小说添加章节，支持草稿保存</li>
          <li style={{ marginBottom: '0.5rem' }}>发布后其他用户可以在作品库阅读</li>
          <li>读者可以给喜欢的小说留言评论</li>
        </ol>
      </div>

      {/* 页脚 */}
      <footer style={{
        textAlign: 'center',
        paddingTop: '2rem',
        borderTop: '1px solid #e5e7eb',
        color: '#6b7280',
        fontSize: '0.875rem'
      }}>
        <p>© 2024 简阅小说创作平台 - 专为5-6年级小学生设计</p>
        <p style={{ marginTop: '0.5rem' }}>简约界面 | 高对比度 | 响应式设计 | 完全免费</p>
      </footer>
    </div>
  );
}