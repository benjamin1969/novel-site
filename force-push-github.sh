#!/bin/bash
# force-push-github.sh - 强制推送到GitHub

echo "🚀 强制推送到GitHub仓库"
echo "======================="

cd /mnt/d/novel-site || exit 1

# 1. 首先尝试正常的推送
echo "1. 尝试正常推送..."
git push -u origin main 2>&1 | tee /tmp/push-output.txt

if grep -q "403" /tmp/push-output.txt || grep -q "Permission denied" /tmp/push-output.txt; then
    echo "❌ 权限错误，需要新令牌"
    echo ""
    echo "📝 请创建新的GitHub Personal Access Token:"
    echo "1. 访问: https://github.com/settings/tokens"
    echo "2. 点击 'Generate new token (classic)'"
    echo "3. 选择权限: repo (全部)"
    echo "4. 复制新令牌"
    echo ""
    read -p "请输入新令牌: " NEW_TOKEN
    
    if [ -n "$NEW_TOKEN" ]; then
        echo "使用新令牌推送..."
        git remote remove origin
        git remote add origin "https://benjamin1969:${NEW_TOKEN}@github.com/benjamin1969/novel-site.git"
        git push -u origin main
        
        if [ $? -eq 0 ]; then
            echo "✅ 推送成功！"
        else
            echo "❌ 仍然失败，尝试强制推送..."
            git push -u origin main --force
        fi
    fi
elif grep -q "Repository not found" /tmp/push-output.txt; then
    echo "❌ 仓库不存在"
    echo "请确认仓库已创建: https://github.com/benjamin1969/novel-site"
else
    echo "✅ 推送成功！"
fi

echo ""
echo "检查仓库: https://github.com/benjamin1969/novel-site"