import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, Search, Filter, Cpu, ExternalLink, Sparkles, 
  FolderGit2, Server, MapPin, ChevronRight, ArrowRight
} from 'lucide-react';
import { api } from '../api/client';

export default function ResourcesHub() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('All Types');
  const [domain, setDomain] = useState('All Domains');
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  const types = ['All Types', 'Dataset', 'Lab Infrastructure'];
  const domains = [
    'All Domains',
    'AI & Machine Learning',
    'Internet of Things (IoT)',
    'Blockchain & Web3',
    'Cybersecurity & Cryptography'
  ];

  useEffect(() => {
    fetchResources();
  }, [type, domain]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (type !== 'All Types') params.append('type', type);
      if (domain !== 'All Domains') params.append('domain', domain);
      if (search.trim()) params.append('search', search.trim());

      const res = await api.get(`/resources?${params.toString()}`);
      setResources(res.data.resources || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResources();
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Institutional Datasets & Lab Facilities
              </span>
              <span className="text-xs text-slate-400">Total {total} Assets Available</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Datasets & Computing Resources
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl">
              Access high-performance GPU clusters, IoT sensor testbeds, private blockchain nodes, and benchmark training datasets curated for VLITS engineering scholars.
            </p>
          </div>

          <Link
            to="/discover?q=Datasets"
            className="btn-gradient self-start md:self-auto text-xs sm:text-sm !py-2.5 !px-5 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Discover by Topic</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl space-y-4 border border-white/10 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="w-4 h-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dataset name, lab equipment, GPU specs, or format..."
              className="w-full pl-10 pr-20 py-2.5 bg-dark-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-rose-500/60 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Type & Domain Filter Chips */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Type:</span>
            {types.map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  type === t
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Domain:</span>
            {domains.map(d => (
              <button
                key={d}
                onClick={() => setDomain(d)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  domain === d
                    ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-rose-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Loading datasets and lab assets from MongoDB Atlas...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="py-16 text-center glass-card space-y-4">
          <Database className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Resources Found</h3>
          <p className="text-xs text-slate-400">Try changing your filters or searching for different keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(res => (
            <div
              key={res._id}
              className="glass-card p-6 flex flex-col justify-between hover:border-rose-500/40 hover:shadow-xl hover:shadow-rose-500/10 hover:-translate-y-1 transition-all duration-300 group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    res.type === 'Lab Infrastructure' 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}>
                    {res.type}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{res.domain}</span>
                </div>

                <Link
                  to={`/resources/${res._id}`}
                  className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors block"
                >
                  {res.name}
                </Link>

                <p className="text-xs text-slate-300 line-clamp-3">
                  {res.description}
                </p>

                {res.location && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-300">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{res.location}</span>
                  </div>
                )}

                {res.format && (
                  <div className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">Format:</strong> {res.format} &bull; {res.size}
                  </div>
                )}

                {/* Techs */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {res.technologies?.slice(0, 4).map(t => (
                    <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-slate-300 border border-white/5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
                <Link
                  to={`/resources/${res._id}`}
                  className="text-rose-300 hover:text-white flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Asset Details</span>
                  <span>&rarr;</span>
                </Link>

                {(res.sourceUrl || res.documentationUrl) && (
                  <a
                    href={res.sourceUrl || res.documentationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-cyan-300 inline-flex items-center gap-1"
                  >
                    <span>External Link</span>
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
