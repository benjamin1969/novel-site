#!/bin/bash
# complete-deployment.sh - 完整部署脚本

echo "🎯 小说平台完整部署流程"
echo "========================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}第1步：验证项目状态${NC}"
cd /mnt/d/novel-site || { echo -e "${RED}错误：项目目录不存在${NC}"; exit 1; }

# 检查必要的文件
required_files=("package.json" "next.config.js" ".env.example" "app/")
for file in "${required_files[@]}"; do
    if [ -e "$file" ]; then
        echo -e "  ✅ $file"
    else
        echo -e "  ❌ 缺少: $file"
    fi
done

echo ""
echo -e "${YELLOW}第2步：GitHub仓库设置${NC}"
echo "请手动创建GitHub仓库："
echo "1. 访问 https://github.com/new"
echo "2. 仓库名: novel-site"
echo "3. 描述: 小学生小说创作平台 - Cloudflare Pages + Neon.tech"
echo "4. 公开仓库，不要初始化任何文件"
echo ""
read -p "创建完成后按Enter继续..."

echo ""
echo -e "${YELLOW}第3步：配置Git并推送代码${NC}"

# 设置Git配置
git config --global user.name "benjamin1969"
git config --global user.email "snh@263.net"

# 设置远程仓库
if git remote | grep -q origin; then
    git remote remove origin
fi
git remote add origin https://github.com/benjamin1969/novel-site.git

echo "推送代码到GitHub..."
echo "请输入GitHub用户名：benjamin1969"
echo "请输入GitHub密码：Sunnianhui319410"
echo ""

# 尝试推送
git push -u origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 代码推送成功！${NC}"
else
    echo -e "${RED}❌ 推送失败${NC}"
    echo "请检查："
    echo "1. GitHub仓库是否已创建"
    echo "2. 凭据是否正确"
    echo "3. 网络连接"
    exit 1
fi

echo ""
echo -e "${YELLOW}第4步：Cloudflare Pages部署${NC}"
echo "请按照以下步骤操作："
echo ""
echo "1. 登录 Cloudflare: https://dash.cloudflare.com"
echo "   用户名: snh@263.net"
echo "   密码: sunnianhui@319410"
echo ""
echo "2. 进入 Workers & Pages → Pages → Create a project"
echo ""
echo "3. 连接GitHub，选择 novel-site 仓库"
echo ""
echo "4. 配置构建设置："
echo "   - Build command: npm run build"
echo "   - Build output directory: .next/standalone"
echo "   - Node.js version: 18"
echo ""
echo "5. 添加环境变量："
echo "   DATABASE_URL: postgresql://neondb_owner:npg_Awnt1qIMO4YS@ep-patient-frost-amrgdg0v-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
echo "   JWT_SECRET: (从.env文件复制)"
echo ""
echo "6. 保存并部署"
echo ""
echo -e "${GREEN}部署完成后，您的网站将在 https://novel-platform.pages.dev 可用${NC}"
echo ""
echo -e "${YELLOW}第5步：验证部署${NC}"
echo "部署完成后，请："
echo "1. 访问您的网站"
echo "2. 测试注册/登录功能"
echo "3. 测试小说创建和阅读"
echo "4. 检查数据库连接"

echo ""
echo -e "${GREEN}🎉 部署指南完成！${NC}"
echo "详细步骤请查看 CLOUDFLARE-DEPLOY-GUIDE.md"