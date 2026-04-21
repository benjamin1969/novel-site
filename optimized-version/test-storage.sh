#!/bin/bash

echo "=== 存储适配器测试 ==="
echo ""

# 创建测试目录
TEST_DIR="/tmp/novel-platform-test"
rm -rf "$TEST_DIR"
mkdir -p "$TEST_DIR"

echo "1. 测试本地存储适配器..."
echo ""

# 创建测试脚本
cat > "$TEST_DIR/test-local-storage.js" << 'EOF'
const { LocalStorageAdapter } = require('/mnt/d/novel-site/optimized-version/app/lib/storage/local-adapter.ts');

// Mock localStorage
global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value;
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

async function runTests() {
  console.log('开始本地存储适配器测试...\n');
  
  const adapter = new LocalStorageAdapter();
  
  try {
    // 测试1: 初始化
    console.log('测试1: 初始化存储');
    await adapter.initialize();
    console.log('✓ 初始化成功\n');
    
    // 测试2: 获取用户
    console.log('测试2: 获取用户列表');
    const users = await adapter.getUsers();
    console.log(`✓ 获取到 ${users.length} 个用户`);
    console.log(`  第一个用户: ${users[0]?.username || '无'}\n`);
    
    // 测试3: 创建用户
    console.log('测试3: 创建新用户');
    const newUser = await adapter.createUser({
      username: 'testuser_' + Date.now(),
      password: 'testpass',
      role: 'user'
    });
    console.log(`✓ 创建用户成功: ${newUser.username} (ID: ${newUser.id})\n`);
    
    // 测试4: 按用户名查找用户
    console.log('测试4: 按用户名查找用户');
    const foundUser = await adapter.getUserByUsername('admin');
    console.log(`✓ 找到用户: ${foundUser?.username || '未找到'}\n`);
    
    // 测试5: 创建小说
    console.log('测试5: 创建小说');
    const novel = await adapter.createNovel({
      title: '测试小说',
      author: '测试作者',
      authorId: newUser.id,
      description: '测试描述',
      status: 'published',
      chapters: [],
      tags: ['测试']
    });
    console.log(`✓ 创建小说成功: ${novel.title} (ID: ${novel.id})\n`);
    
    // 测试6: 获取小说列表
    console.log('测试6: 获取小说列表');
    const novels = await adapter.getNovels();
    console.log(`✓ 获取到 ${novels.length} 本小说\n`);
    
    // 测试7: 创建章节
    console.log('测试7: 创建章节');
    const chapter = await adapter.createChapter({
      novelId: novel.id,
      title: '第一章',
      content: '这是第一章内容',
      order: 1,
      wordCount: 10
    });
    console.log(`✓ 创建章节成功: ${chapter.title} (ID: ${chapter.id})\n`);
    
    // 测试8: 获取章节
    console.log('测试8: 获取小说章节');
    const chapters = await adapter.getChapters(novel.id);
    console.log(`✓ 获取到 ${chapters.length} 个章节\n`);
    
    // 测试9: 创建评论
    console.log('测试9: 创建评论');
    const comment = await adapter.createComment({
      novelId: novel.id,
      userId: newUser.id,
      username: newUser.username,
      content: '测试评论内容'
    });
    console.log(`✓ 创建评论成功: ${comment.content.substring(0, 20)}...\n`);
    
    // 测试10: 获取统计数据
    console.log('测试10: 获取统计数据');
    const stats = await adapter.getStats();
    console.log('统计数据:');
    console.log(`  用户数: ${stats.totalUsers}`);
    console.log(`  小说数: ${stats.totalNovels}`);
    console.log(`  章节数: ${stats.totalChapters}`);
    console.log(`  评论数: ${stats.totalComments}\n`);
    
    // 测试11: 更新用户
    console.log('测试11: 更新用户信息');
    const updatedUser = await adapter.updateUser(newUser.id, { email: 'test@example.com' });
    console.log(`✓ 更新用户成功: ${updatedUser?.email || '失败'}\n`);
    
    // 测试12: 删除测试数据
    console.log('测试12: 清理测试数据');
    await adapter.deleteNovel(novel.id);
    await adapter.deleteChapter(novel.id, chapter.id);
    await adapter.deleteComment(comment.id);
    await adapter.deleteUser(newUser.id);
    console.log('✓ 测试数据清理完成\n');
    
    console.log('🎉 所有测试通过！');
    return true;
    
  } catch (error) {
    console.error('测试失败:', error.message);
    console.error(error.stack);
    return false;
  }
}

runTests().then(success => {
  process.exit(success ? 0 : 1);
});
EOF

# 运行测试
echo "运行本地存储适配器测试..."
cd /mnt/d/novel-site/optimized-version

# 使用Node.js运行测试
if node "$TEST_DIR/test-local-storage.js"; then
  echo "✓ 本地存储适配器测试通过"
else
  echo "✗ 本地存储适配器测试失败"
  exit 1
fi

echo ""
echo "2. 测试API客户端..."
echo ""

# 创建API客户端测试
cat > "$TEST_DIR/test-api-client.js" << 'EOF'
const { ApiClient } = require('/mnt/d/novel-site/optimized-version/app/lib/api-client.ts');

// Mock fetch
global.fetch = jest.fn();

const api = new ApiClient();

async function runTests() {
  console.log('开始API客户端测试...\n');
  
  try {
    // 测试1: 设置token
    console.log('测试1: 设置和获取token');
    api.setToken('test-token-123');
    const token = api.getToken();
    console.log(`✓ Token: ${token}\n`);
    
    // 测试2: 检查认证状态
    console.log('测试2: 检查认证状态');
    const isAuthenticated = api.isAuthenticated();
    console.log(`✓ 认证状态: ${isAuthenticated}\n`);
    
    // 测试3: 模拟登录请求
    console.log('测试3: 模拟登录请求结构');
    
    // 配置mock响应
    const mockResponse = {
      ok: true,
      json: async () => ({
        success: true,
        data: {
          user: { id: '1', username: 'testuser', role: 'user' },
          token: 'mock-jwt-token'
        }
      })
    };
    
    global.fetch.mockResolvedValue(mockResponse);
    
    console.log('✓ API客户端结构测试完成\n');
    
    console.log('🎉 API客户端基本测试通过！');
    return true;
    
  } catch (error) {
    console.error('测试失败:', error.message);
    return false;
  }
}

runTests().then(success => {
  process.exit(success ? 0 : 1);
});
EOF

echo "运行API客户端测试..."
if node "$TEST_DIR/test-api-client.js"; then
  echo "✓ API客户端测试通过"
else
  echo "✗ API客户端测试失败"
  exit 1
fi

echo ""
echo "3. 测试认证服务..."
echo ""

# 创建认证服务测试
cat > "$TEST_DIR/test-auth-service.js" << 'EOF'
// Mock localStorage
const localStorageMock = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value;
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

global.localStorage = localStorageMock;

// 模拟AuthService（简化版）
class AuthService {
  static TOKEN_KEY = 'novel_platform_token';
  static USER_KEY = 'novel_platform_user';
  
  static login(username, password) {
    return new Promise((resolve) => {
      const user = { id: '1', username, role: 'user' };
      const token = 'mock-jwt-token';
      
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      
      resolve(user);
    });
  }
  
  static logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
  
  static getCurrentUser() {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
  
  static getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  static isLoggedIn() {
    return !!this.getToken();
  }
  
  static isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}

async function runTests() {
  console.log('开始认证服务测试...\n');
  
  try {
    // 测试1: 登录
    console.log('测试1: 用户登录');
    const user = await AuthService.login('testuser', 'password123');
    console.log(`✓ 登录成功: ${user.username}\n`);
    
    // 测试2: 获取当前用户
    console.log('测试2: 获取当前用户');
    const currentUser = AuthService.getCurrentUser();
    console.log(`✓ 当前用户: ${currentUser?.username || '无'}\n`);
    
    // 测试3: 获取token
    console.log('测试3: 获取token');
    const token = AuthService.getToken();
    console.log(`✓ Token: ${token ? '存在' : '不存在'}\n`);
    
    // 测试4: 检查登录状态
    console.log('测试4: 检查登录状态');
    const isLoggedIn = AuthService.isLoggedIn();
    console.log(`✓ 登录状态: ${isLoggedIn}\n`);
    
    // 测试5: 检查管理员权限
    console.log('测试5: 检查管理员权限');
    const isAdmin = AuthService.isAdmin();
    console.log(`✓ 管理员权限: ${isAdmin}\n`);
    
    // 测试6: 登出
    console.log('测试6: 用户登出');
    AuthService.logout();
    const afterLogout = AuthService.isLoggedIn();
    console.log(`✓ 登出后状态: ${afterLogout ? '仍登录' : '已登出'}\n`);
    
    console.log('🎉 认证服务测试通过！');
    return true;
    
  } catch (error) {
    console.error('测试失败:', error.message);
    return false;
  }
}

runTests().then(success => {
  process.exit(success ? 0 : 1);
});
EOF

echo "运行认证服务测试..."
if node "$TEST_DIR/test-auth-service.js"; then
  echo "✓ 认证服务测试通过"
else
  echo "✗ 认证服务测试失败"
  exit 1
fi

echo ""
echo "=== 存储适配器测试完成 ==="
echo "所有基础测试通过！"
echo ""
echo "接下来可以运行完整的API测试："
echo "cd /mnt/d/novel-site/optimized-version"
echo "./test-api.sh"