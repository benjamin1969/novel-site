/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 改为静态导出，兼容Cloudflare Pages
  output: 'export',
  images: {
    unoptimized: true, // 静态导出需要
  },
  // 优化构建输出
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 确保正确的基础路径
  basePath: '',
  // 禁用严格模式以兼容API路由
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig