import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 验证输入
    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码是必填项' },
        { status: 400 }
      );
    }

    // 使用数据库认证
    const user = await authenticateUser(username, password);

    if (!user) {
      return NextResponse.json(
        { error: '用户名或密码不正确' },
        { status: 401 }
      );
    }

    // 检查用户是否被禁言
    if (user.isMuted && user.mutedUntil) {
      const now = new Date();
      if (now < user.mutedUntil) {
        const remainingDays = Math.ceil((user.mutedUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return NextResponse.json(
          { 
            error: `用户已被禁言，剩余${remainingDays}天`,
            muted: true,
            mutedUntil: user.mutedUntil,
            muteReason: user.muteReason
          },
          { status: 403 }
        );
      }
    }

    // 返回成功响应
    return NextResponse.json(
      { 
        success: true, 
        message: '登录成功！',
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName || user.username,
          role: user.role,
          isMuted: user.isMuted,
          mutedUntil: user.mutedUntil,
          muteReason: user.muteReason,
          createdAt: user.createdAt
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}