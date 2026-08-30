import axios from 'axios';

// Use the same-origin backend API path.
// If the backend is served separately, set VITE_API_BASE_URL to that URL instead.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
});

// 2. Add an "interceptor" to automatically add the token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;