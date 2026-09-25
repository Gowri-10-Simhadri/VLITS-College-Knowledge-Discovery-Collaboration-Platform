import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Database, ArrowLeft, ExternalLink, Sparkles, FolderGit2, 
  MapPin, Server, Cpu, Shield, Layers, ChevronRight
} from 'lucide-react';
import { api } from '../api/client';

export default function ResourceDetail() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResourceDetail();
  }, [id]);

  const fetchResourceDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/resources/${id}`);
      setResource(res.data);
    } catch (err) {
      console.error('Error fetching resource detail:', err);
      setError('Failed to load resource details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-rose-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading resource details from MongoDB Atlas...</p>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-3xl mx-auto text-center space-y-4">
        <div className="glass-card p-8 space-y-4 border-rose-500/30">
          <p className="text-rose-400 font-bold">{error || 'Resource not found.'}</p>
          <Link to="/resources" className="btn-gradient text-xs !py-2 !px-4 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Resources Catalog
          </Link>
        </div>
      </div>
    );
  }

  const externalUrl = resource.sourceUrl || resource.documentationUrl;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Link to="/resources" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Resources Catalog
        </Link>
        {externalUrl && externalUrl !== '#' && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-gradient text-xs !py-1.5 !px-3.5 inline-flex items-center gap-1.5"
          >
            <span>{resource.type === 'Lab Infrastructure' ? 'Official Documentation' : 'Download Dataset'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Main Asset Header */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden space-y-5">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
            resource.type === 'Lab Infrastructure' 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
              : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
          }`}>
            {resource.type}
          </span>
          <span className="text-xs text-slate-400 font-semibold">{resource.domain}</span>
          <span className="text-xs text-cyan-400 font-semibold">{resource.category}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {resource.name}
        </h1>

        {resource.location && (
          <div className="p-4 rounded-xl bg-dark-900/60 border border-white/5 flex items-center gap-2 text-sm text-amber-300">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{resource.location}</span>
          </div>
        )}

        {resource.accessLevel && (
          <div className="p-4 rounded-xl bg-dark-900/60 border border-white/5 space-y-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Access Guidelines & Eligibility</p>
            <p className="text-sm font-semibold text-slate-200">{resource.accessLevel}</p>
          </div>
        )}

        {resource.format && (
          <div className="p-4 rounded-xl bg-dark-900/60 border border-white/5 space-y-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Data Payload Specification</p>
            <p className="text-sm font-semibold text-slate-200">{resource.format} &bull; {resource.size}</p>
          </div>
        )}

        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Technical Specifications & Overview</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {resource.description}
          </p>
        </div>

        {/* Technologies */}
        {resource.technologies?.length > 0 && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compatible Technologies & Toolchains</h3>
            <div className="flex flex-wrap gap-2">
              {resource.technologies.map(tech => (
                <span key={tech} className="px-3 py-1 rounded-xl bg-white/5 text-slate-200 border border-white/10 text-xs font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Associated Projects */}
      {resource.relatedProjects?.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Associated College Capstone Projects ({resource.relatedProjects.length})</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resource.relatedProjects.map(p => (
              <Link
                key={p._id}
                to={`/projects/${p._id}`}
                className="glass-card p-5 space-y-3 hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                    {p.domain}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mt-2 line-clamp-1">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                    {p.description || 'Capstone initiative utilizing this dataset/lab facility.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>Batch {p.year || '2024'}</span>
                  <span className="text-cyan-300 font-semibold group-hover:translate-x-1 transition-transform">Inspect &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
