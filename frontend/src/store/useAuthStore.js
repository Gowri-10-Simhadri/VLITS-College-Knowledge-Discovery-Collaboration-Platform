import { create } from 'zustand';
import { api } from '../api/client';

export const useAuthStore = create((set, get) => ({
  user: (() => {
    try {
      const saved = localStorage.getItem('nexus_user_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })(),
  loading: false,
  error: null,
  recentlyViewed: (() => {
    try {
      const saved = localStorage.getItem('nexus_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })(),

  // One-click demo login for reviewing
  demoLogin: async (role = 'student') => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/demo-login', { role });
      const user = res.data;
      localStorage.setItem('nexus_user_auth', JSON.stringify(user));
      set({ user, loading: false });
      return user;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false });
      throw err;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const user = res.data;
      localStorage.setItem('nexus_user_auth', JSON.stringify(user));
      set({ user, loading: false });
      return user;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false });
      throw err;
    }
  },

  register: async (formData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/register', formData);
      const user = res.data;
      localStorage.setItem('nexus_user_auth', JSON.stringify(user));
      set({ user, loading: false });
      return user;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('nexus_user_auth');
    set({ user: null });
  },

  toggleBookmark: async (projectId) => {
    const { user } = get();
    if (!user) return false;

    try {
      const res = await api.post(`/projects/${projectId}/bookmark`);
      const updatedBookmarks = res.data.bookmarks;
      const updatedUser = { ...user, bookmarks: updatedBookmarks };
      localStorage.setItem('nexus_user_auth', JSON.stringify(updatedUser));
      set({ user: updatedUser });
      return res.data.bookmarked;
    } catch (err) {
      console.error('Bookmark error:', err);
      return false;
    }
  },

  addRecentlyViewed: (project) => {
    if (!project || !project._id) return;
    const { recentlyViewed } = get();
    const filtered = recentlyViewed.filter(p => p._id !== project._id);
    const updated = [project, ...filtered].slice(0, 10);
    localStorage.setItem('nexus_recently_viewed', JSON.stringify(updated));
    set({ recentlyViewed: updated });
  }
}));
