# 小说网站部署指南

这是一个专为小学生设计的小说创作平台，使用 Next.js 14 + TypeScript + PostgreSQL 构建。

## 本地开发部署

### 1. 环境准备

```bash
# 克隆项目（如果从GitHub下载）
git clone <repository-url>
cd novel-site

# 安装依赖
npm install
```

### 2. 数据库设置

#### 使用 PostgreSQL 数据库

1. **安装 PostgreSQL**（如果还没有）：
   - Windows: 下载并安装 [PostgreSQL](https://www.postgresql.org/download/windows/)
   - macOS: `brew install postgresql`
   - Linux: `sudo apt install postgresql`

2. **创建数据库**：
```sql
CREATE DATABASE novel_site;
CREATE USER novel_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE novel_site TO novel_user;
```

3. **配置环境变量**：
复制 `.env.example` 为 `.env` 并修改：
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```env
DATABASE_URL="postgresql://novel_user:your_password@localhost:5432/novel_site"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
SITE_NAME="小学生小说创作平台"
SITE_DESCRIPTION="一个专为小学生设计的小说创作和分享平台"
```

### 3. 初始化数据库

```bash
# 生成 Prisma 客户端
npx prisma generate

# 推送数据库架构
npx prisma db push

# 创建管理员账号
npm run create-admin
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## Vercel 部署

### 1. 准备部署

1. **推送代码到 GitHub**：
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/novel-site.git
git push -u origin main
```

2. **在 Vercel 上导入项目**：
   - 访问 [Vercel](https://vercel.com)
   - 点击 "New Project"
   - 导入你的 GitHub 仓库
   - 配置环境变量（见下文）

### 2. 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| DATABASE_URL | `postgresql://...` | Neon 数据库连接字符串 |
| NEXTAUTH_SECRET | 随机字符串 | 使用 `openssl rand -base64 32` 生成 |
| NEXTAUTH_URL | 你的 Vercel 域名 | 如 `https://your-app.vercel.app` |
| SITE_NAME | 小学生小说创作平台 | 网站名称 |
| SITE_DESCRIPTION | 一个专为小学生设计的小说创作和分享平台 | 网站描述 |

### 3. 使用 Neon 数据库（免费）

1. **注册 Neon**：
   - 访问 [Neon](https://neon.tech)
   - 使用 GitHub 账号登录
   - 创建一个新项目

2. **获取连接字符串**：
   - 在 Neon 控制台找到连接字符串
   - 格式：`postgresql://username:password@ep-xxx.neon.tech/dbname`

3. **在 Vercel 中设置 DATABASE_URL**：
   - 使用 Neon 提供的连接字符串

4. **初始化数据库**：
```bash
# 本地连接远程数据库初始化
npx prisma db push
npm run create-admin
```

## 免费域名配置

### 1. Vercel 自定义域名

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的自定义域名（如 `novel.yourdomain.com`）
3. 按照提示配置 DNS 记录

### 2. 使用免费域名服务

推荐使用：
- **Freenom**: 提供免费的 `.tk`, `.ml`, `.ga`, `.cf`, `.gq` 域名
- **EU.org**: 免费的二级域名
- **GitHub Pages + Cloudflare**: 免费 CDN 和域名

## 架构说明

### 技术栈
- **前端**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **后端**: Next.js API Routes, Prisma ORM
- **数据库**: PostgreSQL (Neon)
- **认证**: NextAuth.js
- **部署**: Vercel

### 项目结构
```
novel-site/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React 组件
│   ├── lib/             # 工具函数
│   └── types/           # TypeScript 类型定义
├── prisma/              # 数据库模型和迁移
└── public/              # 静态资源
```

### 安全特性
1. 所有内容需要管理员审核后才能公开
2. 密码使用 bcrypt 加密存储
3. 会话使用 JWT 管理
4. 管理员操作需要权限验证
5. 输入验证和防 XSS 攻击

## 维护指南

### 备份数据库
```bash
# 使用 pg_dump 备份
pg_dump novel_site > backup_$(date +%Y%m%d).sql

# 从备份恢复
psql novel_site < backup_file.sql
```

### 更新依赖
```bash
npm update
npx prisma generate
```

### 监控日志
- Vercel 控制台查看部署日志
- Neon 控制台查看数据库性能
- 使用 Sentry 或 LogRocket 进行错误监控

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 DATABASE_URL 格式
   - 确认数据库服务运行中
   - 检查防火墙设置

2. **认证问题**
   - 确认 NEXTAUTH_SECRET 已设置
   - 检查 NEXTAUTH_URL 是否正确
   - 清除浏览器 cookies

3. **构建失败**
   - 检查 TypeScript 错误
   - 确认所有依赖已安装
   - 查看 Vercel 构建日志

### 获取帮助
- 查看 [Next.js 文档](https://nextjs.org/docs)
- 查看 [Prisma 文档](https://www.prisma.io/docs)
- 查看 [Vercel 文档](https://vercel.com/docs)
- 查看 [Neon 文档](https://neon.tech/docs)

## 功能清单

### 已完成功能
- [x] 用户注册/登录（用户名+密码）
- [x] 小说创建、编辑、删除
- [x] 章节管理
- [x] 评论系统
- [x] 内容审核系统
- [x] 管理员后台
- [x] 用户管理
- [x] 站点配置
- [x] 响应式设计
- [x] 高对比度视觉方案

### 待开发功能（可选）
- [ ] 小说分类和标签
- [ ] 点赞和收藏功能
- [ ] 阅读历史记录
- [ ] 导出小说为 PDF
- [ ] 多语言支持
- [ ] 移动端应用

## 性能优化

1. **数据库优化**
   - 为常用查询字段添加索引
   - 使用数据库连接池
   - 定期清理旧数据

2. **前端优化**
   - 图片懒加载
   - 代码分割
   - 缓存策略

3. **安全建议**
   - 定期更新依赖
   - 使用 HTTPS
   - 设置 CSP 头
   - 限制 API 请求频率

## 许可证

本项目采用 MIT 许可证。详见 LICENSE 文件。