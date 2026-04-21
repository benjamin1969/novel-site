// API client for Cloudflare Worker
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://novel-platform-api.sunlongyun1030.workers.dev';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Novel API
export const novelAPI = {
  getAll: () => fetchAPI('/api/novels'),
  getById: (id: string) => fetchAPI(`/api/novels/${id}`),
  create: (data: any) => fetchAPI('/api/novels', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// User API
export const userAPI = {
  register: (data: { username: string; email?: string }) => 
    fetchAPI('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  login: (data: { username: string }) => 
    fetchAPI('/api/users/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Comment API
export const commentAPI = {
  create: (data: { novelId: string; userId: string; username: string; content: string }) =>
    fetchAPI('/api/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getByNovelId: (novelId: string) => 
    fetchAPI(`/api/comments/novel/${novelId}`),
};