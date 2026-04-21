/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Cloudflare Pages需要静态导出
  output: 'export',
  // 静态导出配置
  images: {
    unoptimized: true,
  },
  // 禁用trailingSlash重定向
  trailingSlash: false,
  // 基础路径
  basePath: '',
  // 确保API路由在构建时被处理
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig