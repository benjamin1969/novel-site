import { NextRequest, NextResponse } from 'next/server';
import { users, verifyPassword } from '../cf-adapter';

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

    // 查找用户
    const user = users.find(u => u.username === username);

    if (!user) {
      return NextResponse.json(
        { error: '用户名或密码不正确' },
        { status: 401 }
      );
    }

    // 验证密码
    const isValidPassword = await verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '用户名或密码不正确' },
        { status: 401 }
      );
    }

    // 返回成功响应（不包含密码）
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { 
        success: true, 
        message: '登录成功！',
        user: userWithoutPassword
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