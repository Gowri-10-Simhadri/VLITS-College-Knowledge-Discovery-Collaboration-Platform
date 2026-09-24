import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, Eye, Heart, GitCompare, Database, FileText, 
  CheckCircle, ArrowUpRight, Cpu, Sparkles, AlertTriangle
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCompareStore } from '../store/useCompareStore';

export default function ProjectCard({ project, onOpenAuthModal }) {
  const { user, toggleBookmark, addRecentlyViewed } = useAuthStore();
  const { compareList, addToCompare } = useCompareStore();

  const isBookmarked = user?.bookmarks?.includes(project._id);
  const isCompared = compareList.some(p => p._id === project._id);

  const handleBookmarkClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      onOpenAuthModal?.();
      return;
    }
    await toggleBookmark(project._id);
  };

  const handleCompareToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(project);
  };

  return (
    <div 
      className="glass-card flex flex-col h-full overflow-hidden group relative border border-white/10 hover:border-cyan-500/40"
      onClick={() => addRecentlyViewed(project)}
    >
      {/* Card Header & Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900 flex-shrink-0">
        <img
          src={project.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* Domain & Batch */}
          <span className="glass-badge !bg-dark-900/80 !border-white/20 text-cyan-300 font-semibold text-[11px] truncate max-w-[70%]">
            {project.domain}
          </span>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Bookmark Button */}
            <button
              onClick={handleBookmarkClick}
              title={isBookmarked ? "Saved in Wishlist" : "Save for Later"}
              className="w-8 h-8 rounded-full bg-dark-900/80 hover:bg-dark-900 backdrop-blur-md border border-white/20 flex items-center justify-center text-slate-300 hover:text-rose-400 transition-transform active:scale-90"
            >
              <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Award / Special Badge */}
        {project.badge && (
          <div className="absolute bottom-2 left-2.5">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-dark-950 font-bold text-[10px] shadow-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{project.badge}</span>
            </span>
          </div>
        )}

        {/* Year / Batch pill */}
        <div className="absolute bottom-2 right-2.5">
          <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-slate-300 text-[10px] font-medium border border-white/10">
            Batch {project.batch || project.year}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating & Views (Amazon Style) */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <div className="flex items-center text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold ml-1 text-slate-200">{project.rating?.average || 4.8}</span>
              </div>
              <span className="text-[11px] text-slate-400">({project.rating?.count || 12} reviews)</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Eye className="w-3 h-3 text-cyan-400" />
              <span>{project.views || 240} views</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/projects/${project._id}`} className="block group-hover:text-cyan-300 transition-colors mt-1.5">
            <h3 className="font-bold text-sm sm:text-base text-white line-clamp-2 leading-snug">
              {project.title}
            </h3>
          </Link>

          {/* Tagline / Snippet */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {project.tagline || project.description}
          </p>

          {/* Knowledge Indicators (Datasets, Papers, Solved Issues) */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px]">
            {project.datasets?.length > 0 && (
              <span className="inline-flex items-center gap-1 text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20" title={`${project.datasets.length} Reusable Dataset(s)`}>
                <Database className="w-3 h-3 text-rose-400" />
                <span>{project.datasets.length} Dataset</span>
              </span>
            )}

            {project.researchPapers?.length > 0 && (
              <span className="inline-flex items-center gap-1 text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20" title={`${project.researchPapers.length} Cited Research Paper(s)`}>
                <FileText className="w-3 h-3 text-purple-400" />
                <span>{project.researchPapers.length} Paper</span>
              </span>
            )}

            {project.problemsFaced?.length > 0 && (
              <span className="inline-flex items-center gap-1 text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20" title={`${project.problemsFaced.length} Documented Solution(s)`}>
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>{project.problemsFaced.length} Solved Issues</span>
              </span>
            )}
          </div>

          {/* Tech Stack Chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.techStack?.slice(0, 4).map((tech, idx) => (
              <span 
                key={idx} 
                className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/10"
              >
                {tech}
              </span>
            ))}
            {project.techStack?.length > 4 && (
              <span className="text-[10px] text-slate-400 px-1 py-0.5">
                +{project.techStack.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Card Footer: Faculty Supervisor & Compare Checkbox */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          {/* Supervising Mentor */}
          <div className="flex items-center gap-1.5 text-slate-300 truncate max-w-[60%]">
            <span className="text-slate-400 text-[11px]">Mentor:</span>
            <span className="font-medium text-slate-200 truncate">{project.facultySupervisor?.name || 'Dr. Ramesh Kumar'}</span>
          </div>

          {/* Compare Toggle (Flipkart style) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCompareToggle}
              className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded transition-colors ${
                isCompared 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitCompare className="w-3 h-3" />
              <span>{isCompared ? 'Added' : 'Compare'}</span>
            </button>

            <Link
              to={`/projects/${project._id}`}
              className="p-1 rounded-lg bg-primary-600/20 hover:bg-primary-600/40 text-primary-300 transition-colors"
              title="Explore Capstone Knowledge"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
