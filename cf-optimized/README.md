# Novel Site 部署包

## 项目信息
- 框架: Next.js 14.2.0
- 构建命令: npm run build
- 输出目录: .next/standalone
- 存储: 内存存储（重启后数据丢失）

## 部署到Cloudflare Pages
1. 访问 https://dash.cloudflare.com/
2. Pages → 创建项目 → 直接上传
3. 上传此文件夹所有内容
4. 项目名称: novel-site
5. 构建设置会自动从wrangler.toml读取

## 自定义域名
部署后绑定: dskxx.ccwu.cc
