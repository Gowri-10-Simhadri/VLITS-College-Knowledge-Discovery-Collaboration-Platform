import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, GraduationCap, Mail, Github, Linkedin, 
  ExternalLink, Star, Sparkles, Layers, Code, Heart 
} from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';

export default function Profile({ onOpenAuthModal }) {
  const { id } = useParams();
  const { user: currentUser } = useAuthStore();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const targetId = id || currentUser?._id;

  useEffect(() => {
    async function loadProfile() {
      if (!targetId) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/users/${targetId}`);
        setProfileData(res.data);
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [targetId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading College Profile...</p>
      </div>
    );
  }

  if (!profileData?.user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <User className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-lg font-bold text-white">Profile Not Found</h2>
        <p className="text-xs text-slate-400">Please sign in or select a valid college profile.</p>
        <button onClick={onOpenAuthModal} className="btn-gradient text-xs">
          Sign In
        </button>
      </div>
    );
  }

  const { user, projects } = profileData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-24">
      
      {/* Profile Header Glass Card */}
      <div className="glass-card p-6 sm:p-8 border-white/10 relative overflow-hidden bg-gradient-to-r from-primary-950/40 via-dark-900/60 to-cyan-950/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4 sm:gap-6">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-slate-800 border-2 border-cyan-500/40 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="glass-badge !bg-cyan-500/20 text-cyan-300 text-[10px] uppercase font-bold">
                  {user.role} &bull; {user.department || 'CSE'}
                </span>
                {user.batch && (
                  <span className="text-xs text-slate-400 font-medium">Batch {user.batch}</span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">{user.name}</h1>
              <p className="text-xs sm:text-sm text-cyan-300 font-medium mt-0.5">{user.headline}</p>

              <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                <a href={`mailto:${user.email}`} className="hover:text-cyan-300 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{user.email}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {user.github && (
              <a href={user.github} target="_blank" rel="noreferrer" className="p-2 rounded-xl glass-card text-slate-300 hover:text-white border-white/10">
                <Github className="w-4 h-4" />
              </a>
            )}
            {user.linkedin && (
              <a href={user.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-xl glass-card text-slate-300 hover:text-cyan-400 border-white/10">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>

        </div>

        {user.bio && (
          <p className="text-xs sm:text-sm text-slate-300 mt-6 pt-4 border-t border-white/10 max-w-3xl leading-relaxed">
            {user.bio}
          </p>
        )}
      </div>

      {/* Skills Matrix */}
      <div className="glass-card p-6 border-white/10 space-y-3">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Code className="w-4 h-4 text-cyan-400" />
          <span>Verified Skills & Endorsements</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {user.skills?.map((sk, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs flex items-center gap-2">
              <span className="font-semibold text-white">{sk.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                {sk.level || 'Expert'}
              </span>
              <span className="text-[10px] text-slate-400">({sk.endorsements || 12} endorsements)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Authored / Supervised Projects */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Published Capstone Research ({projects?.length || 0})</span>
        </h3>

        {projects?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <ProjectCard key={p._id} project={p} onOpenAuthModal={onOpenAuthModal} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center text-xs text-slate-400">
            No capstones published yet.
          </div>
        )}
      </div>

    </div>
  );
}
