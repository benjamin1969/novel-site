// 生产环境配置 - 专门用于 Cloudflare Pages
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Cloudflare Pages 需要 standalone 输出
  output: 'standalone',
  // 图片配置
  images: {
    unoptimized: true,
  },
  // 禁用 trailingSlash 重定向
  trailingSlash: false,
  // 基础路径
  basePath: '',
  // 确保 API 路由在构建时被处理
  skipTrailingSlashRedirect: true,
  // 优化构建输出
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 实验性功能
  experimental: {
    // 启用服务器组件
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig