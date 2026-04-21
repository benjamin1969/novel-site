// 数据迁移脚本：从内存存储迁移到PostgreSQL
const { initDatabase, query } = require('../lib/db.ts');

// 导入内存数据（模拟）
const mockUsers = [
  { username: 'admin', password: 'admin123', email: 'admin@example.com', role: 'admin' },
  { username: 'testuser', password: 'test123', email: 'test@example.com', role: 'user' }
];

const mockNovels = [
  { title: '小学生冒险记', author: 'testuser', description: '一个有趣的冒险故事', status: 'published' },
  { title: '科学探索', author: 'admin', description: '探索科学奥秘', status: 'published' }
];

async function migrateData() {
  console.log('🚀 开始数据迁移...');
  
  try {
    // 1. 初始化数据库表结构
    await initDatabase();
    console.log('✅ 数据库表结构已初始化');
    
    // 2. 迁移用户数据
    console.log('📋 迁移用户数据...');
    for (const user of mockUsers) {
      await query(
        'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) ON CONFLICT (username) DO NOTHING',
        [user.username, user.password, user.email, user.role]
      );
    }
    console.log(`✅ 已迁移 ${mockUsers.length} 个用户`);
    
    // 3. 迁移小说数据
    console.log('📚 迁移小说数据...');
    for (const novel of mockNovels) {
      await query(
        'INSERT INTO novels (title, author, description, status) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [novel.title, novel.author, novel.description, novel.status]
      );
    }
    console.log(`✅ 已迁移 ${mockNovels.length} 本小说`);
    
    // 4. 验证迁移结果
    console.log('🔍 验证迁移结果...');
    
    const userCount = await query('SELECT COUNT(*) as count FROM users');
    const novelCount = await query('SELECT COUNT(*) as count FROM novels');
    
    console.log(`📊 数据库当前状态：
    - 用户数: ${userCount.rows[0].count}
    - 小说数: ${novelCount.rows[0].count}`);
    
    console.log('🎉 数据迁移完成！');
    
  } catch (error) {
    console.error('❌ 数据迁移失败:', error);
    process.exit(1);
  }
}

// 执行迁移
if (require.main === module) {
  migrateData();
}

module.exports = { migrateData };