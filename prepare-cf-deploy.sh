#!/bin/bash
echo "=== Cloudflare Pages 部署准备 ==="

# 检查必要文件
if [ ! -f "package.json" ]; then
    echo "错误: 找不到 package.json"
    exit 1
fi

echo "1. 安装依赖..."
npm install

echo "2. 使用Cloudflare配置构建..."
cp next.config.cf.js next.config.js

echo "3. 构建项目..."
npm run build

echo "4. 准备部署包..."
mkdir -p deploy
cp -r .next deploy/
cp package.json deploy/
cp next.config.js deploy/
cp -r app deploy/
cp -r public deploy/ 2>/dev/null || true

echo "5. 创建部署清单..."
cat > deploy/deploy-info.txt << EOF
Cloudflare Pages 部署信息
项目: 简阅小说平台
构建时间: $(date)
Next.js版本: 14.2.0

部署步骤:
1. 登录 Cloudflare Dashboard
2. 进入 Pages -> 创建项目
3. 选择"直接上传"
4. 上传整个 deploy 文件夹
5. 配置构建设置:
   - 构建命令: npm run build
   - 构建输出目录: .next
6. 保存并部署

注意事项:
- 首次部署可能需要几分钟
- 确保环境变量已配置
- 检查构建日志是否有错误
EOF

echo "=== 部署准备完成 ==="
echo "部署包已创建在 ./deploy 目录"
echo "请按照 deploy/deploy-info.txt 的说明进行部署"
echo ""
echo "重要: Cloudflare Pages 需要适配数据存储方式"
echo "当前使用内存存储，需要迁移到 Cloudflare KV"