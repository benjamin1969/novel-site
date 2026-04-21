'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  // 无邮箱注册功能 - 为5-6年级小学生设计
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError('请填写所有必填字段');
      return;
    }

    // 验证用户名长度（支持中文，最少2个字符）
    const usernameLength = Array.from(formData.username).length;
    if (usernameLength < 2) {
      setError('用户名至少需要2个字符');
      return;
    }

    // 验证用户名格式（允许中文、英文、数字和下划线）
    const usernameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(formData.username)) {
      setError('用户名只能包含中文、英文、数字和下划线');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码至少需要6个字符');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (!agreedToTerms) {
      setError('请阅读并同意用户协议');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          displayName: formData.displayName || formData.username
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '注册失败');
      }

      setSuccess('注册成功！正在跳转到作品库...');
      
      // 保存用户信息到 localStorage（临时方案）- 修复：同时保存两种格式
      localStorage.setItem('user', JSON.stringify(data.user));
      // 新增：保存用户名到标准键名
      localStorage.setItem('novel-site-username', data.user.username);
      localStorage.setItem('novel-site-loggedin', 'true');
      
      // 立即刷新页面并跳转到作品库
      window.location.href = '/novels';

    } catch (err: any) {
      setError(err.message || '注册失败，请稍后重试');
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
          <span>📝</span>
          <span style={{ fontWeight: '500' }}>创建账号</span>
        </div>
        
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#111827'
        }}>
          加入简阅
        </h1>
        
        <p style={{
          color: '#6b7280',
          marginBottom: '2rem'
        }}>
          开始你的创作之旅，与其他小作者分享故事
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
      
      {/* 注册表单 */}
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
            用户名 *
          </label>
          <input
            type="text"
            name="username"
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
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
            至少2个字符，支持中文、英文、数字和下划线
          </p>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#374151'
          }}>
            密码 *
          </label>
          <input
            type="password"
            name="password"
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
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
            至少6个字符，包含字母和数字
          </p>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#374151'
          }}>
            确认密码 *
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="再次输入密码"
            value={formData.confirmPassword}
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
            显示名称（可选）
          </label>
          <input
            type="text"
            name="displayName"
            placeholder="其他同学看到的名称"
            value={formData.displayName}
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
        
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              disabled={isLoading}
            />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              我已阅读并同意
              <a href="/terms" style={{ color: '#2563eb', marginLeft: '0.25rem' }}>
                用户协议
              </a>
            </span>
          </label>
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
          {isLoading ? '注册中...' : '注册账号'}
        </button>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            已有账号？
            <Link href="/login" style={{ color: '#2563eb', marginLeft: '0.25rem' }}>
              立即登录
            </Link>
          </p>
        </div>
      </form>
      
      {/* 安全提示 */}
      <div style={{
        backgroundColor: '#f0f9ff',
        padding: '1rem',
        borderRadius: '8px',
        marginTop: '1.5rem',
        textAlign: 'center'
      }}>
        <p style={{ color: '#1e40af', fontSize: '0.875rem' }}>
          🔒 我们重视你的隐私，不会要求邮箱或手机号
        </p>
      </div>
    </div>
  );
}