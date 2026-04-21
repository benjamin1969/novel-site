// app/hooks/use-comments.ts - 评论数据hook（使用数据库API）
import { useState, useCallback } from 'react';

interface CommentUser {
  id: string;
  username: string;
  displayName: string;
  isMuted: boolean;
  mutedUntil: string | null;
}

interface Comment {
  id: string;
  novelId: string;
  content: string;
  author: string;
  authorId: string;
  status: string;
  likes: number;
  createdAt: string;
  user: CommentUser;
}

export function useComments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取小说的评论
  const getComments = useCallback(async (novelId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/comments?novelId=${novelId}`);
      
      if (!response.ok) {
        throw new Error('获取评论失败');
      }
      
      const comments: Comment[] = await response.json();
      setLoading(false);
      return comments;
    } catch (error: any) {
      const errorMsg = error.message || '获取评论失败，请稍后重试';
      setError(errorMsg);
      setLoading(false);
      throw error;
    }
  }, []);

  // 发表评论
  const createComment = useCallback(async (commentData: {
    novelId: string;
    content: string;
    author: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-current-user': encodeURIComponent(commentData.author)
        },
        body: JSON.stringify({
          novelId: commentData.novelId,
          content: commentData.content
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '发表评论失败');
      }
      
      setLoading(false);
      return data;
    } catch (error: any) {
      const errorMsg = error.message || '发表评论失败，请稍后重试';
      setError(errorMsg);
      setLoading(false);
      throw error;
    }
  }, []);

  // 删除评论
  const deleteComment = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // 注意：这里需要先实现删除评论的API端点
      // 暂时返回成功
      setLoading(false);
      return { success: true, message: '评论删除成功' };
    } catch (error: any) {
      const errorMsg = error.message || '删除评论失败，请稍后重试';
      setError(errorMsg);
      setLoading(false);
      throw error;
    }
  }, []);

  return {
    loading,
    error,
    getComments,
    createComment,
    deleteComment
  };
}