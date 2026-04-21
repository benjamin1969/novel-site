# 小说网站快速部署指南

## 当前状态
✅ 代码已推送到 GitHub: https://github.com/benjamin1969/novel-site
✅ Neon.tech 项目已创建
⏳ 等待配置 DATABASE_URL 并部署到 Vercel

## 立即执行的步骤

### 1. 获取 Neon.tech DATABASE_URL
1. 登录 [Neon.tech](https://neon.tech)
2. 进入你的项目
3. 点击左侧 "Connection Details"
4. 复制连接字符串，格式类似：
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

### 2. 部署到 Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 登录
3. 点击 "Add New..." → "Project"
4. 导入仓库: `benjamin1969/novel-site`
5. 配置项目：
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

6. **添加环境变量**：
   - 点击 "Environment Variables"
   - 添加新变量：
     - Name: `DATABASE_URL`
     - Value: 你的 Neon 连接字符串
   - 点击 "Add"

7. 点击 "Deploy"

### 3. 验证部署
部署完成后：
1. 访问 Vercel 提供的域名（如 `https://novel-site.vercel.app`）
2. 测试功能：
   - 注册新用户
   - 创建小说
   - 添加章节
   - 发表评论
   - 访问管理后台（使用管理员账号）

### 4. 后续优化
1. **自定义域名**（可选）：
   - 获取免费域名：dns.he.net
   - 配置 Cloudflare DNS
   - 在 Vercel 中添加自定义域名

2. **数据迁移**：
   - 运行迁移脚本将内存数据导入 PostgreSQL
   - 命令：`npm run db:migrate`

3. **监控和维护**：
   - 设置 Neon.tech 自动备份
   - 配置 Vercel 分析
   - 定期更新依赖

## 故障排除

### 数据库连接失败
1. 检查 `DATABASE_URL` 格式是否正确
2. 确保 Neon 数据库正在运行
3. 验证网络连接（某些地区可能需要 VPN）

### 构建失败
1. 检查 Vercel 构建日志
2. 确保 `package.json` 依赖正确
3. 验证 TypeScript 编译无错误

### 应用功能异常
1. 检查浏览器控制台错误
2. 验证 API 端点响应
3. 检查数据库表结构

## 联系支持
- GitHub Issues: https://github.com/benjamin1969/novel-site/issues
- Vercel 文档: https://vercel.com/docs
- Neon.tech 文档: https://neon.tech/docs

---
**部署时间估计**: 15-20分钟
**成本**: 完全免费（所有服务都有免费层）