import axios from 'axios';

const isProduction = import.meta.env.PROD;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isProduction ? '/api' : 'http://localhost:8000/api'),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Request Interceptor: Attach token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('janamanthan_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      localStorage.removeItem('janamanthan_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);