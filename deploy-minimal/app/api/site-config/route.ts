import { NextRequest, NextResponse } from 'next/server';

// 网站设置存储在内存中（服务器重启会重置）
let siteConfig = {
  siteName: '简阅小说平台',
  siteDescription: '小学生专属的原创小说天地',
  maintenanceMode: false
};

// 获取网站设置
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      config: siteConfig
    });
  } catch (error) {
    console.error('获取网站设置失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取网站设置失败'
    }, { status: 500 });
  }
}

// 更新网站设置
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证输入
    if (!body.siteName || !body.siteDescription) {
      return NextResponse.json({
        success: false,
        error: '网站名称和描述不能为空'
      }, { status: 400 });
    }
    
    // 更新配置
    siteConfig = {
      siteName: body.siteName.trim(),
      siteDescription: body.siteDescription.trim(),
      maintenanceMode: body.maintenanceMode || false
    };
    
    console.log('网站设置已更新:', siteConfig);
    
    return NextResponse.json({
      success: true,
      config: siteConfig,
      message: '网站设置已更新'
    });
  } catch (error) {
    console.error('更新网站设置失败:', error);
    return NextResponse.json({
      success: false,
      error: '更新网站设置失败'
    }, { status: 500 });
  }
}