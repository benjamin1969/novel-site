// 共享内存存储
import crypto from 'crypto';

// 用户数据存储
export const users: any[] = [
  // 预创建管理员用户
  {
    id: 'admin_1',
    username: 'admin',
    password: '60d38732b2eb787ee3fc0fa9e55dad34:91419e4c30e62b78760baebdbb18ea8b009e752d3987af7b0d79f1365fe0772094c34560b594dddce82f4e3297463236aabfaf9a9829f1d7bd6c88188d3a9e82', // admin123 的哈希
    role: 'ADMIN',
    createdAt: new Date().toISOString()
  }
];

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