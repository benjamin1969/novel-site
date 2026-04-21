'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: 'admin',
    password: 'admin123'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除错误信息
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 验证表单
    if (!formData.username || !formData.password) {
      setError('请输入用户名和密码');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '登录失败');
      }

      setSuccess('登录成功！正在跳转...');
      
      // 保存用户信息到 localStorage - 修复：同时保存两种格式
      localStorage.setItem('user', JSON.stringify(data.user));
      // 新增：保存用户名到标准键名
      localStorage.setItem('novel-site-username', data.user.username);
      localStorage.setItem('novel-site-loggedin', 'true');
      
      // 检查是否有重定向页面
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath && redirectPath !== '/login') {
        sessionStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectPath;
      } else {
        // 默认跳转到作品库
        window.location.href = '/novels';
      }

    } catch (err: any) {
      setError(err.message || '登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (username: string, password: string) => {
    setFormData({ username, password });
    setError('');
    setSuccess('');

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '登录失败');
      }

      setSuccess('登录成功！正在跳转...');
      
      // 保存用户信息到 localStorage - 修复：同时保存两种格式
      localStorage.setItem('user', JSON.stringify(data.user));
      // 新增：保存用户名到标准键名
      localStorage.setItem('novel-site-username', data.user.username);
      localStorage.setItem('novel-site-loggedin', 'true');
      
      // 检查是否有重定向页面
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath && redirectPath !== '/login') {
        sessionStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectPath;
      } else {
        // 默认跳转到作品库
        window.location.href = '/novels';
      }

    } catch (err: any) {
      setError(err.message || '登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#dbeafe',
          color: '#1e40af',
          borderRadius: '9999px',
          marginBottom: '1rem'
        }}>
          <span>🔑</span>
          <span style={{ fontWeight: '500' }}>欢迎回来</span>
        </div>
        
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#111827'
        }}>
          登录简阅
        </h1>
        
        <p style={{
          color: '#6b7280',
          marginBottom: '2rem'
        }}>
          继续你的创作之旅，查看你的作品
        </p>
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '1px solid #fca5a5'
        }}>
          {error}
        </div>
      )}

      {/* 成功提示 */}
      {success && (
        <div style={{
          backgroundColor: '#d1fae5',
          color: '#059669',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '1px solid #34d399'
        }}>
          {success}
        </div>
      )}
      
      {/* 登录表单 */}
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#374151'
          }}>
            用户名
          </label>
          <input
            name="username"
            type="text"
            placeholder="输入用户名"
            value={formData.username}
            onChange={handleChange}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#374151'
          }}>
            密码
          </label>
          <input
            name="password"
            type="password"
            placeholder="输入密码"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem', textAlign: 'right' }}>
          <a href="/forgot-password" style={{ color: '#2563eb', fontSize: '0.875rem' }}>
            忘记密码？
          </a>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: isLoading ? '#93c5fd' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? '登录中...' : '登录'}
        </button>
        
        {/* 快速登录按钮 */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => handleQuickLogin('admin', 'admin123')}
            disabled={isLoading}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            快速登录：admin
          </button>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            还没有账号？
            <Link href="/register" style={{ color: '#2563eb', marginLeft: '0.25rem' }}>
              立即注册
            </Link>
          </p>
        </div>
      </form>
      
      {/* 测试账号提示 */}
      <div style={{
        backgroundColor: '#fef3c7',
        padding: '1rem',
        borderRadius: '8px',
        marginTop: '1.5rem'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#92400e' }}>
          🧪 测试账号
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#92400e', marginBottom: '0.25rem' }}>
          <strong>用户名:</strong> admin
        </p>
        <p style={{ fontSize: '0.875rem', color: '#92400e' }}>
          <strong>密码:</strong> admin123
        </p>
        <p style={{ fontSize: '0.75rem', color: '#92400e', marginTop: '0.5rem' }}>
          注意：这是测试账号，请在生产环境修改密码
        </p>
      </div>
      
      {/* 安全提示 */}
      <div style={{
        backgroundColor: '#f0f9ff',
        padding: '1rem',
        borderRadius: '8px',
        marginTop: '1.5rem',
        textAlign: 'center'
      }}>
        <p style={{ color: '#1e40af', fontSize: '0.875rem' }}>
          🔒 安全登录，保护你的创作成果
        </p>
      </div>
    </div>
  )
}