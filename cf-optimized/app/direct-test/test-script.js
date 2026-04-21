
// 直接测试脚本 - 在浏览器控制台运行
console.log(=== 直接测试脚本 ===);

// 1. 检查localStorage
console.log(localStorage内容:);
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`${key}: ${value}`);
}

// 2. 模拟登录
function setZhangSanLogin() {
  localStorage.setItem(novel-site-username, 张三);
  localStorage.setItem(novel-site-loggedin, true);
  localStorage.setItem(user, JSON.stringify({
    id: user_test_123,
    username: 张三,
    role: USER,
    createdAt: new Date().toISOString()
  }));
  console.log(✅ 已设置张三登录);
}

// 3. 测试用户名提取
function testUsernameExtraction() {
  const possibleKeys = [novel-site-username, username, currentUser, user, name];
  let currentUsername = ;
  
  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);
    if (value && value.trim() && value.trim() !== 匿名用户) {
      if (key === user) {
        try {
          const userData = JSON.parse(value.trim());
          currentUsername = userData.username || userData.name || userData.displayName || ;
          console.log(`从JSON提取用户名: ${currentUsername} (键: ${key})`);
        } catch (e) {
          currentUsername = value.trim();
          console.log(`直接使用用户名: ${currentUsername} (键: ${key})`);
        }
      } else {
        currentUsername = value.trim();
        console.log(`找到用户名: ${currentUsername} (键: ${key})`);
      }
      break;
    }
  }
  
  if (!currentUsername) {
    console.log(❌ 未找到用户名);
  }
  
  return currentUsername;
}

// 4. 测试创建小说
async function testCreateNovel() {
  const username = testUsernameExtraction();
  if (!username) {
    console.log(❌ 请先设置登录);
    return;
  }
  
  const novelData = {
    title: 直接测试小说- + Date.now(),
    description: 这是直接测试小说,
    author: username,
    content: 这是直接测试内容...
  };
  
  console.log(发送数据:, novelData);
  
  try {
    const response = await fetch(/api/novels, {
      method: POST,
      headers: {Content-Type: application/json},
      body: JSON.stringify(novelData)
    });
    
    const result = await response.json();
    console.log(API响应:, result);
    
    if (response.ok) {
      console.log(✅ 小说创建成功);
      console.log(作者字段:, result.novel?.author);
    } else {
      console.log(❌ 创建失败:, result.error);
    }
  } catch (error) {
    console.log(❌ 请求失败:, error);
  }
}

// 5. 测试获取小说
async function testGetNovels() {
  try {
    const response = await fetch(/api/novels);
    const novels = await response.json();
    console.log(当前所有小说:);
    novels.slice(0, 5).forEach(novel => {
      console.log(`- 《${novel.title}》 by ${novel.author} (ID: ${novel.id})`);
    });
  } catch (error) {
    console.log(❌ 获取失败:, error);
  }
}

// 执行测试
console.log(n=== 执行测试 ===);
setZhangSanLogin();
testUsernameExtraction();
testCreateNovel();
setTimeout(testGetNovels, 1000);

