/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用静态导出，适用于Cloudflare Pages
  output: 'standalone',
  
  // 启用严格模式
  reactStrictMode: true,
  
  // 配置图片优化
  images: {
    unoptimized: true, // Cloudflare Pages不支持Next.js图片优化
  },
  
  // 配置环境变量
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://novel-platform-api.sunlongyun1030.workers.dev',
  },
  
  // 配置headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // 重写规则，用于API代理
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://novel-platform-api.sunlongyun1030.workers.dev/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;