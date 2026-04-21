/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Cloudflare Pages 需要静态导出
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
  // 优化构建输出
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 重写规则 - 将API请求转发到单独的Worker
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.novel-platform.workers.dev/:path*',
      },
    ]
  },
}

module.exports = nextConfig