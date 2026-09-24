import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, GraduationCap, Search, Sparkles, Filter, 
  Mail, Github, Linkedin, ExternalLink, Star, CheckCircle2,
  Send, X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';

export default function Collaborators() {
  const { user: currentUser } = useAuthStore();
  const [tab, setTab] = useState('students'); // 'students' | 'faculty'
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [searchSkill, setSearchSkill] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [loading, setLoading] = useState(true);

  // Connect Modal State
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [connectMessage, setConnectMessage] = useState('');
  const [connectProjectTitle, setConnectProjectTitle] = useState('');
  const [connectSending, setConnectSending] = useState(false);
  const [connectSuccess, setConnectSuccess] = useState(null);

  const branchesList = ['All', 'Computer Science & Engineering', 'Artificial Intelligence & Data Science', 'Information Technology', 'Electronics & Communication', 'IoT & Embedded Systems'];

  useEffect(() => {
    async function loadDirectory() {
      setLoading(true);
      try {
        const [stRes, facRes] = await Promise.allSettled([
          api.get('/users/collaborators'),
          api.get('/users/faculty')
        ]);
        if (stRes.status === 'fulfilled') setStudents(stRes.value.data);
        if (facRes.status === 'fulfilled') setFaculty(facRes.value.data);
      } catch (err) {
        console.error('Failed to load directory:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDirectory();
  }, []);

  const handleOpenConnect = (recipient) => {
    setSelectedRecipient(recipient);
    setConnectProjectTitle('');
    setConnectMessage(`Hi ${recipient.name.split(' ')[0]}! I would love to collaborate with you on a capstone project at Vignan's Lara.`);
    setConnectSuccess(null);
  };

  const handleSendConnect = async (e) => {
    e.preventDefault();
    if (!selectedRecipient) return;
    setConnectSending(true);
    try {
      const res = await api.post(`/users/${selectedRecipient._id}/connect`, {
        senderName: currentUser?.name || 'Vignan Lara Scholar',
        senderEmail: currentUser?.email || 'scholar@vignanlara.edu',
        projectTitle: connectProjectTitle || 'Capstone Collaboration',
        message: connectMessage
      });
      setConnectSuccess(res.data.message);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        setConnectSuccess(null);
        setSelectedRecipient(null);
      }, 2500);
    } catch (err) {
      alert('Failed to dispatch collaboration invite.');
    } finally {
      setConnectSending(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSkill = !searchSkill.trim() || 
      s.name.toLowerCase().includes(searchSkill.toLowerCase()) || 
      s.skills?.some(sk => (sk.name || sk).toLowerCase().includes(searchSkill.toLowerCase())) ||
      s.branch.toLowerCase().includes(searchSkill.toLowerCase());

    const matchesBranch = selectedBranch === 'All' || s.branch === selectedBranch;
    return matchesSkill && matchesBranch;
  });

  const filteredFaculty = faculty.filter(f => {
    const matchesSkill = !searchSkill.trim() || 
      f.name.toLowerCase().includes(searchSkill.toLowerCase()) || 
      f.department.toLowerCase().includes(searchSkill.toLowerCase()) ||
      f.skills?.some(sk => (sk.name || sk).toLowerCase().includes(searchSkill.toLowerCase()));

    const matchesBranch = selectedBranch === 'All' || f.department?.toLowerCase().includes(selectedBranch.toLowerCase());
    return matchesSkill && matchesBranch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
      
      {/* Header */}
      <div className="glass-card p-6 border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Users className="w-4 h-4" />
            <span>Cross-Batch College Talent Directory</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Find Student Collaborators & Faculty Mentors
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pair with students possessing complementary skills or discover supervising professors for your capstone idea
          </p>
        </div>

        {/* Skill Search Input */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchSkill}
            onChange={(e) => setSearchSkill(e.target.value)}
            placeholder="Search skill (e.g. Computer Vision)..."
            className="glass-input w-full pl-9 text-xs"
          />
        </div>
      </div>

      {/* Branch Quick Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          Branch:
        </span>
        {branchesList.map(branch => (
          <button
            key={branch}
            onClick={() => setSelectedBranch(branch)}
            className={`px-3 py-1 rounded-xl text-[11px] font-medium transition-all shrink-0 ${
              selectedBranch === branch
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            {branch}
          </button>
        ))}
      </div>

      {/* Tabs (Students / Faculty) */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setTab('students')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            tab === 'students'
              ? 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white shadow-md'
              : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Collaborators ({filteredStudents.length})</span>
        </button>

        <button
          onClick={() => setTab('faculty')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            tab === 'faculty'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Faculty Supervisors ({filteredFaculty.length})</span>
        </button>
      </div>

      {/* Students Grid */}
      {tab === 'students' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((st) => (
            <div key={st._id} className="glass-card p-5 border-white/10 space-y-4 flex flex-col justify-between hover:border-cyan-500/30 transition-all">
              <div>
                <div className="flex items-start gap-3.5">
                  <img
                    src={st.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${st.name}`}
                    alt={st.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-white/10"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-white truncate">{st.name}</h3>
                    <p className="text-[11px] text-cyan-400 font-medium truncate">{st.headline}</p>
                    <p className="text-[10px] text-slate-400">{st.batch} &bull; {st.branch}</p>
                  </div>
                </div>

                {st.bio && (
                  <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                    {st.bio}
                  </p>
                )}

                {/* Skills Chips */}
                <div className="mt-3.5">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1.5">Endorsed Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {st.skills?.map((sk, idx) => (
                      <span key={idx} className="glass-badge !bg-cyan-500/10 text-cyan-300 border-cyan-500/20 text-[10px]">
                        ✓ {sk.name || sk} <strong className="text-slate-400">({sk.endorsements || 1})</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => handleOpenConnect(st)}
                  className="btn-gradient !py-1.5 !px-3 text-[11px] font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>Connect</span>
                </button>

                <Link
                  to={`/profile/${st._id}`}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>Portfolio</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Faculty Grid */}
      {tab === 'faculty' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFaculty.map((fac) => (
            <div key={fac._id} className="glass-card p-5 border-amber-500/30 bg-amber-950/10 space-y-4 flex flex-col justify-between hover:border-amber-500/50 transition-all">
              <div>
                <div className="flex items-start gap-3.5">
                  <img
                    src={fac.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${fac.name}`}
                    alt={fac.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-amber-500/30"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Faculty Mentor</span>
                    <h3 className="font-bold text-sm text-white truncate">{fac.name}</h3>
                    <p className="text-[11px] text-amber-300 font-medium truncate">{fac.headline}</p>
                    <p className="text-[10px] text-slate-400">{fac.department} Department</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                  {fac.bio}
                </p>

                {/* Research Areas */}
                <div className="mt-3.5">
                  <span className="text-[11px] font-bold text-amber-300 block mb-1.5">Research Specializations:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {fac.skills?.map((sk, idx) => (
                      <span key={idx} className="glass-badge !bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px]">
                        ★ {sk.name || sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => handleOpenConnect(fac)}
                  className="btn-glass !py-1.5 !px-3 text-[11px] font-bold flex items-center gap-1.5 text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
                >
                  <Send className="w-3 h-3" />
                  <span>Request Guidance</span>
                </button>

                <Link
                  to={`/profile/${fac._id}`}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <span>Lab Details</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Connect Modal */}
      {selectedRecipient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md glass-panel rounded-2xl border border-white/15 p-6 shadow-2xl">
            <button
              onClick={() => setSelectedRecipient(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={selectedRecipient.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedRecipient.name}`}
                alt={selectedRecipient.name}
                className="w-10 h-10 rounded-xl object-cover bg-slate-800 border border-white/10"
              />
              <div>
                <h3 className="text-sm font-bold text-white">Connect with {selectedRecipient.name}</h3>
                <p className="text-[11px] text-cyan-400">{selectedRecipient.role === 'faculty' ? 'Faculty Mentorship' : 'Peer Collaboration'}</p>
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
                  <label className="text-slate-300 font-semibold block mb-1">Project Idea / Capstone Subject</label>
                  <input
                    type="text"
                    value={connectProjectTitle}
                    onChange={(e) => setConnectProjectTitle(e.target.value)}
                    placeholder="e.g. Traffic Accident Detection with Edge AI"
                    className="glass-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Proposal Note</label>
                  <textarea
                    rows={4}
                    value={connectMessage}
                    onChange={(e) => setConnectMessage(e.target.value)}
                    className="glass-input w-full resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setSelectedRecipient(null)}
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

