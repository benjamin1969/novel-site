// 统一数据存储 - 供前后端共享
// 使用全局变量避免热重载时数据丢失

declare global {
  var __novels_store: any[] | undefined;
  var __comments_store: any[] | undefined;
}

// 初始化一些示例数据
const initialNovels = [
  {
    id: 'novel_1',
    title: '小明的冒险',
    author: '小明',
    description: '这是一个关于小明冒险的故事...',
    views: 150,
    likes: 30,
    chapters: 3,
    status: 'published',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'novel_2',
    title: '小红的花园',
    author: '小红',
    description: '小红在她的花园里发现了神奇的花朵...',
    views: 89,
    likes: 25,
    chapters: 2,
    status: 'published',
    createdAt: '2024-01-20T14:45:00Z'
  },
  {
    id: 'novel_3',
    title: '未完成的故事',
    author: '小刚',
    description: '这是一个还在创作中的故事...',
    views: 12,
    likes: 5,
    chapters: 1,
    status: 'draft',
    createdAt: '2024-02-01T09:15:00Z'
  }
];

// 初始化一些示例评论数据
const initialComments = [
  {
    id: 'comment_1',
    novelId: 'novel_1',
    author: '小红',
    authorId: '小红',
    content: '这个故事真有趣！小明太勇敢了！',
    status: 'approved',
    likes: 5,
    createdAt: '2024-01-16T14:30:00Z',
    replies: []
  },
  {
    id: 'comment_2',
    novelId: 'novel_1',
    author: '小刚',
    authorId: '小刚',
    content: '我喜欢第三章的冒险情节，期待续集！',
    status: 'approved',
    likes: 3,
    createdAt: '2024-01-17T09:15:00Z',
    replies: []
  },
  {
    id: 'comment_3',
    novelId: 'novel_2',
    author: '小明',
    authorId: '小明',
    content: '花园里的花真漂亮，我也想要一个这样的花园！',
    status: 'approved',
    likes: 7,
    createdAt: '2024-01-21T16:45:00Z',
    replies: []
  },
  {
    id: 'comment_4',
    novelId: 'novel_1',
    author: '匿名用户',
    authorId: 'anonymous',
    content: '这个故事有点短，希望作者能写长一点。',
    status: 'approved',
    likes: 0,
    createdAt: '2024-02-02T11:20:00Z',
    replies: []
  }
];

// 使用全局存储，避免热重载时数据丢失
if (!global.__novels_store) {
  global.__novels_store = [...initialNovels];
}

if (!global.__comments_store) {
  global.__comments_store = [...initialComments];
}

// 导出函数
export const novels = {
  // 获取存储引用
  _store: () => global.__novels_store || [...initialNovels],
  
  // 获取所有小说
  getAll: () => [...(global.__novels_store || initialNovels)],
  
  // 获取已发布的小说
  getPublished: () => (global.__novels_store || initialNovels).filter(novel => novel.status === 'published'),
  
  // 根据ID获取小说
  getById: (id: string) => (global.__novels_store || initialNovels).find(novel => novel.id === id),
  
  // 添加小说
  add: (novel: any) => {
    if (!global.__novels_store) {
      global.__novels_store = [...initialNovels];
    }
    
    const newNovel = {
      ...novel,
      id: `novel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: novel.status || 'published', // 默认直接发布
      views: novel.views || 0,
      likes: novel.likes || 0,
      chapters: novel.chapters || 1 // 新小说默认有1章
    };
    
    global.__novels_store.push(newNovel);
    console.log(`新小说已添加: ${newNovel.title} by ${newNovel.author}, ID: ${newNovel.id}`);
    return newNovel;
  },
  
  // 更新小说
  update: (id: string, updates: any) => {
    if (!global.__novels_store) return null;
    
    const index = global.__novels_store.findIndex(novel => novel.id === id);
    if (index !== -1) {
      global.__novels_store[index] = { ...global.__novels_store[index], ...updates };
      return global.__novels_store[index];
    }
    return null;
  },
  
  // 删除小说
  delete: (id: string) => {
    if (!global.__novels_store) return false;
    
    const index = global.__novels_store.findIndex(novel => novel.id === id);
    if (index !== -1) {
      global.__novels_store.splice(index, 1);
      return true;
    }
    return false;
  },
  
  // 搜索小说
  search: (query: string) => {
    const store = global.__novels_store || initialNovels;
    const searchTerm = query.toLowerCase();
    return store.filter(novel => 
      novel.title.toLowerCase().includes(searchTerm) ||
      novel.author.toLowerCase().includes(searchTerm) ||
      (novel.description && novel.description.toLowerCase().includes(searchTerm)) ||
      (novel.content && novel.content.toLowerCase().includes(searchTerm))
    );
  },
  
  // 获取作者的小说
  getByAuthor: (author: string) => {
    const store = global.__novels_store || initialNovels;
    return store.filter(novel => novel.author === author);
  },
  
  // 获取统计信息
  getStats: () => {
    const store = global.__novels_store || initialNovels;
    return {
      total: store.length,
      published: store.filter(novel => novel.status === 'published').length,
      draft: store.filter(novel => novel.status === 'draft').length
    };
  }
};

// 评论相关函数
export const comments = {
  _store: () => global.__comments_store || [],
  
  getAll: () => [...(global.__comments_store || initialComments)],
  
  getApproved: () => [...(global.__comments_store || initialComments)], // 现在所有评论都是已发布的
  
  getByNovelId: (novelId: string) => (global.__comments_store || initialComments).filter(comment => comment.novelId === novelId),
  
  getByAuthor: (author: string) => (global.__comments_store || initialComments).filter(comment => comment.author === author),
  
  getById: (id: string) => (global.__comments_store || initialComments).find(comment => comment.id === id),
  
  add: (comment: any) => {
    if (!global.__comments_store) {
      global.__comments_store = [];
    }
    
    const newComment = {
      ...comment,
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: comment.status || 'pending',
      likes: comment.likes || 0,
      replies: comment.replies || []
    };
    
    global.__comments_store.push(newComment);
    return newComment;
  },
  
  update: (id: string, updates: any) => {
    if (!global.__comments_store) return null;
    
    const index = global.__comments_store.findIndex(comment => comment.id === id);
    if (index !== -1) {
      global.__comments_store[index] = { ...global.__comments_store[index], ...updates };
      return global.__comments_store[index];
    }
    return null;
  },
  
  delete: (id: string) => {
    if (!global.__comments_store) return false;
    
    const index = global.__comments_store.findIndex(comment => comment.id === id);
    if (index !== -1) {
      global.__comments_store.splice(index, 1);
      return true;
    }
    return false;
  },
  
  // 点赞评论
  like: (id: string) => {
    if (!global.__comments_store) return null;
    
    const index = global.__comments_store.findIndex(comment => comment.id === id);
    if (index !== -1) {
      global.__comments_store[index].likes = (global.__comments_store[index].likes || 0) + 1;
      return global.__comments_store[index];
    }
    return null;
  },
  
  // 获取评论统计
  getStats: () => {
    const store = global.__comments_store || initialComments;
    return {
      total: store.length,
      pending: store.filter(comment => comment.status === 'pending').length,
      approved: store.filter(comment => comment.status === 'approved').length,
      rejected: store.filter(comment => comment.status === 'rejected').length
    };
  }
};