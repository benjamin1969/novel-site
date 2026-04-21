// 内存数据存储（临时方案）
// 在实际应用中，这些数据应该来自数据库

// 用户数据
export const users = [
  {
    id: 'admin_1',
    username: 'admin',
    password: '1c13a3ff2f0692687fe3e387ddf9427b:6914ea5a179d8b2f8dd3013e460ada5cc981dbd3e98a1c8b0c307a7760905d7a80ac71ba61f0178aefa58a1d60ddf993d13ca77bafe36c36004d8b35dd65ece0',
    role: 'ADMIN',
    createdAt: '2024-03-01T10:00:00Z',
    status: 'active'
  },
  {
    id: 'user_1',
    username: 'xiaohong',
    password: 'hash_for_xiaohong123',
    role: 'USER',
    createdAt: '2024-03-10T14:30:00Z',
    status: 'active'
  },
  {
    id: 'user_2',
    username: 'xiaoming',
    password: 'hash_for_xiaoming123',
    role: 'USER',
    createdAt: '2024-03-11T09:15:00Z',
    status: 'active'
  },
  {
    id: 'user_3',
    username: 'xiaohua',
    password: 'hash_for_xiaohua123',
    role: 'USER',
    createdAt: '2024-03-12T16:45:00Z',
    status: 'inactive'
  }
];

// 小说数据
export const novels = [
  {
    id: 'novel_1',
    title: '魔法森林的冒险',
    author: '小明',
    content: '这是一个关于魔法森林的故事...',
    views: 156,
    likes: 67,
    status: 'published',
    createdAt: '2024-03-10T10:00:00Z'
  },
  {
    id: 'novel_2',
    title: '太空探险记',
    author: '小红',
    content: '探索宇宙的奥秘...',
    views: 98,
    likes: 45,
    status: 'published',
    createdAt: '2024-03-11T14:30:00Z'
  },
  {
    id: 'novel_3',
    title: '海底两万里',
    author: '小华',
    content: '深海探险的故事...',
    views: 156,
    likes: 89,
    status: 'draft',
    createdAt: '2024-03-12T09:15:00Z'
  }
];

// 评论数据
export const comments = [
  {
    id: 'comment_1',
    novelId: 'novel_1',
    userId: 'user_2',
    username: 'xiaoming',
    content: '这个故事太精彩了！',
    status: 'approved',
    createdAt: '2024-03-10T11:30:00Z'
  },
  {
    id: 'comment_2',
    novelId: 'novel_1',
    userId: 'user_1',
    username: 'xiaohong',
    content: '我喜欢里面的魔法元素',
    status: 'approved',
    createdAt: '2024-03-10T15:45:00Z'
  },
  {
    id: 'comment_3',
    novelId: 'novel_2',
    userId: 'user_3',
    username: 'xiaohua',
    content: '太空旅行真有趣！',
    status: 'pending',
    createdAt: '2024-03-11T16:20:00Z'
  }
];

// 网站设置
export let siteConfig = {
  siteName: '简阅小说平台',
  siteDescription: '小学生专属的原创小说天地',
  maintenanceMode: false
};

// 访问统计
export let visitStats = {
  todayVisits: 24,
  yesterdayVisits: 16,
  totalVisits: 124
};

// 更新网站设置
export function updateSiteConfig(newConfig: any) {
  siteConfig = { ...siteConfig, ...newConfig };
  return siteConfig;
}

// 更新访问统计
export function incrementVisitCount() {
  visitStats.todayVisits += 1;
  visitStats.totalVisits += 1;
  return visitStats;
}

// 获取统计数据
export function getStats() {
  const activeUsers = users.filter(user => user.status === 'active').length;
  const publishedNovels = novels.filter(novel => novel.status === 'published').length;
  const approvedComments = comments.filter(comment => comment.status === 'approved').length;
  
  return {
    totalUsers: activeUsers,
    totalNovels: publishedNovels,
    totalComments: approvedComments,
    todayVisits: visitStats.todayVisits
  };
}

// 获取最近用户
export function getRecentUsers(limit = 4) {
  return users
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
    .map(user => ({
      id: user.id,
      username: user.username,
      email: `${user.username}@example.com`,
      joined: new Date(user.createdAt).toISOString().split('T')[0],
      status: user.status
    }));
}

// 获取最近小说
export function getRecentNovels(limit = 3) {
  return novels
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
    .map(novel => ({
      id: novel.id,
      title: novel.title,
      author: novel.author,
      views: novel.views,
      likes: novel.likes,
      status: novel.status
    }));
}