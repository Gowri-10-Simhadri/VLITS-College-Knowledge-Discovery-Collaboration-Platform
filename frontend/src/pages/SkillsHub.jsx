import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Search, Filter, Cpu, Database, Shield, Globe, 
  Layers, ChevronRight, User, FolderGit2, GraduationCap, ArrowRight
} from 'lucide-react';
import { api } from '../api/client';

export default function SkillsHub() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [search, setSearch] = useState('');

  const categories = [
    'All Categories',
    'AI & Data',
    'Robotics & Embedded',
    'Cloud & Systems',
    'Cybersecurity & Web3',
    'Full Stack Software'
  ];

  useEffect(() => {
    fetchSkills();
  }, [selectedCategory]);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All Categories') params.append('category', selectedCategory);
      if (search.trim()) params.append('search', search.trim());

      const res = await api.get(`/skills?${params.toString()}`);
      setSkills(res.data || []);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSkills();
  };

  const getCategoryIcon = (cat) => {
    if (cat?.includes('AI') || cat?.includes('Data')) return <Database className="w-4 h-4 text-cyan-400" />;
    if (cat?.includes('Robotics') || cat?.includes('Embedded')) return <Cpu className="w-4 h-4 text-amber-400" />;
    if (cat?.includes('Cyber') || cat?.includes('Web3')) return <Shield className="w-4 h-4 text-rose-400" />;
    return <Globe className="w-4 h-4 text-indigo-400" />;
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Institutional Competency Network
              </span>
              <span className="text-xs text-slate-400">Multi-domain Skill Explorer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              College Skill & Competency Graph
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl">
              Discover which skills are actively cultivated in VLITS labs, connect with verified student practitioners, find faculty research advisors, and inspect previous capstone architectures.
            </p>
          </div>

          <Link
            to="/graph"
            className="btn-glass self-start md:self-auto text-xs sm:text-sm !py-2.5 !px-5 text-emerald-300 border-emerald-500/30 hover:border-emerald-400"
          >
            <span>Interactive Graph View</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl space-y-4 border border-white/10 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skill (e.g., Computer Vision, PyTorch, LoRaWAN, Solidity)..."
              className="w-full pl-10 pr-20 py-2.5 bg-dark-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/60 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
            >
              Search
            </button>
          </form>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Loading verified competencies from MongoDB Atlas...</p>
        </div>
      ) : skills.length === 0 ? (
        <div className="py-16 text-center glass-card space-y-4">
          <Sparkles className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Skills Found</h3>
          <p className="text-xs text-slate-400">Try changing your search query or selecting All Categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map(skill => (
            <Link
              key={skill._id || skill.name}
              to={`/skills/${encodeURIComponent(skill.name)}`}
              className="glass-card p-6 flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                      {getCategoryIcon(skill.category)}
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-300 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      {skill.category || 'General'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {skill.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Knowledge hub connecting student practitioners, faculty mentors & capstone architectures.
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-dark-900/60 rounded-xl border border-white/5 text-center">
                  <div>
                    <span className="block text-base font-extrabold text-cyan-400">{skill.projectsCount || 0}</span>
                    <span className="text-[10px] text-slate-400">Capstones</span>
                  </div>
                  <div className="border-x border-white/5">
                    <span className="block text-base font-extrabold text-emerald-400">{skill.studentsCount || 0}</span>
                    <span className="text-[10px] text-slate-400">Students</span>
                  </div>
                  <div>
                    <span className="block text-base font-extrabold text-amber-400">{skill.facultyCount || 0}</span>
                    <span className="text-[10px] text-slate-400">Faculty</span>
                  </div>
                </div>

                {/* Sample Projects */}
                {skill.sampleProjects?.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Representative Work:</span>
                    {skill.sampleProjects.map((p, idx) => (
                      <div key={idx} className="text-xs text-slate-300 truncate flex items-center gap-1.5">
                        <FolderGit2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{p.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-emerald-300">
                <span>Inspect Knowledge Path</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
