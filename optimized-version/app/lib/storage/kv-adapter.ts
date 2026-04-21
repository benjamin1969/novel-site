import { StorageAdapter } from './adapter'
import { User, Novel, Chapter, Comment } from '@/app/types'

// Cloudflare KV存储适配器
export class KVStorageAdapter implements StorageAdapter {
  constructor(private kv: KVNamespace) {}

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private async getCollection<T>(key: string, defaultValue: T[] = []): Promise<T[]> {
    try {
      const data = await this.kv.get(key, 'json')
      return data ? (data as T[]) : [...defaultValue]
    } catch (error) {
      console.error(`从KV读取${key}失败:`, error)
      return [...defaultValue]
    }
  }

  private async setCollection<T>(key: string, data: T[]): Promise<void> {
    try {
      await this.kv.put(key, JSON.stringify(data))
    } catch (error) {
      console.error(`保存到KV ${key}失败:`, error)
    }
  }

  async initialize(): Promise<void> {
    // 初始化默认数据（如果KV为空）
    const users = await this.getCollection('users')
    const novels = await this.getCollection('novels')
    const chapters = await this.getCollection('chapters')
    const comments = await this.getCollection('comments')

    // 如果没有数据，设置默认数据
    if (users.length === 0) {
      const defaultUsers: User[] = [
        {
          id: '1',
          username: 'admin',
          password: 'admin',
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      await this.setCollection('users', defaultUsers)
    }

    if (novels.length === 0) {
      const defaultNovels: Novel[] = [
        {
          id: '1',
          title: '欢迎来到小说平台',
          author: '系统',
          authorId: '1',
          description: '这是一个示例小说，展示平台功能',
          status: 'published',
          chapters: [],
          tags: ['示例', '欢迎'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      await this.setCollection('novels', defaultNovels)
    }
  }

  // 用户操作
  async getUsers(): Promise<User[]> {
    return this.getCollection('users')
  }

  async getUserById(id: string): Promise<User | null> {
    const users = await this.getUsers()
    return users.find(user => user.id === id) || null
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const users = await this.getUsers()
    return users.find(user => user.username === username) || null
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const users = await this.getUsers()
    
    // 检查用户名是否已存在
    if (users.some(u => u.username === userData.username)) {
      throw new Error('用户名已存在')
    }
    
    const now = new Date().toISOString()
    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    }
    
    users.push(newUser)
    await this.setCollection('users', users)
    
    return newUser
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const users = await this.getUsers()
    const index = users.findIndex(user => user.id === id)
    
    if (index === -1) return null
    
    const updatedUser = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    users[index] = updatedUser
    await this.setCollection('users', users)
    
    return updatedUser
  }

  async deleteUser(id: string): Promise<boolean> {
    const users = await this.getUsers()
    const initialLength = users.length
    
    const filteredUsers = users.filter(user => user.id !== id)
    
    if (filteredUsers.length === initialLength) {
      return false
    }
    
    await this.setCollection('users', filteredUsers)
    return true
  }

  // 小说操作
  async getNovels(): Promise<Novel[]> {
    return this.getCollection('novels')
  }

  async getNovelById(id: string): Promise<Novel | null> {
    const novels = await this.getNovels()
    return novels.find(novel => novel.id === id) || null
  }

  async getNovelsByAuthor(authorId: string): Promise<Novel[]> {
    const novels = await this.getNovels()
    return novels.filter(novel => novel.authorId === authorId)
  }

  async createNovel(novelData: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'>): Promise<Novel> {
    const novels = await this.getNovels()
    
    const now = new Date().toISOString()
    const newNovel: Novel = {
      ...novelData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    }
    
    novels.push(newNovel)
    await this.setCollection('novels', novels)
    
    return newNovel
  }

  async updateNovel(id: string, updates: Partial<Novel>): Promise<Novel | null> {
    const novels = await this.getNovels()
    const index = novels.findIndex(novel => novel.id === id)
    
    if (index === -1) return null
    
    const updatedNovel = {
      ...novels[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    novels[index] = updatedNovel
    await this.setCollection('novels', novels)
    
    return updatedNovel
  }

  async deleteNovel(id: string): Promise<boolean> {
    const novels = await this.getNovels()
    const initialLength = novels.length
    
    const filteredNovels = novels.filter(novel => novel.id !== id)
    
    if (filteredNovels.length === initialLength) {
      return false
    }
    
    await this.setCollection('novels', filteredNovels)
    return true
  }

  // 章节操作
  async getChapters(novelId: string): Promise<Chapter[]> {
    const chapters = await this.getCollection('chapters')
    return chapters.filter(chapter => chapter.novelId === novelId)
  }

  async getChapterById(novelId: string, chapterId: string): Promise<Chapter | null> {
    const chapters = await this.getChapters(novelId)
    return chapters.find(chapter => chapter.id === chapterId) || null
  }

  async createChapter(chapterData: Omit<Chapter, 'id' | 'createdAt' | 'updatedAt'>): Promise<Chapter> {
    const chapters = await this.getCollection('chapters')
    
    const now = new Date().toISOString()
    const newChapter: Chapter = {
      ...chapterData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    }
    
    chapters.push(newChapter)
    await this.setCollection('chapters', chapters)
    
    return newChapter
  }

  async updateChapter(novelId: string, chapterId: string, updates: Partial<Chapter>): Promise<Chapter | null> {
    const chapters = await this.getCollection('chapters')
    const chapter = chapters.find(c => c.id === chapterId && c.novelId === novelId)
    
    if (!chapter) return null
    
    const updatedChapter = {
      ...chapter,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    const index = chapters.findIndex(c => c.id === chapterId && c.novelId === novelId)
    chapters[index] = updatedChapter
    await this.setCollection('chapters', chapters)
    
    return updatedChapter
  }

  async deleteChapter(novelId: string, chapterId: string): Promise<boolean> {
    const chapters = await this.getCollection('chapters')
    const initialLength = chapters.length
    
    const filteredChapters = chapters.filter(
      chapter => !(chapter.id === chapterId && chapter.novelId === novelId)
    )
    
    if (filteredChapters.length === initialLength) {
      return false
    }
    
    await this.setCollection('chapters', filteredChapters)
    return true
  }

  // 评论操作
  async getComments(novelId: string): Promise<Comment[]> {
    const comments = await this.getCollection('comments')
    return comments.filter(comment => comment.novelId === novelId)
  }

  async getCommentById(id: string): Promise<Comment | null> {
    const comments = await this.getCollection('comments')
    return comments.find(comment => comment.id === id) || null
  }

  async createComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    const comments = await this.getCollection('comments')
    
    const now = new Date().toISOString()
    const newComment: Comment = {
      ...commentData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    }
    
    comments.push(newComment)
    await this.setCollection('comments', comments)
    
    return newComment
  }

  async updateComment(id: string, updates: Partial<Comment>): Promise<Comment | null> {
    const comments = await this.getCollection('comments')
    const index = comments.findIndex(comment => comment.id === id)
    
    if (index === -1) return null
    
    const updatedComment = {
      ...comments[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    comments[index] = updatedComment
    await this.setCollection('comments', comments)
    
    return updatedComment
  }

  async deleteComment(id: string): Promise<boolean> {
    const comments = await this.getCollection('comments')
    const initialLength = comments.length
    
    const filteredComments = comments.filter(comment => comment.id !== id)
    
    if (filteredComments.length === initialLength) {
      return false
    }
    
    await this.setCollection('comments', filteredComments)
    return true
  }

  // 统计数据
  async getStats(): Promise<{
    totalUsers: number
    totalNovels: number
    totalChapters: number
    totalComments: number
  }> {
    const [users, novels, chapters, comments] = await Promise.all([
      this.getUsers(),
      this.getNovels(),
      this.getCollection('chapters'),
      this.getCollection('comments')
    ])
    
    return {
      totalUsers: users.length,
      totalNovels: novels.length,
      totalChapters: chapters.length,
      totalComments: comments.length
    }
  }
}