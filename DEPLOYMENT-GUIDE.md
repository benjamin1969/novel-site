# 小说网站部署检查清单

## ✅ 第一阶段：GitHub仓库
- [ ] 创建GitHub账号
- [ ] 创建新仓库：novel-site
- [ ] 推送本地代码到GitHub

## ✅ 第二阶段：Neon.tech数据库
- [ ] 注册Neon.tech账号
- [ ] 创建新项目：novel-site-db
- [ ] 复制数据库连接字符串
- [ ] 执行SQL创建表结构

## ✅ 第三阶段：代码修改
- [ ] 安装pg依赖：`npm install pg`
- [ ] 创建lib/db.ts数据库连接
- [ ] 创建数据迁移脚本
- [ ] 修改API路由使用数据库
- [ ] 更新环境变量配置

## ✅ 第四阶段：Vercel部署
- [ ] 注册Vercel账号
- [ ] 导入GitHub仓库
- [ ] 配置环境变量（DATABASE_URL等）
- [ ] 更新vercel.json配置
- [ ] 更新package.json脚本

## ✅ 第五阶段：域名设置
- [ ] 注册dns.he.net账号
- [ ] 获取免费域名
- [ ] 注册Cloudflare账号
- [ ] 添加域名到Cloudflare
- [ ] 配置DNS记录（CNAME到Vercel）
- [ ] 在Vercel添加自定义域名

## ✅ 第六阶段：部署验证
- [ ] 提交代码到GitHub
- [ ] 检查Vercel自动部署
- [ ] 验证网站可访问
- [ ] 测试API端点
- [ ] 测试数据库连接
- [ ] 测试用户登录/注册
- [ ] 测试小说创建功能

## 🔧 故障排除
1. **数据库连接失败**
   - 检查DATABASE_URL环境变量
   - 验证Neon数据库状态
   - 检查防火墙设置

2. **Vercel构建失败**
   - 检查构建日志
   - 验证依赖项
   - 检查TypeScript错误

3. **域名无法访问**
   - 检查DNS传播（等待24-48小时）
   - 验证Cloudflare代理状态
   - 检查Vercel域名配置

## 📞 支持资源
- Vercel文档：https://vercel.com/docs
- Neon文档：https://neon.tech/docs
- Cloudflare文档：https://developers.cloudflare.com
- Next.js部署指南：https://nextjs.org/docs/deployment

## 🚀 高级功能（可选）
- [ ] 设置自动备份
- [ ] 配置监控和告警
- [ ] 启用CDN缓存
- [ ] 设置SSL证书
- [ ] 配置邮件服务