# 小学生小说创作平台 📚

一个专为小学五年级学生设计的小说创作和分享平台，提供安全、友好的创作环境。

## ✨ 特色功能

### 🎯 专为小学生设计
- **简单易用**: 直观的界面，操作简单
- **安全环境**: 所有内容经过审核
- **高对比度**: 适合小学生的视觉方案
- **鼓励创作**: 激发想象力和写作兴趣

### 👥 用户功能
- **无需邮箱**: 使用用户名和密码注册
- **个人作品集**: 管理自己的小说和章节
- **评论互动**: 对章节进行评论交流
- **审核机制**: 内容审核确保适合性

### ⚙️ 管理功能
- **内容审核**: 审核用户提交的小说
- **用户管理**: 管理用户账号和权限
- **站点配置**: 自定义网站名称和描述
- **数据统计**: 查看网站运营数据

## 🚀 快速开始

### 本地开发

1. **克隆项目**
```bash
git clone <repository-url>
cd novel-site
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境**
```bash
cp .env.example .env
# 编辑 .env 文件，设置数据库连接
```

4. **初始化数据库**
```bash
npx prisma generate
npx prisma db push
npm run create-admin
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 http://localhost:3000

### 生产部署

详细部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🛠️ 技术栈

- **前端**: Next.js 14, TypeScript, Tailwind CSS
- **后端**: Next.js API Routes, Prisma ORM
- **数据库**: PostgreSQL (Neon)
- **认证**: NextAuth.js
- **部署**: Vercel
- **样式**: Radix UI, Lucide React

## 📁 项目结构

```
novel-site/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 认证页面
│   │   ├── admin/             # 管理后台
│   │   ├── api/               # API 路由
│   │   ├── my-novels/         # 个人作品
│   │   ├── novels/            # 小说相关
│   │   └── page.tsx           # 首页
│   ├── components/            # React 组件
│   ├── lib/                   # 工具函数
│   └── types/                 # TypeScript 类型
├── prisma/                    # 数据库模型
└── public/                    # 静态资源
```

## 🔐 安全特性

1. **内容安全**
   - 所有用户提交内容需要审核
   - 敏感词过滤
   - 防 XSS 攻击

2. **账户安全**
   - 密码加密存储 (bcrypt)
   - JWT 会话管理
   - 权限验证

3. **数据安全**
   - SQL 注入防护
   - 输入验证
   - 数据备份

## 🎨 设计理念

### 视觉设计
- **高对比度**: 使用清晰的颜色对比
- **大字体**: 适合小学生阅读
- **简单布局**: 减少认知负担
- **友好图标**: 使用直观的图标系统

### 用户体验
- **一步操作**: 尽量减少操作步骤
- **即时反馈**: 操作后立即显示结果
- **错误提示**: 友好的错误提示信息
- **进度显示**: 长时间操作显示进度

## 📊 数据模型

```prisma
User → Novel → Chapter → Comment
         ↓
      Review
```

- **User**: 用户信息
- **Novel**: 小说信息
- **Chapter**: 小说章节
- **Comment**: 章节评论
- **Review**: 内容审核记录

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Prisma](https://www.prisma.io/) - 数据库 ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Vercel](https://vercel.com/) - 部署平台
- [Neon](https://neon.tech/) - 数据库服务

## 📞 支持

如有问题或建议，请：
1. 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 中的故障排除
2. 提交 [Issue](https://github.com/yourusername/novel-site/issues)
3. 联系项目维护者

---

**让每个孩子都能成为小作家！** ✍️📖