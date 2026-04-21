/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 关键配置：使用standalone输出以支持API路由
  // 注意：这可能导致Cloudflare Pages 522错误
  // 备选方案：使用output: 'export' + 单独的Worker处理API
  output: 'standalone',
  
  // 或者使用edge runtime（推荐用于Cloudflare Pages）
  // experimental: {
  //   runtime: 'edge',
  // },
  
  images: {
    unoptimized: true,
  },
  
  poweredByHeader: false,
  trailingSlash: false,
  
  // 允许API路由在静态导出时工作
  // 注意：API路由在静态导出时不会工作
  // 需要单独部署API Worker
  skipTrailingSlashRedirect: true,
  
  // 环境变量
  env: {
    // 这里可以添加环境变量
  },
  
  // 头部配置
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}

// 检查是否在Cloudflare Pages环境
const isCloudflarePages = process.env.CF_PAGES === '1'

if (isCloudflarePages) {
  console.log('检测到Cloudflare Pages环境')
  
  // 在Cloudflare Pages上，可能需要使用edge runtime
  // nextConfig.experimental = {
  //   ...nextConfig.experimental,
  //   runtime: 'edge',
  // }
}

module.exports = nextConfig