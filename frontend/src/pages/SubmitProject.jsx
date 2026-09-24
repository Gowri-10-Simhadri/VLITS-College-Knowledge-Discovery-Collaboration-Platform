import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, CheckCircle, Plus, Trash2, ArrowRight, ArrowLeft, 
  Database, FileText, AlertTriangle, Lightbulb, Users, GraduationCap,
  Layers, Code, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';

export default function SubmitProject({ onOpenAuthModal }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('Computer Vision & Image Processing');
  const [year, setYear] = useState(2024);
  const [batch, setBatch] = useState('2020-2024');
  const [semester, setSemester] = useState('8th Semester / Final Year Capstone');

  const [techStackInput, setTechStackInput] = useState('PyTorch, OpenCV, React, FastAPI');
  const [skillsInput, setSkillsInput] = useState('Computer Vision, Deep Learning, Edge AI');

  // Datasets
  const [datasets, setDatasets] = useState([
    { name: '', size: '', format: 'CSV', link: '', description: '' }
  ]);

  // Research Papers
  const [researchPapers, setResearchPapers] = useState([
    { title: '', authors: '', conferenceJournal: 'IEEE / Springer', year: 2024, doi: '' }
  ]);

  // Problems & Solutions
  const [problemsFaced, setProblemsFaced] = useState([
    { problem: '', solution: '', approach: '' }
  ]);

  const [lessonsLearned, setLessonsLearned] = useState('');
  const [futureImprovements, setFutureImprovements] = useState('');

  // Links & Media
  const [githubLink, setGithubLink] = useState('');
  const [liveDemoLink, setLiveDemoLink] = useState('');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80');

  const domainsList = [
    'Computer Vision & Image Processing',
    'Smart Agriculture & Environment',
    'Healthcare & Biomedical',
    'Blockchain & Web3',
    'Natural Language Processing',
    'Internet of Things & Embedded',
    'Web & Mobile App Development',
    'Cyber Security & Cryptography'
  ];

  const handleAddDataset = () => {
    setDatasets([...datasets, { name: '', size: '', format: 'CSV', link: '', description: '' }]);
  };

  const handleRemoveDataset = (index) => {
    setDatasets(datasets.filter((_, i) => i !== index));
  };

  const handleAddProblem = () => {
    setProblemsFaced([...problemsFaced, { problem: '', solution: '', approach: '' }]);
  };

  const handleRemoveProblem = (index) => {
    setProblemsFaced(problemsFaced.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuthModal?.();
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        tagline,
        description,
        domain,
        year: Number(year),
        batch,
        semester,
        techStack: techStackInput.split(',').map(s => s.trim()).filter(Boolean),
        skillsRequired: skillsInput.split(',').map(s => s.trim()).filter(Boolean),
        datasets: datasets.filter(d => d.name.trim() !== ''),
        researchPapers: researchPapers.filter(r => r.title.trim() !== ''),
        problemsFaced: problemsFaced.filter(p => p.problem.trim() !== ''),
        lessonsLearned,
        futureImprovements,
        githubLink,
        liveDemoLink,
        thumbnail,
        teamMembers: [
          { name: user.name, role: 'Lead Author', email: user.email, batch: user.batch, avatar: user.avatar }
        ]
      };

      const res = await api.post('/projects', payload);
      
      // Celebrate with Confetti!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        navigate(`/projects/${res.data._id}`);
      }, 1200);

    } catch (err) {
      alert('Failed to publish capstone project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24">
      
      {/* Header */}
      <div className="glass-card p-6 border-white/10 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Knowledge Preservation Wizard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Publish Your Capstone into College Living Memory
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Ensure your research, solved hurdles, and datasets empower future student generations.
        </p>
      </div>

      {/* Stepper Progress Header */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
        {[
          { num: 1, label: 'Overview' },
          { num: 2, label: 'Tech & Skills' },
          { num: 3, label: 'Knowledge Capture' },
          { num: 4, label: 'Review & Publish' }
        ].map((s) => (
          <div
            key={s.num}
            className={`p-2.5 rounded-xl border transition-all ${
              step === s.num
                ? 'bg-primary-600/30 border-primary-500 text-cyan-300 shadow-md'
                : step > s.num
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                : 'bg-white/[0.03] border-white/10 text-slate-500'
            }`}
          >
            <span className="block text-[11px] font-mono">Step {s.num}</span>
            <span className="truncate">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Form Steps Container */}
      <div className="glass-card p-6 border-white/10">
        
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Project Identity & Domain</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Capstone Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI-Powered Real-Time Traffic Accident Detection System"
                className="glass-input w-full text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">One-Line Tagline *</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Vision-based edge pipeline for automated emergency dispatch"
                className="glass-input w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Detailed Abstract & Overview *</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what was built, problem addressed, and real-world system architecture..."
                className="glass-input w-full text-xs h-28 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Research Domain *</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="glass-input w-full text-xs bg-dark-900"
                >
                  {domainsList.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Year *</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Graduating Batch</label>
                <input
                  type="text"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="2020-2024"
                  className="glass-input w-full text-xs"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!title.trim() || !description.trim()) {
                    alert('Please provide Title and Abstract.');
                    return;
                  }
                  setStep(2);
                }}
                className="btn-gradient text-xs font-bold flex items-center gap-1.5"
              >
                <span>Continue to Tech & Skills</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Tech Stack & Reusable Assets */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-400" />
              <span>Technologies, Skills & Datasets</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Technologies & Libraries (comma separated) *</label>
              <input
                type="text"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                placeholder="PyTorch, YOLOv8, OpenCV, FastAPI, React, Docker"
                className="glass-input w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Core Required Skills (comma separated) *</label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="Computer Vision, Deep Learning, Embedded Edge AI"
                className="glass-input w-full text-xs"
              />
            </div>

            {/* Datasets Section */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <Database className="w-4 h-4" />
                  <span>Reusable Datasets</span>
                </span>
                <button
                  type="button"
                  onClick={handleAddDataset}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Dataset</span>
                </button>
              </div>

              {datasets.map((ds, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-dark-900/80 border border-white/10 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Dataset Name (e.g. CCTV Crash Video Dataset)"
                      value={ds.name}
                      onChange={(e) => {
                        const copy = [...datasets];
                        copy[idx].name = e.target.value;
                        setDatasets(copy);
                      }}
                      className="glass-input text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Size (e.g. 14.2 GB)"
                      value={ds.size}
                      onChange={(e) => {
                        const copy = [...datasets];
                        copy[idx].size = e.target.value;
                        setDatasets(copy);
                      }}
                      className="glass-input text-xs"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Link URL"
                        value={ds.link}
                        onChange={(e) => {
                          const copy = [...datasets];
                          copy[idx].link = e.target.value;
                          setDatasets(copy);
                        }}
                        className="glass-input text-xs flex-1"
                      />
                      {datasets.length > 1 && (
                        <button onClick={() => handleRemoveDataset(idx)} className="text-rose-400 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-glass text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-gradient text-xs font-bold flex items-center gap-1.5"
              >
                <span>Continue to Knowledge Capture</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Problems & Solutions (The Core Memory) */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-emerald-400" />
                <span>Preserve Solutions & Pitfalls (Living Memory)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Document what went wrong and how you solved it so future students don’t waste weeks on the same bugs.
              </p>
            </div>

            <div className="space-y-4">
              {problemsFaced.map((pf, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-dark-900/80 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Hurdle #{idx + 1}</span>
                    {problemsFaced.length > 1 && (
                      <button onClick={() => handleRemoveProblem(idx)} className="text-rose-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-semibold text-rose-400 mb-1">Problem Encountered:</label>
                    <input
                      type="text"
                      placeholder="e.g. Night-time headlight glare caused high false positive rate"
                      value={pf.problem}
                      onChange={(e) => {
                        const copy = [...problemsFaced];
                        copy[idx].problem = e.target.value;
                        setProblemsFaced(copy);
                      }}
                      className="glass-input w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-400 mb-1">Solution & Technical Fix Applied:</label>
                    <input
                      type="text"
                      placeholder="e.g. Implemented CLAHE contrast normalization filter in OpenCV pipeline"
                      value={pf.solution}
                      onChange={(e) => {
                        const copy = [...problemsFaced];
                        copy[idx].solution = e.target.value;
                        setProblemsFaced(copy);
                      }}
                      className="glass-input w-full text-xs"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddProblem}
                className="text-xs text-emerald-400 font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Documented Solution</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Key Lessons Learned</label>
              <textarea
                value={lessonsLearned}
                onChange={(e) => setLessonsLearned(e.target.value)}
                placeholder="What advice would you give to juniors starting a similar project?"
                className="glass-input w-full text-xs h-20 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Potential Project Extensions</label>
              <textarea
                value={futureImprovements}
                onChange={(e) => setFutureImprovements(e.target.value)}
                placeholder="How could the next batch build upon or extend this work?"
                className="glass-input w-full text-xs h-20 resize-none"
              />
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-glass text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="btn-gradient text-xs font-bold flex items-center gap-1.5"
              >
                <span>Continue to Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Final Review & Publish */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Review & Publish Capstone</span>
            </h3>

            <div className="p-4 rounded-xl bg-dark-900/80 border border-white/10 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block">Title:</span>
                <strong className="text-sm text-white">{title}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Domain:</span>
                <span className="text-cyan-300 font-semibold">{domain} &bull; Batch {batch}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Technologies:</span>
                <span className="text-slate-200">{techStackInput}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Documented Solutions:</span>
                <span className="text-emerald-300 font-bold">{problemsFaced.filter(p => p.problem.trim()).length} Fixes Preserved</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">GitHub Repository Link</label>
                <input
                  type="url"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  placeholder="https://github.com/my-team/capstone"
                  className="glass-input w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Live Demo / URL</label>
                <input
                  type="url"
                  value={liveDemoLink}
                  onChange={(e) => setLiveDemoLink(e.target.value)}
                  placeholder="https://myproject.college.edu"
                  className="glass-input w-full text-xs"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-glass text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-gradient !py-3 !px-8 text-xs font-bold flex items-center gap-2 shadow-xl shadow-primary-500/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>{submitting ? 'Publishing into College Brain...' : 'Publish to Knowledge Memory'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
