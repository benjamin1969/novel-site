// 小说详情页面 - 简化版本
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function NovelDetailPage() {
  const [selectedChapter, setSelectedChapter] = useState(0)
  const [novel, setNovel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState('')
  const params = useParams()
  
  // 获取当前登录用户
  useEffect(() => {
    const getCurrentUser = () => {
      // 尝试所有可能的键名来获取用户名
      const possibleKeys = [
        'novel-site-username',
        'username',
        'currentUser',
        'user',
        'name'
      ]
      
      for (const key of possibleKeys) {
        const value = localStorage.getItem(key)
        if (value && value.trim() && value.trim() !== '匿名用户') {
          // 特殊处理：如果键名是'user'，可能是JSON格式
          if (key === 'user') {
            try {
              const userData = JSON.parse(value.trim())
              // 尝试从JSON对象中提取用户名
              return userData.username || userData.name || userData.displayName || ''
            } catch (e) {
              return value.trim()
            }
          } else {
            return value.trim()
          }
        }
      }
      return ''
    }
    
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  useEffect(() => {
    const fetchNovel = async () => {
      try {
        setLoading(true)
        const novelId = params.id as string
        
        // 尝试从API获取小说基本信息
        const novelResponse = await fetch(`/api/novels/${novelId}`)
        
        if (novelResponse.ok) {
          const novelData = await novelResponse.json()
          
          // 获取章节数据
          const chaptersResponse = await fetch(`/api/novels/${novelId}/chapters`)
          let chapterList = []
          
          if (chaptersResponse.ok) {
            const chaptersData = await chaptersResponse.json()
            chapterList = chaptersData.map((chapter: any, index: number) => ({
              id: chapter.id,
              title: chapter.title || `第${index + 1}章`,
              number: chapter.number || index + 1,
              content: chapter.content || '',
              createdAt: chapter.createdAt || new Date().toISOString().split('T')[0],
              views: chapter.views || 0
            }))
          }
          
          setNovel({
            ...novelData,
            chapters: chapterList.length,
            chapterList: chapterList
          })
        } else {
          // 如果API失败，尝试从localStorage获取
          console.log('API失败，尝试localStorage')
          const savedNovels = JSON.parse(localStorage.getItem('novel-site-novels') || '[]')
          const savedChapters = JSON.parse(localStorage.getItem('novel-site-chapters') || '[]')
          
          const foundNovel = savedNovels.find((n: any) => n.id === novelId)
          
          if (foundNovel) {
            const novelChapters = savedChapters
              .filter((c: any) => c.novelId === novelId)
              .sort((a: any, b: any) => a.number - b.number)
            
            setNovel({
              ...foundNovel,
              chapters: novelChapters.length,
              chapterList: novelChapters
            })
          } else {
            // 如果都找不到，显示错误
            setNovel({
              id: novelId,
              title: '小说不存在',
              author: '未知',
              description: '抱歉，找不到您要查看的小说。',
              chapters: 0,
              chapterList: []
            })
          }
        }
      } catch (error) {
        console.error('获取小说详情失败:', error)
        setNovel({
          id: params.id as string,
          title: '加载失败',
          author: '未知',
          description: '加载小说详情时发生错误，请稍后重试。',
          chapters: 0,
          chapterList: []
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchNovel()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!novel) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-red-600 mb-4">小说不存在</h1>
          <p className="text-gray-600 mb-8">抱歉，找不到您要查看的小说。</p>
          <Link href="/novels" className="text-blue-600 hover:text-blue-800 underline">
            返回作品库
          </Link>
        </div>
      </div>
    )
  }

  const isAuthor = currentUser === novel.author

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 返回链接 */}
        <div className="mb-6">
          <Link href="/novels" className="text-blue-600 hover:text-blue-800 underline">
            ← 返回作品库
          </Link>
        </div>

        {/* 小说基本信息 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{novel.title}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <span className="mr-4">作者: {novel.author}</span>
            <span>章节数: {novel.chapters}</span>
          </div>
          
          <p className="text-gray-700 mb-6 whitespace-pre-line">{novel.description}</p>
          
          {/* 作者操作按钮 */}
          {isAuthor && (
            <div className="flex space-x-4 mb-6">
              <Link 
                href={`/novels/edit/${novel.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                编辑小说信息
              </Link>
              <Link 
                href={`/novels/new?mode=chapter&novel=${novel.id}`}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                添加新章节
              </Link>
            </div>
          )}
        </div>

        {/* 章节列表 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">章节列表</h2>
          
          {novel.chapterList && novel.chapterList.length > 0 ? (
            <div className="space-y-4">
              {novel.chapterList.map((chapter: any, index: number) => (
                <div 
                  key={chapter.id} 
                  className={`border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition ${
                    selectedChapter === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedChapter(index)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {chapter.title}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <span className="mr-4">第{chapter.number}章</span>
                        <span>创建时间: {chapter.createdAt}</span>
                        <span className="ml-4">阅读量: {chapter.views}</span>
                      </div>
                    </div>
                    
                    {/* 作者编辑按钮 */}
                    {isAuthor && (
                      <Link
                        href={`/novels/edit/${novel.id}/chapter/${chapter.id}`}
                        className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        编辑章节
                      </Link>
                    )}
                  </div>
                  
                  {selectedChapter === index && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-gray-700 whitespace-pre-line">
                        {chapter.content || '本章节暂无内容。'}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">暂无章节内容。</p>
              {isAuthor && (
                <Link 
                  href={`/novels/new?mode=chapter&novel=${novel.id}`}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition inline-block"
                >
                  添加第一个章节
                </Link>
              )}
            </div>
          )}
        </div>

        {/* 阅读提示 */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>点击章节标题可以展开/收起章节内容</p>
          {isAuthor && <p className="mt-1">作为作者，您可以编辑小说信息和各个章节</p>}
        </div>
      </div>
    </div>
  )
}