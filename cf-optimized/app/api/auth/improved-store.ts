// 改进的内存存储
import crypto from 'crypto';

// 使用全局变量来避免热重载时数据丢失
declare global {
  var __users_store: any[] | undefined;
}

// 初始化用户数据存储（包含预定义用户）
const initialUsers = [
  // 预创建管理员用户
  {
    id: 'admin_1',
    username: 'admin',
    password: '60d38732b2eb787ee3fc0fa9e55dad34:91419e4c30e62b78760baebdbb18ea8b009e752d3987af7b0d79f1365fe0772094c34560b594dddce82f4e3297463236aabfaf9a9829f1d7bd6c88188d3a9e82', // admin123 的哈希
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    status: 'active',
    isMuted: false,
    mutedUntil: null,
    muteReason: null
  },
  // 预创建普通用户
  {
    id: 'user_1',
    username: 'xiaohong',
    password: 'e1f2d3c4b5a697887766554433221100:***', // xiaohong123 的哈希
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
    password: 'a1b2c3d4e5f678901234567890123456:***', // xiaoming123 的哈希
    role: 'USER',
    createdAt: new Date().toISOString(),
    status: 'active',
    isMuted: false,
    mutedUntil: null,
    muteReason: null
  }
];

// 使用全局存储，避免热重载时数据丢失
if (!global.__users_store) {
  global.__users_store = [...initialUsers];
}

export const users = global.__users_store;

// 简单的密码哈希函数
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

// 验证密码
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
}

// 添加用户
export function addUser(user: any) {
  users.push(user);
  return user;
}

// 查找用户
export function findUserByUsername(username: string) {
  return users.find(u => u.username === username);
}