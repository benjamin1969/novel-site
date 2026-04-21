#!/bin/bash
# deploy-to-cloudflare.sh - 部署到 Cloudflare Pages

set -e

echo "🚀 开始部署到 Cloudflare Pages..."

# 1. 切换到 Cloudflare Pages 配置
echo "📋 切换到 Cloudflare Pages 配置..."
cp next.config.cf.js next.config.js

# 2. 安装依赖
echo "📦 安装依赖..."
npm ci --only=production

# 3. 生成 Prisma 客户端
echo "🔧 生成 Prisma 客户端..."
npx prisma generate

# 4. 构建项目
echo "🏗️  构建项目..."
npm run build

# 5. 准备部署目录
echo "📁 准备部署目录..."
mkdir -p .next/standalone/.next/static
cp -r .next/static .next/standalone/.next/

# 6. 创建必要的运行时文件
echo "⚙️  创建运行时文件..."
cat > .next/standalone/package.json << 'EOF'
{
  "name": "novel-site",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "pg": "^8.13.3"
  }
}
EOF

# 7. 创建启动脚本
cat > .next/standalone/start.sh << 'EOF'
#!/bin/bash
export DATABASE_URL="$DATABASE_URL"
export JWT_SECRET="$JWT_SECRET"
export NODE_ENV="production"
node server.js
EOF
chmod +x .next/standalone/start.sh

echo "✅ 部署准备完成！"
echo ""
echo "📋 下一步："
echo "1. 将 .next/standalone 目录上传到 Cloudflare Pages"
echo "2. 在 Cloudflare Pages 中设置环境变量："
echo "   - DATABASE_URL: $DATABASE_URL"
echo "   - JWT_SECRET: novel-...2024"
echo "3. 构建命令: npm run build"
echo "4. 输出目录: .next/standalone"
echo "5. 根目录: /"
echo ""
echo "🌐 目标域名: dskxx.ccwu.cc"