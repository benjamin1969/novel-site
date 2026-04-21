// Cloudflare Pages 数据存储适配器
// 用于临时替代内存存储，支持迁移到 Cloudflare KV

// 模拟内存存储的接口
let usersStore: any[] = [];
let novelsStore: any[] = [];
let commentsStore: any[] = [];

// 初始化数据
const initialUsers = [
  {
    id: 'admin_1',
    username: 'admin',
    password: '60d38732b2eb787ee3fc0fa9e55dad34:91419e4c30e62b78760baebdbb18ea8b009e752d3987af7b0d79f1365fe0772094c34560b594dddce82f4e3297463236aabfaf9a9829f1d7bd6c88188d3a9e82',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    status: 'active',
    isMuted: false,
    mutedUntil: null,
    muteReason: null
  },
  {
    id: 'user_1',
    username: 'xiaohong',
    password: 'e1f2d3c4b5a697887766554433221100:***',
    role: 'USER',
    createdAt: new Date().toISOString(),
    status: 'active',
    isMuted: false,
    mutedUntil: null,
    muteReason: null
  },
  {
    id: 'user_2',
    username: 'xiaoming',
    password: 'a1b2c3d4e5f678901234567890123456:***',
    role: 'USER',
    createdAt: new Date().toISOString(),
    status: 'active',
    isMuted: false,
    mutedUntil: null,
    muteReason: null
  }
];

const initialNovels = [
  {
    id: '1',
    title: '小明的冒险',
    author: 'xiaoming',
    content: '这是一个关于小明冒险的故事...',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const initialComments = [
  {
    id: '1',
    novelId: '1',
    author: 'xiaohong',
    content: '这个故事真有趣！',
    status: 'approved',
    createdAt: new Date().toISOString()
  }
];

// 初始化存储
export function initializeStores() {
  if (usersStore.length === 0) {
    usersStore = [...initialUsers];
  }
  if (novelsStore.length === 0) {
    novelsStore = [...initialNovels];
  }
  if (commentsStore.length === 0) {
    commentsStore = [...initialComments];
  }
}

// 用户存储接口
export const users = {
  find: (predicate: (user: any) => boolean) => {
    initializeStores();
    return usersStore.find(predicate);
  },
  filter: (predicate: (user: any) => boolean) => {
    initializeStores();
    return usersStore.filter(predicate);
  },
  push: (user: any) => {
    initializeStores();
    usersStore.push(user);
    return user;
  },
  findIndex: (predicate: (user: any) => boolean) => {
    initializeStores();
    return usersStore.findIndex(predicate);
  },
  splice: (start: number, deleteCount: number, ...items: any[]) => {
    initializeStores();
    return usersStore.splice(start, deleteCount, ...items);
  },
  map: (callback: (user: any, index: number, array: any[]) => any) => {
    initializeStores();
    return usersStore.map(callback);
  },
  // 获取所有用户
  getAll: () => {
    initializeStores();
    return [...usersStore];
  }
};

// 小说存储接口
export const novels = {
  find: (predicate: (novel: any) => boolean) => {
    initializeStores();
    return novelsStore.find(predicate);
  },
  filter: (predicate: (novel: any) => boolean) => {
    initializeStores();
    return novelsStore.filter(predicate);
  },
  push: (novel: any) => {
    initializeStores();
    novelsStore.push(novel);
    return novel;
  },
  findIndex: (predicate: (novel: any) => boolean) => {
    initializeStores();
    return novelsStore.findIndex(predicate);
  },
  splice: (start: number, deleteCount: number, ...items: any[]) => {
    initializeStores();
    return novelsStore.splice(start, deleteCount, ...items);
  },
  map: (callback: (novel: any, index: number, array: any[]) => any) => {
    initializeStores();
    return novelsStore.map(callback);
  },
  // 获取所有小说
  getAll: () => {
    initializeStores();
    return [...novelsStore];
  }
};

// 评论存储接口
export const comments = {
  find: (predicate: (comment: any) => boolean) => {
    initializeStores();
    return commentsStore.find(predicate);
  },
  filter: (predicate: (comment: any) => boolean) => {
    initializeStores();
    return commentsStore.filter(predicate);
  },
  push: (comment: any) => {
    initializeStores();
    commentsStore.push(comment);
    return comment;
  },
  findIndex: (predicate: (comment: any) => boolean) => {
    initializeStores();
    return commentsStore.findIndex(predicate);
  },
  splice: (start: number, deleteCount: number, ...items: any[]) => {
    initializeStores();
    return commentsStore.splice(start, deleteCount, ...items);
  },
  map: (callback: (comment: any, index: number, array: any[]) => any) => {
    initializeStores();
    return commentsStore.map(callback);
  },
  // 获取所有评论
  getAll: () => {
    initializeStores();
    return [...commentsStore];
  }
};

// 网站设置存储
export const siteSettings = {
  siteTitle: '简阅小说平台',
  siteDescription: '小学生专属的原创小说天地',
  allowRegistration: true,
  allowComments: true,
  maintenanceMode: false
};

export default {
  users,
  novels,
  comments,
  siteSettings,
  initializeStores
};