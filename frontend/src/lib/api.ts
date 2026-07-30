import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('recluta_token') || (typeof window !== 'undefined' ? localStorage.getItem('recluta_token') : null);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('recluta_token');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('recluta_token');
        if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin') {
          window.location.href = '/admin';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// API helpers
export const jobsApi = {
  getAll: (params?: Record<string, any>) => api.get('/jobs', { params }),
  getBySlug: (slug: string) => api.get(`/jobs/slug/${slug}`),
  getById: (id: string) => api.get(`/jobs/${id}`),
  create: (data: any) => api.post('/jobs', data),
  update: (id: string, data: any) => api.put(`/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/jobs/${id}`),
  getStats: () => api.get('/jobs/stats'),
};

export const applicationsApi = {
  apply: (jobId: string, formData: FormData) =>
    api.post(`/applications/job/${jobId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: (params?: Record<string, any>) => api.get('/applications', { params }),
  getById: (id: string) => api.get(`/applications/${id}`),
  updateStatus: (id: string, data: any) => api.patch(`/applications/${id}/status`, data),
  delete: (id: string) => api.delete(`/applications/${id}`),
  getStats: () => api.get('/applications/stats'),
};

export const testimonialsApi = {
  getAll: (params?: Record<string, any>) => api.get('/testimonials', { params }),
  create: (data: any) => api.post('/testimonials', data),
  update: (id: string, data: any) => api.put(`/testimonials/${id}`, data),
  delete: (id: string) => api.delete(`/testimonials/${id}`),
};

export const contactApi = {
  submit: (data: any) => api.post('/contact', data),
  getAll: (params?: Record<string, any>) => api.get('/contact', { params }),
  updateStatus: (id: string, status: string) => api.patch(`/contact/${id}/status`, { status }),
};

export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  changePassword: (data: any) => api.patch('/auth/change-password', data),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
};

export const updatesApi = {
  getAll: (params?: Record<string, any>) => api.get('/updates', { params }),
  getBySlug: (slug: string) => api.get(`/updates/${slug}`),
  create: (data: any) => api.post('/updates', data),
  update: (id: string, data: any) => api.put(`/updates/${id}`, data),
  delete: (id: string) => api.delete(`/updates/${id}`),
};
