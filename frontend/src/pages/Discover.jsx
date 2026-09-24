import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Filter, Search, Grid, List, Sparkles, Database, FileText, 
  CheckCircle, Users, GraduationCap, X, ChevronDown, 
  Lightbulb, ArrowRight, Star, Eye, Layers, AlertCircle
} from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import KnowledgePathVisualizer from '../components/KnowledgePathVisualizer';
import { api } from '../api/client';

export default function Discover({ onOpenAuthModal }) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const queryParam = searchParams.get('q') || '';
  const domainParam = searchParams.get('domain') || '';
  const sortParam = searchParams.get('sort') || 'rating';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedDomain, setSelectedDomain] = useState(domainParam || 'All Domains');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedBatch, setSelectedBatch] = useState('All Batches');
  const [sortBy, setSortBy] = useState(sortParam);
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'datasets' | 'papers' | 'problems' | 'collaborators' | 'faculty'

  const [discoveryData, setDiscoveryData] = useState(null);
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const domainsList = [
    'All Domains',
    'Computer Vision & Image Processing',
    'Smart Agriculture & Environment',
    'Healthcare & Biomedical',
    'Blockchain & Web3',
    'Natural Language Processing',
    'Internet of Things & Embedded',
    'Web & Mobile App Development',
    'Cyber Security & Cryptography'
  ];

  const yearsList = ['All Years', '2024', '2023', '2022', '2021'];

  useEffect(() => {
    async function loadResults() {
      setLoading(true);
      try {
        if (queryParam) {
          // Trigger the Multi-hop Knowledge Discovery Engine
          const res = await api.get(`/discover?q=${encodeURIComponent(queryParam)}`);
          setDiscoveryData(res.data);
          setProjectsList(res.data.projects || []);
        } else {
          // Standard filtered project list
          const res = await api.get('/projects', {
            params: {
              domain: selectedDomain !== 'All Domains' ? selectedDomain : undefined,
              year: selectedYear !== 'All Years' ? selectedYear : undefined,
              batch: selectedBatch !== 'All Batches' ? selectedBatch : undefined,
              sort: sortBy
            }
          });
          setDiscoveryData(null);
          setProjectsList(res.data.projects || []);
        }
      } catch (err) {
        console.error('Discovery search error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, [queryParam, selectedDomain, selectedYear, selectedBatch, sortBy]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/discover');
    }
  };

  const clearFilters = () => {
    setSelectedDomain('All Domains');
    setSelectedYear('All Years');
    setSelectedBatch('All Batches');
    setSortBy('rating');
    setSearchQuery('');
    navigate('/discover');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
      
      {/* Search Header Banner */}
      <div className="glass-card p-4 sm:p-6 border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Knowledge Discovery Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {queryParam ? (
              <>Results for: <span className="text-cyan-300">"{queryParam}"</span></>
            ) : selectedDomain !== 'All Domains' ? (
              <>Domain: <span className="text-cyan-300">{selectedDomain}</span></>
            ) : (
              'All College Capstones & Research Knowledge'
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Showing accumulated multi-generational projects, datasets, faculty & solved challenges
          </p>
        </div>

        {/* Search inside discover page */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative flex items-center">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search idea or problem statement..."
            className="w-full pl-9 pr-20 py-2.5 glass-input text-xs"
          />
          <button
            type="submit"
            className="absolute right-1 px-3 py-1.5 bg-gradient-to-r from-primary-600 to-cyan-600 text-white rounded-lg text-xs font-bold"
          >
            Search
          </button>
        </form>
      </div>

      {/* Discovery Knowledge Path Visualizer (if querying an idea) */}
      {discoveryData?.discoveryPath && (
        <KnowledgePathVisualizer 
          discoveryPath={discoveryData.discoveryPath} 
          query={queryParam} 
        />
      )}

      {/* Suggested next steps notification if discovered */}
      {discoveryData?.suggestedNextSteps?.length > 0 && (
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-200 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-cyan-300">AI Knowledge Suggestion: </span>
            <span>{discoveryData.suggestedNextSteps[0]}</span>
          </div>
        </div>
      )}

      {/* Main Layout: Flipkart-style Filter Sidebar + Results Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 space-y-5">
          <div className="glass-card p-5 border-white/10 sticky top-28 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <Filter className="w-4 h-4 text-cyan-400" />
                <span>Knowledge Filters</span>
              </div>
              <button 
                onClick={clearFilters}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Reset All
              </button>
            </div>

            {/* Domains Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Research Domain</label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1 text-xs">
                {domainsList.map((dom) => (
                  <button
                    key={dom}
                    onClick={() => setSelectedDomain(dom)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                      selectedDomain === dom 
                        ? 'bg-primary-600/30 text-cyan-300 font-semibold border border-primary-500/40' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{dom}</span>
                    {selectedDomain === dom && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Year / Batch Filter */}
            <div className="pt-3 border-t border-white/10">
              <label className="block text-xs font-bold text-slate-300 mb-2">Academic Year</label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {yearsList.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-2 py-1.5 rounded-lg border text-center transition-all ${
                      selectedYear === yr
                        ? 'bg-primary-600/30 border-primary-500 text-cyan-300 font-bold'
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="pt-3 border-t border-white/10">
              <label className="block text-xs font-bold text-slate-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="glass-input w-full text-xs bg-dark-900"
              >
                <option value="rating">Highest Rated ★</option>
                <option value="views">Most Explored / Views</option>
                <option value="year-desc">Newest Year (2024)</option>
                <option value="year-asc">Historical Capstones</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Main Area */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Tabs Matrix (Amazon / Flipkart Categories) */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5 min-w-max">
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'projects'
                    ? 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white shadow-md'
                    : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-white/10'
                }`}
              >
                <span>Capstones</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                  {projectsList.length}
                </span>
              </button>

              {discoveryData?.datasets?.length > 0 && (
                <button
                  onClick={() => setActiveTab('datasets')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'datasets'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-white/[0.04] text-rose-300 hover:text-white border border-white/10'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Datasets</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                    {discoveryData.datasets.length}
                  </span>
                </button>
              )}

              {discoveryData?.researchPapers?.length > 0 && (
                <button
                  onClick={() => setActiveTab('papers')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'papers'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white/[0.04] text-purple-300 hover:text-white border border-white/10'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Papers</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                    {discoveryData.researchPapers.length}
                  </span>
                </button>
              )}

              {discoveryData?.previousSolutions?.length > 0 && (
                <button
                  onClick={() => setActiveTab('problems')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'problems'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white/[0.04] text-emerald-300 hover:text-white border border-white/10'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Solved Pitfalls</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                    {discoveryData.previousSolutions.length}
                  </span>
                </button>
              )}

              {discoveryData?.students?.length > 0 && (
                <button
                  onClick={() => setActiveTab('collaborators')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'collaborators'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-white/[0.04] text-cyan-300 hover:text-white border border-white/10'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Skilled Students</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                    {discoveryData.students.length}
                  </span>
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-cyan-300 text-xs font-bold flex items-center gap-1"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="lg:hidden glass-card p-4 border-cyan-500/40 space-y-4 animate-in slide-in-from-top duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-white">Filter Discovery</span>
                <button onClick={clearFilters} className="text-xs text-cyan-400 font-medium">Reset</button>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-300">Domain</label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="glass-input w-full text-xs mt-1 bg-dark-900"
                >
                  {domainsList.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Tab Content 1: Projects Grid */}
          {activeTab === 'projects' && (
            <div>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <div key={n} className="glass-card h-80 animate-pulse bg-white/[0.02]" />
                  ))}
                </div>
              ) : projectsList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {projectsList.map((project) => (
                    <ProjectCard key={project._id} project={project} onOpenAuthModal={onOpenAuthModal} />
                  ))}
                </div>
              ) : (
                <div className="glass-card p-12 text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
                  <h3 className="text-base font-bold text-white">No Capstones Found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    No recorded college project matches this filter. Try adjusting your query or be the first to publish one!
                  </p>
                  <button onClick={clearFilters} className="btn-glass text-xs mt-2">
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab Content 2: Reusable Datasets */}
          {activeTab === 'datasets' && discoveryData?.datasets && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {discoveryData.datasets.map((ds, idx) => (
                  <div key={idx} className="glass-card p-4 border-rose-500/20 bg-rose-950/10 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="glass-badge !bg-rose-500/20 text-rose-300 text-[10px]">
                          {ds.format || 'Dataset'} &bull; {ds.size || 'Open Access'}
                        </span>
                        <h4 className="font-bold text-sm text-white mt-1.5">{ds.name}</h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">{ds.description}</p>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">Used in: <strong className="text-slate-200">{ds.usedInProjectTitle}</strong></span>
                      {ds.link && (
                        <a
                          href={ds.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 font-bold hover:underline flex items-center gap-1"
                        >
                          <span>Dataset Link</span>
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content 3: Research Papers */}
          {activeTab === 'papers' && discoveryData?.researchPapers && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {discoveryData.researchPapers.map((paper, idx) => (
                  <div key={idx} className="glass-card p-4 border-purple-500/20 bg-purple-950/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="glass-badge !bg-purple-500/20 text-purple-300 text-[10px]">
                        {paper.conferenceJournal || 'IEEE / Springer'} &bull; {paper.year || 2024}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white">{paper.title}</h4>
                    <p className="text-xs text-slate-400">Authors: <span className="text-slate-300">{paper.authors}</span></p>
                    {paper.doi && <p className="text-[11px] text-cyan-400 font-mono">DOI: {paper.doi}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content 4: Previous Solved Problems (Knowledge Preservation) */}
          {activeTab === 'problems' && discoveryData?.previousSolutions && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {discoveryData.previousSolutions.map((sol, idx) => (
                  <div key={idx} className="glass-card p-5 border-emerald-500/20 bg-emerald-950/10 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Documented in: <strong className="text-cyan-300">{sol.projectTitle} ({sol.year})</strong></span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                        Verified Fix
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs">
                        <span className="font-bold text-rose-400 block mb-1">⚠️ Problem Encountered by Previous Batch:</span>
                        <span className="text-slate-200">{sol.problem}</span>
                      </div>

                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                        <span className="font-bold text-emerald-400 block mb-1">💡 Solution & Approach Discovered:</span>
                        <span className="text-slate-200">{sol.solution}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content 5: Student Collaborators with Matching Skills */}
          {activeTab === 'collaborators' && discoveryData?.students && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {discoveryData.students.map((st) => (
                <div key={st._id} className="glass-card p-4 flex items-start gap-3.5 border-cyan-500/20">
                  <img src={st.avatar} alt={st.name} className="w-12 h-12 rounded-xl object-cover bg-slate-800" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-white truncate">{st.name}</h4>
                    <p className="text-[11px] text-cyan-400 truncate">{st.headline}</p>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {st.matchedSkills?.map((sk, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                          ✓ {sk}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">Batch: {st.batch}</span>
                      <button 
                        onClick={() => navigate(`/profile/${st._id}`)}
                        className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
                      >
                        View Profile &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
