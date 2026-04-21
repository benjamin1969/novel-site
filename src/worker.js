// Cloudflare Worker API for novel platform
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // API routes
    if (path.startsWith('/api/')) {
      try {
        // Parse request body
        let body = {};
        if (request.method === 'POST' || request.method === 'PUT') {
          try {
            body = await request.json();
          } catch (e) {
            // Body may be empty
          }
        }

        // Route handling
        if (path === '/api/novels' && request.method === 'GET') {
          // Get all novels
          const novels = await getNovels(env);
          return jsonResponse({ novels }, corsHeaders);
        }
        
        if (path === '/api/novels' && request.method === 'POST') {
          // Create novel
          const novel = await createNovel(body, env);
          return jsonResponse({ novel }, corsHeaders);
        }
        
        if (path.match(/^\/api\/novels\/[^\/]+$/) && request.method === 'GET') {
          // Get single novel
          const id = path.split('/')[3];
          const novel = await getNovel(id, env);
          if (!novel) {
            return jsonResponse({ error: 'Novel not found' }, corsHeaders, 404);
          }
          return jsonResponse({ novel }, corsHeaders);
        }
        
        if (path === '/api/users/register' && request.method === 'POST') {
          // Register user
          const user = await registerUser(body, env);
          return jsonResponse({ user }, corsHeaders);
        }
        
        if (path === '/api/users/login' && request.method === 'POST') {
          // Login user
          const result = await loginUser(body, env);
          return jsonResponse(result, corsHeaders);
        }
        
        if (path === '/api/comments' && request.method === 'POST') {
          // Add comment
          const comment = await addComment(body, env);
          return jsonResponse({ comment }, corsHeaders);
        }
        
        if (path.startsWith('/api/comments/novel/') && request.method === 'GET') {
          // Get comments for novel
          const novelId = path.split('/')[4];
          const comments = await getCommentsForNovel(novelId, env);
          return jsonResponse({ comments }, corsHeaders);
        }

        // Default API response
        return jsonResponse({ error: 'API endpoint not found' }, corsHeaders, 404);
      } catch (error) {
        console.error('API error:', error);
        return jsonResponse({ error: 'Internal server error' }, corsHeaders, 500);
      }
    }

    // Default response
    return new Response('Novel Platform API', {
      headers: { 'Content-Type': 'text/plain', ...corsHeaders }
    });
  }
};

// Helper functions
function jsonResponse(data, headers = {}, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
}

// Data storage functions
async function getNovels(env) {
  try {
    const list = await env.NOVELS.list();
    const novels = [];
    
    for (const key of list.keys) {
      if (key.name.startsWith('novel:')) {
        const novelData = await env.NOVELS.get(key.name, 'json');
        if (novelData) {
          novels.push({ id: key.name.replace('novel:', ''), ...novelData });
        }
      }
    }
    
    return novels.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting novels:', error);
    return [];
  }
}

async function getNovel(id, env) {
  try {
    const novelData = await env.NOVELS.get(`novel:${id}`, 'json');
    return novelData ? { id, ...novelData } : null;
  } catch (error) {
    console.error('Error getting novel:', error);
    return null;
  }
}

async function createNovel(data, env) {
  try {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const novel = {
      title: data.title || 'Untitled',
      author: data.author || 'Anonymous',
      content: data.content || '',
      summary: data.summary || '',
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'published'
    };
    
    await env.NOVELS.put(`novel:${id}`, JSON.stringify(novel));
    return { id, ...novel };
  } catch (error) {
    console.error('Error creating novel:', error);
    throw error;
  }
}

async function registerUser(data, env) {
  try {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const user = {
      username: data.username,
      email: data.email || '',
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    await env.NOVELS.put(`user:${id}`, JSON.stringify(user));
    return { id, ...user };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

async function loginUser(data, env) {
  try {
    // Simplified login - in production, use proper authentication
    const list = await env.NOVELS.list();
    
    for (const key of list.keys) {
      if (key.name.startsWith('user:')) {
        const userData = await env.NOVELS.get(key.name, 'json');
        if (userData && userData.username === data.username) {
          return {
            success: true,
            user: {
              id: key.name.replace('user:', ''),
              ...userData
            },
            token: 'demo-token-' + Date.now() // In production, use JWT
          };
        }
      }
    }
    
    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: 'Login failed' };
  }
}

async function addComment(data, env) {
  try {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const comment = {
      novelId: data.novelId,
      userId: data.userId,
      username: data.username || 'Anonymous',
      content: data.content,
      createdAt: new Date().toISOString()
    };
    
    await env.NOVELS.put(`comment:${id}`, JSON.stringify(comment));
    return { id, ...comment };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

async function getCommentsForNovel(novelId, env) {
  try {
    const list = await env.NOVELS.list();
    const comments = [];
    
    for (const key of list.keys) {
      if (key.name.startsWith('comment:')) {
        const commentData = await env.NOVELS.get(key.name, 'json');
        if (commentData && commentData.novelId === novelId) {
          comments.push({
            id: key.name.replace('comment:', ''),
            ...commentData
          });
        }
      }
    }
    
    return comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting comments:', error);
    return [];
  }
}