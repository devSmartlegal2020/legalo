import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_BASE_URL = API_URL.replace('/api', '');

console.log('🔵 API Service initializing. API_URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60 seconds for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🔵 API Request:', config.url, 'Token exists:', !!token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log('🔵 API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('🔵 API Response:', response.config.url, 'Status:', response.status);
    return response;
  },
  (error) => {
    console.log('🔵 API Error:', error.config?.url, 'Status:', error.response?.status);
    console.log('🔵 Error Message:', error.response?.data?.message || error.message);
    
    // Only handle 401 errors for authenticated routes (not login/register)
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      
      // Don't redirect if it's the login endpoint
      if (!requestUrl.includes('/auth/login')) {
        console.log('🔵 401 detected on', requestUrl, '- clearing auth and redirecting');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
      } else {
        console.log('🔵 401 on login endpoint - NOT redirecting, just showing error');
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) => {
    console.log('🔵 authAPI.login called with email:', email);
    return api.post('/auth/login', { email, password });
  },
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: { name?: string; avatar?: string }) =>
    api.put('/auth/profile', data),
};

// Blog API
export const blogAPI = {
  getAll: (params?: { page?: number; limit?: number; status?: string; category?: string; search?: string }) =>
    api.get('/blogs', { params }),
  getPublished: (params?: { page?: number; limit?: number; category?: string; search?: string }) =>
    api.get('/blogs/public', { params }),
  getBySlug: (slug: string) => api.get(`/blogs/slug/${slug}`),
  getById: (id: string) => api.get(`/blogs/${id}`),
  create: (data: FormData) =>
    api.post('/blogs', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, data: FormData) =>
    api.put(`/blogs/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete(`/blogs/${id}`),
  bulkDelete: (ids: string[]) => api.post('/blogs/bulk-delete', { ids }),
  bulkArchive: (ids: string[]) => api.post('/blogs/bulk-archive', { ids }),
  getFeatured: (limit?: number) =>
    api.get('/blogs/featured', { params: { limit } }),
  getPopular: (limit?: number) =>
    api.get('/blogs/popular', { params: { limit } }),
  recommendKeywords: (data: {
    title: string;
    content: string;
    country?: string;
    maxKeywords?: number;
  }) => api.post('/blogs/recommend-keywords', data),
};

// Category API
export const categoryAPI = {
  getAll: () => api.get('/categories/public'),
  getAllAdmin: () => api.get('/categories'),
  getBySlug: (slug: string) => api.get(`/categories/slug/${slug}`),
  create: (data: { name: string; description?: string; defaultCta?: string | null }) =>
    api.post('/categories', data),
  update: (id: string, data: { name?: string; description?: string; isActive?: boolean; defaultCta?: string | null }) =>
    api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
  getStats: () => api.get('/categories/stats/all'),
};

// CTA API
export interface CTA {
  _id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  backgroundColor: string;
  textColor: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const ctaAPI = {
  getAll: (params?: { page?: number; limit?: number; isActive?: boolean }) =>
    api.get('/ctas', { params }),
  getActive: () => api.get('/ctas/active'),
  getById: (id: string) => api.get(`/ctas/${id}`),
  create: (data: Partial<CTA>) => api.post('/ctas', data),
  update: (id: string, data: Partial<CTA>) => api.put(`/ctas/${id}`, data),
  delete: (id: string) => api.delete(`/ctas/${id}`),
  toggleStatus: (id: string) => api.patch(`/ctas/${id}/toggle-status`),
};

// User API
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: { email: string; password: string; name: string; role?: string }) =>
    api.post('/users', data),
  update: (id: string, data: { name?: string; email?: string; role?: string; isActive?: boolean }) =>
    api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  toggleStatus: (id: string) => api.patch(`/users/${id}/toggle-status`),
  changePassword: (id: string, newPassword: string) =>
    api.put(`/users/${id}/password`, { newPassword }),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteImage: (filename: string) => api.delete(`/upload/${filename}`),
};

// Import API
export const importAPI = {
  previewImport: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/import/preview', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  startImport: (file: File, defaultStatus: 'draft' | 'published' = 'draft') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('defaultStatus', defaultStatus);
    return api.post('/import/wordpress', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getProgress: (importId: string) =>
    api.get(`/import/${importId}/status`),
  streamProgress: (importId: string, onMessage: (progress: any) => void, onError?: (error: Error) => void) => {
    // Get token from localStorage for SSE (EventSource doesn't support headers)
    const token = localStorage.getItem('token');
    const url = token 
      ? `${API_URL}/import/${importId}/progress?token=${token}`
      : `${API_URL}/import/${importId}/progress`;
    
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);

        if (['completed', 'failed', 'cancelled'].includes(data.status)) {
          eventSource.close();
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
        if (onError && error instanceof Error) {
          onError(error);
        }
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      if (onError) {
        onError(new Error('Connection error'));
      }
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  },
  cancelImport: (importId: string) =>
    api.post(`/import/${importId}/cancel`),
  undoImport: (importId: string) =>
    api.post(`/import/${importId}/undo`),
  getAllImports: (page = 1, limit = 10) =>
    api.get('/import', { params: { page, limit } }),
  getImportDetails: (importId: string) =>
    api.get(`/import/${importId}`),
};

// Settings API
export const settingsAPI = {
  getAll: () => api.get('/settings'),
  update: (data: { settings: Array<{ key: string; value: string }> }) =>
    api.put('/settings', data),
  getStatus: () => api.get('/settings/status'),
  testConnection: (apiName: string) => api.get(`/settings/test/${apiName}`),
  getDebug: () => api.get('/settings/debug'),
  diagnoseOpenAI: () => api.get('/settings/diagnose/openai'),
  diagnoseAhrefs: () => api.get('/settings/diagnose/ahrefs'),
};

// Event API
export const eventAPI = {
  // Admin routes
  getAll: (params?: { page?: number; limit?: number; status?: string; type?: string; category?: string; search?: string }) =>
    api.get('/events/admin/events', { params }),
  getById: (id: string) => api.get(`/events/admin/events/${id}`),
  create: (data: FormData) =>
    api.post('/events/admin/events', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, data: FormData) =>
    api.put(`/events/admin/events/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete(`/events/admin/events/${id}`),
  
  // Public routes
  getPublished: (params?: { page?: number; limit?: number; type?: string; category?: string; featured?: boolean }) =>
    api.get('/events/public/events', { params }),
  getBySlug: (slug: string) => api.get(`/events/public/events/${slug}`),
  getFeatured: (limit?: number) =>
    api.get('/events/public/events/featured', { params: { limit } }),
  getUpcoming: (limit?: number) =>
    api.get('/events/public/events/upcoming', { params: { limit } }),
  getSchedule: () => api.get('/events/public/events/schedule'),
  getRelated: (slug: string, limit?: number) =>
    api.get(`/events/public/events/${slug}/related`, { params: { limit } }),
  register: (slug: string, data: { name: string; email: string; phone?: string; company?: string; message?: string }) =>
    api.post(`/events/public/events/${slug}/register`, data),
};

// Promotion API
export const promotionAPI = {
  // Admin routes
  getAll: (params?: { page?: number; limit?: number; status?: string; search?: string; showInPopup?: boolean }) =>
    api.get('/promotions/admin/promotions', { params }),
  getById: (id: string) => api.get(`/promotions/admin/promotions/${id}`),
  create: (data: FormData) =>
    api.post('/promotions/admin/promotions', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, data: FormData) =>
    api.put(`/promotions/admin/promotions/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete(`/promotions/admin/promotions/${id}`),
  
  // Public routes
  getActive: (params?: { page?: number; limit?: number }) =>
    api.get('/promotions/public/promotions', { params }),
  getBySlug: (slug: string) => api.get(`/promotions/public/promotions/${slug}`),
  getPopup: (path?: string, categoryId?: string) =>
    api.get('/promotions/public/promotions/popup', { params: { path, categoryId } }),
};

// Ebook API
export const ebookAPI = {
  // Admin routes
  getAll: (params?: { page?: number; limit?: number; status?: string; category?: string; search?: string }) =>
    api.get('/ebooks/admin/ebooks', { params }),
  getById: (id: string) => api.get(`/ebooks/admin/ebooks/${id}`),
  getStats: (id: string) => api.get(`/ebooks/admin/ebooks/${id}/stats`),
  create: (data: FormData) =>
    api.post('/ebooks/admin/ebooks', data),
  update: (id: string, data: FormData) =>
    api.put(`/ebooks/admin/ebooks/${id}`, data),
  delete: (id: string) => api.delete(`/ebooks/admin/ebooks/${id}`),
  bulkDelete: (ids: string[]) => api.post('/ebooks/admin/ebooks/bulk-delete', { ids }),
  getAllDownloads: (params?: { page?: number; limit?: number; ebookId?: string; email?: string }) =>
    api.get('/ebooks/admin/downloads', { params }),
  
  // Public routes
  getPublished: (params?: { page?: number; limit?: number; category?: string; search?: string }) =>
    api.get('/ebooks/public/ebooks', { params }),
  getBySlug: (slug: string) => api.get(`/ebooks/public/ebooks/${slug}`),
  recordDownload: (id: string, data: { email: string; name?: string; company?: string; consent: boolean }) =>
    api.post(`/ebooks/public/ebooks/${id}/download`, data),
};

// Newsletter API
export const newsletterAPI = {
  // Admin routes
  getAllSubscribers: (params?: { page?: number; limit?: number; status?: string; signupSource?: string; search?: string }) =>
    api.get('/newsletter/admin/subscribers', { params }),
  getStats: () => api.get('/newsletter/admin/subscribers/stats'),
  exportSubscribers: (status?: string) =>
    api.get('/newsletter/admin/subscribers/export', { 
      params: { status },
      responseType: 'blob',
    }),
  updateSubscriber: (id: string, data: { name?: string; status?: string }) =>
    api.put(`/newsletter/admin/subscribers/${id}`, data),
  deleteSubscriber: (id: string) => api.delete(`/newsletter/admin/subscribers/${id}`),
  bulkDeleteSubscribers: (ids: string[]) =>
    api.post('/newsletter/admin/subscribers/bulk-delete', { ids }),
  
  // Public routes
  subscribe: (data: { email: string; name?: string; signupSource?: string }) =>
    api.post('/newsletter/subscribe', data),
  confirmSubscription: (token: string) =>
    api.get(`/newsletter/confirm/${token}`),
  unsubscribe: (email: string) =>
    api.post('/newsletter/unsubscribe', { email }),
};

// Consultation API
export const consultationAPI = {
  create: (data: { fullName: string; email: string; phone: string; serviceType: string; message?: string }) =>
    api.post('/consultations', data),
  getAll: (params?: { page?: number; limit?: number; status?: string; serviceType?: string; search?: string }) =>
    api.get('/consultations', { params }),
  updateStatus: (id: string, status: string) =>
    api.patch(`/consultations/${id}/status`, { status }),
  delete: (id: string) =>
    api.delete(`/consultations/${id}`),
};

export default api;

