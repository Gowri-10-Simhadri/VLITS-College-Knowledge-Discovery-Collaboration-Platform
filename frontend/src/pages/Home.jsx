import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Sparkles, Network, Database, GraduationCap, 
  Layers, ArrowRight, ShieldCheck, Cpu, Code2, Heart,
  Flame, CheckCircle, TrendingUp, Compass, GitMerge, FileText
} from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';

export default function Home({ onOpenAuthModal }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [trendingProjects, setTrendingProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 248,
    totalStudents: 1120,
    totalFaculty: 42,
    totalGraphNodes: 380,
    totalRelationships: 610,
    knowledgeReuseIndex: '94.8%'
  });

  const sampleSearchPrompts = [
    "AI-based traffic accident detection system",
    "Crop disease detection using computer vision",
    "Epileptic seizure prediction with wearable EEG",
    "Tamper-proof academic degrees on Ethereum",
    "Smart campus IoT energy optimizer"
  ];

  const domains = [
    { name: 'Computer Vision & AI', count: 48, icon: '👁️', color: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/30' },
    { name: 'Smart Agriculture & Environment', count: 32, icon: '🌱', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30' },
    { name: 'Healthcare & Biomedical', count: 29, icon: '🩺', color: 'from-rose-500/20 to-pink-500/20', border: 'border-rose-500/30' },
    { name: 'Blockchain & Web3', count: 21, icon: '⛓️', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
    { name: 'Natural Language Processing', count: 37, icon: '🗣️', color: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/30' },
    { name: 'Internet of Things & Embedded', count: 41, icon: '📡', color: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30' }
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const [featRes, trendRes, statsRes] = await Promise.allSettled([
          api.get('/projects/featured'),
          api.get('/projects/trending'),
          api.get('/graph/stats')
        ]);

        if (featRes.status === 'fulfilled') setFeaturedProjects(featRes.value.data);
        if (trendRes.status === 'fulfilled') setTrendingProjects(trendRes.value.data);
        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePromptClick = (prompt) => {
    setSearchQuery(prompt);
    navigate(`/discover?q=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 pb-8 overflow-hidden">
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-primary-600/20 via-cyan-500/20 to-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-5 shadow-lg shadow-cyan-500/10 animate-pulse-slow">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Digital Knowledge Memory of Vignan's Lara (VLITS)</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover, Reuse & Build Upon <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Vignan's Lara College Knowledge
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            When students graduate from Vignan's Lara, their breakthroughs shouldn't disappear. Search any project idea to discover previous code, datasets, faculty research, solved bugs, and skilled collaborators across graduating batches.
          </p>

          {/* Big Hero Search Bar (Amazon / Discovery Style) */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative flex items-center p-1.5 glass-panel rounded-2xl border-2 border-white/15 focus-within:border-cyan-400/80 shadow-2xl transition-all">
              <div className="pl-3.5 text-slate-400">
                <Search className="w-5 h-5 text-cyan-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="E.g. I want to build an AI-based traffic accident detection system..."
                className="w-full px-3.5 py-3 bg-transparent text-sm text-white placeholder-slate-400 outline-none"
              />
              <button
                type="submit"
                className="btn-gradient !py-3 !px-6 text-xs sm:text-sm font-bold flex-shrink-0"
              >
                <span>Search Memory</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Prompts (Flipkart search tags) */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 text-[11px]">Try queries:</span>
              {sampleSearchPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 text-cyan-300 text-[11px] font-medium transition-colors text-left"
                >
                  "{prompt.slice(0, 32)}..."
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Knowledge Network Counter Ribbon */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="glass-card p-6 border-white/10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
              {stats.totalProjects}+
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">Preserved Capstones</p>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">
              {stats.totalGraphNodes}+
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">Knowledge Nodes</p>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">
              {stats.totalRelationships}+
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">Connected Graph Links</p>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              {stats.totalFaculty}
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">Faculty Mentors</p>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
              64+
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">College Datasets</p>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">
              {stats.knowledgeReuseIndex || '94.8%'}
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">Knowledge Reuse Rate</p>
          </div>
        </div>
      </section>

      {/* Featured / Award-Winning Capstones (Amazon Featured Style) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Award-Winning College Capstones</h2>
              <p className="text-xs text-slate-400">Top-rated projects with complete code, datasets, and solved hurdles</p>
            </div>
          </div>

          <Link to="/discover" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.slice(0, 3).map((project) => (
            <ProjectCard key={project._id} project={project} onOpenAuthModal={onOpenAuthModal} />
          ))}
        </div>
      </section>

      {/* Browse by Knowledge Domains (Flipkart Category Tiles) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Browse by College Research Domain</h2>
              <p className="text-xs text-slate-400">Explore interconnected knowledge hubs across departments</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {domains.map((dom, idx) => (
            <Link
              key={idx}
              to={`/discover?domain=${encodeURIComponent(dom.name)}`}
              className={`glass-card p-4 rounded-xl border ${dom.border} bg-gradient-to-b ${dom.color} hover:scale-[1.03] transition-all flex flex-col justify-between h-32 group`}
            >
              <div className="text-2xl">{dom.icon}</div>
              <div>
                <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {dom.name}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">{dom.count} Capstones</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending This Semester (Amazon Deals / Trending) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Trending in College This Semester</h2>
              <p className="text-xs text-slate-400">Most viewed and bookmarked research by juniors and faculty</p>
            </div>
          </div>

          <Link to="/discover?sort=views" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            <span>View Rankings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingProjects.slice(0, 3).map((project) => (
            <ProjectCard key={project._id} project={project} onOpenAuthModal={onOpenAuthModal} />
          ))}
        </div>
      </section>

      {/* Why Living Memory Matters (The Problem vs Solution Comparison Matrix) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="glass-card p-6 sm:p-8 border-cyan-500/30 bg-gradient-to-r from-primary-950/60 via-dark-900/80 to-cyan-950/60">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Why the "Living Memory" Paradigm Changes Everything
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Transforming isolated capstone projects into an interconnected college brain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Way */}
            <div className="p-5 rounded-xl bg-rose-500/[0.04] border border-rose-500/20 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <span>❌ Traditional College Silos</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Students graduate & their source code, dataset links, and hard-earned solutions are lost forever.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Next batch starts from zero, repeating the same bugs and wasting months on solved problems.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Faculty guide repetitive basic projects instead of pushing frontiers.</span>
                </li>
              </ul>
            </div>

            {/* The Vignan's Lara Way */}
            <div className="p-5 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <span>✨ Vignan's Lara Living Memory</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Every project preserves its datasets, paper citations, pitfalls faced, and exact solutions applied.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Juniors discover previous foundations within seconds and build innovative extension layers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Skill-based collaborator matching pairs complementary student talents seamlessly.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/graph"
              className="btn-gradient inline-flex items-center gap-2 text-xs sm:text-sm !py-3 !px-6"
            >
              <Network className="w-4 h-4" />
              <span>Explore Interactive College Knowledge Graph</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
