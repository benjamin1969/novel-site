import { StorageAdapter } from './adapter'
import { User, Novel, Chapter, Comment } from '@/app/types'

// 默认数据
const DEFAULT_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin', // 实际应该存储hash
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    username: 'testuser',
    password: 'test123',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const DEFAULT_NOVELS: Novel[] = [
  {
    id: '1',
    title: '小明的冒险故事',
    author: 'testuser',
    authorId: '2',
    description: '一个关于勇气和友谊的冒险故事',
    status: 'published',
    chapters: [],
    tags: ['冒险', '友谊', '勇气'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const DEFAULT_CHAPTERS: Chapter[] = [
  {
    id: '1',
    novelId: '1',
    title: '第一章：神秘的开始',
    content: '在一个阳光明媚的早晨，小明醒来后发现窗外有一只奇怪的鸟...',
    order: 1,
    wordCount: 350,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const DEFAULT_COMMENTS: Comment[] = [
  {
    id: '1',
    novelId: '1',
    userId: '1',
    username: 'admin',
    content: '很有趣的故事开头！期待后续发展。',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export class LocalStorageAdapter implements StorageAdapter {
  private storageKey = {
    users: 'novel_platform_users',
    novels: 'novel_platform_novels',
    chapters: 'novel_platform_chapters',
    comments: 'novel_platform_comments'
  }

  async getCollection<T>(key: string, defaultValue: T[] = []): Promise<T[]> {
    return this.getItem(key, defaultValue)
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private getItem<T>(key: string, defaultValue: T[]): T[] {
    if (typeof window === 'undefined') {
      return [...defaultValue]
    }
    
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error(`读取${key}失败:`, error)
    }
    
    return [...defaultValue]
  }

  private setItem<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(`保存${key}失败:`, error)
    }
  }

  async initialize(): Promise<void> {
    // 确保有默认数据
    const users = this.getItem(this.storageKey.users, DEFAULT_USERS)
    const novels = this.getItem(this.storageKey.novels, DEFAULT_NOVELS)
    const chapters = this.getItem(this.storageKey.chapters, DEFAULT_CHAPTERS)
    const comments = this.getItem(this.storageKey.comments, DEFAULT_COMMENTS)
    
    this.setItem(this.storageKey.users, users)
    this.setItem(this.storageKey.novels, novels)
    this.setItem(this.storageKey.chapters, chapters)
    this.setItem(this.storageKey.comments, comments)
  }

  // 用户操作
  async getUsers(): Promise<User[]> {
    return this.getItem(this.storageKey.users, DEFAULT_USERS)
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
    this.setItem(this.storageKey.users, users)
    
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
    this.setItem(this.storageKey.users, users)
    
    return updatedUser
  }

  async deleteUser(id: string): Promise<boolean> {
    const users = await this.getUsers()
    const initialLength = users.length
    
    const filteredUsers = users.filter(user => user.id !== id)
    
    if (filteredUsers.length === initialLength) {
      return false
    }
    
    this.setItem(this.storageKey.users, filteredUsers)
    return true
  }

  // 小说操作
  async getNovels(): Promise<Novel[]> {
    return this.getItem(this.storageKey.novels, DEFAULT_NOVELS)
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
    this.setItem(this.storageKey.novels, novels)
    
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
    this.setItem(this.storageKey.novels, novels)
    
    return updatedNovel
  }

  async deleteNovel(id: string): Promise<boolean> {
    const novels = await this.getNovels()
    const initialLength = novels.length
    
    const filteredNovels = novels.filter(novel => novel.id !== id)
    
    if (filteredNovels.length === initialLength) {
      return false
    }
    
    this.setItem(this.storageKey.novels, filteredNovels)
    return true
  }

  // 章节操作
  async getChapters(novelId: string): Promise<Chapter[]> {
    const chapters = this.getItem(this.storageKey.chapters, DEFAULT_CHAPTERS)
    return chapters.filter(chapter => chapter.novelId === novelId)
  }

  async getChapterById(novelId: string, chapterId: string): Promise<Chapter | null> {
    const chapters = await this.getChapters(novelId)
    return chapters.find(chapter => chapter.id === chapterId) || null
  }

  async createChapter(chapterData: Omit<Chapter, 'id' | 'createdAt' | 'updatedAt'>): Promise<Chapter> {
    const chapters = this.getItem(this.storageKey.chapters, DEFAULT_CHAPTERS)
    
    const now = new Date().toISOString()
    const newChapter: Chapter = {
      ...chapterData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    }
    
    chapters.push(newChapter)
    this.setItem(this.storageKey.chapters, chapters)
    
    return newChapter
  }

  async updateChapter(novelId: string, chapterId: string, updates: Partial<Chapter>): Promise<Chapter | null> {
    const chapters = this.getItem(this.storageKey.chapters, DEFAULT_CHAPTERS)
    const chapter = chapters.find(c => c.id === chapterId && c.novelId === novelId)
    
    if (!chapter) return null
    
    const updatedChapter = {
      ...chapter,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    const index = chapters.findIndex(c => c.id === chapterId && c.novelId === novelId)
    chapters[index] = updatedChapter
    this.setItem(this.storageKey.chapters, chapters)
    
    return updatedChapter
  }

  async deleteChapter(novelId: string, chapterId: string): Promise<boolean> {
    const chapters = this.getItem(this.storageKey.chapters, DEFAULT_CHAPTERS)
    const initialLength = chapters.length
    
    const filteredChapters = chapters.filter(
      chapter => !(chapter.id === chapterId && chapter.novelId === novelId)
    )
    
    if (filteredChapters.length === initialLength) {
      return false
    }
    
    this.setItem(this.storageKey.chapters, filteredChapters)
    return true
  }

  // 评论操作
  async getComments(novelId: string): Promise<Comment[]> {
    const comments = this.getItem(this.storageKey.comments, DEFAULT_COMMENTS)
    return comments.filter(comment => comment.novelId === novelId)
  }

  async getCommentById(id: string): Promise<Comment | null> {
    const comments = this.getItem(this.storageKey.comments, DEFAULT_COMMENTS)
    return comments.find(comment => comment.id === id) || null
  }

  async createComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    const comments = this.getItem(this.storageKey.comments, DEFAULT_COMMENTS)
    
    const now = new Date().toISOString()
    const newComment: Comment = {
      ...commentData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    }
    
    comments.push(newComment)
    this.setItem(this.storageKey.comments, comments)
    
    return newComment
  }

  async updateComment(id: string, updates: Partial<Comment>): Promise<Comment | null> {
    const comments = this.getItem(this.storageKey.comments, DEFAULT_COMMENTS)
    const index = comments.findIndex(comment => comment.id === id)
    
    if (index === -1) return null
    
    const updatedComment = {
      ...comments[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    comments[index] = updatedComment
    this.setItem(this.storageKey.comments, comments)
    
    return updatedComment
  }

  async deleteComment(id: string): Promise<boolean> {
    const comments = this.getItem(this.storageKey.comments, DEFAULT_COMMENTS)
    const initialLength = comments.length
    
    const filteredComments = comments.filter(comment => comment.id !== id)
    
    if (filteredComments.length === initialLength) {
      return false
    }
    
    this.setItem(this.storageKey.comments, filteredComments)
    return true
  }

  // 统计数据
  async getStats(): Promise<{
    totalUsers: number
    totalNovels: number
    totalChapters: number
    totalComments: number
  }> {
    const users = await this.getUsers()
    const novels = await this.getNovels()
    const chapters = this.getItem(this.storageKey.chapters, DEFAULT_CHAPTERS)
    const comments = this.getItem(this.storageKey.comments, DEFAULT_COMMENTS)
    
    return {
      totalUsers: users.length,
      totalNovels: novels.length,
      totalChapters: chapters.length,
      totalComments: comments.length
    }
  }
}