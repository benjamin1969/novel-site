// 统一的认证工具函数
'use client'

/**
 * 检查用户是否已登录（兼容新旧系统）
 * @returns 用户名（如果已登录）或空字符串（如果未登录）
 */
export function checkLogin(): string {
  // 尝试所有可能的键名来获取用户名
  const possibleKeys = [
    // 新系统
    'current_user', // JSON格式
    'auth_token',   // 令牌存在表示已登录
    
    // 旧系统
    'novel-site-username',
    'username',
    'currentUser',
    'user',
    'name'
  ]
  
  // 先检查新系统的current_user
  const currentUserStr = localStorage.getItem('current_user')
  if (currentUserStr) {
    try {
      const userData = JSON.parse(currentUserStr)
      // 尝试从JSON对象中提取用户名
      return userData.username || userData.name || userData.displayName || ''
    } catch (e) {
      // 如果不是JSON，直接返回
      return currentUserStr.trim()
    }
  }
  
  // 检查auth_token
  const authToken = localStorage.getItem('auth_token')
  if (authToken) {
    // 如果有token但没有user信息，返回默认用户名
    return '已登录用户'
  }
  
  // 检查旧系统的键名
  for (const key of possibleKeys.slice(2)) {
    const value = localStorage.getItem(key)
    if (value && value.trim() && value.trim() !== '匿名用户') {
      return value.trim()
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
  
  // 检查新系统的token
  const authToken = localStorage.getItem('auth_token')
  if (authToken) return true
  
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
  const loggedIn = isLoggedIn()
  
  if (!username && !loggedIn) {
    console.log('未登录，重定向到登录页面')
    redirectToLogin()
    return ''
  }
  
  // 如果有token但没有用户名，返回默认值
  if (!username && loggedIn) {
    return '已登录用户'
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

/**
 * 获取当前用户信息（新系统）
 * @returns 用户对象或null
 */
export function getCurrentUser(): any {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('current_user')
  return userStr ? JSON.parse(userStr) : null
}

/**
 * 检查是否已认证（新系统）
 * @returns 是否已认证
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('auth_token')
}

/**
 * 登录并设置认证信息（兼容新旧系统）
 */
export function setLoginInfo(username: string, isAdmin: boolean = false): void {
  if (typeof window === 'undefined') return
  
  // 设置新系统
  localStorage.setItem('current_user', JSON.stringify({ username, isAdmin }))
  localStorage.setItem('auth_token', 'token_' + Date.now())
  
  // 设置旧系统（兼容）
  localStorage.setItem('novel-site-username', username)
  localStorage.setItem('novel-site-loggedin', 'true')
  if (isAdmin) {
    localStorage.setItem('novel-site-isAdmin', 'true')
  }
}

/**
 * 登出（清除所有认证信息）
 */
export function logout(): void {
  if (typeof window === 'undefined') return
  
  // 清除新系统
  localStorage.removeItem('auth_token')
  localStorage.removeItem('current_user')
  
  // 清除旧系统
  localStorage.removeItem('novel-site-username')
  localStorage.removeItem('novel-site-loggedin')
  localStorage.removeItem('novel-site-isAdmin')
  localStorage.removeItem('username')
  localStorage.removeItem('loggedin')
  localStorage.removeItem('isAdmin')
  localStorage.removeItem('currentUser')
  localStorage.removeItem('user')
  localStorage.removeItem('name')
  localStorage.removeItem('login')
  
  // 重定向到首页
  window.location.href = '/'
}