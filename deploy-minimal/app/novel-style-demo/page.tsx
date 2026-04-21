// 测试页面 - 小说详情统一样式演示
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function NovelStyleDemoPage() {
  const [selectedChapter, setSelectedChapter] = useState(0)
  
  // 模拟数据
  const novel = {
    id: 'demo_novel',
    title: '示例小说：小明的冒险',
    author: '小明',
    description: '这是一个关于小明在神奇世界中冒险的故事。故事充满了想象力和趣味性，适合小学生阅读。',
    chapters: 5,
    status: 'published',
    chapterList: [
      { id: 'ch1', number: 1, title: '神秘的邀请', content: '在一个阳光明媚的早晨，小明收到了一封神秘的信件...', createdAt: '2024-01-15', views: 150 },
      { id: 'ch2', number: 2, title: '穿越魔法门', content: '小明按照信中的指示，找到了隐藏在公园深处的魔法门...', createdAt: '2024-01-16', views: 120 },
      { id: 'ch3', number: 3, title: '遇见精灵朋友', content: '在魔法世界的森林里，小明遇到了一只可爱的小精灵...', createdAt: '2024-01-18', views: 98 },
      { id: 'ch4', number: 4, title: '解决第一个难题', content: '精灵告诉小明，要离开这个世界，必须解开三个谜题...', createdAt: '2024-01-20', views: 85 },
      { id: 'ch5', number: 5, title: '新的冒险开始', content: '解决了第一个谜题后，小明和精灵继续他们的旅程...', createdAt: '2024-01-22', views: 76 },
    ]
  }
  
  const currentChapter = novel.chapterList[selectedChapter]
  const isAuthor = true // 模拟作者身份

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 返回链接 */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
            ← 返回首页
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
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                编辑小说信息
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                添加新章节
              </button>
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
              
              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {novel.chapterList.map((chapter, index) => (
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
                        <button className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition">
                          编辑
                        </button>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：章节内容 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6 min-h-[600px]">
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
                  {currentChapter.content}
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
            </div>
          </div>
        </div>

        {/* 样式说明 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">统一样式说明</h3>
          <ul className="text-blue-700 space-y-2">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span><strong>左侧章节列表</strong>：显示所有章节，包含序号和名称，当前选中章节高亮显示</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span><strong>右侧章节内容</strong>：显示选定章节的完整内容，包含章节标题、导航按钮</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span><strong>响应式设计</strong>：在大屏幕上左右分栏，在小屏幕上垂直堆叠</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span><strong>作者功能</strong>：作者可以看到编辑按钮，可以编辑小说信息和各个章节</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}