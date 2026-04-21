// 文件存储用户数据
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const USERS_FILE = path.join(process.cwd(), 'users.json');

// 确保文件存在
function ensureUsersFile() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([
      {
        id: 'admin_1',
        username: 'admin',
        password: '60d38732b2eb787ee3fc0fa9e55dad34:91419e4c30e62b78760baebdbb18ea8b009e752d3987af7b0d79f1365fe0772094c34560b594dddce82f4e3297463236aabfaf9a9829f1d7bd6c88188d3a9e82',
        role: 'ADMIN',
        createdAt: new Date().toISOString()
      }
    ], null, 2));
  }
}

// 读取用户数据
export function readUsers(): any[] {
  ensureUsersFile();
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取用户数据失败:', error);
    return [];
  }
}

// 写入用户数据
export function writeUsers(users: any[]) {
  ensureUsersFile();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('写入用户数据失败:', error);
  }
}

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
  const users = readUsers();
  users.push(user);
  writeUsers(users);
  return user;
}

// 查找用户
export function findUserByUsername(username: string) {
  const users = readUsers();
  return users.find(u => u.username === username);
}