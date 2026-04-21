#!/bin/bash
echo "=== 更新unified-data导入以适配Cloudflare Pages ==="

# 更新API路由
echo "1. 更新API路由..."

# 更新评论路由
sed -i 's|from ../unified-data|from ../cf-unified-data|g' app/api/comments/route.ts

# 更新小说路由
sed -i 's|from ../unified-data|from ../cf-unified-data|g' app/api/novels/route.ts

# 更新我的小说路由
sed -i 's|from ../unified-data|from ../cf-unified-data|g' app/api/my-novels/route.ts

# 更新小说详情路由
sed -i 's|from ../unified-data|from ../cf-unified-data|g' app/api/novels/\[id\]/route.ts

# 更新管理员小说路由
sed -i 's|from ../unified-data|from ../cf-unified-data|g' app/api/admin/novels/route.ts

# 更新管理员评论路由
sed -i 's|from ../unified-data|from ../cf-unified-data|g' app/api/admin/comments/route.ts

# 更新管理员评论详情路由
sed -i 's|from ../unified-data|from ../cf-unified-data|g' app/api/admin/comments/\[id\]/route.ts

# 更新管理员统计路由（已经更新了users，还需要更新novels和comments）
sed -i 's|from ../unified-data|from ../cf-unified-data|g' app/api/admin/stats/route.ts

echo "2. 验证更新..."
grep -r "from.*unified-data" app/api/ --include="*.ts" --include="*.tsx" || echo "所有文件已更新"

echo "=== 更新完成 ==="
echo "已更新所有使用unified-data的API路由"