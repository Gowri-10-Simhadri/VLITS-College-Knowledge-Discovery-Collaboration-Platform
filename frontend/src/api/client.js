import axios from 'axios';

// Detect host & fallback to local API if accessed directly
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    if (window.location.port === '3000') {
      return '/api';
    }
    return `${window.location.protocol}//${window.location.hostname}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to inject JWT
api.interceptors.request.use((config) => {
  const storedAuth = localStorage.getItem('vlits_user_auth') || localStorage.getItem('nexus_user_auth');
  if (storedAuth) {
    try {
      const { token } = JSON.parse(storedAuth);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {}
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
