/** @type {import('next').NextConfig} */
const nextConfig = {
  // 使用默认配置，Cloudflare Pages支持完整的Next.js功能
  reactStrictMode: true,
  
  // 配置图片优化
  images: {
    unoptimized: true, // Cloudflare Pages不支持Next.js图片优化
  },
  
  // 配置环境变量
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://novel-platform-api.sunlongyun1030.workers.dev',
  },
};

module.exports = nextConfig;