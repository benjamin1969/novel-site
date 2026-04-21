#!/bin/bash

echo "=== 小说平台优化版部署包创建 ==="
echo ""

cd /mnt/d/novel-site/optimized-version

echo "1. 创建部署目录..."
DEPLOY_DIR="/tmp/novel-platform-deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

echo "2. 复制核心文件..."
# 复制package.json和配置文件
cp package.json "$DEPLOY_DIR/"
cp next.config.js "$DEPLOY_DIR/"
cp tsconfig.json "$DEPLOY_DIR/"
cp next-env.d.ts "$DEPLOY_DIR/"
cp .env.production "$DEPLOY_DIR/.env.local" 2>/dev/null || true

echo "3. 复制应用文件..."
# 创建目录结构
mkdir -p "$DEPLOY_DIR/app"
mkdir -p "$DEPLOY_DIR/app/api"
mkdir -p "$DEPLOY_DIR/app/lib"
mkdir -p "$DEPLOY_DIR/app/types"
mkdir -p "$DEPLOY_DIR/components"

# 复制app目录内容
find app -type f -name "*.ts" -o -name "*.tsx" -o -name "*.css" | while read file; do
  mkdir -p "$DEPLOY_DIR/$(dirname "$file")"
  cp "$file" "$DEPLOY_DIR/$file"
done

echo "4. 创建部署说明..."
cat > "$DEPLOY_DIR/DEPLOYMENT.md" << 'EOF'
# 小说平台优化版部署说明

## 项目概述
这是一个为小学生设计的简约小说创作平台，已优化用于Cloudflare Pages部署。

## 核心特性
- 用户认证系统（注册、登录）
- 小说创作与管理
- 章节系统
- 评论功能
- 管理员后台
- 简约朴素设计，适合5-6年级小学生

## 技术架构
- Next.js 14 (App Router)
- TypeScript
- 存储适配器模式（开发：localStorage，生产：Cloudflare KV）
- 静态导出 + API路由支持

## 部署到Cloudflare Pages

### 方法A：Web界面部署
1. 访问 https://dash.cloudflare.com/
2. 选择Pages -> "Create a project"
3. 选择"Direct upload"
4. 上传本目录的所有文件
5. 配置构建设置：
   - Build command: `npm run build`
   - Build output directory: `.next/standalone`
   - Root directory: `/`
6. 添加环境变量（可选）：
   - NODE_ENV: production
   - KV_STORE: [你的KV命名空间ID]

### 方法B：Wrangler CLI部署
```bash
# 安装wrangler
npm install -g wrangler

# 登录
wrangler login

# 创建KV命名空间
wrangler kv:namespace create "NOVEL_STORE"

# 部署
wrangler pages deploy . --project-name=novel-platform
```

## 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

## 默认测试账户
- 管理员: admin / admin
- 测试用户: testuser / test123

## 文件结构
- `app/` - Next.js应用代码
- `app/api/` - API路由
- `app/lib/` - 工具库和存储适配器
- `app/types/` - TypeScript类型定义
- `components/` - React组件

## 注意事项
1. 开发环境使用localStorage存储数据
2. 生产环境需要配置Cloudflare KV
3. 项目已配置为`output: 'standalone'`模式
4. 支持静态导出和API路由
EOF

echo "5. 创建一键部署脚本..."
cat > "$DEPLOY_DIR/deploy-cloudflare.sh" << 'EOF'
#!/bin/bash

echo "=== Cloudflare Pages一键部署脚本 ==="
echo ""

# 检查是否已登录
if ! command -v wrangler &> /dev/null; then
  echo "错误: 未找到wrangler命令"
  echo "请先安装: npm install -g wrangler"
  echo "然后登录: wrangler login"
  exit 1
fi

echo "1. 检查登录状态..."
wrangler whoami

echo ""
echo "2. 构建项目..."
npm run build

echo ""
echo "3. 部署到Cloudflare Pages..."
echo "请输入项目名称（默认: novel-platform）:"
read -r project_name
project_name=${project_name:-novel-platform}

wrangler pages deploy . --project-name="$project_name"

echo ""
echo "部署完成！"
echo "项目URL: https://${project_name}.pages.dev"
EOF

chmod +x "$DEPLOY_DIR/deploy-cloudflare.sh"

echo "6. 统计文件信息..."
echo ""
echo "部署包内容统计:"
find "$DEPLOY_DIR" -type f | wc -l | xargs echo "总文件数:"
find "$DEPLOY_DIR" -name "*.ts" -o -name "*.tsx" | wc -l | xargs echo "TypeScript文件:"
find "$DEPLOY_DIR" -name "*.ts" | wc -l | xargs echo "  .ts文件:"
find "$DEPLOY_DIR" -name "*.tsx" | wc -l | xargs echo "  .tsx文件:"
find "$DEPLOY_DIR/app/api -name "*.ts" | wc -l | xargs echo "API路由文件:"

echo ""
echo "=== 部署包创建完成 ==="
echo "位置: $DEPLOY_DIR"
echo ""
echo "下一步操作:"
echo "1. 检查部署包: ls -la $DEPLOY_DIR"
echo "2. 查看部署说明: cat $DEPLOY_DIR/DEPLOYMENT.md"
echo "3. 上传到Cloudflare Pages Web界面"
echo "4. 或运行: cd $DEPLOY_DIR && ./deploy-cloudflare.sh"
echo ""
echo "项目已准备好部署到Cloudflare Pages！"
