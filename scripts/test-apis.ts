#!/usr/bin/env tsx
// scripts/test-apis.ts - API端点测试脚本
import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3000'

async function testAPI(endpoint: string, method: string = 'GET', body?: any, headers?: Record<string, string>) {
  const url = `${BASE_URL}${endpoint}`
  const options: any = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }
  
  if (body) {
    options.body = JSON.stringify(body)
  }
  
  try {
    const response = await fetch(url, options)
    const data = await response.json().catch(() => ({}))
    
    return {
      success: response.ok,
      status: response.status,
      data: data as any,
      error: !response.ok ? (data as any).message || `HTTP ${response.status}` : null
    }
  } catch (error: any) {
    return {
      success: false,
      status: 0,
      data: null,
      error: error.message
    }
  }
}

async function runTests() {
  console.log('🧪 开始API端点测试...\n')
  
  let passed = 0
  let failed = 0
  
  // 1. 测试公开API端点
  console.log('📡 测试公开API端点:')
  
  // 获取所有小说
  const novelsResult = await testAPI('/api/novels')
  if (novelsResult.success) {
    console.log('  ✅ GET /api/novels - 成功')
    console.log(`     返回 ${novelsResult.data?.length || 0} 本小说`)
    passed++
  } else {
    console.log(`  ❌ GET /api/novels - 失败: ${novelsResult.error}`)
    failed++
  }
  
  // 获取特定小说
  const novelDetailResult = await testAPI('/api/novels/1')
  if (novelDetailResult.success) {
    console.log('  ✅ GET /api/novels/1 - 成功')
    passed++
  } else {
    console.log(`  ❌ GET /api/novels/1 - 失败: ${novelDetailResult.error}`)
    failed++
  }
  
  // 获取评论
  const commentsResult = await testAPI('/api/comments?novelId=1')
  if (commentsResult.success) {
    console.log('  ✅ GET /api/comments - 成功')
    console.log(`     返回 ${commentsResult.data?.length || 0} 条评论`)
    passed++
  } else {
    console.log(`  ❌ GET /api/comments - 失败: ${commentsResult.error}`)
    failed++
  }
  
  console.log('\n🔐 测试认证API端点:')
  
  // 用户登录
  const loginResult = await testAPI('/api/auth/login', 'POST', {
    username: '张三',
    password: 'password123'
  })
  
  let authToken = ''
  if (loginResult.success && loginResult.data?.token) {
    console.log('  ✅ POST /api/auth/login - 成功')
    authToken = loginResult.data.token
    passed++
  } else {
    console.log(`  ❌ POST /api/auth/login - 失败: ${loginResult.error}`)
    failed++
  }
  
  // 获取用户信息
  if (authToken) {
    const userInfoResult = await testAPI('/api/auth/me', 'GET', null, {
      'Authorization': `Bearer ${authToken}`
    })
    
    if (userInfoResult.success) {
      console.log('  ✅ GET /api/auth/me - 成功')
      console.log(`     用户: ${userInfoResult.data?.username}`)
      passed++
    } else {
      console.log(`  ❌ GET /api/auth/me - 失败: ${userInfoResult.error}`)
      failed++
    }
  }
  
  console.log('\n📚 测试用户相关API端点:')
  
  // 获取用户的小说
  if (authToken) {
    const myNovelsResult = await testAPI('/api/my-novels?author=张三', 'GET', null, {
      'Authorization': `Bearer ${authToken}`
    })
    
    if (myNovelsResult.success) {
      console.log('  ✅ GET /api/my-novels - 成功')
      console.log(`     返回 ${myNovelsResult.data?.length || 0} 本小说`)
      passed++
    } else {
      console.log(`  ❌ GET /api/my-novels - 失败: ${myNovelsResult.error}`)
      failed++
    }
  }
  
  console.log('\n👑 测试管理员API端点:')
  
  // 管理员登录
  const adminLoginResult = await testAPI('/api/auth/login', 'POST', {
    username: 'admin',
    password: 'admin123'
  })
  
  let adminToken = ''
  if (adminLoginResult.success && adminLoginResult.data?.token) {
    console.log('  ✅ POST /api/auth/login (admin) - 成功')
    adminToken = adminLoginResult.data.token
    passed++
  } else {
    console.log(`  ❌ POST /api/auth/login (admin) - 失败: ${adminLoginResult.error}`)
    failed++
  }
  
  // 获取所有用户
  if (adminToken) {
    const usersResult = await testAPI('/api/admin/users', 'GET', null, {
      'Authorization': `Bearer ${adminToken}`
    })
    
    if (usersResult.success) {
      console.log('  ✅ GET /api/admin/users - 成功')
      console.log(`     返回 ${usersResult.data?.length || 0} 个用户`)
      passed++
    } else {
      console.log(`  ❌ GET /api/admin/users - 失败: ${usersResult.error}`)
      failed++
    }
  }
  
  // 获取所有小说（管理员）
  if (adminToken) {
    const adminNovelsResult = await testAPI('/api/admin/novels', 'GET', null, {
      'Authorization': `Bearer ${adminToken}`
    })
    
    if (adminNovelsResult.success) {
      console.log('  ✅ GET /api/admin/novels - 成功')
      console.log(`     返回 ${adminNovelsResult.data?.length || 0} 本小说`)
      passed++
    } else {
      console.log(`  ❌ GET /api/admin/novels - 失败: ${adminNovelsResult.error}`)
      failed++
    }
  }
  
  // 获取所有评论（管理员）
  if (adminToken) {
    const adminCommentsResult = await testAPI('/api/admin/comments', 'GET', null, {
      'Authorization': `Bearer ${adminToken}`
    })
    
    if (adminCommentsResult.success) {
      console.log('  ✅ GET /api/admin/comments - 成功')
      console.log(`     返回 ${adminCommentsResult.data?.length || 0} 条评论`)
      passed++
    } else {
      console.log(`  ❌ GET /api/admin/comments - 失败: ${adminCommentsResult.error}`)
      failed++
    }
  }
  
  console.log('\n📊 测试结果汇总:')
  console.log(`  ✅ 通过: ${passed}`)
  console.log(`  ❌ 失败: ${failed}`)
  console.log(`  📈 成功率: ${((passed / (passed + failed)) * 100).toFixed(1)}%`)
  
  if (failed === 0) {
    console.log('\n🎉 所有API端点测试通过！')
    return true
  } else {
    console.log('\n⚠️  部分API端点测试失败，请检查问题。')
    return false
  }
}

// 运行测试
runTests().then(success => {
  process.exit(success ? 0 : 1)
}).catch(error => {
  console.error('❌ 测试脚本执行失败:', error)
  process.exit(1)
})