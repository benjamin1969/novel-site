// 认证工具函数
'use client'

/**
 * 检查用户是否已登录
 * @returns 用户名（如果已登录）或空字符串（如果未登录）
 */
export function checkLogin(): string {
  // 尝试所有可能的键名来获取用户名
  const possibleKeys = [
    'novel-site-username',
    'username',
    'currentUser',
    'user',
    'name'
  ]
  
  for (const key of possibleKeys) {
    const value = localStorage.getItem(key)
    if (value && value.trim() && value.trim() !== '匿名用户') {
      // 特殊处理：如果键名是'user'，可能是JSON格式
      if (key === 'user') {
        try {
          const userData = JSON.parse(value.trim())
          // 尝试从JSON对象中提取用户名
          return userData.username || userData.name || userData.displayName || ''
        } catch (e) {
          return value.trim()
        }
      } else {
        return value.trim()
      }
    }
  }
  
  return ''
}

/**
 * 检查登录状态（包括登录标记）
 * @returns 是否已登录
 */
export function isLoggedIn(): boolean {
  // 先检查用户名
  const username = checkLogin()
  if (username) return true
  
  // 再检查登录标记
  const loginKeys = ['novel-site-loggedin', 'loggedin', 'isLoggedIn', 'login']
  for (const key of loginKeys) {
    const value = localStorage.getItem(key)
    if (value === 'true' || value === '1') {
      return true
    }
  }
  
  return false
}

/**
 * 重定向到登录页面
 */
export function redirectToLogin(): void {
  if (typeof window !== 'undefined') {
    // 保存当前页面以便登录后返回
    const currentPath = window.location.pathname + window.location.search
    if (currentPath !== '/login') {
      sessionStorage.setItem('redirectAfterLogin', currentPath)
    }
    
    window.location.href = '/login'
  }
}

/**
 * 检查并重定向未登录用户
 * @returns 用户名（如果已登录），否则重定向到登录页面
 */
export function requireLogin(): string {
  const username = checkLogin()
  if (!username && !isLoggedIn()) {
    redirectToLogin()
    return ''
  }
  return username
}

/**
 * 检查用户是否是作者（用于编辑权限）
 * @param author 小说的作者
 * @returns 是否有编辑权限
 */
export function canEditNovel(author: string): boolean {
  const username = checkLogin()
  if (!username) return false
  
  // 作者可以编辑自己的小说
  if (username === author) return true
  
  // 检查是否是管理员
  const adminKeys = ['novel-site-isAdmin', 'isAdmin', 'admin']
  for (const key of adminKeys) {
    const value = localStorage.getItem(key)
    if (value === 'true' || value === '1' || value === 'admin') {
      return true
    }
  }
  
  return false
}