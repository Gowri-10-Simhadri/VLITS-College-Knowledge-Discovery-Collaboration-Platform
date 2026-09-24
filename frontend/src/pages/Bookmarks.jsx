import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Layers, Sparkles } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';

export default function Bookmarks({ onOpenAuthModal }) {
  const { user } = useAuthStore();
  const [bookmarkedProjects, setBookmarkedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookmarks() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/users/bookmarks');
        setBookmarkedProjects(res.data);
      } catch (err) {
        console.error('Failed to load bookmarks:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBookmarks();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Heart className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Sign In to View Saved Capstones</h2>
        <p className="text-xs text-slate-400">
          Save projects, research papers, and datasets to build your personal knowledge repository.
        </p>
        <button onClick={onOpenAuthModal} className="btn-gradient text-xs">
          Sign In / Demo Access
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
      <div className="glass-card p-6 border-white/10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-1">
            <Heart className="w-4 h-4 fill-rose-500" />
            <span>Personal Knowledge Wishlist</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Saved Capstone Projects ({bookmarkedProjects.length})
          </h1>
        </div>

        <Link to="/discover" className="btn-glass text-xs flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Discover More</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => <div key={n} className="glass-card h-80 animate-pulse" />)}
        </div>
      ) : bookmarkedProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedProjects.map((project) => (
            <ProjectCard key={project._id} project={project} onOpenAuthModal={onOpenAuthModal} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-16 text-center space-y-3">
          <Heart className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Explore college knowledge and click the heart icon on any project to bookmark it for your research.
          </p>
          <Link to="/discover" className="btn-gradient text-xs inline-flex items-center gap-1.5 mt-2">
            <span>Discover Projects</span>
          </Link>
        </div>
      )}
    </div>
  );
}
