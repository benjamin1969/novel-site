#!/bin/bash
# create-github-repo.sh - 创建GitHub仓库并推送代码

echo "🚀 GitHub仓库创建脚本"
echo "======================"

# 检查是否已安装gh CLI
if command -v gh &> /dev/null; then
    echo "✅ 检测到GitHub CLI (gh)"
    echo ""
    echo "使用GitHub CLI创建仓库..."
    
    # 使用gh创建仓库
    gh repo create novel-site --public --description "小学生小说创作平台 - Cloudflare Pages + Neon.tech" --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo "✅ 仓库创建并推送成功！"
        echo "🔗 仓库地址: https://github.com/$(gh api user | jq -r '.login')/novel-site"
    else
        echo "❌ 使用gh创建仓库失败，请手动创建"
        manual_creation
    fi
else
    echo "⚠️ 未安装GitHub CLI，请手动创建仓库"
    manual_creation
fi

function manual_creation() {
    echo ""
    echo "📝 手动创建GitHub仓库步骤:"
    echo "1. 访问 https://github.com/new"
    echo "2. 填写仓库信息:"
    echo "   - Repository name: novel-site"
    echo "   - Description: 小学生小说创作平台 - Cloudflare Pages + Neon.tech"
    echo "   - Public (公开)"
    echo "   - 不要初始化README、.gitignore或license"
    echo "3. 点击 'Create repository'"
    echo ""
    echo "4. 创建后，按照页面上的指示推送现有代码:"
    echo "   git remote add origin https://github.com/benjamin1969/novel-site.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "或者，如果您有GitHub个人访问令牌:"
    echo "   git remote add origin https://[YOUR_TOKEN]@github.com/benjamin1969/novel-site.git"
    echo "   git push -u origin main"
}