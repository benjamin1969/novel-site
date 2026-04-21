# Cloudflare Pages 部署配置

## 部署步骤

### 1. 登录Cloudflare
- 访问: https://dash.cloudflare.com
- 用户名: snh@263.net
- 密码: sunnianhui@319410

### 2. 进入Pages
- 点击左侧菜单 "Workers & Pages"
- 点击 "Pages"
- 点击 "Create a project"

### 3. 连接GitHub
- 选择 "Connect to Git"
- 授权Cloudflare访问GitHub
- 选择仓库: `benjamin1969/novel-site`

### 4. 配置构建设置
- **项目名称**: `novel-platform` (或保持默认)
- **生产分支**: `main`
- **构建设置**:
  - **Framework preset**: `Next.js`
  - **Build command**: `npm run build`
  - **Build output directory**: `.next/standalone`
  - **Node.js version**: `18` (或更高)

### 5. 环境变量
点击 "Environment variables" 添加:

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_Awnt1qIMO4YS@ep-patient-frost-amrgdg0v-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | Neon.tech数据库 |
| `JWT_SECRET` | `novel-...2024` (从.env文件复制完整值) | JWT密钥 |
| `NODE_ENV` | `production` | 环境变量 |
| `NEXT_PUBLIC_SITE_NAME` | `简阅小说平台` | 网站名称 |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | `小学生专属的原创小说天地` | 网站描述 |

### 6. 保存并部署
- 点击 "Save and Deploy"
- 等待构建完成 (约5-10分钟)

### 7. 自定义域名 (可选)
- 项目部署后，进入 "Custom domains"
- 添加: `dskxx.ccwu.cc`
- 按照提示配置DNS

## 故障排除

### 构建失败
1. 检查构建日志中的错误
2. 确保package.json中的依赖正确
3. 检查Node.js版本兼容性

### 数据库连接失败
1. 验证DATABASE_URL格式
2. 检查Neon.tech数据库状态
3. 确保IP允许列表包含Cloudflare IP

### 应用运行时错误
1. 检查环境变量是否正确设置
2. 查看运行时日志
3. 验证API路由配置

## 监控
- **构建日志**: 在Cloudflare Pages项目页面查看
- **访问日志**: Cloudflare Analytics
- **错误监控**: 查看运行时错误日志

部署完成后，您的网站将在 `https://novel-platform.pages.dev` 可用。