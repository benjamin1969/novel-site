#!/bin/bash
# deploy-all.sh - 完整的部署脚本

echo "🚀 开始完整部署流程"
echo "======================"

# 1. 检查项目状态
echo "1. 检查项目状态..."
cd /mnt/d/novel-site

# 2. 配置Git凭据
echo "2. 配置Git凭据..."
cat > ~/.git-credentials << EOF
https://benjamin1969:Sunnianhui319410@github.com
EOF

# 3. 设置Git配置
git config --global user.name "benjamin1969"
git config --global user.email "snh@263.net"

# 4. 检查远程仓库
echo "3. 检查远程仓库..."
if git remote | grep -q origin; then
    echo "  远程仓库已配置"
else
    echo "  配置远程仓库..."
    git remote add origin https://github.com/benjamin1969/novel-site.git
fi

# 5. 尝试推送（如果仓库不存在，GitHub会提示）
echo "4. 尝试推送到GitHub..."
echo "   如果仓库不存在，请手动创建："
echo "   1. 访问 https://github.com/new"
echo "   2. 仓库名: novel-site"
echo "   3. 描述: 小学生小说创作平台 - Cloudflare Pages + Neon.tech"
echo "   4. 公开仓库"
echo "   5. 不要初始化任何文件"
echo ""
echo "   创建后按Enter继续..."
read -p "按Enter继续..."

# 6. 推送代码
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ 代码推送成功！"
else
    echo "❌ 推送失败，请检查："
    echo "   - GitHub仓库是否已创建"
    echo "   - 凭据是否正确"
    exit 1
fi

echo ""
echo "📦 部署流程完成！"
echo "下一步：连接Cloudflare Pages"