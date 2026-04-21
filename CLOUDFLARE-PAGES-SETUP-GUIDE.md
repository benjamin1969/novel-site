# Cloudflare Pages 部署配置指南

## 步骤1：登录Cloudflare
1. 访问: https://dash.cloudflare.com
2. 用户名: `snh@263.net`
3. 密码: `sunnianhui@319410`

## 步骤2：创建Pages项目
1. 点击左侧菜单 "Workers & Pages"
2. 点击 "Create application" → "Pages"
3. 选择 "Connect to Git"

## 步骤3：连接GitHub仓库
1. 点击 "Connect GitHub" 按钮
2. 授权Cloudflare访问您的GitHub账户
3. 选择仓库: `benjamin1969/novel-site`
4. 点击 "Begin setup"

## 步骤4：配置构建设置
**重要：必须按以下配置**

### 项目名称
- Project name: `novel-platform` (或保持默认)

### 构建设置
- **Production branch**: `main`
- **Framework preset**: `None`
- **Build command**: `npm run build`
- **Build output directory**: `.next/standalone`
- **Root directory**: `/` (保持默认)

### 环境变量
点击 "Environment variables" → "Add variable"

添加以下变量：

| 变量名 | 值 | 描述 |
|--------|-----|------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_Awnt1qIMO4YS@ep-patient-frost-amrgdg0v-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | Neon.tech PostgreSQL数据库连接 |
| `JWT_SECRET` | `your-jwt-secret-key-here` | JWT签名密钥（从.env文件复制） |
| `NODE_ENV` | `production` | 环境变量 |
| `NEXT_PUBLIC_API_URL` | `/api` | API基础URL |

**注意**：`JWT_SECRET` 需要从您的 `.env` 文件中获取。

## 步骤5：高级设置
1. 点击 "Settings" → "Builds & deployments"
2. 确保以下配置：
   - Node.js version: `18`
   - Build caching: Enabled
   - Auto publishing: Enabled

## 步骤6：部署
1. 点击 "Save and Deploy"
2. 等待构建完成（约10-15分钟）

## 步骤7：验证部署
构建完成后，您将获得：
- **默认域名**: https://novel-platform.pages.dev
- **构建日志**: 可查看构建过程中的任何错误

## 步骤8：自定义域名（可选）
1. 点击 "Settings" → "Custom domains"
2. 点击 "Set up a custom domain"
3. 输入: `dskxx.ccwu.cc`
4. 按照DNS配置说明操作

## 故障排除

### 常见问题1：构建失败
**错误**: `next: not found`
**解决方案**: 确保 `package.json` 中有正确的依赖项

**错误**: `ENOENT: no such file or directory`
**解决方案**: 确保输出目录正确设置为 `.next/standalone`

### 常见问题2：运行时错误
**错误**: `DATABASE_URL is not defined`
**解决方案**: 确保环境变量已正确设置

### 常见问题3：API路由404
**解决方案**: 确保 `next.config.js` 配置正确支持API路由

## 验证清单
- [ ] GitHub仓库已连接
- [ ] 构建设置正确
- [ ] 环境变量已添加
- [ ] 构建成功
- [ ] 网站可访问

## 后续步骤
1. 测试网站功能
2. 配置自定义域名
3. 设置自动部署触发器
4. 监控网站性能

## 支持
- Cloudflare文档: https://developers.cloudflare.com/pages/
- Next.js部署指南: https://nextjs.org/docs/deployment
- 问题反馈: 检查构建日志获取详细信息

## 快速命令参考
```bash
# 本地测试构建
npm run build

# 检查输出目录
ls -la .next/standalone

# 本地运行生产版本
node .next/standalone/server.js
```

**重要提示**: 首次构建可能需要较长时间（10-15分钟），因为需要安装所有依赖项。