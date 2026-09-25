import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Sparkles, Layers, Cpu, User, FolderGit2, BookOpen, Database, 
  ArrowLeft, ExternalLink, GraduationCap, ChevronRight, Share2, 
  CheckCircle2, Network, Heart
} from 'lucide-react';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';

export default function SkillDetail({ onOpenAuthModal }) {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name || '');
  const { user } = useAuthStore();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSkillKnowledgePath();
  }, [name]);

  const fetchSkillKnowledgePath = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/skills/${encodeURIComponent(decodedName)}`);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching skill knowledge graph:', err);
      setError('Failed to resolve skill knowledge graph.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Traversing Knowledge Path for "{decodedName}"...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-3xl mx-auto text-center space-y-4">
        <div className="glass-card p-8 space-y-4 border-rose-500/30">
          <p className="text-rose-400 font-bold">{error || 'Skill knowledge graph not found.'}</p>
          <Link to="/skills" className="btn-gradient text-xs !py-2 !px-4 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Skills Explorer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-300">
      
      {/* Top Nav & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link to="/skills" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> All Skills Explorer
        </Link>
        <button
          onClick={handleShare}
          className="btn-glass text-xs !py-1.5 !px-3 flex items-center gap-1.5 text-slate-300"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'Copied URL!' : 'Share Skill Graph'}</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Competency Hub
              </span>
              <span className="text-xs text-slate-400">Living College Memory</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {data.skillName}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
              {data.summary}
            </p>
          </div>

          <Link
            to={`/graph?highlight=${encodeURIComponent(data.skillName)}`}
            className="btn-gradient self-start md:self-auto text-xs sm:text-sm !py-2.5 !px-5 flex items-center gap-2 whitespace-nowrap"
          >
            <Network className="w-4 h-4" />
            <span>View in Knowledge Graph</span>
          </Link>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8 pt-6 border-t border-white/10">
          <div className="p-3 rounded-xl bg-dark-900/60 border border-white/5 text-center">
            <span className="block text-xl font-black text-cyan-400">{data.stats.projectsCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">Capstones</span>
          </div>
          <div className="p-3 rounded-xl bg-dark-900/60 border border-white/5 text-center">
            <span className="block text-xl font-black text-emerald-400">{data.stats.studentsCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">Students</span>
          </div>
          <div className="p-3 rounded-xl bg-dark-900/60 border border-white/5 text-center">
            <span className="block text-xl font-black text-amber-400">{data.stats.facultyCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">Faculty Mentors</span>
          </div>
          <div className="p-3 rounded-xl bg-dark-900/60 border border-white/5 text-center">
            <span className="block text-xl font-black text-purple-400">{data.stats.researchPapersCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">Papers Cited</span>
          </div>
          <div className="p-3 rounded-xl bg-dark-900/60 border border-white/5 text-center col-span-2 sm:col-span-1">
            <span className="block text-xl font-black text-rose-400">{data.stats.datasetsCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">Datasets Used</span>
          </div>
        </div>
      </div>

      {/* Visual Knowledge Path Journey */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 border border-white/10">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Traversed Knowledge Pipeline</h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Skill: {data.skillName}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-500" />
          <span className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {data.relatedTechnologies?.length || 0} Core Techs
          </span>
          <ChevronRight className="w-4 h-4 text-slate-500" />
          <span className="px-3 py-1.5 rounded-xl bg-primary-500/20 text-primary-300 border border-primary-500/30">
            {data.projects?.length || 0} Projects
          </span>
          <ChevronRight className="w-4 h-4 text-slate-500" />
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {data.faculty?.length || 0} Mentors
          </span>
          <ChevronRight className="w-4 h-4 text-slate-500" />
          <span className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {data.researchPapers?.length || 0} Research Papers
          </span>
        </div>
      </div>

      {/* Section 1: Related Technologies & Sibling Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Associated Technologies & Frameworks</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.relatedTechnologies?.length > 0 ? (
              data.relatedTechnologies.map(tech => (
                <Link
                  key={tech}
                  to={`/discover?q=${encodeURIComponent(tech)}`}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-xs font-medium text-slate-200 hover:text-cyan-300 transition-all flex items-center gap-1.5"
                >
                  <span>{tech}</span>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </Link>
              ))
            ) : (
              <p className="text-xs text-slate-400">No adjacent technologies indexed yet.</p>
            )}
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Complementary / Sibling Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.relatedSkills?.length > 0 ? (
              data.relatedSkills.map(skill => (
                <Link
                  key={skill}
                  to={`/skills/${encodeURIComponent(skill)}`}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-xs font-medium text-slate-200 hover:text-emerald-300 transition-all flex items-center gap-1.5"
                >
                  <span>{skill}</span>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </Link>
              ))
            ) : (
              <p className="text-xs text-slate-400">No complementary skills indexed yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Projects utilizing this skill */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Documented Capstone Projects ({data.projects?.length || 0})</h2>
          </div>
          <Link to={`/projects?domain=All Domains&q=${encodeURIComponent(data.skillName)}`} className="text-xs text-cyan-400 font-semibold hover:underline">
            View in Project Repository &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.projects?.map(p => (
            <Link
              key={p._id}
              to={`/projects/${p._id}`}
              className="glass-card p-5 space-y-3 hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
                    {p.domain}
                  </span>
                  <span>Batch {p.batch || '2023-2027'}</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {p.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                  {p.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="truncate">Mentor: {p.facultySupervisor?.name}</span>
                <span className="text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">Inspect &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Section 3: Student Practitioners & Faculty Mentors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Students */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Student Practitioners ({data.students?.length || 0})</h3>
            </div>
            <Link to="/collaborators" className="text-xs text-emerald-400 font-semibold hover:underline">
              Collaborator Matchmaker &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {data.students?.length > 0 ? (
              data.students.map(student => (
                <div
                  key={student._id}
                  className="glass-card p-4 flex items-center justify-between gap-4 hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.name}`}
                      alt={student.name}
                      className="w-11 h-11 rounded-xl bg-slate-800 object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{student.name}</h4>
                      <p className="text-xs text-emerald-300">{student.branch || student.department} &bull; Batch {student.batch}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-xs">{student.headline || 'Capstone Scholar'}</p>
                    </div>
                  </div>

                  <Link
                    to={`/profile/${student._id}`}
                    className="btn-glass text-xs !py-1.5 !px-3 text-emerald-300 border-emerald-500/30 hover:border-emerald-400 flex-shrink-0"
                  >
                    View Profile
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 glass-card p-4">No student profiles currently tagged with this skill.</p>
            )}
          </div>
        </div>

        {/* Faculty Mentors */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Faculty Advisors & Mentors ({data.faculty?.length || 0})</h3>
            </div>
            <Link to="/faculty" className="text-xs text-amber-400 font-semibold hover:underline">
              Faculty Directory &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {data.faculty?.length > 0 ? (
              data.faculty.map(fac => (
                <div
                  key={fac._id}
                  className="glass-card p-4 flex items-center justify-between gap-4 hover:border-amber-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={fac.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${fac.name}`}
                      alt={fac.name}
                      className="w-11 h-11 rounded-xl bg-slate-800 object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{fac.name}</h4>
                      <p className="text-xs text-amber-300">{fac.department} Department</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-xs">{fac.headline || 'Senior Research Advisor'}</p>
                    </div>
                  </div>

                  <Link
                    to={`/faculty/${fac._id}`}
                    className="btn-glass text-xs !py-1.5 !px-3 text-amber-300 border-amber-500/30 hover:border-amber-400 flex-shrink-0"
                  >
                    Faculty Lab
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 glass-card p-4">No faculty advisors currently tagged with this skill.</p>
            )}
          </div>
        </div>
      </div>

      {/* Section 4: Research Papers & Benchmarked Datasets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Research Papers */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">Cited Research Papers ({data.researchPapers?.length || 0})</h3>
            </div>
            <Link to="/research" className="text-xs text-purple-400 hover:underline font-semibold">
              Research Hub &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {data.researchPapers?.length > 0 ? (
              data.researchPapers.map((paper, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-dark-900/60 border border-white/5 space-y-1">
                  <h5 className="text-xs font-bold text-white">{paper.title}</h5>
                  <p className="text-[11px] text-purple-300">Authors: {paper.authors}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">Cited in {paper.projectTitle}</span>
                    {paper.url && (
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-cyan-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>IEEE / DOI</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No research papers cited yet under this skill.</p>
            )}
          </div>
        </div>

        {/* Datasets */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-bold text-white">Datasets Utilized ({data.datasets?.length || 0})</h3>
            </div>
            <Link to="/resources" className="text-xs text-rose-400 hover:underline font-semibold">
              Lab Resources &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {data.datasets?.length > 0 ? (
              data.datasets.map((ds, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-dark-900/60 border border-white/5 space-y-1">
                  <h5 className="text-xs font-bold text-white">{ds.name}</h5>
                  <p className="text-[11px] text-slate-300">{ds.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">Utilized in {ds.projectTitle}</span>
                    {ds.url && (
                      <a
                        href={ds.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-rose-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Source Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No datasets indexed under this skill yet.</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
