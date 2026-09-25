import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, Heart, GitCompare, Github, ExternalLink, FileText, 
  Database, CheckCircle, AlertTriangle, Lightbulb, Users, 
  GraduationCap, Sparkles, Eye, Share2, ArrowLeft, Send,
  Layers, Code, ShieldCheck, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ProjectCard from '../components/ProjectCard';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useCompareStore } from '../store/useCompareStore';

export default function ProjectDetail({ onOpenAuthModal }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleBookmark, addRecentlyViewed } = useAuthStore();
  const { addToCompare } = useCompareStore();

  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Form State
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Citation & Share Modal State
  const [citationOpen, setCitationOpen] = useState(false);
  const [citationFormat, setCitationFormat] = useState('bibtex'); // 'bibtex' | 'ieee' | 'apa'
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    async function loadProject() {
      setLoading(true);
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data.project);
        setRelatedProjects(res.data.relatedProjects || []);
        addRecentlyViewed(res.data.project);
      } catch (err) {
        setError(err.response?.data?.message || 'Project not found');
      } finally {
        setLoading(false);
      }
    }
    loadProject();
    window.scrollTo(0, 0);
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${project?.title} - Vignan's Lara College Knowledge`,
          text: `Check out this capstone project on Vignan's Lara College Knowledge Discovery Platform!`,
          url
        });
        return;
      } catch (e) {}
    }
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  const getCitationText = () => {
    if (!project) return '';
    const authorNames = project.teamMembers?.map(m => m.name).join(' and ') || 'Vignan Lara Student Team';
    const year = project.year || 2024;
    
    if (citationFormat === 'bibtex') {
      return `@inproceedings{vlits_${project._id},
  title={${project.title}},
  author={${authorNames}},
  booktitle={Vignan's Lara Institute of Technology & Science Capstone Proceedings},
  year={${year}},
  note={Supervised by ${project.facultySupervisor?.name || 'VLITS Faculty'}},
  url={${window.location.href}}
}`;
    } else if (citationFormat === 'ieee') {
      return `${authorNames}, "${project.title}," Vignan's Lara Institute of Technology & Science Capstone Archives, ${year}. [Online]. Available: ${window.location.href}.`;
    } else {
      return `${authorNames} (${year}). ${project.title}. Vignan's Lara Institute of Technology & Science Knowledge Discovery Platform. ${window.location.href}`;
    }
  };

  const copyCitation = () => {
    navigator.clipboard.writeText(getCitationText());
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuthModal?.();
      return;
    }
    if (!commentInput.trim()) return;

    setReviewSubmitting(true);
    try {
      const res = await api.post(`/projects/${id}/reviews`, {
        rating: ratingInput,
        comment: commentInput
      });
      setProject(res.data);
      setCommentInput('');
      setReviewSuccess(true);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (err) {
      alert('Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const isBookmarked = user?.bookmarks?.includes(project?._id);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400">Loading College Knowledge Memory...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Project Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'This project is not archived in the college knowledge base.'}</p>
        <Link to="/discover" className="btn-gradient text-xs inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discover</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-24">
      
      {/* Breadcrumb Navigation (Flipkart/Amazon style) */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 overflow-x-auto whitespace-nowrap pb-1">
        <Link to="/" className="hover:text-cyan-300">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/discover?domain=${encodeURIComponent(project.domain)}`} className="hover:text-cyan-300">
          {project.domain}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 font-medium truncate max-w-xs">{project.title}</span>
      </nav>

      {/* Hero Overview Card */}
      <div className="glass-card p-6 border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Thumbnail & Badges */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/15 h-64 sm:h-80 shadow-2xl">
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            {project.badge && (
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-lg bg-amber-500 text-dark-950 font-bold text-xs shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{project.badge}</span>
                </span>
              </div>
            )}
          </div>

          {/* Quick Action Buttons (GitHub, Demo, Wishlist, Compare) */}
          <div className="flex flex-wrap gap-2.5">
            {project.githubLink && project.githubLink.startsWith('http') ? (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
                className="btn-glass flex-1 !py-2.5 text-xs font-semibold text-white"
              >
                <Github className="w-4 h-4" />
                <span>View Source Code</span>
              </a>
            ) : (
              <div className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-400 flex items-center justify-center gap-1.5 cursor-not-allowed">
                <Github className="w-4 h-4 text-slate-500" />
                <span>Source code not available</span>
              </div>
            )}

            {project.liveDemoLink && project.liveDemoLink.startsWith('http') && (
              <a
                href={project.liveDemoLink}
                target="_blank"
                rel="noreferrer"
                className="btn-gradient flex-1 !py-2.5 text-xs font-semibold"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            )}

            <button
              onClick={() => toggleBookmark(project._id)}
              className={`p-2.5 rounded-xl border transition-all ${
                isBookmarked 
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' 
                  : 'glass-card text-slate-300 hover:text-rose-400'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={() => addToCompare(project)}
              className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-cyan-400 border-white/10"
              title="Add to Compare Matrix"
            >
              <GitCompare className="w-4 h-4" />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-emerald-400 border-white/10 relative"
              title="Share Project"
            >
              <Share2 className="w-4 h-4" />
              {shareCopied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] whitespace-nowrap shadow-lg animate-bounce">
                  Link Copied!
                </span>
              )}
            </button>

            <button
              onClick={() => setCitationOpen(true)}
              className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-purple-400 border-white/10"
              title="Cite Capstone Research"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Metadata & Stats */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="glass-badge !bg-cyan-500/20 text-cyan-300 font-bold text-xs">
              {project.domain}
            </span>
            <span className="glass-badge !bg-white/10 text-slate-300 text-xs">
              Batch: {project.batch} ({project.year})
            </span>
            <span className="glass-badge !bg-emerald-500/20 text-emerald-300 text-xs">
              Status: {project.status}
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold text-white leading-snug">
            {project.title}
          </h1>

          <p className="text-xs sm:text-sm text-cyan-300 font-medium italic">
            "{project.tagline}"
          </p>

          {/* Rating & Views */}
          <div className="flex items-center gap-4 py-2 border-y border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="text-sm text-white">{project.rating?.average || 4.9}</span>
              <span className="text-slate-400 font-normal">({project.rating?.count || 14} reviews)</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>{project.views} Views</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>{project.bookmarksCount} Bookmarks</span>
            </div>
          </div>

          {/* Abstract */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {project.detailedOverview || project.description}
          </p>

          {/* Tech Stack Chips */}
          <div>
            <span className="text-xs font-bold text-slate-300 block mb-2">Technologies & Frameworks:</span>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack?.map((tech, idx) => (
                <span key={idx} className="glass-badge !bg-primary-600/20 text-primary-200 border-primary-500/30 text-xs">
                  <Code className="w-3 h-3 text-cyan-400" />
                  <span>{tech}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <span className="text-xs font-bold text-slate-300 block mb-2">Core Skills Developed:</span>
            <div className="flex flex-wrap gap-1.5">
              {project.skillsRequired?.map((skill, idx) => (
                <span key={idx} className="glass-badge !bg-white/[0.06] text-slate-200 text-xs">
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Knowledge Capture Matrix: Problems Faced, Exact Solutions, & Lessons Learned */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Solved Problems & Pitfalls */}
        <div className="glass-card p-6 border-emerald-500/30 bg-emerald-950/10 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm sm:text-base">
            <CheckCircle className="w-5 h-5" />
            <span>Documented Pitfalls & Solutions (Knowledge Reuse)</span>
          </div>
          <p className="text-xs text-slate-400">
            Real issues encountered during development and how the previous team solved them:
          </p>

          <div className="space-y-3.5">
            {project.problemsFaced?.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-dark-900/80 border border-white/10 space-y-2">
                <div className="flex items-start gap-2 text-xs text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-rose-400">Problem:</strong>
                    <span>{item.problem}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs text-emerald-300 pt-2 border-t border-white/5">
                  <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-400">Solution Applied:</strong>
                    <span>{item.solution}</span>
                  </div>
                </div>

                {item.approach && (
                  <p className="text-[11px] text-slate-400 font-mono bg-white/5 p-1.5 rounded">
                    Approach: {item.approach}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Lessons Learned & Future Project Extension Opportunities */}
        <div className="space-y-6">
          
          {/* Lessons Learned */}
          <div className="glass-card p-6 border-cyan-500/30 bg-cyan-950/10 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm sm:text-base">
              <GraduationCap className="w-5 h-5" />
              <span>Lessons Learned & Takeaways</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-dark-900/60 p-4 rounded-xl border border-white/10">
              {project.lessonsLearned || "Thorough dataset annotation and baseline benchmarking are critical before model quantization."}
            </p>
          </div>

          {/* Future Extensions for Juniors */}
          <div className="glass-card p-6 border-purple-500/30 bg-purple-950/10 space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm sm:text-base">
              <Sparkles className="w-5 h-5" />
              <span>Recommended Extensions for Future Batches</span>
            </div>
            <p className="text-xs text-slate-400">
              Ideas for juniors looking to extend or build a capstone on top of this work:
            </p>
            <div className="p-4 rounded-xl bg-dark-900/80 border border-purple-500/30 text-xs text-slate-200 leading-relaxed font-medium">
              💡 {project.futureImprovements || "Integrate multi-camera synchronization and edge LoRaWAN telemetry for distant rural telemetry."}
            </div>
          </div>
        </div>
      </div>

      {/* Reusable Datasets & Research Papers Registry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Datasets */}
        <div className="glass-card p-6 border-rose-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm sm:text-base">
              <Database className="w-5 h-5" />
              <span>Reusable Datasets ({project.datasets?.length || 0})</span>
            </div>
          </div>

          <div className="space-y-3">
            {project.datasets?.map((ds, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-dark-900/80 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-white">{ds.name}</h4>
                  <span className="text-[10px] text-rose-300 font-semibold">{ds.size}</span>
                </div>
                <p className="text-xs text-slate-400">{ds.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                  <span className="text-slate-400 text-[11px]">Format: {ds.format}</span>
                  {ds.link && (
                    <a href={ds.link} target="_blank" rel="noreferrer" className="text-cyan-400 font-bold hover:underline flex items-center gap-1">
                      <span>Access Dataset</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Research Papers */}
        <div className="glass-card p-6 border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm sm:text-base">
              <FileText className="w-5 h-5" />
              <span>Cited Research Papers ({project.researchPapers?.length || 0})</span>
            </div>
          </div>

          <div className="space-y-3">
            {project.researchPapers?.map((paper, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-dark-900/80 border border-white/10 space-y-1.5">
                <h4 className="font-bold text-xs text-white">{paper.title}</h4>
                <p className="text-xs text-slate-400">Authors: {paper.authors}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                  <span className="text-purple-300 text-[11px] font-medium">{paper.conferenceJournal} ({paper.year})</span>
                  {paper.doi && <span className="text-slate-400 text-[10px] font-mono">DOI: {paper.doi}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Members & Supervising Professor */}
      <div className="glass-card p-6 border-white/10 space-y-6">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Users className="w-5 h-5 text-cyan-400" />
          <span>Project Team & Faculty Mentorship</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Supervising Professor */}
          {project.facultySupervisor && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Supervisor</span>
                <h4 className="font-bold text-xs text-white truncate">{project.facultySupervisor.name}</h4>
                <p className="text-[11px] text-slate-300 truncate">{project.facultySupervisor.designation}</p>
                <p className="text-[10px] text-cyan-400 mt-1 truncate">{project.facultySupervisor.email}</p>
              </div>
            </div>
          )}

          {/* Student Team */}
          {project.teamMembers?.map((member, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-3">
              <img
                src={member.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${member.name}`}
                alt={member.name}
                className="w-10 h-10 rounded-xl object-cover bg-slate-800 flex-shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{member.role}</span>
                <h4 className="font-bold text-xs text-white truncate">{member.name}</h4>
                <p className="text-[11px] text-slate-300 truncate">Batch: {member.batch || project.batch}</p>
                <p className="text-[10px] text-cyan-400 mt-1 truncate">{member.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amazon / Flipkart Style Reviews & Star Rating System */}
      <div className="glass-card p-6 border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>Student & Faculty Reviews ({project.reviews?.length || 0})</span>
          </div>
          <span className="text-xs text-slate-400">Average Rating: <strong className="text-amber-400">{project.rating?.average || 4.9} / 5</strong></span>
        </div>

        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-dark-900/90 border border-white/10 space-y-3">
          <h4 className="text-xs font-bold text-white">Leave a Review or Reuse Note for this Project</h4>
          
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>Your Rating:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRatingInput(star)}
                  className="text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star className={`w-4 h-4 ${star <= ratingInput ? 'fill-amber-400' : 'text-slate-600'}`} />
                </button>
              ))}
            </div>
          </div>

          <textarea
            required
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Share feedback, cite how you reused their dataset or code, or ask questions to the authors..."
            className="glass-input w-full text-xs h-20 resize-none"
          />

          <div className="flex items-center justify-between">
            {reviewSuccess ? (
              <span className="text-xs text-emerald-400 font-bold">✓ Review posted to knowledge network!</span>
            ) : <div />}
            <button
              type="submit"
              disabled={reviewSubmitting}
              className="btn-gradient !py-2 !px-4 text-xs font-bold flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{reviewSubmitting ? 'Posting...' : 'Submit Review'}</span>
            </button>
          </div>
        </form>

        {/* Reviews List */}
        <div className="space-y-3">
          {project.reviews?.length > 0 ? (
            project.reviews.map((rev, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.userAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${rev.userName}`}
                      alt={rev.userName}
                      className="w-7 h-7 rounded-lg object-cover bg-slate-800"
                    />
                    <div>
                      <h5 className="font-bold text-xs text-white">{rev.userName}</h5>
                      <span className="text-[10px] text-cyan-400 capitalize">{rev.userRole}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-400 text-xs">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pl-9">
                  {rev.comment}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-4">No reviews yet. Be the first to review this work!</p>
          )}
        </div>
      </div>

      {/* Related Projects in Knowledge Network (Amazon "Customers also viewed") */}
      {relatedProjects.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Related Projects in College Knowledge Network</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProjects.map((rel) => (
              <ProjectCard key={rel._id} project={rel} onOpenAuthModal={onOpenAuthModal} />
            ))}
          </div>
        </section>
      )}

      {/* Citation Modal */}
      {citationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-white/15 p-6 shadow-2xl">
            <button
              onClick={() => setCitationOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Cite this Capstone Project</h3>
            </div>

            {/* Format Tabs */}
            <div className="flex rounded-xl bg-white/[0.04] p-1 border border-white/10 mb-4">
              {['bibtex', 'ieee', 'apa'].map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setCitationFormat(fmt)}
                  className={`flex-1 py-1.5 text-xs font-bold uppercase rounded-lg transition-all ${
                    citationFormat === fmt
                      ? 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {/* Citation Box */}
            <pre className="p-4 rounded-xl bg-dark-950 border border-white/10 text-[11px] text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48 select-all">
              {getCitationText()}
            </pre>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setCitationOpen(false)}
                className="btn-glass !py-2 !px-4 text-xs"
              >
                Close
              </button>
              <button
                onClick={copyCitation}
                className="btn-gradient !py-2 !px-5 text-xs font-bold flex items-center gap-1.5"
              >
                <span>{copiedCitation ? '✓ Copied to Clipboard!' : 'Copy Citation'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

