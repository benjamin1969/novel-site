// 小说详情页面 - 支持章节显示
'use client'

import { useState } from 'react'

export default function NovelDetailPage() {
  const [selectedChapter, setSelectedChapter] = useState(0)
  
  // 模拟小说数据，包含多个章节
  const novel = {
    id: 1,
    title: '魔法森林的冒险',
    author: '小明',
    description: '一个关于勇气和友谊的魔法森林冒险故事。小主人公在森林中遇到了各种神奇的生物，并学会了重要的生活道理。',
    category: '奇幻',
    chapters: 3,
    views: 156,
    likes: 67,
    createdAt: '2024-03-10',
    
    // 章节内容
    chapterList: [
      {
        id: 1,
        title: '第一章：神秘的森林',
        number: 1,
        content: `从前，有一个叫小明的小男孩，他住在一个宁静的小村庄旁边。

有一天，小明在村庄后面的森林里玩耍时，发现了一条他从未见过的小路。这条小路被五彩斑斓的花朵包围，空气中弥漫着甜甜的香气。

"这条路通向哪里呢？"小明好奇地想。

他小心翼翼地踏上小路，两旁的树木似乎在对他说悄悄话。阳光透过树叶的缝隙洒下来，在地上形成斑驳的光影。

走了一会儿，小明听到了一阵悦耳的歌声。他顺着歌声走去，发现了一个小小的池塘，池塘边坐着一只会说话的小兔子！

"你好，小朋友，"小兔子用温柔的声音说，"欢迎来到魔法森林。"

小明惊讶地睁大了眼睛："你会说话？"

"当然会，"小兔子笑着说，"在这里，所有的动物都会说话。不过，你要小心，森林深处住着一个坏巫师，他总想破坏森林的和平。"

小明握紧了小拳头："我要帮助你们保护森林！"

就这样，小明的魔法森林冒险开始了...`,
        createdAt: '2024-03-10',
        views: 156
      },
      {
        id: 2,
        title: '第二章：会说话的小兔子',
        number: 2,
        content: `小兔子名叫小白，它告诉小明很多关于魔法森林的秘密。

"这片森林里住着很多神奇的生物，"小白一边跳着一边说，"有会唱歌的小鸟，有会发光的蘑菇，还有会变魔术的小松鼠。"

小明听得入迷："我能见到它们吗？"

"当然可以，"小白说，"不过我们要小心那个坏巫师。他住在森林最深处的黑暗城堡里，总想抓走森林里的小动物。"

突然，远处传来一阵奇怪的声音。小白紧张地竖起耳朵："不好，是巫师的巡逻队！快躲起来！"

小明和小白躲在一棵大树后面，看到几个穿着黑袍的骷髅兵从旁边走过。

"我们必须想办法阻止巫师，"小明小声说，"不能让他伤害森林里的朋友们。"

小白点点头："我知道一条秘密小路可以通往黑暗城堡，但是路上有很多危险..."

小明坚定地说："我不怕危险，我要保护魔法森林！"`,
        createdAt: '2024-03-11',
        views: 98
      },
      {
        id: 3,
        title: '第三章：黑暗城堡的挑战',
        number: 3,
        content: `在前往黑暗城堡的路上，小明和小白遇到了很多挑战。

首先是一片食人花森林，那些花会突然张开大嘴想要吃掉他们。小白教小明唱一首魔法歌谣，食人花听到歌谣就会安静下来。

接着是一条湍急的河流，河上没有桥。幸好他们遇到了一群友好的水獭，水獭们用身体搭成了一座浮桥让他们通过。

最后是一片迷雾森林，里面很容易迷路。小白用它的魔法胡萝卜在地上画了一条发光的路线，指引他们前进。

终于，他们看到了黑暗城堡。城堡高高地耸立在悬崖上，周围环绕着黑色的雾气。

"我们到了，"小白说，"但是要小心，城堡里有很多陷阱。"

小明深吸一口气："不管有什么困难，我都要救出被巫师抓走的小动物们！"

他们悄悄地靠近城堡大门，准备开始最危险的冒险...`,
        createdAt: '2024-03-12',
        views: 76
      }
    ]
  }

  return (
    <div>
      {/* 小说头部信息 */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '9999px', marginBottom: '1rem' }}>
          <span>📚</span>
          <span style={{ fontWeight: '500' }}>{novel.category}</span>
        </div>
        
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#111827'
        }}>
          {novel.title}
        </h1>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#f0f9ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              👤
            </div>
            <span style={{ color: '#6b7280' }}>{novel.author}</span>
          </div>
          
          <div style={{ color: '#6b7280' }}>
            <span>📖 {novel.chapters} 章</span>
            <span style={{ marginLeft: '1rem' }}>👁️ {novel.views} 阅读</span>
            <span style={{ marginLeft: '1rem' }}>❤️ {novel.likes} 喜欢</span>
          </div>
        </div>
        
        <p style={{
          color: '#4b5563',
          maxWidth: '600px',
          margin: '0 auto 2rem',
          lineHeight: '1.6'
        }}>
          {novel.description}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
        {/* 左侧：章节导航 */}
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1rem 1.5rem',
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontWeight: '600',
              color: '#374151'
            }}>
              章节列表 ({novel.chapters}章)
            </div>
            
            <div>
              {novel.chapterList.map((chapter, index) => (
                <button
                  key={chapter.id}
                  onClick={() => setSelectedChapter(index)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid #f3f4f6',
                    textAlign: 'left',
                    backgroundColor: selectedChapter === index ? '#f0f9ff' : 'white',
                    color: selectedChapter === index ? '#1e40af' : '#374151',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>{chapter.title}</div>
                      <div style={{ fontSize: '0.875rem', color: selectedChapter === index ? '#60a5fa' : '#6b7280', marginTop: '0.25rem' }}>
                        第 {chapter.number} 章 · {chapter.views} 阅读
                      </div>
                    </div>
                    {selectedChapter === index && (
                      <span style={{ color: '#3b82f6' }}>▶</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {/* 添加新章节按钮 */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb' }}>
              <a
                href="/novels/new"
                style={{
                  display: 'block',
                  padding: '0.75rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'center'
                }}
              >
                ✏️ 续写新章节
              </a>
            </div>
          </div>
        </div>

        {/* 右侧：章节内容 */}
        <div>
          {novel.chapterList[selectedChapter] && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '2rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#111827',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #e5e7eb'
              }}>
                {novel.chapterList[selectedChapter].title}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                <span>第 {novel.chapterList[selectedChapter].number} 章</span>
                <span>•</span>
                <span>{novel.chapterList[selectedChapter].createdAt}</span>
                <span>•</span>
                <span>{novel.chapterList[selectedChapter].views} 阅读</span>
              </div>
              
              <div style={{
                color: '#374151',
                lineHeight: '1.8',
                fontSize: '1.125rem'
              }}>
                {novel.chapterList[selectedChapter].content.split('\n').map((paragraph, index) => (
                  <p key={index} style={{ marginBottom: '1.5rem', textIndent: '2em' }}>
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {/* 章节导航 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '2rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <button
                  onClick={() => setSelectedChapter(prev => Math.max(0, prev - 1))}
                  disabled={selectedChapter === 0}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: selectedChapter === 0 ? '#f3f4f6' : '#2563eb',
                    color: selectedChapter === 0 ? '#9ca3af' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: selectedChapter === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  ← 上一章
                </button>
                
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  {selectedChapter + 1} / {novel.chapterList.length}
                </div>
                
                <button
                  onClick={() => setSelectedChapter(prev => Math.min(novel.chapterList.length - 1, prev + 1))}
                  disabled={selectedChapter === novel.chapterList.length - 1}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: selectedChapter === novel.chapterList.length - 1 ? '#f3f4f6' : '#2563eb',
                    color: selectedChapter === novel.chapterList.length - 1 ? '#9ca3af' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: selectedChapter === novel.chapterList.length - 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  下一章 →
                </button>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>❤️</span>
              <span>喜欢 ({novel.likes})</span>
            </button>
            
            <a
              href="/novels/new"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>✏️</span>
              <span>续写新章节</span>
            </a>
            
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>💬</span>
              <span>评论</span>
            </button>
            
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>📋</span>
              <span>分享</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}