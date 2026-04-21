import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { muteUser, unmuteUser } from '@/app/lib/auth';

// GET /api/admin/users - 获取所有用户（管理员用）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    
    // 获取所有用户（不包含密码）
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        isMuted: true,
        mutedUntil: true,
        muteReason: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 应用limit参数
    let resultUsers = users;
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        resultUsers = users.slice(0, limitNum);
      }
    }

    return NextResponse.json(resultUsers);
  } catch (error) {
    console.error('获取用户数据错误:', error);
    return NextResponse.json(
      { error: '获取用户数据失败' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users - 更新用户状态（禁言/解禁）
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
    const user = await prisma.user.findUnique({
      where: { id: body.userId },
      select: {
        id: true,
        username: true,
        role: true,
        isMuted: true,
        mutedUntil: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 检查是否是管理员用户（不能禁言管理员）
    if (user.role === 'ADMIN' && typeof body.isMuted !== 'undefined' && body.isMuted) {
      return NextResponse.json(
        { error: '不能禁言管理员用户' },
        { status: 403 }
      );
    }

    let action = '更新';
    let updatedUser;

    // 更新禁言状态
    if (typeof body.isMuted !== 'undefined') {
      if (body.isMuted) {
        // 禁言用户
        const days = body.days || 1; // 默认禁言1天
        const reason = body.reason || '违反社区规则';
        updatedUser = await muteUser(body.userId, days, reason);
        action = '禁言';
      } else {
        // 解禁用户
        updatedUser = await unmuteUser(body.userId);
        action = '解禁';
      }
    } else {
      // 其他更新
      const updateData: any = {};
      if (body.role) updateData.role = body.role;
      if (body.displayName) updateData.displayName = body.displayName;
      
      updatedUser = await prisma.user.update({
        where: { id: body.userId },
        data: updateData,
        select: {
          id: true,
          username: true,
          displayName: true,
          role: true,
          isMuted: true,
          mutedUntil: true,
          muteReason: true,
          createdAt: true,
          updatedAt: true
        }
      });
    }

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

// DELETE /api/admin/users - 删除用户
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        role: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 检查是否是管理员用户（不能删除管理员）
    if (user.role === 'ADMIN') {
      return NextResponse.json(
        { error: '不能删除管理员用户' },
        { status: 403 }
      );
    }

    // 删除用户（级联删除用户的小说、评论等）
    await prisma.user.delete({
      where: { id: userId }
    });

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