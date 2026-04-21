import { Pool } from 'pg';

// 从环境变量获取数据库连接字符串
const connectionString = process.env.DATABASE_URL;

// 创建数据库连接池（延迟初始化）
let pool: Pool | null = null;

function getPool() {
  if (!pool) {
    if (!connectionString) {
      console.error('❌ DATABASE_URL环境变量未设置');
      console.error('请在Vercel环境变量中设置DATABASE_URL');
      // 在开发环境中使用内存存储回退
      return null;
    }
    
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20, // 最大连接数
      idleTimeoutMillis: 30000, // 空闲连接超时时间
      connectionTimeoutMillis: 2000, // 连接超时时间
    });
  }
  return pool;
}

// 自动初始化数据库（首次查询时触发）
let isInitialized = false;
export async function ensureInitialized() {
  if (isInitialized) return;
  
  const currentPool = getPool();
  if (!currentPool) {
    console.warn('⚠️ 数据库连接未配置，使用内存存储');
    return;
  }
  
  try {
    await initDatabase();
    isInitialized = true;
    console.log('✅ 数据库自动初始化完成');
  } catch (error) {
    console.error('❌ 数据库自动初始化失败:', error instanceof Error ? error.message : String(error));
    // 继续运行，应用将在首次数据库操作时失败
  }
}

// 初始化数据库表结构
export async function initDatabase() {
  const currentPool = getPool();
  if (!currentPool) {
    throw new Error('数据库连接未配置，无法初始化');
  }
  
  const client = await currentPool.connect();
  
  try {
    // 创建用户表
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        role VARCHAR(20) DEFAULT 'user',
        is_muted BOOLEAN DEFAULT false,
        mute_until TIMESTAMP,
        mute_reason TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // 创建小说表
    await client.query(`
      CREATE TABLE IF NOT EXISTS novels (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        author VARCHAR(100) NOT NULL,
        description TEXT,
        cover_image VARCHAR(500),
        status VARCHAR(20) DEFAULT 'published',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        INDEX idx_author (author),
        INDEX idx_status (status)
      )
    `);

    // 创建章节表
    await client.query(`
      CREATE TABLE IF NOT EXISTS chapters (
        id SERIAL PRIMARY KEY,
        novel_id INTEGER REFERENCES novels(id) ON DELETE CASCADE,
        chapter_number INTEGER NOT NULL,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        is_draft BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(novel_id, chapter_number),
        INDEX idx_novel_id (novel_id),
        INDEX idx_is_draft (is_draft)
      )
    `);

    // 创建评论表
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        novel_id INTEGER REFERENCES novels(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        INDEX idx_novel_id (novel_id),
        INDEX idx_user_id (user_id),
        INDEX idx_status (status)
      )
    `);

    // 创建网站设置表
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        value TEXT,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // 插入默认管理员用户（如果不存在）
    await client.query(`
      INSERT INTO users (username, password, email, role)
      VALUES ('admin', 'admin123', 'admin@example.com', 'admin')
      ON CONFLICT (username) DO NOTHING
    `);

    console.log('✅ 数据库表结构初始化完成');
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    throw error;
  } finally {
    client.release();
  }
}

// 测试数据库连接
export async function testConnection() {
  const currentPool = getPool();
  if (!currentPool) {
    return {
      success: false,
      message: '数据库连接未配置'
    };
  }
  
  try {
    const client = await currentPool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    client.release();
    return {
      success: true,
      message: '数据库连接正常',
      currentTime: result.rows[0].current_time
    };
  } catch (error) {
    return {
      success: false,
      message: '数据库连接失败',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// 导出查询函数
export async function query(text: string, params?: any[]) {
  await ensureInitialized();
  const currentPool = getPool();
  
  if (!currentPool) {
    throw new Error('数据库连接未配置');
  }
  
  return currentPool.query(text, params);
}