#!/bin/bash
cd /mnt/d/novel-site

# 清理可能的缓存
rm -rf .next 2>/dev/null || true

# 设置环境变量
export NODE_ENV=development
export NEXT_TELEMETRY_DISABLED=1

# 启动Next.js开发服务器
echo "正在启动Next.js开发服务器..."
npx next dev --port 3022 --hostname 0.0.0.0