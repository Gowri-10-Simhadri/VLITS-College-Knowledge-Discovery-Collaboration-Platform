import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Users, FolderGit2, CheckCircle2, XCircle, 
  Trash2, Award, Network, Sparkles, Database, ArrowRight, RefreshCw
} from 'lucide-react';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';

export default function AdminDashboard({ onOpenAuthModal }) {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'users'
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, projectsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/projects?limit=100')
      ]);

      setStats(statsRes.data);
      setUsersList(usersRes.data || []);
      setProjectsList(projectsRes.data?.projects || []);
    } catch (err) {
      console.error('Admin data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerify = async (projectId, currentStatus) => {
    setActionLoading(projectId);
    try {
      await api.patch(`/admin/projects/${projectId}/verify`, {
        isVerified: !currentStatus,
        badge: !currentStatus ? '🛡️ Faculty Verified Capstone' : '⭐ Student Project'
      });
      fetchAdminData();
    } catch (err) {
      console.error('Verify error:', err);
      alert('Failed to update project status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to remove this capstone from the repository?')) return;
    setActionLoading(projectId);
    try {
      await api.delete(`/admin/projects/${projectId}`);
      fetchAdminData();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to remove project.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setActionLoading(userId);
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      fetchAdminData();
    } catch (err) {
      console.error('Role update error:', err);
      alert('Failed to update user role.');
    } finally {
      setActionLoading(null);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen py-20 px-4 max-w-lg mx-auto text-center space-y-6">
        <div className="glass-card p-8 space-y-4 border border-rose-500/30">
          <ShieldCheck className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Administrator Privileges Required</h2>
          <p className="text-xs text-slate-300">
            You must be logged in as a registered College Administrator to access system moderation, user role permissions, and project verification tools.
          </p>
          <button onClick={onOpenAuthModal} className="btn-gradient text-xs !py-2.5 !px-5">
            Switch Account / Admin Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-cyan-300 border border-primary-500/30">
                Institutional Control Center
              </span>
              <span className="text-xs text-slate-400">VLITS Knowledge System Admin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Platform Administration & Verification
            </h1>
          </div>

          <button
            onClick={fetchAdminData}
            className="btn-glass text-xs !py-2 !px-4 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync MongoDB Atlas</span>
          </button>
        </div>

        {/* Overview Stats Cards */}
        {stats?.overview && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
            <div className="p-4 rounded-xl bg-dark-900/60 border border-white/5">
              <span className="block text-2xl font-black text-cyan-400">{stats.overview.totalProjects}</span>
              <span className="text-xs text-slate-400 font-medium">Documented Capstones</span>
            </div>
            <div className="p-4 rounded-xl bg-dark-900/60 border border-white/5">
              <span className="block text-2xl font-black text-emerald-400">{stats.overview.studentsCount}</span>
              <span className="text-xs text-slate-400 font-medium">Enrolled Scholars</span>
            </div>
            <div className="p-4 rounded-xl bg-dark-900/60 border border-white/5">
              <span className="block text-2xl font-black text-amber-400">{stats.overview.facultyCount}</span>
              <span className="text-xs text-slate-400 font-medium">Faculty Mentors</span>
            </div>
            <div className="p-4 rounded-xl bg-dark-900/60 border border-white/5">
              <span className="block text-2xl font-black text-purple-400">{stats.overview.graphEdges}</span>
              <span className="text-xs text-slate-400 font-medium">Knowledge Graph Edges</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'projects'
              ? 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Capstone Verification & Moderation ({projectsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Role Management ({usersList.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading admin records from Atlas...</p>
        </div>
      ) : activeTab === 'projects' ? (
        <div className="space-y-4">
          {projectsList.map(project => {
            const isVerified = project.badge?.includes('Verified') || project.isFeatured;

            return (
              <div
                key={project._id}
                className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-cyan-500/30 transition-all"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {project.domain}
                    </span>
                    <span className="text-xs text-slate-400">Batch {project.batch || '2023-2027'}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isVerified ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {project.badge || 'Standard Project'}
                    </span>
                  </div>

                  <Link
                    to={`/projects/${project._id}`}
                    className="text-base font-bold text-white hover:text-cyan-300 transition-colors block"
                  >
                    {project.title}
                  </Link>

                  <p className="text-xs text-slate-400 truncate">
                    Mentor: {project.facultySupervisor?.name || 'Dr. Ramesh Kumar'} &bull; Author: {project.teamMembers?.[0]?.name}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleToggleVerify(project._id, isVerified)}
                    disabled={actionLoading === project._id}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isVerified
                        ? 'bg-amber-600/30 border border-amber-500/40 text-amber-300 hover:bg-amber-600/50'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isVerified ? 'Remove Verification' : 'Verify Capstone'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    disabled={actionLoading === project._id}
                    className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Users Tab */
        <div className="space-y-4">
          {usersList.map(u => (
            <div
              key={u._id}
              className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <img
                  src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.name}`}
                  alt={u.name}
                  className="w-12 h-12 rounded-xl bg-slate-800 object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{u.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-cyan-300 border border-white/10 uppercase font-bold">
                      {u.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{u.email} &bull; {u.department || 'CSE'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10 w-full sm:w-auto justify-end">
                <span className="text-xs text-slate-400">Change Role:</span>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  disabled={actionLoading === u._id}
                  className="bg-dark-900 border border-white/10 rounded-xl text-xs text-slate-200 px-3 py-1.5 focus:outline-none focus:border-cyan-500/60"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
