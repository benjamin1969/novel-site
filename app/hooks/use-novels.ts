// app/hooks/use-novels.ts - 小说数据hook（使用数据库API）
import { useState, useCallback } from 'react';

interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  content: string;
  createdAt: string;
}

interface Novel {
  id: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  coverImage: string;
  status: string;
  views: number;
  likes: number;
  chapterCount: number;
  chapters: Chapter[];
  createdAt: string;
}

export function useNovels() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取所有已发布小说（作品库）
  const getNovels = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/novels');
      
      if (!response.ok) {
        throw new Error('获取小说列表失败');
      }
      
      const novels: Novel[] = await response.json();
      setLoading(false);
      return novels;
    } catch (error: any) {
      const errorMsg = error.message || '获取小说列表失败，请稍后重试';
      setError(errorMsg);
      setLoading(false);
      throw error;
    }
  }, []);

  // 获取用户的小说（我的作品）
  const getMyNovels = useCallback(async (author: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const encodedAuthor = encodeURIComponent(author);
      const response = await fetch(`/api/my-novels?author=${encodedAuthor}`);
      
      if (!response.ok) {
        throw new Error('获取我的小说失败');
      }
      
      const novels: Novel[] = await response.json();
      setLoading(false);
      return novels;
    } catch (error: any) {
      const errorMsg = error.message || '获取我的小说失败，请稍后重试';
      setError(errorMsg);
      setLoading(false);
      throw error;
    }
  }, []);

  // 获取小说详情
  const getNovelById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/novels/${id}`);
      
      if (!response.ok) {
        throw new Error('获取小说详情失败');
      }
      
      const novel: Novel = await response.json();
      setLoading(false);
      return novel;
    } catch (error: any) {
      const errorMsg = error.message || '获取小说详情失败，请稍后重试';
      setError(errorMsg);
      setLoading(false);
      throw error;
    }
  }, []);

  // 创建新小说
  const createNovel = useCallback(async (novelData: {
    title: string;
    description: string;
    authorId: string;
    content?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/novels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novelData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '创建小说失败');
      }
      
      setLoading(false);
      return data;
    } catch (error: any) {
      const errorMsg = error.message || '创建小说失败，请稍后重试';
      setError(errorMsg);
      setLoading(false);
      throw error;
    }
  }, []);

  // 更新小说
  const updateNovel = useCallback(async (id: string, novelData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/novels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novelData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '更新小说失败');
      }
      
      setLoading(false);
      return data;
    } catch (error: any) {
      const errorMsg = error.message || '更新小说失败，请稍后重试';
      setError(errorMsg);
      setLoading(false);
      throw error;
    }
  }, []);

  // 删除小说
  const deleteNovel = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/novels/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '删除小说失败');
      }
      
      setLoading(false);
      return data;
    } catch (error: any) {
      const errorMsg = error.message || '删除小说失败，请稍后重试';
      setError(errorMsg);
      setLoading(false);
      throw error;
    }
  }, []);

  return {
    loading,
    error,
    getNovels,
    getMyNovels,
    getNovelById,
    createNovel,
    updateNovel,
    deleteNovel
  };
}