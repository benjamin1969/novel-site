#!/bin/bash
# production-build.sh - 生产环境构建脚本

set -e

echo "🚀 开始生产环境构建..."

# 1. 使用生产配置
echo "📋 切换到生产配置..."
cp next.config.production.js next.config.js

# 2. 清理之前的构建
echo "🧹 清理构建缓存..."
rm -rf .next 2>/dev/null || true

# 3. 安装生产依赖
echo "📦 安装生产依赖..."
npm ci --omit=dev

# 4. 生成 Prisma 客户端
echo "🔧 生成 Prisma 客户端..."
npx prisma generate

# 5. 构建项目（增加内存限制）
echo "🏗️  开始构建项目..."
NODE_OPTIONS="--max-old-space-size=4096" npx next build

# 6. 验证构建输出
echo "✅ 构建完成！检查输出..."
if [ -d ".next/standalone" ]; then
  echo "   ✓ standalone 目录已创建"
  ls -la .next/standalone/
else
  echo "   ✗ standalone 目录未找到，检查 .next/"
  ls -la .next/
fi

echo ""
echo "🎯 生产构建完成！"
echo "部署目录: .next/standalone"
echo "主文件: .next/standalone/server.js"