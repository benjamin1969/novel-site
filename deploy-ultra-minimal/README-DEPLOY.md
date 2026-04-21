# Cloudflare Pages 部署说明

## 超精简部署包
文件数量已大幅减少，适合直接上传。

## 部署步骤
1. 访问 https://dash.cloudflare.com/
2. 选择 Pages -> 创建项目 -> 直接上传
3. 上传此文件夹的所有内容
4. 配置：
   - 项目名称：novel-site
   - 生产分支：main
   - 构建设置：
     * 框架预设：Next.js
     * 构建命令：npm run build
     * 输出目录：.next
   - 环境变量：无需设置
5. 保存并部署

## 自定义域名
部署完成后，在项目设置中添加自定义域名：
- dskxx.ccwu.cc

## 注意事项
- 此包包含源代码，Cloudflare Pages会自动构建
- 使用内存存储，重启后数据会丢失
