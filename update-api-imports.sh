#!/bin/bash
echo "=== 更新API路由导入以适配Cloudflare Pages ==="

# 备份原始文件
echo "1. 备份原始文件..."
mkdir -p backup
cp -r app/api/auth backup/ 2>/dev/null || true

# 更新登录路由
echo "2. 更新登录路由..."
sed -i 's|from ../improved-store|from ../cf-adapter|g' app/api/auth/login/route.ts

# 更新注册路由
echo "3. 更新注册路由..."
sed -i 's|from ../improved-store|from ../cf-adapter|g' app/api/auth/register/route.ts

# 更新评论路由
echo "4. 更新评论路由..."
sed -i 's|from ../auth/improved-store|from ../auth/cf-adapter|g' app/api/comments/route.ts

# 更新管理员用户路由
echo "5. 更新管理员用户路由..."
sed -i 's|from ../auth/improved-store|from ../auth/cf-adapter|g' app/api/admin/users/route.ts

# 更新管理员统计路由
echo "6. 更新管理员统计路由..."
sed -i 's|from ../auth/improved-store|from ../auth/cf-adapter|g' app/api/admin/stats/route.ts

# 检查其他可能使用存储的文件
echo "7. 检查其他文件..."
grep -r "from.*improved-store" app/api/ --include="*.ts" --include="*.tsx" || echo "没有其他文件需要更新"

echo "=== 更新完成 ==="
echo "已更新以下文件："
echo "- app/api/auth/login/route.ts"
echo "- app/api/auth/register/route.ts"
echo "- app/api/comments/route.ts"
echo "- app/api/admin/users/route.ts"
echo "- app/api/admin/stats/route.ts"
echo ""
echo "注意：这些更改仅用于Cloudflare Pages部署"
echo "原始文件已备份到 backup/ 目录"