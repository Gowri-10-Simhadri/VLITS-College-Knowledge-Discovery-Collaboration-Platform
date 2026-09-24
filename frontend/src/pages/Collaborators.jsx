import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, GraduationCap, Search, Sparkles, Filter, 
  Mail, Github, Linkedin, ExternalLink, Star, CheckCircle2 
} from 'lucide-react';
import { api } from '../api/client';

export default function Collaborators() {
  const [tab, setTab] = useState('students'); // 'students' | 'faculty'
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [searchSkill, setSearchSkill] = useState('');
  const [loading, setLoading] = useState(true);

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

  const filteredStudents = students.filter(s => {
    if (!searchSkill.trim()) return true;
    const q = searchSkill.toLowerCase();
    return s.name.toLowerCase().includes(q) || 
      s.skills?.some(sk => sk.name.toLowerCase().includes(q)) ||
      s.branch.toLowerCase().includes(q);
  });

  const filteredFaculty = faculty.filter(f => {
    if (!searchSkill.trim()) return true;
    const q = searchSkill.toLowerCase();
    return f.name.toLowerCase().includes(q) || 
      f.department.toLowerCase().includes(q) ||
      f.skills?.some(sk => sk.name.toLowerCase().includes(q));
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
            <div key={st._id} className="glass-card p-5 border-white/10 space-y-4 flex flex-col justify-between">
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
                        ✓ {sk.name} <strong className="text-slate-400">({sk.endorsements || 1})</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <a
                  href={`mailto:${st.email}`}
                  className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{st.email}</span>
                </a>

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
            <div key={fac._id} className="glass-card p-5 border-amber-500/30 bg-amber-950/10 space-y-4 flex flex-col justify-between">
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
                        ★ {sk.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <a
                  href={`mailto:${fac.email}`}
                  className="text-slate-400 hover:text-amber-300 flex items-center gap-1 text-[11px]"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>{fac.email}</span>
                </a>

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

    </div>
  );
}
