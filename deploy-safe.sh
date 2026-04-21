#!/bin/bash
# deploy-safe.sh - 安全部署脚本，无硬编码凭据

echo "🚀 开始安全部署流程"
echo "========================"

# 1. 检查项目状态
echo "1. 检查项目状态..."
cd /mnt/d/novel-site

# 2. 设置Git配置（使用环境变量或提示用户）
echo "2. 设置Git配置..."
echo "请确保已配置Git凭据："
echo "  git config --global user.name '您的用户名'"
echo "  git config --global user.email '您的邮箱'"
echo "  git remote set-url origin https://github.com/benjamin1969/novel-site.git"

# 3. 检查远程仓库
echo "3. 检查远程仓库..."
if git remote | grep -q origin; then
    echo "  远程仓库已配置"
else
    echo "  配置远程仓库..."
    git remote add origin https://github.com/benjamin1969/novel-site.git
fi

# 4. 添加所有更改
echo "4. 添加更改..."
git add .

# 5. 提交更改
echo "5. 提交更改..."
git commit -m "修复动态部署配置，确保完整Next.js功能" || echo "无更改可提交"

# 6. 推送到GitHub
echo "6. 推送到GitHub..."
echo "注意：这将触发GitHub Actions自动部署到Cloudflare Pages"
git push origin dynamic-deploy-fix

if [ $? -eq 0 ]; then
    echo "✅ 代码推送成功！"
    echo ""
    echo "📋 下一步："
    echo "1. 访问 https://github.com/benjamin1969/novel-site/actions"
    echo "2. 查看部署状态"
    echo "3. 部署完成后访问：https://novel-platform-f3a.pages.dev"
else
    echo "❌ 推送失败，请检查："
    echo "   - GitHub凭据是否正确"
    echo "   - 网络连接是否正常"
    exit 1
fi

echo ""
echo "🎉 部署流程完成！GitHub Actions将自动构建和部署动态Next.js应用。"