'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../hooks/use-api';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
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
      // 使用客户端存储登录
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        setSuccess('登录成功！正在跳转...');
        
        // 延迟跳转，让用户看到成功消息
        setTimeout(() => {
          router.push('/novels');
        }, 1500);
      } else {
        setError(result.error || '登录失败');
      }
    } catch (err: any) {
      setError(err.message || '登录时发生错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{
        fontSize: '1.875rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        textAlign: 'center',
        color: '#111827'
      }}>
        登录账号
      </h1>

      {error && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          borderRadius: '6px',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: '#d1fae5',
          color: '#059669',
          borderRadius: '6px',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="username" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#374151'
          }}>
            用户名
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="请输入用户名"
            disabled={isLoading}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="password" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#374151'
          }}>
            密码
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="请输入密码"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginBottom: '1rem'
          }}
        >
          {isLoading ? '登录中...' : '登录'}
        </button>
      </form>

      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
        <p style={{ marginBottom: '0.5rem' }}>
          测试账号：admin / admin123
        </p>
        <p style={{ marginBottom: '0.5rem' }}>
          或使用：张三 / zhangsan123
        </p>
        <p>
          还没有账号？{' '}
          <Link href="/register" style={{ color: '#2563eb', textDecoration: 'none' }}>
            立即注册
          </Link>
        </p>
      </div>

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '6px',
        fontSize: '0.875rem',
        color: '#6b7280'
      }}>
        <p style={{ marginBottom: '0.5rem', fontWeight: '500' }}>💡 提示：</p>
        <ul style={{ paddingLeft: '1rem', margin: 0 }}>
          <li>使用客户端存储，数据保存在浏览器中</li>
          <li>清除浏览器数据会丢失所有内容</li>
          <li>适合演示和测试使用</li>
        </ul>
      </div>
    </div>
  );
}