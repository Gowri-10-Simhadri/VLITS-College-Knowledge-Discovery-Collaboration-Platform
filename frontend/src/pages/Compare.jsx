import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GitCompare, X, Star, CheckCircle, ArrowLeft, 
  Database, FileText, Code, Cpu, ExternalLink, Sparkles 
} from 'lucide-react';
import { useCompareStore } from '../store/useCompareStore';

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();

  if (compareList.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <GitCompare className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Projects in Compare Matrix</h2>
        <p className="text-xs text-slate-400">
          Click the "Compare" button on any 2 or 3 projects to view a side-by-side analysis of tech stacks, datasets, and solved hurdles.
        </p>
        <Link to="/discover" className="btn-gradient text-xs inline-flex items-center gap-1.5 mt-2">
          <span>Browse Projects</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <GitCompare className="w-4 h-4" />
            <span>Side-by-Side Architectural Matrix</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Comparing {compareList.length} Capstone Projects
          </h1>
        </div>

        <button
          onClick={clearCompare}
          className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20"
        >
          Clear All
        </button>
      </div>

      {/* Side-by-Side Comparison Table (Amazon style) */}
      <div className="overflow-x-auto pb-4">
        <div className={`grid gap-4 min-w-[650px] ${compareList.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {compareList.map((project) => (
            <div key={project._id} className="glass-card p-5 border-white/10 space-y-5 flex flex-col justify-between relative">
              
              {/* Remove button */}
              <button
                onClick={() => removeFromCompare(project._id)}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                {/* Thumbnail */}
                <div className="h-40 rounded-xl overflow-hidden bg-slate-900 border border-white/10">
                  <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                </div>

                <div>
                  <span className="glass-badge !bg-cyan-500/20 text-cyan-300 text-[10px]">
                    {project.domain}
                  </span>
                  <h3 className="font-bold text-sm text-white mt-1.5 line-clamp-2">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1 text-amber-400 text-xs mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold text-slate-200">{project.rating?.average || 4.9}</span>
                    <span className="text-slate-400 text-[11px]">({project.rating?.count || 12} reviews)</span>
                  </div>
                </div>

                {/* Batch & Year */}
                <div className="p-3 rounded-xl bg-dark-900/60 text-xs space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Batch:</span>
                    <strong className="text-slate-200">{project.batch} ({project.year})</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Status:</span>
                    <span className="text-emerald-300 font-semibold">{project.status}</span>
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <span className="text-xs font-bold text-slate-300 block mb-1.5">Tech Stack:</span>
                  <div className="flex flex-wrap gap-1">
                    {project.techStack?.map((t, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/10">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Datasets */}
                <div>
                  <span className="text-xs font-bold text-rose-300 block mb-1.5">Datasets Used:</span>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {project.datasets?.map((ds, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px]">
                        <Database className="w-3 h-3 text-rose-400 flex-shrink-0 mt-0.5" />
                        <span>{ds.name} ({ds.size})</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Solved Problems */}
                <div>
                  <span className="text-xs font-bold text-emerald-300 block mb-1.5">Solved Hurdles:</span>
                  <div className="space-y-2">
                    {project.problemsFaced?.map((pf, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px]">
                        <strong className="text-emerald-400 block">Fix #{i+1}:</strong>
                        <span className="text-slate-200">{pf.solution}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Link
                  to={`/projects/${project._id}`}
                  className="btn-gradient w-full !py-2.5 text-xs font-bold flex items-center justify-center gap-1"
                >
                  <span>View Full Capstone</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
