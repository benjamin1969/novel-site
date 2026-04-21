/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // Cloudflare Pages需要
  images: {
    domains: [],
  },
  // 优化构建输出
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Cloudflare Pages特定配置
  experimental: {
    // 启用服务器组件
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig