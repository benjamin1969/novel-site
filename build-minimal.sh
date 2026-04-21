#!/bin/bash
# build-minimal.sh - 构建最小化版本用于 Cloudflare Pages 部署

set -e

echo "🔧 构建最小化版本..."

# 1. 创建临时目录
TEMP_DIR=$(mktemp -d)
echo "临时目录: $TEMP_DIR"

# 2. 复制核心文件
echo "📁 复制核心文件..."
mkdir -p $TEMP_DIR/app
cp -r app/api $TEMP_DIR/app/
cp -r app/lib $TEMP_DIR/app/
cp -r app/components $TEMP_DIR/app/
cp -r app/hooks $TEMP_DIR/app/
cp -r app/utils $TEMP_DIR/app/
cp app/globals.css $TEMP_DIR/app/
cp app/layout.tsx $TEMP_DIR/app/
cp app/page.tsx $TEMP_DIR/app/

# 3. 复制核心页面（只保留必要的）
mkdir -p $TEMP_DIR/app/login
cp app/login/page.tsx $TEMP_DIR/app/login/
mkdir -p $TEMP_DIR/app/register
cp app/register/page.tsx $TEMP_DIR/app/register/
mkdir -p $TEMP_DIR/app/novels
cp app/novels/page.tsx $TEMP_DIR/app/novels/
mkdir -p $TEMP_DIR/app/admin
cp app/admin/page.tsx $TEMP_DIR/app/admin/
mkdir -p $TEMP_DIR/app/my-novels
cp app/my-novels/page.tsx $TEMP_DIR/app/my-novels/

# 4. 复制配置文件
cp package.json $TEMP_DIR/
cp package-lock.json $TEMP_DIR/
cp tsconfig.json $TEMP_DIR/
cp next.config.cf.js $TEMP_DIR/next.config.js
cp .env $TEMP_DIR/
cp prisma $TEMP_DIR/ -r

# 5. 清理不需要的测试目录
echo "🧹 清理测试目录..."
find $TEMP_DIR -type d -name "*test*" -exec rm -rf {} + 2>/dev/null || true
find $TEMP_DIR -type d -name "*diagnostic*" -exec rm -rf {} + 2>/dev/null || true
find $TEMP_DIR -type d -name "*fix*" -exec rm -rf {} + 2>/dev/null || true
find $TEMP_DIR -type d -name "*demo*" -exec rm -rf {} + 2>/dev/null || true

# 6. 进入临时目录构建
cd $TEMP_DIR
echo "📦 安装依赖..."
npm ci --only=production

echo "🔧 生成 Prisma 客户端..."
npx prisma generate

echo "🏗️  开始构建..."
NODE_OPTIONS="--max-old-space-size=4096" npx next build

echo "✅ 构建完成！"
echo "构建输出在: $TEMP_DIR/.next/standalone"

# 7. 复制回原目录
cd /mnt/d/novel-site
cp -r $TEMP_DIR/.next/standalone .next/ 2>/dev/null || true

echo ""
echo "🎯 最小化构建完成！"
echo "可以部署的目录: $TEMP_DIR/.next/standalone"