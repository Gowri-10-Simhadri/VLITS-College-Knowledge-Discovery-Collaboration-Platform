import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, GraduationCap, Mail, Github, Linkedin, 
  ExternalLink, Star, Sparkles, Layers, Code, Heart,
  Edit3, Save, X, Globe, CheckCircle2, Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ProjectCard from '../components/ProjectCard';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';

export default function Profile({ onOpenAuthModal }) {
  const { id } = useParams();
  const { user: currentUser } = useAuthStore();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editHeadline, setEditHeadline] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editBatch, setEditBatch] = useState('');
  const [editBranch, setEditBranch] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editPortfolio, setEditPortfolio] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Connect Modal State
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [connectMessage, setConnectMessage] = useState('');
  const [connectProjectTitle, setConnectProjectTitle] = useState('');
  const [connectSending, setConnectSending] = useState(false);
  const [connectSuccess, setConnectSuccess] = useState(null);

  const targetId = id || currentUser?._id;
  const isOwnProfile = currentUser && currentUser._id === (id || currentUser._id);

  useEffect(() => {
    async function loadProfile() {
      if (!targetId) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/users/${targetId}`);
        setProfileData(res.data);
        
        // Pre-fill edit form
        if (res.data?.user) {
          const u = res.data.user;
          setEditName(u.name || '');
          setEditHeadline(u.headline || '');
          setEditBio(u.bio || '');
          setEditBatch(u.batch || '2023-2027');
          setEditBranch(u.branch || 'Computer Science & Engineering');
          setEditDepartment(u.department || 'CSE');
          setEditSkills(u.skills?.map(s => s.name || s).join(', ') || '');
          setEditGithub(u.github || '');
          setEditLinkedin(u.linkedin || '');
          setEditPortfolio(u.portfolio || '');
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [targetId]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setSaving(true);
    try {
      const skillsArray = editSkills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.put('/users/profile', {
        name: editName,
        headline: editHeadline,
        bio: editBio,
        batch: editBatch,
        branch: editBranch,
        department: editDepartment,
        skills: skillsArray,
        github: editGithub,
        linkedin: editLinkedin,
        portfolio: editPortfolio
      });

      setProfileData(prev => ({
        ...prev,
        user: { ...prev.user, ...res.data }
      }));

      // Update zustand store
      useAuthStore.setState({ user: { ...currentUser, ...res.data, token: currentUser.token } });
      localStorage.setItem('vlits_user_auth', JSON.stringify({ ...currentUser, ...res.data, token: currentUser.token }));

      setSaveSuccess(true);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditModalOpen(false);
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSendConnect = async (e) => {
    e.preventDefault();
    setConnectSending(true);
    try {
      const res = await api.post(`/users/${profileData.user._id}/connect`, {
        senderName: currentUser?.name || 'Vignan Lara Scholar',
        senderEmail: currentUser?.email || 'scholar@vignanlara.edu',
        projectTitle: connectProjectTitle || 'Capstone Collaboration',
        message: connectMessage
      });
      setConnectSuccess(res.data.message);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        setConnectSuccess(null);
        setIsConnectOpen(false);
        setConnectMessage('');
        setConnectProjectTitle('');
      }, 3000);
    } catch (err) {
      alert('Failed to dispatch collaboration invite.');
    } finally {
      setConnectSending(false);
    }
  };

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

          {/* Action Buttons: Edit Profile or Connect */}
          <div className="flex items-center gap-2 flex-wrap">
            {isOwnProfile ? (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="btn-glass !py-2 !px-4 text-xs font-semibold flex items-center gap-2 text-cyan-300 border-cyan-500/30"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={() => setIsConnectOpen(true)}
                className="btn-gradient !py-2 !px-4 text-xs font-semibold flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Collaborate / Connect</span>
              </button>
            )}

            {user.github && (
              <a href={user.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-white border-white/10" title="GitHub">
                <Github className="w-4 h-4" />
              </a>
            )}
            {user.linkedin && (
              <a href={user.linkedin} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-cyan-400 border-white/10" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {user.portfolio && (
              <a href={user.portfolio} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-emerald-400 border-white/10" title="Portfolio">
                <Globe className="w-4 h-4" />
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
          {user.skills && user.skills.length > 0 ? (
            user.skills.map((sk, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs flex items-center gap-2">
                <span className="font-semibold text-white">{sk.name || sk}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                  {sk.level || 'Expert'}
                </span>
                <span className="text-[10px] text-slate-400">({sk.endorsements || 12} endorsements)</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400">No skills added yet. Click "Edit Profile" to add skills.</p>
          )}
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

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-white/15 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-5">
              <Edit3 className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Edit College Profile</h3>
            </div>

            {saveSuccess && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile updated successfully in MongoDB Atlas!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="glass-input w-full"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Headline / Role Tagline</label>
                <input
                  type="text"
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  placeholder="e.g. AI Researcher | Computer Vision Specialist"
                  className="glass-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Batch</label>
                  <input
                    type="text"
                    value={editBatch}
                    onChange={(e) => setEditBatch(e.target.value)}
                    placeholder="2023-2027"
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Department</label>
                  <input
                    type="text"
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    placeholder="CSE / IT / ECE"
                    className="glass-input w-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Branch / Specialization</label>
                <input
                  type="text"
                  value={editBranch}
                  onChange={(e) => setEditBranch(e.target.value)}
                  placeholder="Computer Science & Engineering"
                  className="glass-input w-full"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  placeholder="Computer Vision, PyTorch, React, Python"
                  className="glass-input w-full"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Biography / About</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell peers and professors about your research interests and projects..."
                  className="glass-input w-full resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={editGithub}
                    onChange={(e) => setEditGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={editLinkedin}
                    onChange={(e) => setEditLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="glass-input w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-glass !py-2 !px-4 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-gradient !py-2 !px-5 text-xs font-bold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collaboration Connect Modal */}
      {isConnectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md glass-panel rounded-2xl border border-white/15 p-6 shadow-2xl">
            <button
              onClick={() => setIsConnectOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <Send className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-base font-bold text-white">Connect with {user.name}</h3>
                <p className="text-[11px] text-slate-400">Send an invitation to collaborate on a capstone project</p>
              </div>
            </div>

            {connectSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{connectSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSendConnect} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Capstone Topic / Project Idea</label>
                  <input
                    type="text"
                    value={connectProjectTitle}
                    onChange={(e) => setConnectProjectTitle(e.target.value)}
                    placeholder="e.g. Edge AI Crop Disease Diagnostic Device"
                    className="glass-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Collaboration Note</label>
                  <textarea
                    rows={4}
                    value={connectMessage}
                    onChange={(e) => setConnectMessage(e.target.value)}
                    placeholder="Hi! I noticed your skills in computer vision. Would you like to collaborate on our upcoming capstone project?"
                    className="glass-input w-full resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsConnectOpen(false)}
                    className="btn-glass !py-2 !px-4 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={connectSending}
                    className="btn-gradient !py-2 !px-5 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{connectSending ? 'Sending...' : 'Send Request'}</span>
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

