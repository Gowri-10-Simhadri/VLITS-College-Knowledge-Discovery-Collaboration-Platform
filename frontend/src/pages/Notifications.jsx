import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, Mail, CheckCircle2, XCircle, Clock, User, 
  Send, Sparkles, FolderGit2, ArrowRight, MessageSquare
} from 'lucide-react';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';

export default function Notifications({ onOpenAuthModal }) {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'outgoing'
  const [requests, setRequests] = useState({ incoming: [], outgoing: [], all: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (user) {
      fetchCollaborations();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCollaborations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/collaborations/my');
      setRequests(res.data || { incoming: [], outgoing: [] });
    } catch (err) {
      console.error('Error fetching collaborations:', err);
      setError('Failed to fetch notifications.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setActionLoading(id);
    try {
      await api.patch(`/collaborations/${id}`, { status });
      fetchCollaborations();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update collaboration status.');
    } finally {
      setActionLoading(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-lg mx-auto text-center space-y-6">
        <div className="glass-card p-8 space-y-4">
          <Bell className="w-12 h-12 text-cyan-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Sign In to View Notifications</h2>
          <p className="text-xs text-slate-400">
            Sign in with your student or faculty profile to receive collaboration requests, mentor responses, and project invites.
          </p>
          <button onClick={onOpenAuthModal} className="btn-gradient text-xs !py-2.5 !px-5">
            Sign In / Demo Login
          </button>
        </div>
      </div>
    );
  }

  const currentList = activeTab === 'incoming' ? requests.incoming : requests.outgoing;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Collaboration Inbox & Invites
              </span>
              <span className="text-xs text-slate-400">Real-time Connection Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Notifications & Collaboration Requests
            </h1>
          </div>

          <Link
            to="/collaborators"
            className="btn-glass text-xs !py-2 !px-4 text-cyan-300 border-cyan-500/30 self-start sm:self-auto"
          >
            <span>Explore Students</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'incoming'
              ? 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Incoming Requests ({requests.incoming?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('outgoing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'outgoing'
              ? 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent Invites ({requests.outgoing?.length || 0})</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading collaboration requests...</p>
        </div>
      ) : error ? (
        <div className="glass-card p-6 border-rose-500/30 text-center text-rose-400 text-xs">
          {error}
        </div>
      ) : currentList?.length === 0 ? (
        <div className="py-16 text-center glass-card space-y-4">
          <MessageSquare className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No {activeTab} collaboration requests</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {activeTab === 'incoming' 
              ? 'When other students or faculty reach out to collaborate on your projects, their invitations will appear here.'
              : 'Browse student and faculty profiles to send mentorship inquiries or team invites.'}
          </p>
          <Link to="/collaborators" className="btn-gradient text-xs !py-2 !px-4 inline-block">
            Find Collaborators
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {currentList.map(req => {
            const isIncoming = activeTab === 'incoming';
            const otherPartyName = isIncoming ? req.senderName : req.recipientName;
            const otherPartyEmail = isIncoming ? req.senderEmail : req.recipientEmail;
            const otherPartyId = isIncoming ? req.senderId : req.recipientId;

            return (
              <div
                key={req._id}
                className="glass-card p-6 space-y-4 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.senderAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${otherPartyName}`}
                      alt={otherPartyName}
                      className="w-12 h-12 rounded-xl bg-slate-800 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{otherPartyName}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-cyan-300 border border-white/10 capitalize font-medium">
                          {isIncoming ? req.senderRole : req.recipientRole}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{otherPartyEmail}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize flex items-center gap-1.5 ${
                      req.status === 'accepted' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : req.status === 'rejected'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {req.status === 'accepted' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {req.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                      {req.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                      <span>{req.status}</span>
                    </span>
                  </div>
                </div>

                {/* Project Title & Message */}
                <div className="p-4 rounded-xl bg-dark-900/60 border border-white/5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>Project: {req.projectTitle}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "{req.message}"
                  </p>
                </div>

                {req.responseNote && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                    <strong>Response note:</strong> {req.responseNote}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500 text-[11px]">
                    {new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/profile/${otherPartyId}`}
                      className="btn-glass text-xs !py-1.5 !px-3"
                    >
                      View Profile
                    </Link>

                    {isIncoming && req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(req._id, 'accepted')}
                          disabled={actionLoading === req._id}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(req._id, 'rejected')}
                          disabled={actionLoading === req._id}
                          className="px-3 py-1.5 rounded-xl bg-rose-600/40 hover:bg-rose-600/60 text-rose-200 border border-rose-500/30 font-semibold flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
