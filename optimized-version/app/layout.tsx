import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '小说创作平台 - 优化版',
  description: '为小学生设计的简约小说创作平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9fafb',
        minHeight: '100vh'
      }}>
        <Navigation />
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem'
        }}>
          {children}
        </main>
        <footer style={{
          textAlign: 'center',
          padding: '2rem',
          marginTop: '3rem',
          borderTop: '1px solid #e5e7eb',
          color: '#6b7280',
          fontSize: '0.875rem'
        }}>
          <p>© 2024 小说创作平台 - 为小学生设计的简约平台</p>
          <p style={{ marginTop: '0.5rem' }}>优化版本 | 国内快速访问 | 简约设计</p>
        </footer>
      </body>
    </html>
  )
}