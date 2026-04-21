// Cloudflare Pages 统一数据存储适配器
// 替代原有的 unified-data.ts，使用内存存储适配器

import { novels as cfNovels, comments as cfComments } from './auth/cf-adapter';

// 小说数据接口
export const novels = {
  // 获取存储引用
  _store: () => cfNovels.getAll(),
  
  // 获取所有小说
  getAll: () => cfNovels.getAll(),
  
  // 获取已发布的小说
  getPublished: () => cfNovels.getAll().filter(novel => novel.status === 'published'),
  
  // 根据ID获取小说
  getById: (id: string) => cfNovels.getAll().find(novel => novel.id === id),
  
  // 根据作者获取小说
  getByAuthor: (author: string) => cfNovels.getAll().filter(novel => novel.author === author),
  
  // 添加新小说
  add: (novelData: any) => {
    const newNovel = {
      ...novelData,
      id: `novel_${Date.now()}`,
      views: 0,
      likes: 0,
      chapters: novelData.chapters || 1,
      status: novelData.status || 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    cfNovels.push(newNovel);
    return newNovel;
  },
  
  // 更新小说
  update: (id: string, updates: any) => {
    const novelsList = cfNovels.getAll();
    const index = novelsList.findIndex(novel => novel.id === id);
    
    if (index === -1) return null;
    
    const updatedNovel = {
      ...novelsList[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // 更新存储
    const currentList = cfNovels.getAll();
    currentList[index] = updatedNovel;
    return updatedNovel;
  },
  
  // 删除小说
  delete: (id: string) => {
    const novelsList = cfNovels.getAll();
    const index = novelsList.findIndex(novel => novel.id === id);
    
    if (index === -1) return false;
    
    // 从存储中删除
    const currentList = cfNovels.getAll();
    currentList.splice(index, 1);
    return true;
  },
  
  // 批量删除
  deleteMultiple: (ids: string[]) => {
    let deletedCount = 0;
    ids.forEach(id => {
      if (novels.delete(id)) {
        deletedCount++;
      }
    });
    return deletedCount;
  },
  
  // 获取统计信息
  getStats: () => {
    const allNovels = cfNovels.getAll();
    return {
      total: allNovels.length,
      published: allNovels.filter(n => n.status === 'published').length,
      draft: allNovels.filter(n => n.status === 'draft').length,
      totalViews: allNovels.reduce((sum, novel) => sum + (novel.views || 0), 0),
      totalLikes: allNovels.reduce((sum, novel) => sum + (novel.likes || 0), 0)
    };
  },
  
  // 增加浏览量
  incrementViews: (id: string) => {
    const novel = novels.getById(id);
    if (novel) {
      novel.views = (novel.views || 0) + 1;
      novels.update(id, { views: novel.views });
    }
    return novel;
  },
  
  // 增加点赞数
  incrementLikes: (id: string) => {
    const novel = novels.getById(id);
    if (novel) {
      novel.likes = (novel.likes || 0) + 1;
      novels.update(id, { likes: novel.likes });
    }
    return novel;
  }
};

// 评论数据接口
export const comments = {
  // 获取存储引用
  _store: () => cfComments.getAll(),
  
  // 获取所有评论
  getAll: () => cfComments.getAll(),
  
  // 获取已批准的评论（现在所有评论都是已发布的）
  getApproved: () => cfComments.getAll(),
  
  // 根据小说ID获取评论
  getByNovelId: (novelId: string) => cfComments.getAll().filter(comment => comment.novelId === novelId),
  
  // 根据作者获取评论
  getByAuthor: (author: string) => cfComments.getAll().filter(comment => comment.author === author),
  
  // 根据ID获取评论
  getById: (id: string) => cfComments.getAll().find(comment => comment.id === id),
  
  // 添加新评论
  add: (commentData: any) => {
    const newComment = {
      ...commentData,
      id: `comment_${Date.now()}`,
      status: 'approved', // 评论直接发布，无需审核
      likes: commentData.likes || 0,
      createdAt: new Date().toISOString()
    };
    
    cfComments.push(newComment);
    return newComment;
  },
  
  // 更新评论
  update: (id: string, updates: any) => {
    const commentsList = cfComments.getAll();
    const index = commentsList.findIndex(comment => comment.id === id);
    
    if (index === -1) return null;
    
    const updatedComment = {
      ...commentsList[index],
      ...updates
    };
    
    // 更新存储
    const currentList = cfComments.getAll();
    currentList[index] = updatedComment;
    return updatedComment;
  },
  
  // 删除评论
  delete: (id: string) => {
    const commentsList = cfComments.getAll();
    const index = commentsList.findIndex(comment => comment.id === id);
    
    if (index === -1) return false;
    
    // 从存储中删除
    const currentList = cfComments.getAll();
    currentList.splice(index, 1);
    return true;
  },
  
  // 批量删除
  deleteMultiple: (ids: string[]) => {
    let deletedCount = 0;
    ids.forEach(id => {
      if (comments.delete(id)) {
        deletedCount++;
      }
    });
    return deletedCount;
  },
  
  // 获取统计信息
  getStats: () => {
    const allComments = cfComments.getAll();
    return {
      total: allComments.length,
      approved: allComments.filter(c => c.status === 'approved').length,
      pending: allComments.filter(c => c.status === 'pending').length,
      totalLikes: allComments.reduce((sum, comment) => sum + (comment.likes || 0), 0)
    };
  },
  
  // 增加点赞数
  incrementLikes: (id: string) => {
    const comment = comments.getById(id);
    if (comment) {
      comment.likes = (comment.likes || 0) + 1;
      comments.update(id, { likes: comment.likes });
    }
    return comment;
  }
};

// 导出默认对象
export default {
  novels,
  comments
};