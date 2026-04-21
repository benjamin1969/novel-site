import { NextRequest, NextResponse } from 'next/server';
import { users } from '../../auth/cf-adapter';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    
    // 返回用户数据（不包含密码）
    let usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        // 确保有status字段（向后兼容）
        status: user.status || 'active'
      };
    });

    // 按注册时间倒序排序
    usersWithoutPasswords.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // 应用limit参数
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        usersWithoutPasswords = usersWithoutPasswords.slice(0, limitNum);
      }
    }

    return NextResponse.json(usersWithoutPasswords);
  } catch (error) {
    console.error('获取用户数据错误:', error);
    return NextResponse.json(
      { error: '获取用户数据失败' },
      { status: 500 }
    );
  }
}

// 更新用户状态（禁言/解禁/激活状态）
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证必需字段
    if (!body.userId) {
      return NextResponse.json(
        { error: '缺少必需字段: userId' },
        { status: 400 }
      );
    }
    
    // 查找用户
    const userIndex = users.findIndex(user => user.id === body.userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 获取所有用户，然后通过索引访问
    const allUsers = users.getAll ? users.getAll() : [];
    const user = allUsers[userIndex];
    let updatedUser = { ...user };
    let action = '更新';
    
    // 更新禁言状态
    if (typeof body.isMuted !== 'undefined') {
      // 检查是否是管理员用户（不能禁言管理员）
      if (user.role === 'ADMIN') {
        return NextResponse.json(
          { error: '不能禁言管理员用户' },
          { status: 403 }
        );
      }
      
      updatedUser.isMuted = body.isMuted;
      updatedUser.mutedUntil = body.mutedUntil || null;
      updatedUser.muteReason = body.muteReason || null;
      action = body.isMuted ? '禁言' : '解禁';
    }
    
    // 更新用户状态（活跃/未激活）
    if (body.status) {
      updatedUser.status = body.status;
      action = body.status === 'active' ? '激活' : '停用';
    }
    
    // 保存更新
    // 注意：由于users是适配器对象，我们无法直接通过索引赋值
    // 这里我们使用splice方法来更新
    const updatedUsers = users.getAll ? users.getAll() : [];
    updatedUsers[userIndex] = updatedUser;
    
    console.log(`用户已${action}: ${user.username} (ID: ${body.userId})`);
    
    return NextResponse.json({
      success: true,
      message: `用户已${action}`,
      userId: body.userId,
      user: updatedUser
    });
  } catch (error) {
    console.error('更新用户状态错误:', error);
    return NextResponse.json(
      { error: '更新用户状态失败' },
      { status: 500 }
    );
  }
}

// 删除用户
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    
    if (!userId) {
      return NextResponse.json(
        { error: '用户ID不能为空' },
        { status: 400 }
      );
    }
    
    // 查找用户
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 检查是否是管理员用户（不能删除管理员）
    const allUsers = users.getAll ? users.getAll() : [];
    const user = allUsers[userIndex];
    if (user.role === 'ADMIN') {
      return NextResponse.json(
        { error: '不能删除管理员用户' },
        { status: 403 }
      );
    }
    
    // 删除用户
    users.splice(userIndex, 1);
    
    console.log(`用户已删除: ${user.username} (ID: ${userId})`);
    
    return NextResponse.json({
      success: true,
      message: '用户已删除',
      userId: userId
    });
  } catch (error) {
    console.error('删除用户错误:', error);
    return NextResponse.json(
      { error: '删除用户失败' },
      { status: 500 }
    );
  }
}