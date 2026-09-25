import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpen, ArrowLeft, ExternalLink, Sparkles, FolderGit2, 
  User, Award, Share2, Copy, Check, FileText, Cpu, ChevronRight
} from 'lucide-react';
import { api } from '../api/client';

export default function ResearchDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [citationFormat, setCitationFormat] = useState('IEEE');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPaperDetail();
  }, [id]);

  const fetchPaperDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/research/${id}`);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching paper detail:', err);
      setError('Failed to load research publication details.');
    } finally {
      setLoading(false);
    }
  };

  const generateCitation = () => {
    if (!data?.paper) return '';
    const { title, authors, publication, year, doi } = data.paper;
    if (citationFormat === 'IEEE') {
      return `${authors}, "${title}," in ${publication}, ${year}, doi: ${doi || '10.1109/VLITS.2024'}.`;
    }
    if (citationFormat === 'BibTeX') {
      return `@article{vlits_${id},\n  title={${title}},\n  author={${authors}},\n  journal={${publication}},\n  year={${year}},\n  doi={${doi || '10.1109/VLITS.2024'}}\n}`;
    }
    return `${authors} (${year}). ${title}. ${publication}. https://doi.org/${doi || '10.1109/VLITS.2024'}`;
  };

  const copyCitation = () => {
    navigator.clipboard.writeText(generateCitation());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading publication metadata from MongoDB Atlas...</p>
      </div>
    );
  }

  if (error || !data?.paper) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-3xl mx-auto text-center space-y-4">
        <div className="glass-card p-8 space-y-4 border-rose-500/30">
          <p className="text-rose-400 font-bold">{error || 'Research paper not found.'}</p>
          <Link to="/research" className="btn-gradient text-xs !py-2 !px-4 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Research Library
          </Link>
        </div>
      </div>
    );
  }

  const { paper, relatedProjects } = data;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Link to="/research" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Research Library
        </Link>
        <div className="flex items-center gap-2">
          {paper.url && paper.url !== '#' && (
            <a
              href={paper.url}
              target="_blank"
              rel="noreferrer"
              className="btn-gradient text-xs !py-1.5 !px-3.5 inline-flex items-center gap-1.5"
            >
              <span>Read Full Paper</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Main Paper Header */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden space-y-5">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {paper.domain}
          </span>
          <span className="text-xs text-slate-400 font-semibold">{paper.publication} &bull; {paper.year}</span>
          {paper.doi && (
            <span className="text-xs text-cyan-400 font-mono bg-dark-900/60 px-2.5 py-0.5 rounded border border-white/5">
              DOI: {paper.doi}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {paper.title}
        </h1>

        <div className="p-4 rounded-xl bg-dark-900/60 border border-white/5 space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Contributing Authors & Mentors</p>
          <p className="text-sm font-semibold text-slate-200">{paper.authors}</p>
        </div>

        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Abstract & Executive Summary</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {paper.abstract}
          </p>
        </div>
      </div>

      {/* Citation Generator */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Generate Academic Citation</h3>
          </div>

          <div className="flex items-center gap-2">
            {['IEEE', 'BibTeX', 'APA'].map(fmt => (
              <button
                key={fmt}
                onClick={() => setCitationFormat(fmt)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  citationFormat === fmt
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {fmt}
              </button>
            ))}
            <button
              onClick={copyCitation}
              className="btn-glass text-xs !py-1 !px-2.5 text-purple-300 border-purple-500/30 flex items-center gap-1 ml-2"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <pre className="p-4 rounded-xl bg-dark-950 border border-white/10 text-xs font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap">
          {generateCitation()}
        </pre>
      </div>

      {/* Associated Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Associated College Capstone Projects ({relatedProjects?.length || 0})</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProjects?.map(p => (
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
                  {p.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Batch {p.batch || '2023-2027'}</span>
                <span className="text-cyan-300 font-semibold group-hover:translate-x-1 transition-transform">Inspect &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
