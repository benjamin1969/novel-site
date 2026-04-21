#!/bin/bash

# 小说网站部署到Cloudflare Pages脚本

echo "=== 开始部署小说网站到Cloudflare Pages ==="

# 1. 备份当前配置
echo "1. 备份当前配置..."
cp next.config.js next.config.js.backup
cp next.config.cf.js next.config.js

# 2. 安装依赖
echo "2. 安装依赖..."
npm install

# 3. 构建项目
echo "3. 构建项目..."
npm run build

# 4. 检查构建输出
echo "4. 检查构建输出..."
if [ -d ".next/standalone" ]; then
    echo "✅ 构建成功，找到standalone输出"
    ls -la .next/standalone/
else
    echo "❌ 构建失败，未找到standalone输出"
    exit 1
fi

# 5. 部署到Cloudflare Pages
echo "5. 部署到Cloudflare Pages..."
echo "请确保已经安装wrangler并登录："
echo "npm install -g wrangler"
echo "wrangler login"
echo ""
echo "然后运行："
echo "npx wrangler pages deploy .next/standalone --project-name=novel-platform"
echo ""
echo "或者使用API令牌部署："
echo "CLOUDFLARE_API_TOKEN=你的令牌 npx wrangler pages deploy .next/standalone --project-name=novel-platform"

# 6. 恢复配置
echo "6. 恢复配置..."
cp next.config.js.backup next.config.js

echo "=== 部署脚本完成 ==="
echo "请按照第5步的指示完成部署"