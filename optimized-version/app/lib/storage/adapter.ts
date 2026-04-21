import { User, Novel, Chapter, Comment } from '@/app/types'

export interface StorageAdapter {
  // 用户操作
  getUsers(): Promise<User[]>
  getUserById(id: string): Promise<User | null>
  getUserByUsername(username: string): Promise<User | null>
  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>
  updateUser(id: string, updates: Partial<User>): Promise<User | null>
  deleteUser(id: string): Promise<boolean>
  
  // 小说操作
  getNovels(): Promise<Novel[]>
  getNovelById(id: string): Promise<Novel | null>
  getNovelsByAuthor(authorId: string): Promise<Novel[]>
  createNovel(novel: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'>): Promise<Novel>
  updateNovel(id: string, updates: Partial<Novel>): Promise<Novel | null>
  deleteNovel(id: string): Promise<boolean>
  
  // 章节操作
  getChapters(novelId: string): Promise<Chapter[]>
  getChapterById(novelId: string, chapterId: string): Promise<Chapter | null>
  createChapter(chapter: Omit<Chapter, 'id' | 'createdAt' | 'updatedAt'>): Promise<Chapter>
  updateChapter(novelId: string, chapterId: string, updates: Partial<Chapter>): Promise<Chapter | null>
  deleteChapter(novelId: string, chapterId: string): Promise<boolean>
  
  // 评论操作
  getComments(novelId: string): Promise<Comment[]>
  getCommentById(id: string): Promise<Comment | null>
  createComment(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment>
  updateComment(id: string, updates: Partial<Comment>): Promise<Comment | null>
  deleteComment(id: string): Promise<boolean>
  
  // 初始化
  initialize(): Promise<void>
  
  // 统计数据
  getStats(): Promise<{
    totalUsers: number
    totalNovels: number
    totalChapters: number
    totalComments: number
  }>
}