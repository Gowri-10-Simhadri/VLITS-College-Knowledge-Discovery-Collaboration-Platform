import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FolderGit2, Search, Filter, SlidersHorizontal, ArrowUpDown, 
  ExternalLink, Github, Heart, GitCompare, Sparkles, CheckCircle2,
  Calendar, Award, User, BookOpen, Layers, LayoutGrid, List
} from 'lucide-react';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useCompareStore } from '../store/useCompareStore';

export default function Projects({ onOpenAuthModal }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, updateUserBookmarks } = useAuthStore();
  const { compareList, toggleCompare, isInCompare } = useCompareStore();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Filters state
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [domain, setDomain] = useState(searchParams.get('domain') || 'All Domains');
  const [batch, setBatch] = useState(searchParams.get('batch') || 'All Batches');
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');
  const [totalCount, setTotalCount] = useState(0);

  const domains = [
    'All Domains',
    'AI & Machine Learning',
    'Internet of Things (IoT)',
    'Cybersecurity & Cryptography',
    'Blockchain & Web3',
    'Cloud Computing & DevOps',
    'Full Stack Web Systems',
    'Data Science & Analytics',
    'Embedded Systems & VLSI'
  ];

  const batches = [
    'All Batches',
    '2023-2027',
    '2022-2026',
    '2021-2025',
    '2020-2024'
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'Newest Published' },
    { value: 'rating', label: 'Highest Rated (⭐ 5.0)' },
    { value: 'views', label: 'Most Viewed & Cited' },
    { value: 'year-desc', label: 'Academic Year (Latest)' }
  ];

  useEffect(() => {
    fetchProjects();
  }, [domain, batch, sort]);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (domain !== 'All Domains') params.append('domain', domain);
      if (batch !== 'All Batches') params.append('batch', batch);
      if (query.trim()) params.append('q', query.trim());
      if (sort) params.append('sort', sort);
      params.append('limit', '50');

      const res = await api.get(`/projects?${params.toString()}`);
      setProjects(res.data.projects || []);
      setTotalCount(res.data.total || 0);
    } catch (err) {
      console.error('Error fetching projects repository:', err);
      setError('Failed to load projects from college knowledge base.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleBookmarkToggle = async (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      onOpenAuthModal?.();
      return;
    }
    try {
      const res = await api.post(`/projects/${projectId}/bookmark`);
      if (res.data && res.data.bookmarks) {
        updateUserBookmarks(res.data.bookmarks);
      }
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Capstone Knowledge Vault
              </span>
              <span className="text-xs text-slate-400">Total {totalCount} Projects Documented</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              College Capstone & Research Repository
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl">
              Explore multi-generational final year capstone initiatives, technical architectures, problem-solving methodologies, and research citations from Vignan's Lara scholars.
            </p>
          </div>

          <Link
            to="/submit"
            className="btn-gradient self-start md:self-auto text-xs sm:text-sm !py-2.5 !px-5 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Publish Capstone</span>
          </Link>
        </div>
      </div>

      {/* Control Bar: Search, Filters, Sorting & View Toggle */}
      <div className="glass-panel p-4 rounded-2xl space-y-4 border border-white/10 shadow-xl">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, technology, domain, problem solved, or skill..."
              className="w-full pl-10 pr-20 py-2.5 bg-dark-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/60 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-xs font-semibold"
            >
              Filter
            </button>
          </form>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-dark-900/80 border border-white/10 rounded-xl text-xs sm:text-sm text-slate-200 px-3 py-2.5 focus:outline-none focus:border-cyan-500/60"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-dark-900 text-white">
                  {opt.label}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center p-1 bg-dark-900/80 border border-white/10 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" /> Domain:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {domains.map(d => (
              <button
                key={d}
                onClick={() => setDomain(d)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  domain === d 
                    ? 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white shadow-md' 
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Batch Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Batch:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {batches.map(b => (
              <button
                key={b}
                onClick={() => setBatch(b)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  batch === b 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Querying College Knowledge Base & MongoDB Atlas...</p>
        </div>
      ) : error ? (
        <div className="p-8 glass-card border border-rose-500/30 text-center space-y-3">
          <p className="text-rose-400 font-semibold">{error}</p>
          <button onClick={fetchProjects} className="btn-gradient text-xs">Retry Query</button>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-16 text-center glass-card space-y-4">
          <FolderGit2 className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Matching Capstones Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try resetting your domain or batch filters, or enter a different technical keyword.
          </p>
          <button
            onClick={() => {
              setDomain('All Domains');
              setBatch('All Batches');
              setQuery('');
            }}
            className="btn-glass text-xs"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => {
            const isSaved = user?.bookmarks?.includes(project._id);
            const inCompare = isInCompare(project._id);

            return (
              <div
                key={project._id}
                className="glass-card group flex flex-col justify-between overflow-hidden hover:border-cyan-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1"
              >
                {/* Thumbnail Header */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={project.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-dark-900/90 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                      {project.domain}
                    </span>
                    {project.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                        {project.badge}
                      </span>
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => handleBookmarkToggle(e, project._id)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-dark-900/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-rose-400 transition-all"
                    title={isSaved ? "Remove from bookmarks" : "Save project"}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold text-white">Batch {project.batch || '2023-2027'}</span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      ⭐ {project.rating?.average ? project.rating.average.toFixed(1) : '5.0'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1"
                    >
                      {project.title}
                    </Link>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1.5">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Stack Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack?.slice(0, 4).map(tech => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/5 text-slate-300 border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                    {(project.techStack?.length || 0) > 4 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                        +{project.techStack.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Faculty & Team Footer */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <User className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">Mentor: {project.facultySupervisor?.name || 'Dr. Ramesh Kumar'}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Compare Toggle Button */}
                      <button
                        onClick={() => toggleCompare(project._id)}
                        className={`p-1.5 rounded-lg border text-xs transition-all ${
                          inCompare 
                            ? 'bg-indigo-600/40 border-indigo-400 text-indigo-200' 
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                        title={inCompare ? "Remove from comparison" : "Add to comparison"}
                      >
                        <GitCompare className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        to={`/projects/${project._id}`}
                        className="px-3 py-1.5 rounded-lg bg-primary-600/30 hover:bg-primary-600/50 border border-primary-500/30 text-cyan-300 font-semibold text-xs flex items-center gap-1 transition-all"
                      >
                        <span>Inspect</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {projects.map(project => {
            const isSaved = user?.bookmarks?.includes(project._id);
            const inCompare = isInCompare(project._id);

            return (
              <div
                key={project._id}
                className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:border-cyan-500/40 transition-all"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={project.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80'}
                    alt={project.title}
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0 hidden sm:block bg-slate-900"
                  />
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {project.domain}
                      </span>
                      <span className="text-xs text-slate-400">Batch {project.batch || '2023-2027'}</span>
                      <span className="text-xs text-amber-400 font-bold">
                        ⭐ {project.rating?.average ? project.rating.average.toFixed(1) : '5.0'}
                      </span>
                    </div>

                    <Link
                      to={`/projects/${project._id}`}
                      className="text-base sm:text-lg font-bold text-white hover:text-cyan-300 transition-colors block"
                    >
                      {project.title}
                    </Link>

                    <p className="text-xs text-slate-300 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.techStack?.slice(0, 5).map(tech => (
                        <span key={tech} className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-slate-300 border border-white/5">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 flex-shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleBookmarkToggle(e, project._id)}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-rose-400 transition-all"
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    <button
                      onClick={() => toggleCompare(project._id)}
                      className={`p-2 rounded-xl border transition-all ${
                        inCompare 
                          ? 'bg-indigo-600/40 border-indigo-400 text-indigo-200' 
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <GitCompare className="w-4 h-4" />
                    </button>
                  </div>

                  <Link
                    to={`/projects/${project._id}`}
                    className="btn-gradient text-xs !py-2 !px-4"
                  >
                    View Project
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
