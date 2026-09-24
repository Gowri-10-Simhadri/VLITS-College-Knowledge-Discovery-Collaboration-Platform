import React, { useState } from 'react';
import { X, Sparkles, GraduationCap, ShieldCheck, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, demoLogin, loading, error } = useAuthStore();
  const [tab, setTab] = useState('demo'); // 'demo' | 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [batch, setBatch] = useState('2023-2027');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [skills, setSkills] = useState('Computer Vision, Python, React.js');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      onClose();
    } catch (err) {}
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      await register({
        name,
        email,
        password,
        role,
        batch,
        branch,
        skills: skillsArray
      });
      onClose();
    } catch (err) {}
  };

  const handleDemo = async (demoRole) => {
    try {
      await demoLogin(demoRole);
      onClose();
    } catch (err) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel rounded-2xl border border-white/15 p-6 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-primary-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-primary-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-white">Vignan's Lara Knowledge Portal</h3>
          <p className="text-xs text-slate-400 mt-0.5">Access VLITS living memory, publish capstones & collaborate</p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-white/[0.04] p-1 border border-white/10 mb-5">
          <button
            onClick={() => setTab('demo')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === 'demo' ? 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ Quick Demo Access
          </button>
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === 'login' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === 'register' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Demo Tab Content */}
        {tab === 'demo' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-300 text-center mb-2">
              Select a pre-configured Vignan's Lara profile to test all features:
            </p>

            <button
              onClick={() => handleDemo('student')}
              disabled={loading}
              className="w-full glass-card p-3.5 flex items-center justify-between hover:border-cyan-500/50 group text-left transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-sm">
                  GS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Gowri Simhadri
                  </h4>
                  <p className="text-[11px] text-slate-400">Student &bull; Vignan's Lara CSE (Batch 2023-2027)</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
                Enter &rarr;
              </span>
            </button>

            <button
              onClick={() => handleDemo('faculty')}
              disabled={loading}
              className="w-full glass-card p-3.5 flex items-center justify-between hover:border-amber-500/50 group text-left transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold text-sm">
                  DR
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    Dr. Ramesh Kumar
                  </h4>
                  <p className="text-[11px] text-slate-400">Professor &bull; VLITS Vision AI Research Lab</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                Enter &rarr;
              </span>
            </button>
          </div>
        )}

        {/* Login Tab */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">College Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gowri@college.edu"
                  className="glass-input w-full pl-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input w-full pl-9 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full !py-2.5 text-xs font-bold mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In with College ID'}
            </button>
          </form>
        )}

        {/* Register Tab */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aditi Sharma"
                className="glass-input w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">College Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aditi@college.edu"
                className="glass-input w-full text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="glass-input w-full text-xs bg-dark-900"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty Mentor</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Batch / Year</label>
                <input
                  type="text"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="2023-2027"
                  className="glass-input w-full text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Skills (comma separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Deep Learning, React, Python"
                className="glass-input w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input w-full text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full !py-2.5 text-xs font-bold mt-2"
            >
              {loading ? 'Creating Account...' : 'Register College Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
