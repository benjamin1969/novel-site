import { NextRequest, NextResponse } from 'next/server';
import { users, hashPassword, addUser } from '../cf-adapter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, displayName } = body;

    // 验证输入
    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码是必填项' },
        { status: 400 }
      );
    }

    // 验证用户名长度（支持中文，最少2个字符）
    const usernameLength = Array.from(username).length; // 正确计算字符数（包括中文）
    if (usernameLength < 2) {
      return NextResponse.json(
        { error: '用户名至少需要2个字符' },
        { status: 400 }
      );
    }

    // 验证用户名格式（允许中文、英文、数字和下划线）
    const usernameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: '用户名只能包含中文、英文、数字和下划线' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码至少需要6个字符' },
        { status: 400 }
      );
    }

    // 检查用户名是否已存在
    const existingUser = users.find(u => u.username === username);

    if (existingUser) {
      return NextResponse.json(
        { error: '用户名已被使用' },
        { status: 409 }
      );
    }

    // 哈希密码
    const hashedPassword = await hashPassword(password);

    // 创建用户
    const user = {
      id: `user_${Date.now()}`,
      username,
      password: hashedPassword,
      role: username === 'admin' ? 'ADMIN' : 'USER',
      createdAt: new Date().toISOString()
    };

    addUser(user);

    // 返回成功响应（不包含密码）
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { 
        success: true, 
        message: '注册成功！',
        user: userWithoutPassword
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
}