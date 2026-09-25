import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  GraduationCap, ArrowLeft, Mail, Award, BookOpen, FolderGit2, 
  Sparkles, ExternalLink, Send, CheckCircle2, User, Globe, Github, Linkedin
} from 'lucide-react';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';

export default function FacultyProfile({ onOpenAuthModal }) {
  const { id } = useParams();
  const { user } = useAuthStore();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Connect Modal State
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    fetchFacultyData();
  }, [id]);

  const fetchFacultyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/users/${id}`);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching faculty profile:', err);
      setError('Failed to load faculty profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendCollaboration = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuthModal?.();
      return;
    }
    setSending(true);
    try {
      await api.post('/collaborations', {
        recipientId: id,
        projectTitle: projectTitle || 'Capstone Project Mentorship Inquiry',
        message
      });
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        setConnectModalOpen(false);
        setMessage('');
        setProjectTitle('');
      }, 2500);
    } catch (err) {
      console.error('Error dispatching mentorship request:', err);
      alert('Failed to send mentorship request.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading faculty profile from MongoDB Atlas...</p>
      </div>
    );
  }

  if (error || !data?.user) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-3xl mx-auto text-center space-y-4">
        <div className="glass-card p-8 space-y-4 border-rose-500/30">
          <p className="text-rose-400 font-bold">{error || 'Faculty mentor not found.'}</p>
          <Link to="/faculty" className="btn-gradient text-xs !py-2 !px-4 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Faculty Directory
          </Link>
        </div>
      </div>
    );
  }

  const { user: faculty, projects } = data;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Link to="/faculty" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Faculty Directory
        </Link>
        <button
          onClick={() => setConnectModalOpen(true)}
          className="btn-gradient text-xs !py-1.5 !px-4 inline-flex items-center gap-1.5"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Request Project Mentorship</span>
        </button>
      </div>

      {/* Main Faculty Header */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden space-y-6">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          <img
            src={faculty.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${faculty.name}`}
            alt={faculty.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-800 object-cover border-2 border-amber-500/30 shadow-2xl flex-shrink-0"
          />

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {faculty.department || 'Computer Science & Engineering'}
              </span>
              <span className="text-xs text-slate-400 font-semibold">Faculty Mentor & Advisor</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {faculty.name}
            </h1>

            <p className="text-sm font-medium text-slate-300">
              {faculty.headline || 'Professor & Principal Research Advisor'}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <a href={`mailto:${faculty.email}`} className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{faculty.email}</span>
              </a>
              {faculty.linkedin && (
                <a href={faculty.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                  <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faculty Biography & Research Focus</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {faculty.bio || 'Advising final-year undergraduate capstones, interdisciplinary student teams, and peer-reviewed technical publications at Vignan\'s Lara Institute of Technology & Science.'}
          </p>
        </div>

        {/* Research Expertise */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Research Expertise & Mentoring Domains</h3>
          <div className="flex flex-wrap gap-2">
            {faculty.skills?.map((s, idx) => (
              <span key={idx} className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold">
                {s.name || s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Supervised Capstone Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Supervised Capstone Projects ({projects?.length || 0})</h2>
          </div>
        </div>

        {projects?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(p => (
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
        ) : (
          <p className="text-xs text-slate-400 glass-card p-6">No capstone projects currently linked to this supervisor.</p>
        )}
      </div>

      {/* Connect Modal */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-card max-w-lg w-full p-6 space-y-4 border border-amber-500/30">
            <h3 className="text-lg font-bold text-white">Request Mentorship from {faculty.name}</h3>
            <p className="text-xs text-slate-300">
              Submit your proposed capstone topic or research question directly to this faculty advisor's inbox.
            </p>

            {sentSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-center text-emerald-300 space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <p className="text-sm font-bold">Mentorship Request Dispatched!</p>
                <p className="text-xs text-slate-300">The faculty member has been notified via their college inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleSendCollaboration} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Proposed Project Title</label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g., Deep Learning for Autonomous Plant Pathology"
                    className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mentorship Inquiry / Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your project concept, target deliverables, and why this advisor's expertise is ideal..."
                    className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setConnectModalOpen(false)}
                    className="btn-glass text-xs !py-2 !px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-gradient text-xs !py-2 !px-4 inline-flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sending ? 'Sending...' : 'Send Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
