/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 开发模式不使用静态导出
  // output: 'export', // 注释掉这行
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
}

module.exports = nextConfig