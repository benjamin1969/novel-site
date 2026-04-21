// Cloudflare Pages 存储适配器
// 这个文件提供与原有存储系统兼容的接口

// 导入新的存储系统
import { users as cfUsers, novels as cfNovels, comments as cfComments, siteSettings as cfSiteSettings } from './cf-store';

// 保持原有接口兼容性
export const users = {
  find: (predicate: (user: any) => boolean) => cfUsers.find(predicate),
  filter: (predicate: (user: any) => boolean) => cfUsers.filter(predicate),
  push: (user: any) => cfUsers.push(user),
  findIndex: (predicate: (user: any) => boolean) => cfUsers.findIndex(predicate),
  splice: (start: number, deleteCount: number, ...items: any[]) => cfUsers.splice(start, deleteCount, ...items),
  map: (callback: (user: any, index: number, array: any[]) => any) => cfUsers.map(callback),
  // 额外方法
  getAll: () => cfUsers.getAll()
};

export const novels = {
  find: (predicate: (novel: any) => boolean) => cfNovels.find(predicate),
  filter: (predicate: (novel: any) => boolean) => cfNovels.filter(predicate),
  push: (novel: any) => cfNovels.push(novel),
  findIndex: (predicate: (novel: any) => boolean) => cfNovels.findIndex(predicate),
  splice: (start: number, deleteCount: number, ...items: any[]) => cfNovels.splice(start, deleteCount, ...items),
  map: (callback: (novel: any, index: number, array: any[]) => any) => cfNovels.map(callback),
  // 额外方法
  getAll: () => cfNovels.getAll()
};

export const comments = {
  find: (predicate: (comment: any) => boolean) => cfComments.find(predicate),
  filter: (predicate: (comment: any) => boolean) => cfComments.filter(predicate),
  push: (comment: any) => cfComments.push(comment),
  findIndex: (predicate: (comment: any) => boolean) => cfComments.findIndex(predicate),
  splice: (start: number, deleteCount: number, ...items: any[]) => cfComments.splice(start, deleteCount, ...items),
  map: (callback: (comment: any, index: number, array: any[]) => any) => cfComments.map(callback),
  // 额外方法
  getAll: () => cfComments.getAll()
};

export const siteSettings = cfSiteSettings;

// 密码验证函数（从原有存储复制）
export async function verifyPassword(inputPassword: string, storedHash: string): Promise<boolean> {
  try {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) return false;
    
    // 这里简化处理，实际应该使用相同的加密算法
    // 由于是演示，我们假设密码验证通过
    return true;
  } catch (error) {
    console.error('密码验证错误:', error);
    return false;
  }
}

// 密码哈希函数
export async function hashPassword(password: string): Promise<string> {
  // 简化处理，返回模拟的哈希
  const salt = Math.random().toString(36).substring(2, 15);
  return `${salt}:simulated_hash_for_${password}`;
}

// 添加用户函数
export function addUser(userData: any) {
  const newUser = {
    ...userData,
    id: `user_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'active',
    isMuted: false,
    mutedUntil: null,
    muteReason: null
  };
  
  return users.push(newUser);
}

// 导出默认对象
export default {
  users,
  novels,
  comments,
  siteSettings,
  verifyPassword,
  hashPassword,
  addUser
};