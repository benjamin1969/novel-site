// 测试页面 - 验证章节创建问题
'use client'

import { useState } from 'react'

export default function TestPage() {
  const [result, setResult] = useState('')

  const testNovelCreation = async () => {
    try {
      // 创建小说
      const response = await fetch('/api/novels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '测试章节修复',
          description: '测试章节重复问题是否修复',
          author: '测试用户',
          content: '这是测试内容'
        })
      })
      
      const data = await response.json()
      setResult(`小说创建: ${response.status} - ${JSON.stringify(data)}`)
      
      // 检查是否有章节创建
      if (data.novel?.id) {
        const chaptersResponse = await fetch(`/api/novels/${data.novel.id}/chapters`)
        const chapters = await chaptersResponse.json()
        setResult(prev => prev + `\n章节数量: ${chapters.length}`)
      }
    } catch (error) {
      setResult(`错误: ${error}`)
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>测试章节创建问题</h1>
      <button onClick={testNovelCreation} style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
        测试创建小说
      </button>
      <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
        {result || '点击按钮开始测试'}
      </pre>
    </div>
  )
}
