// 小说详情页面 - 统一样式版本（左右分栏布局）
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function NovelDetailPageUnified() {
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
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-200 rounded mb-4"></div>
                <div className="h-12 bg-gray-200 rounded mb-2"></div>
                <div className="h-12 bg-gray-200 rounded mb-2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
              <div className="lg:col-span-3">
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!novel) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
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
  const currentChapter = novel.chapterList[selectedChapter]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 返回链接 */}
        <div className="mb-6">
          <Link href="/novels" className="text-blue-600 hover:text-blue-800 underline">
            ← 返回作品库
          </Link>
        </div>

        {/* 小说基本信息 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{novel.title}</h1>
          <div className="flex flex-wrap items-center text-gray-600 mb-4 gap-4">
            <span>作者: {novel.author}</span>
            <span>章节数: {novel.chapters}</span>
            <span>状态: {novel.status === 'published' ? '已发布' : '草稿'}</span>
          </div>
          
          <p className="text-gray-700 mb-6 whitespace-pre-line">{novel.description}</p>
          
          {/* 作者操作按钮 */}
          {isAuthor && (
            <div className="flex flex-wrap gap-4 mb-6">
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

        {/* 左右分栏布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：章节列表 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
                章节列表 ({novel.chapters})
              </h2>
              
              {novel.chapterList && novel.chapterList.length > 0 ? (
                <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                  {novel.chapterList.map((chapter: any, index: number) => (
                    <button
                      key={chapter.id}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        selectedChapter === index 
                          ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700' 
                          : 'hover:bg-gray-50 border-l-4 border-transparent text-gray-700'
                      }`}
                      onClick={() => setSelectedChapter(index)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-sm font-medium mr-3">
                          {chapter.number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{chapter.title}</h3>
                          <div className="text-xs text-gray-500 mt-1">
                            <span>{chapter.createdAt}</span>
                            <span className="mx-2">•</span>
                            <span>{chapter.views} 阅读</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* 作者编辑按钮 */}
                      {isAuthor && (
                        <div className="mt-2 flex justify-end">
                          <Link
                            href={`/novels/edit/${novel.id}/chapter/${chapter.id}`}
                            className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                            onClick={(e) => e.stopPropagation()}
                          >
                            编辑
                          </Link>
                        </div>
                      )}
                    </button>
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
          </div>

          {/* 右侧：章节内容 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6 min-h-[600px]">
              {novel.chapterList && novel.chapterList.length > 0 ? (
                <>
                  {/* 章节标题和导航 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {currentChapter.title}
                      </h2>
                      <div className="flex items-center text-gray-600 text-sm mt-2">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded mr-3">
                          第{currentChapter.number}章
                        </span>
                        <span>创建时间: {currentChapter.createdAt}</span>
                        <span className="mx-3">•</span>
                        <span>阅读量: {currentChapter.views}</span>
                      </div>
                    </div>
                    
                    {/* 章节导航 */}
                    <div className="flex space-x-2 mt-4 sm:mt-0">
                      <button
                        onClick={() => setSelectedChapter(Math.max(0, selectedChapter - 1))}
                        disabled={selectedChapter === 0}
                        className={`px-4 py-2 rounded transition ${
                          selectedChapter === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        上一章
                      </button>
                      <button
                        onClick={() => setSelectedChapter(Math.min(novel.chapterList.length - 1, selectedChapter + 1))}
                        disabled={selectedChapter === novel.chapterList.length - 1}
                        className={`px-4 py-2 rounded transition ${
                          selectedChapter === novel.chapterList.length - 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        下一章
                      </button>
                    </div>
                  </div>

                  {/* 章节内容 */}
                  <div className="prose max-w-none">
                    <div className="text-gray-800 whitespace-pre-line leading-relaxed text-lg">
                      {currentChapter.content || '本章节暂无内容。'}
                    </div>
                  </div>

                  {/* 章节底部导航 */}
                  <div className="mt-12 pt-6 border-t border-gray-200">
                    <div className="flex justify-between">
                      <div>
                        {selectedChapter > 0 && (
                          <button
                            onClick={() => setSelectedChapter(selectedChapter - 1)}
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <span className="mr-2">←</span>
                            <div>
                              <div className="text-sm text-gray-500">上一章</div>
                              <div className="font-medium">{novel.chapterList[selectedChapter - 1].title}</div>
                            </div>
                          </button>
                        )}
                      </div>
                      
                      <div>
                        {selectedChapter < novel.chapterList.length - 1 && (
                          <button
                            onClick={() => setSelectedChapter(selectedChapter + 1)}
                            className="text-blue-600 hover:text-blue-800 flex items-center text-right"
                          >
                            <div>
                              <div className="text-sm text-gray-500">下一章</div>
                              <div className="font-medium">{novel.chapterList[selectedChapter + 1].title}</div>
                            </div>
                            <span className="ml-2">→</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-3">
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">暂无章节内容</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    这部小说还没有任何章节内容。{isAuthor ? '作为作者，您可以点击左侧的"添加第一个章节"按钮开始创作。' : '请等待作者添加章节内容。'}
                  </p>
                  {isAuthor && (
                    <Link 
                      href={`/novels/new?mode=chapter&novel=${novel.id}`}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition inline-flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                      开始创作第一个章节
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 阅读提示 */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>点击左侧章节列表中的章节可以切换阅读内容</p>
          {isAuthor && <p className="mt-1">作为作者，您可以编辑小说信息和各个章节</p>}
        </div>
      </div>
    </div>
  )
}