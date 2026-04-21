// 客户端数据存储（用于静态站点）
// 使用localStorage模拟服务器存储

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: string;
  mutedUntil?: string;
  muteReason?: string;
}

export interface Novel {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage?: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  novelId: string;
  title: string;
  content: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  novelId: string;
  chapterId?: string;
  author: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

class ClientStorage {
  private readonly USERS_KEY = 'novel_site_users';
  private readonly NOVELS_KEY = 'novel_site_novels';
  private readonly COMMENTS_KEY = 'novel_site_comments';
  private readonly SITE_CONFIG_KEY = 'novel_site_config';

  // 初始化默认数据
  constructor() {
    // 只在客户端初始化
    if (typeof window !== 'undefined') {
      this.initDefaultData();
    }
  }

  private initDefaultData() {
    // 安全检查：确保在客户端环境
    if (typeof window === 'undefined') return;
    
    // 初始化用户
    if (!localStorage.getItem(this.USERS_KEY)) {
      const defaultUsers: User[] = [
        {
          id: '1',
          username: 'admin',
          password: 'admin123',
          role: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          username: '张三',
          password: 'zhangsan123',
          role: 'user',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers));
    }

    // 初始化小说
    if (!localStorage.getItem(this.NOVELS_KEY)) {
      const defaultNovels: Novel[] = [
        {
          id: '1',
          title: '小学生冒险记',
          author: '张三',
          description: '一个关于小学生冒险的精彩故事',
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          chapters: [
            {
              id: '1',
              novelId: '1',
              title: '第一章：神秘的森林',
              content: '小明是一个普通的小学生，直到有一天他在学校后山发现了一片神秘的森林...',
              order: 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ]
        }
      ];
      localStorage.setItem(this.NOVELS_KEY, JSON.stringify(defaultNovels));
    }

    // 初始化评论
    if (!localStorage.getItem(this.COMMENTS_KEY)) {
      const defaultComments: Comment[] = [
        {
          id: '1',
          novelId: '1',
          author: '李四',
          content: '这个故事真有趣！',
          status: 'approved',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.COMMENTS_KEY, JSON.stringify(defaultComments));
    }

    // 初始化网站配置
    if (!localStorage.getItem(this.SITE_CONFIG_KEY)) {
      const defaultConfig = {
        siteName: '小学生小说创作平台',
        siteDescription: '专为小学生设计的简约小说创作平台',
        allowRegistration: true,
        allowComments: true,
        theme: 'light'
      };
      localStorage.setItem(this.SITE_CONFIG_KEY, JSON.stringify(defaultConfig));
    }
  }

  // 用户相关方法
  async findUser(username: string, password?: string): Promise<User | null> {
    const users = await this.getUsers();
    const user = users.find(u => 
      u.username === username && (!password || u.password === password)
    );
    return user || null;
  }

  async createUser(username: string, password: string): Promise<User> {
    const users = await this.getUsers();
    
    // 检查用户是否已存在
    if (users.some(u => u.username === username)) {
      throw new Error('用户已存在');
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
    return newUser;
  }

  async getUsers(): Promise<User[]> {
    if (typeof window === 'undefined') return [];
    const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    return users;
  }

  // 小说相关方法
  async getNovels(): Promise<Novel[]> {
    if (typeof window === 'undefined') return [];
    const novels = JSON.parse(localStorage.getItem(this.NOVELS_KEY) || '[]');
    return novels;
  }

  async getNovel(id: string): Promise<Novel | null> {
    const novels = await this.getNovels();
    return novels.find(n => n.id === id) || null;
  }

  async createNovel(novel: Omit<Novel, 'id' | 'createdAt' | 'updatedAt' | 'chapters'>): Promise<Novel> {
    const novels = await this.getNovels();
    const newNovel: Novel = {
      ...novel,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chapters: []
    };

    novels.push(newNovel);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.NOVELS_KEY, JSON.stringify(novels));
    }
    return newNovel;
  }

  // 评论相关方法
  async getComments(): Promise<Comment[]> {
    if (typeof window === 'undefined') return [];
    const comments = JSON.parse(localStorage.getItem(this.COMMENTS_KEY) || '[]');
    return comments;
  }

  async createComment(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    const comments = await this.getComments();
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    comments.push(newComment);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.COMMENTS_KEY, JSON.stringify(comments));
    }
    return newComment;
  }

  // 网站配置
  async getSiteConfig() {
    if (typeof window === 'undefined') return {};
    const config = JSON.parse(localStorage.getItem(this.SITE_CONFIG_KEY) || '{}');
    return config;
  }

  async updateSiteConfig(config: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.SITE_CONFIG_KEY, JSON.stringify(config));
    }
    return config;
  }
}

// 导出单例实例
export const clientStorage = new ClientStorage();

// 模拟API调用
export const api = {
  // 用户认证
  login: async (username: string, password: string) => {
    const user = await clientStorage.findUser(username, password);
    if (!user) throw new Error('用户名或密码错误');
    return { user, token: 'mock-token-' + Date.now() };
  },

  register: async (username: string, password: string) => {
    const user = await clientStorage.createUser(username, password);
    return { user, token: 'mock-token-' + Date.now() };
  },

  // 小说操作
  getNovels: () => clientStorage.getNovels(),
  getNovel: (id: string) => clientStorage.getNovel(id),
  createNovel: (novel: any) => clientStorage.createNovel(novel),

  // 评论操作
  getComments: () => clientStorage.getComments(),
  createComment: (comment: any) => clientStorage.createComment(comment),

  // 网站配置
  getSiteConfig: () => clientStorage.getSiteConfig(),
  updateSiteConfig: (config: any) => clientStorage.updateSiteConfig(config),

  // 用户管理
  getUsers: () => clientStorage.getUsers(),
};