import { create } from 'zustand';
import { api } from '../api/client';

const getStoredUser = () => {
  try {
    const saved = localStorage.getItem('vlits_user_auth') || localStorage.getItem('nexus_user_auth');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const persistUser = (user) => {
  if (user) {
    localStorage.setItem('vlits_user_auth', JSON.stringify(user));
    localStorage.setItem('nexus_user_auth', JSON.stringify(user));
  } else {
    localStorage.removeItem('vlits_user_auth');
    localStorage.removeItem('nexus_user_auth');
  }
};

export const useAuthStore = create((set, get) => ({
  user: getStoredUser(),
  loading: false,
  error: null,
  recentlyViewed: (() => {
    try {
      const saved = localStorage.getItem('vlits_recently_viewed') || localStorage.getItem('nexus_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })(),

  // Verify active JWT token on startup
  checkAuth: async () => {
    const { user } = get();
    if (!user || !user.token) return null;
    try {
      const res = await api.get('/auth/me');
      const updatedUser = { ...user, ...res.data, token: user.token };
      persistUser(updatedUser);
      set({ user: updatedUser });
      return updatedUser;
    } catch (err) {
      if (err.response?.status === 401) {
        persistUser(null);
        set({ user: null });
      }
      return null;
    }
  },

  // One-click demo login for fast access
  demoLogin: async (role = 'student') => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/demo-login', { role });
      const user = res.data;
      persistUser(user);
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
      persistUser(user);
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
      persistUser(user);
      set({ user, loading: false });
      return user;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', loading: false });
      throw err;
    }
  },

  logout: () => {
    persistUser(null);
    set({ user: null });
  },

  toggleBookmark: async (projectId) => {
    const { user } = get();
    if (!user) return false;

    try {
      const res = await api.post(`/projects/${projectId}/bookmark`);
      const updatedBookmarks = res.data.bookmarks;
      const updatedUser = { ...user, bookmarks: updatedBookmarks };
      persistUser(updatedUser);
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
    localStorage.setItem('vlits_recently_viewed', JSON.stringify(updated));
    localStorage.setItem('nexus_recently_viewed', JSON.stringify(updated));
    set({ recentlyViewed: updated });
  }
}));

