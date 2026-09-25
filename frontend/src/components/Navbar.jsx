import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, Bookmark, Heart, GitCompare, Network, PlusCircle, 
  User as UserIcon, Sparkles, GraduationCap, Menu, X, ArrowRight,
  TrendingUp, Layers, Compass, LogOut, CheckCircle, FolderGit2,
  Cpu, BookOpen, Database, Bell, ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCompareStore } from '../store/useCompareStore';
import { api } from '../api/client';

export default function Navbar({ onOpenAuthModal }) {
  const { user, logout } = useAuthStore();
  const { compareList } = useCompareStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const searchContainerRef = useRef(null);

  // Fetch unread notifications count
  useEffect(() => {
    if (user) {
      api.get('/collaborations/my')
        .then(res => {
          const pending = res.data?.incoming?.filter(r => r.status === 'pending')?.length || 0;
          setUnreadNotifications(pending);
        })
        .catch(() => {});
    }
  }, [user, location.pathname]);

  // Fetch quick suggestions
  useEffect(() => {
    if (query.trim().length > 1) {
      const timer = setTimeout(async () => {
        try {
          const res = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
          setSuggestions(res.data || []);
          setShowSuggestions(true);
        } catch (e) {}
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      navigate(`/discover?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const selectSuggestion = (s) => {
    setQuery(s);
    setShowSuggestions(false);
    navigate(`/discover?q=${encodeURIComponent(s)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 shadow-lg shadow-black/20">
      {/* Top Banner (College Memory & Knowledge Preservation Banner) */}
      <div className="bg-gradient-to-r from-primary-900/60 via-indigo-900/40 to-cyan-900/60 text-xs py-1 px-4 text-center text-slate-300 border-b border-white/5 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span className="font-medium text-cyan-300">Vignan's Lara Living Memory:</span>
        <span className="hidden sm:inline">Preserving & connecting multi-generational student capstones, datasets & research.</span>
        <span className="sm:hidden">Cross-generational knowledge network</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-dark-950/80 backdrop-blur-sm rounded-[10px] flex items-center justify-center">
              <Network className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                Vignan's Lara
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                VLITS AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-1 hidden sm:block">Knowledge Discovery & Collaboration Platform</p>
          </div>
        </Link>

        {/* Global Smart Search Bar (Amazon / Flipkart Style) */}
        <div ref={searchContainerRef} className="flex-1 max-w-xl relative hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4 text-cyan-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length > 1 && setShowSuggestions(true)}
              placeholder="Enter project idea, technology, or problem statement..."
              className="w-full pl-10 pr-24 py-2 bg-white/[0.06] hover:bg-white/[0.08] focus:bg-dark-900 border border-white/10 focus:border-cyan-500/50 rounded-xl text-sm text-white placeholder-slate-400 outline-none transition-all shadow-inner focus:ring-2 focus:ring-cyan-500/20"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white rounded-lg text-xs font-semibold shadow-md flex items-center gap-1 transition-all"
            >
              <span>Discover</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </form>

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-dark-900/95 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl overflow-hidden z-50 py-1.5 animate-in fade-in duration-150">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Suggested College Knowledge Concepts
              </div>
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => selectSuggestion(item)}
                  className="w-full text-left px-3.5 py-2 text-sm text-slate-200 hover:text-white hover:bg-primary-600/20 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                    <span>{item}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 group-hover:text-slate-300">Explore &rarr;</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Nav Links & Actions */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold text-slate-300">
          <Link 
            to="/discover" 
            className={`flex items-center gap-1 hover:text-white transition-colors ${location.pathname === '/discover' ? 'text-cyan-400' : ''}`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Discover</span>
          </Link>

          <Link 
            to="/projects" 
            className={`flex items-center gap-1 hover:text-white transition-colors ${location.pathname === '/projects' ? 'text-cyan-400' : ''}`}
          >
            <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Projects</span>
          </Link>

          <Link 
            to="/graph" 
            className={`flex items-center gap-1 hover:text-white transition-colors ${location.pathname === '/graph' ? 'text-cyan-400' : ''}`}
          >
            <Network className="w-3.5 h-3.5 text-purple-400" />
            <span>Graph</span>
          </Link>

          <Link 
            to="/skills" 
            className={`flex items-center gap-1 hover:text-white transition-colors ${location.pathname === '/skills' ? 'text-emerald-400' : ''}`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Skills</span>
          </Link>

          <Link 
            to="/research" 
            className={`flex items-center gap-1 hover:text-white transition-colors ${location.pathname === '/research' ? 'text-purple-400' : ''}`}
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Research</span>
          </Link>

          <Link 
            to="/resources" 
            className={`flex items-center gap-1 hover:text-white transition-colors ${location.pathname === '/resources' ? 'text-rose-400' : ''}`}
          >
            <Database className="w-3.5 h-3.5 text-rose-400" />
            <span>Datasets</span>
          </Link>

          <Link 
            to="/faculty" 
            className={`flex items-center gap-1 hover:text-white transition-colors ${location.pathname === '/faculty' ? 'text-amber-400' : ''}`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span>Faculty</span>
          </Link>

          <Link 
            to="/collaborators" 
            className={`flex items-center gap-1 hover:text-white transition-colors ${location.pathname === '/collaborators' ? 'text-cyan-400' : ''}`}
          >
            <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Students</span>
          </Link>

          {/* Compare Pill */}
          {compareList.length > 0 && (
            <Link
              to="/compare"
              className="relative px-2.5 py-1 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold flex items-center gap-1 hover:bg-indigo-600/40 transition-all"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare ({compareList.length})</span>
            </Link>
          )}

          {/* Notifications / Collaboration Inbox */}
          <Link
            to="/notifications"
            title="Collaboration Requests"
            className="relative p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-cyan-300 transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-dark-950 text-[10px] font-black flex items-center justify-center animate-bounce">
                {unreadNotifications}
              </span>
            )}
          </Link>

          {/* Bookmarks / Wishlist */}
          <Link
            to="/bookmarks"
            title="Saved Projects"
            className="relative p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-rose-400 transition-all"
          >
            <Heart className={`w-4 h-4 ${user?.bookmarks?.length ? 'fill-rose-500 text-rose-500' : ''}`} />
            {user?.bookmarks?.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {user.bookmarks.length}
              </span>
            )}
          </Link>

          {/* Submit Capstone Button */}
          <Link
            to="/submit"
            className="btn-gradient text-xs !py-1.5 !px-3"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Publish</span>
          </Link>

          {/* User Auth Profile / Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-white/[0.06] border border-white/10 hover:border-cyan-500/40 transition-all"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg bg-slate-800 object-cover"
                />
                <span className="text-xs font-semibold text-white max-w-[80px] truncate">{user.name}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-dark-900/95 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-cyan-400 capitalize">{user.role} &bull; {user.department || 'CSE'}</p>
                  </div>
                  <Link
                    to={`/profile/${user._id}`}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/10"
                  >
                    <UserIcon className="w-4 h-4 text-cyan-400" />
                    <span>My College Portfolio</span>
                  </Link>
                  <Link
                    to="/notifications"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/10"
                  >
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>Collaboration Invites ({unreadNotifications})</span>
                  </Link>
                  <Link
                    to="/bookmarks"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/10"
                  >
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>Saved Capstones ({user.bookmarks?.length || 0})</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-emerald-300 hover:text-white hover:bg-emerald-500/10"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Admin Control Center</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-white/10 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="btn-glass text-xs !py-1.5 !px-3 !text-cyan-300 border-cyan-500/30 hover:border-cyan-400/50"
            >
              <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sign In</span>
            </button>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center gap-2">
          {user?.bookmarks?.length > 0 && (
            <Link
              to="/bookmarks"
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-rose-400"
            >
              <Heart className="w-4 h-4 fill-rose-500" />
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-dark-900/95 backdrop-blur-2xl px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto">
          <Link
            to="/discover"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-sm font-medium"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Discover Knowledge</span>
          </Link>
          <Link
            to="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-sm font-medium"
          >
            <FolderGit2 className="w-4 h-4 text-cyan-400" />
            <span>Capstone Projects</span>
          </Link>
          <Link
            to="/graph"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-sm font-medium"
          >
            <Network className="w-4 h-4 text-purple-400" />
            <span>Knowledge Graph</span>
          </Link>
          <Link
            to="/skills"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-sm font-medium"
          >
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Skill Explorer</span>
          </Link>
          <Link
            to="/research"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-sm font-medium"
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Research Papers</span>
          </Link>
          <Link
            to="/resources"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-sm font-medium"
          >
            <Database className="w-4 h-4 text-rose-400" />
            <span>Datasets & Labs</span>
          </Link>
          <Link
            to="/faculty"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-sm font-medium"
          >
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Faculty Mentors</span>
          </Link>
          <Link
            to="/collaborators"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-sm font-medium"
          >
            <UserIcon className="w-4 h-4 text-emerald-400" />
            <span>Students Matchmaker</span>
          </Link>
          <Link
            to="/notifications"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-sm font-medium"
          >
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>Notifications ({unreadNotifications})</span>
          </Link>
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm font-semibold text-emerald-300"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Control Center</span>
            </Link>
          )}
          <Link
            to="/submit"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-primary-600/30 to-cyan-600/30 border border-primary-500/30 text-sm font-semibold text-white"
          >
            <PlusCircle className="w-4 h-4 text-cyan-300" />
            <span>Publish Capstone</span>
          </Link>
          
          <div className="pt-2 border-t border-white/10">
            {user ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.05]">
                <div className="flex items-center gap-2">
                  <img src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`} className="w-8 h-8 rounded-lg" />
                  <div>
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
                  </div>
                </div>
                <button onClick={logout} className="text-xs text-rose-400 font-semibold px-2 py-1 bg-rose-500/10 rounded-lg">
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full btn-gradient !py-2.5 text-xs"
              >
                Sign In / Demo Access
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
