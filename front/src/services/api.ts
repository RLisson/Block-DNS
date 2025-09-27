import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';

let BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string | undefined;

// Se for relativo (ex: /api/v1) ou não definido, construir a partir do origin
if (!BACKEND_URL) {
  BACKEND_URL = '/api/v1';
}
if (BACKEND_URL.startsWith('/')) {
  BACKEND_URL = window.location.origin.replace(/\/$/, '') + BACKEND_URL;
}

// Log (pode remover depois)
console.log('[API] baseURL =', BACKEND_URL);

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirecionar para login ou disparar evento
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;