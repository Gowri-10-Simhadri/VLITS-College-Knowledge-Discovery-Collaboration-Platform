import React from 'react';
import { 
  Sparkles, ArrowRight, Lightbulb, Database, 
  GraduationCap, Cpu, Layers, GitBranch, CheckCircle2 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function KnowledgePathVisualizer({ discoveryPath, query }) {
  if (!discoveryPath || discoveryPath.length === 0) return null;

  const iconMap = {
    query: Lightbulb,
    domain: Layers,
    project: GitBranch,
    tech: Cpu,
    dataset: Database,
    faculty: GraduationCap,
    opportunity: Sparkles
  };

  return (
    <div className="glass-card p-4 sm:p-6 border-cyan-500/30 bg-gradient-to-r from-primary-950/40 via-dark-900/60 to-cyan-950/40 shadow-glass-glow relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <span>College Knowledge Discovery Path</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold uppercase tracking-wider">
                Multi-Hop Linked
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Tracing accumulated college intelligence for: <span className="text-cyan-300 font-medium">"{query}"</span>
            </p>
          </div>
        </div>

        <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Living Memory Connected</span>
        </div>
      </div>

      {/* Horizontal Flowing Stepper (Scrollable on Mobile) */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin">
        <div className="flex items-center min-w-max gap-2 sm:gap-3">
          {discoveryPath.map((node, index) => {
            const Icon = iconMap[node.type] || Lightbulb;
            const isLast = index === discoveryPath.length - 1;

            return (
              <React.Fragment key={index}>
                <div className={`
                  flex items-center gap-2.5 p-2.5 rounded-xl border backdrop-blur-md transition-all
                  ${node.type === 'project' 
                    ? 'bg-primary-600/20 border-primary-500/40 text-primary-200' 
                    : node.type === 'opportunity'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-white/[0.04] border-white/10 text-slate-300'}
                `}>
                  <div className={`
                    w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                    ${node.type === 'project' ? 'bg-primary-500/30 text-cyan-300' : 'bg-white/10 text-slate-300'}
                  `}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="max-w-[150px] sm:max-w-[180px]">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {node.label}
                    </div>
                    {node.id ? (
                      <Link 
                        to={`/projects/${node.id}`} 
                        className="text-xs font-semibold text-white truncate block hover:text-cyan-300 transition-colors"
                        title={node.value}
                      >
                        {node.value}
                      </Link>
                    ) : (
                      <div className="text-xs font-medium text-slate-200 truncate" title={node.value}>
                        {node.value}
                      </div>
                    )}
                  </div>
                </div>

                {!isLast && (
                  <ArrowRight className="w-4 h-4 text-cyan-400/60 flex-shrink-0 animate-pulse" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
