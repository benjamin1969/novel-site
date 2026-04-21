// 共享数据模块 - 统一管理小说和评论数据
// 使用全局变量来避免热重载时数据丢失

declare global {
  var __novels_store: any[] | undefined;
  var __comments_store: any[] | undefined;
}

// 初始化小说数据
const initialNovels = [
  {
    id: 'novel_1',
    title: '小明的冒险',
    author: '小明',
    content: '这是一个关于小明冒险的故事...',
    views: 150,
    likes: 30,
    status: 'published',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'novel_2',
    title: '小红的花园',
    author: '小红',
    content: '小红在她的花园里发现了神奇的花朵...',
    views: 89,
    likes: 25,
    status: 'published',
    createdAt: '2024-01-20T14:45:00Z'
  },
  {
    id: 'novel_3',
    title: '未完成的故事',
    author: '小刚',
    content: '这是一个还在创作中的故事...',
    views: 12,
    likes: 5,
    status: 'draft',
    createdAt: '2024-02-01T09:15:00Z'
  },
  {
    id: 'novel_4',
    title: '太空探险',
    author: '小华',
    content: '一群小学生乘坐飞船探索太空...',
    views: 210,
    likes: 45,
    status: 'published',
    createdAt: '2024-01-25T16:20:00Z'
  },
  {
    id: 'novel_5',
    title: '海底世界',
    author: '小丽',
    content: '潜入深海，发现神秘的海底生物...',
    views: 95,
    likes: 28,
    status: 'published',
    createdAt: '2024-01-18T11:10:00Z'
  }
];

// 初始化评论数据
const initialComments = [
  {
    id: 'comment_1',
    novelId: 'novel_1',
    userId: 'user_1',
    username: '小红',
    content: '这个故事太精彩了！',
    status: 'approved',
    createdAt: '2024-01-16T09:30:00Z'
  },
  {
    id: 'comment_2',
    novelId: 'novel_1',
    userId: 'user_2',
    username: '小明',
    content: '期待续集！',
    status: 'approved',
    createdAt: '2024-01-17T14:20:00Z'
  },
  {
    id: 'comment_3',
    novelId: 'novel_2',
    userId: 'user_1',
    username: '小红',
    content: '花园里的花真漂亮',
    status: 'approved',
    createdAt: '2024-01-21T10:15:00Z'
  },
  {
    id: 'comment_4',
    novelId: 'novel_4',
    userId: 'user_2',
    username: '小明',
    content: '我也想去太空！',
    status: 'pending',
    createdAt: '2024-01-26T13:45:00Z'
  },
  {
    id: 'comment_5',
    novelId: 'novel_5',
    userId: 'user_1',
    username: '小红',
    content: '海底世界真神秘',
    status: 'approved',
    createdAt: '2024-01-19T16:30:00Z'
  },
  {
    id: 'comment_6',
    novelId: 'novel_3',
    userId: 'user_2',
    username: '小明',
    content: '什么时候更新？',
    status: 'pending',
    createdAt: '2024-02-02T11:20:00Z'
  }
];

// 使用全局存储，避免热重载时数据丢失
if (!global.__novels_store) {
  global.__novels_store = [...initialNovels];
}

if (!global.__comments_store) {
  global.__comments_store = [...initialComments];
}

export const novels = global.__novels_store;
export const comments = global.__comments_store;

// 小说相关函数
export function getNovelCount(): number {
  return novels.length;
}

export function getPublishedNovelCount(): number {
  return novels.filter(novel => novel.status === 'published').length;
}

export function deleteNovel(novelId: string): boolean {
  const initialLength = novels.length;
  const index = novels.findIndex(novel => novel.id === novelId);
  
  if (index !== -1) {
    novels.splice(index, 1);
    return true;
  }
  
  return false;
}

// 评论相关函数
export function getCommentCount(): number {
  return comments.length;
}

export function getApprovedCommentCount(): number {
  return comments.filter(comment => comment.status === 'approved').length;
}

export function deleteComment(commentId: string): boolean {
  const index = comments.findIndex(comment => comment.id === commentId);
  
  if (index !== -1) {
    comments.splice(index, 1);
    return true;
  }
  
  return false;
}