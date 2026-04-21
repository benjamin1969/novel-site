# Novel Site - Cloudflare Pages 优化版

## 部署说明
此版本已优化用于Cloudflare Pages：
- 使用静态导出 (output: 'export')
- 输出目录: 'out'
- 兼容Cloudflare Pages的构建系统

## 部署步骤
1. 在Cloudflare Pages创建新项目
2. 选择"直接上传"
3. 上传此文件夹所有内容
4. 构建设置：
   - 构建命令: npm run build
   - 输出目录: out
5. 部署后访问: https://[你的项目].pages.dev

## 注意事项
- API功能受限（需要额外配置边缘函数）
- 使用客户端存储（localStorage）替代服务器API
- 适合展示型网站
