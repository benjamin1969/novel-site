// 数据库连接测试脚本
// 使用方法：node test-db-connection.js

const { Pool } = require('pg');

async function testConnection() {
  // 从环境变量读取DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ 错误：未设置DATABASE_URL环境变量');
    console.log('请设置环境变量：');
    console.log('export DATABASE_URL="你的连接字符串"');
    console.log('或者创建.env.local文件');
    return;
  }
  
  console.log('🔗 测试数据库连接...');
  console.log(`连接字符串：${databaseUrl.substring(0, 50)}...`);
  
  try {
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    // 测试连接
    const client = await pool.connect();
    console.log('✅ 数据库连接成功！');
    
    // 获取PostgreSQL版本
    const result = await client.query('SELECT version()');
    console.log(`📊 PostgreSQL版本：${result.rows[0].version.split(',')[0]}`);
    
    // 创建测试表（如果不存在）
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ 测试表创建/验证完成');
    
    // 插入测试数据
    await client.query(
      'INSERT INTO test_table (message) VALUES ($1)',
      ['Hello from novel-site test!']
    );
    console.log('✅ 测试数据插入成功');
    
    // 查询测试数据
    const queryResult = await client.query('SELECT * FROM test_table ORDER BY id DESC LIMIT 5');
    console.log('📋 最近5条测试数据：');
    queryResult.rows.forEach((row, i) => {
      console.log(`  ${i+1}. ID: ${row.id}, 消息: "${row.message}", 时间: ${row.created_at}`);
    });
    
    client.release();
    await pool.end();
    console.log('🎉 所有测试通过！数据库连接正常。');
    
  } catch (error) {
    console.error('❌ 数据库连接失败：', error.message);
    console.error('详细错误：', error);
  }
}

testConnection();