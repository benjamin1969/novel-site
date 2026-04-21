#!/bin/bash

echo "=== 小说平台优化版部署脚本 ==="
echo ""

# 检查必要命令
check_command() {
  if ! command -v $1 &> /dev/null; then
    echo "错误: 未找到 $1 命令"
    echo "请安装: $2"
    exit 1
  fi
}

check_command "npm" "Node.js包管理器"
# check_command "wrangler" "Cloudflare Workers CLI (npm install -g wrangler)"

echo "1. 安装依赖..."
npm install

echo ""
echo "2. 构建项目..."
npm run build

echo ""
echo "3. 检查构建结果..."
if [ -d ".next" ]; then
  echo "✓ 构建成功: .next 目录已创建"
else
  echo "✗ 构建失败: .next 目录不存在"
  exit 1
fi

echo ""
echo "4. 创建部署包..."
DEPLOY_DIR="deploy-package"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# 复制必要文件
cp -r .next $DEPLOY_DIR/
cp -r app $DEPLOY_DIR/
cp -r public $DEPLOY_DIR/ 2>/dev/null || true
cp package.json $DEPLOY_DIR/
cp package-lock.json $DEPLOY_DIR/ 2>/dev/null || true
cp next.config.js $DEPLOY_DIR/
cp tsconfig.json $DEPLOY_DIR/
cp wrangler.toml $DEPLOY_DIR/

echo "✓ 部署包创建完成: $DEPLOY_DIR/"
echo "  文件数量: $(find $DEPLOY_DIR -type f | wc -l) 个"

echo ""
echo "=== 部署选项 ==="
echo ""
echo "A. 使用Cloudflare Pages Web界面部署:"
echo "   1. 登录 Cloudflare Dashboard"
echo "   2. 进入 Pages → 创建项目"
echo "   3. 选择'直接上传'"
echo "   4. 上传 $DEPLOY_DIR.tar.gz"
echo "   5. 配置构建命令: npm run build"
echo "   6. 配置输出目录: .next/standalone"
echo ""
echo "B. 使用Wrangler CLI部署:"
echo "   1. 确保已登录: npx wrangler login"
echo "   2. 创建KV命名空间: npx wrangler kv:namespace create \"KV_STORE\""
echo "   3. 更新wrangler.toml中的KV ID"
echo "   4. 部署: npx wrangler pages deploy $DEPLOY_DIR --project-name=novel-platform-optimized"
echo ""
echo "C. 本地测试:"
echo "   1. 启动开发服务器: npm run dev"
echo "   2. 访问: http://localhost:3000"
echo "   3. 测试API: http://localhost:3000/api/auth/login"

echo ""
echo "=== 重要提示 ==="
echo "1. 首次部署前需要创建Cloudflare KV命名空间"
echo "2. 更新wrangler.toml中的KV命名空间ID"
echo "3. 生产环境需要设置JWT_SECRET环境变量"
echo "4. 如果遇到522错误，尝试使用Edge Runtime配置"

# 创建压缩包
echo ""
read -p "是否创建部署压缩包? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  tar -czf $DEPLOY_DIR.tar.gz $DEPLOY_DIR/
  echo "✓ 压缩包创建完成: $DEPLOY_DIR.tar.gz"
  echo "  文件大小: $(du -h $DEPLOY_DIR.tar.gz | cut -f1)"
fi

echo ""
echo "部署准备完成！"