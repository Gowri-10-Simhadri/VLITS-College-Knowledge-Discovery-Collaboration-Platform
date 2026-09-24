import axios from 'axios';

// Intelligently detect backend URL across localhost, Vercel, and Render deployments
const getBaseURL = () => {
  // 1. Explicit Vite environment variable (if set in Vercel or local .env)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const { hostname, port } = window.location;

    // 2. Localhost development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      if (port === '3000' || port === '5173') {
        return '/api'; // Proxied by Vite dev server
      }
      if (port === '5000') {
        return '/api'; // Served directly by Express
      }
      return 'http://localhost:5000/api';
    }

    // 3. Deployed on Render where backend serves the frontend SPA
    if (hostname.includes('onrender.com')) {
      return '/api';
    }

    // 4. Deployed on Vercel or any other external host -> connect to live Render backend
    return 'https://vlits-college-knowledge-discovery.onrender.com/api';
  }

  return 'https://vlits-college-knowledge-discovery.onrender.com/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 45000 // 45s timeout to allow Render free tier wake-up
});

// Intercept requests to inject JWT
api.interceptors.request.use(
  (config) => {
    const storedAuth = localStorage.getItem('vlits_user_auth') || localStorage.getItem('nexus_user_auth');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        const token = parsed?.token;
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Failed to parse auth token:', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for token expiration handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const requestUrl = error.config?.url || '';
      // Don't wipe storage during failed login/register credential attempts
      if (
        !requestUrl.includes('/auth/login') &&
        !requestUrl.includes('/auth/register') &&
        !requestUrl.includes('/auth/demo-login')
      ) {
        localStorage.removeItem('vlits_user_auth');
        localStorage.removeItem('nexus_user_auth');
      }
    }
    return Promise.reject(error);
  }
);

