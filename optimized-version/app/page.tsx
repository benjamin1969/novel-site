'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [stats, setStats] = useState({
    totalNovels: 0,
    totalUsers: 0,
    totalComments: 0
  })

  useEffect(() => {
    // 检查登录状态
    const user = localStorage.getItem('user')
    setIsLoggedIn(!!user)

    // 加载统计数据
    const novels = JSON.parse(localStorage.getItem('novels') || '[]')
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const comments = JSON.parse(localStorage.getItem('comments') || '[]')
    
    setStats({
      totalNovels: novels.length,
      totalUsers: users.length,
      totalComments: comments.length
    })
  }, [])

  return (
    <div>
      <div style={{
        textAlign: 'center',
        padding: '3rem 1rem',
        backgroundColor: '#f0f9ff',
        borderRadius: '12px',
        marginBottom: '3rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: '#1e40af',
          marginBottom: '1rem'
        }}>
          📚 小说创作平台 - 优化版
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: '#4b5563',
          maxWidth: '600px',
          margin: '0 auto 2rem'
        }}>
          专为小学生设计的简约小说创作平台。无需复杂操作，轻松创作属于自己的故事。
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {isLoggedIn ? (
            <>
              <Link href="/novels/new" style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2563eb',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '500'
              }}>
                开始创作
              </Link>
              <Link href="/novels" style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '500'
              }}>
                浏览作品
              </Link>
            </>
          ) : (
            <>
              <Link href="/register" style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2563eb',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '500'
              }}>
                立即注册
              </Link>
              <Link href="/login" style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f3f4f6',
                color: '#4b5563',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '500'
              }}>
                登录体验
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 平台统计 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '2rem', color: '#2563eb', marginBottom: '0.5rem' }}>
            {stats.totalNovels}
          </div>
          <div style={{ color: '#4b5563' }}>已创作小说</div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '2rem', color: '#10b981', marginBottom: '0.5rem' }}>
            {stats.totalUsers}
          </div>
          <div style={{ color: '#4b5563' }}>注册用户</div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '2rem', color: '#8b5cf6', marginBottom: '0.5rem' }}>
            {stats.totalComments}
          </div>
          <div style={{ color: '#4b5563' }}>读者评论</div>
        </div>
      </div>

      {/* 功能特色 */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#1f2937'
        }}>
          平台特色
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ color: '#2563eb', marginBottom: '1rem' }}>🎨 简约设计</h3>
            <p style={{ color: '#6b7280' }}>
              界面简洁明了，适合小学生使用。没有复杂装饰，专注于创作和阅读。
            </p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>📝 轻松创作</h3>
            <p style={{ color: '#6b7280' }}>
              三步完成小说创作：填写信息、添加章节、立即发布。支持章节管理。
            </p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ color: '#8b5cf6', marginBottom: '1rem' }}>🚀 快速访问</h3>
            <p style={{ color: '#6b7280' }}>
              优化版部署在Cloudflare Pages，国内访问快速稳定，无需科学上网。
            </p>
          </div>
        </div>
      </div>

      {/* 使用指南 */}
      <div style={{
        backgroundColor: '#fef3c7',
        padding: '2rem',
        borderRadius: '8px',
        border: '1px solid #fbbf24'
      }}>
        <h3 style={{ color: '#92400e', marginBottom: '1rem' }}>📋 使用指南</h3>
        <ol style={{ color: '#92400e', paddingLeft: '1.5rem', margin: 0 }}>
          <li style={{ marginBottom: '0.5rem' }}>注册账号（或使用测试账号：admin/admin）</li>
          <li style={{ marginBottom: '0.5rem' }}>点击"创作小说"开始你的第一部作品</li>
          <li style={{ marginBottom: '0.5rem' }}>添加章节内容，支持随时编辑</li>
          <li style={{ marginBottom: '0.5rem' }}>发布后其他用户可以在作品库看到你的小说</li>
          <li>读者可以留下评论，作者可以回复</li>
        </ol>
      </div>
    </div>
  )
}