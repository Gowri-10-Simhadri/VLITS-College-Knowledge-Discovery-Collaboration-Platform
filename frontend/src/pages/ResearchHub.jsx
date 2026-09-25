import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Search, Filter, ExternalLink, Sparkles, FolderGit2, 
  User, Award, ChevronRight, Share2, FileText, ArrowRight
} from 'lucide-react';
import { api } from '../api/client';

export default function ResearchHub() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState('All Domains');
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  const domains = [
    'All Domains',
    'AI & Machine Learning',
    'Internet of Things (IoT)',
    'Cybersecurity & Cryptography',
    'Blockchain & Web3',
    'Cloud Computing & DevOps',
    'Full Stack Web Systems',
    'Data Science & Analytics'
  ];

  useEffect(() => {
    fetchPapers();
  }, [domain]);

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (domain !== 'All Domains') params.append('domain', domain);
      if (search.trim()) params.append('search', search.trim());

      const res = await api.get(`/research?${params.toString()}`);
      setPapers(res.data.papers || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Error fetching research papers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPapers();
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Academic Research & Publications Hub
              </span>
              <span className="text-xs text-slate-400">Total {total} Publications Indexed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Faculty & Student Research Library
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl">
              Explore peer-reviewed IEEE, Springer, and ACM conference papers, theoretical formulations, and algorithmic research outputs connected to Vignan's Lara capstone projects.
            </p>
          </div>

          <Link
            to="/discover?q=Research"
            className="btn-gradient self-start md:self-auto text-xs sm:text-sm !py-2.5 !px-5 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Discover Research by Topic</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl space-y-4 border border-white/10 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by paper title, author, domain, or key theoretical terms..."
              className="w-full pl-10 pr-20 py-2.5 bg-dark-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/60 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Domain Filter Chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          {domains.map(d => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                domain === d
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Research Papers Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Loading research publications from MongoDB Atlas...</p>
        </div>
      ) : papers.length === 0 ? (
        <div className="py-16 text-center glass-card space-y-4">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Research Papers Found</h3>
          <p className="text-xs text-slate-400">Try changing your search terms or selecting All Domains.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {papers.map(paper => (
            <div
              key={paper._id}
              className="glass-card p-6 flex flex-col justify-between hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {paper.domain}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{paper.year} &bull; {paper.publication}</span>
                </div>

                <Link
                  to={`/research/${paper._id}`}
                  className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors block"
                >
                  {paper.title}
                </Link>

                <p className="text-xs text-slate-300">
                  <strong className="text-slate-400 font-medium">Authors: </strong>
                  {paper.authors}
                </p>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {paper.abstract}
                </p>

                {/* Associated Projects */}
                {paper.relatedProjects?.length > 0 && (
                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Citing Capstone Project:</span>
                    {paper.relatedProjects.map(p => (
                      <Link
                        key={p._id}
                        to={`/projects/${p._id}`}
                        className="text-xs text-cyan-300 hover:underline flex items-center gap-1.5 truncate"
                      >
                        <FolderGit2 className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{p.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
                <Link
                  to={`/research/${paper._id}`}
                  className="text-purple-300 hover:text-white flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Read Abstract & Citations</span>
                  <span>&rarr;</span>
                </Link>

                {paper.url && paper.url !== '#' && (
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-cyan-300 inline-flex items-center gap-1"
                  >
                    <span>Publisher Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
