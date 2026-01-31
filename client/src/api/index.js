import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'An error occurred';
        console.error('API Error:', message);
        return Promise.reject(error);
    }
);

// Menu API
export const menuAPI = {
    getAll: (params = {}) => api.get('/menu', { params }),
    search: (query) => api.get('/menu/search', { params: { q: query } }),
    getById: (id) => api.get(`/menu/${id}`),
    create: (data) => api.post('/menu', data),
    update: (id, data) => api.put(`/menu/${id}`, data),
    delete: (id) => api.delete(`/menu/${id}`),
    toggleAvailability: (id) => api.patch(`/menu/${id}/availability`)
};

// Orders API
export const ordersAPI = {
    getAll: (params = {}) => api.get('/orders', { params }),
    getById: (id) => api.get(`/orders/${id}`),
    create: (data) => api.post('/orders', data),
    updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status })
};

// Analytics API
export const analyticsAPI = {
    getTopSellers: () => api.get('/analytics/top-sellers'),
    getStats: () => api.get('/analytics/stats')
};

export default api;
