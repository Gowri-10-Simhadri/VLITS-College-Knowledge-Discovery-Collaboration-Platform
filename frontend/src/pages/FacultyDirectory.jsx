import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, Search, Filter, Mail, Award, BookOpen, 
  FolderGit2, Sparkles, ChevronRight, User, ArrowRight
} from 'lucide-react';
import { api } from '../api/client';

export default function FacultyDirectory() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState('All Departments');
  const [search, setSearch] = useState('');

  const departments = [
    'All Departments',
    'Computer Science & Engineering',
    'Artificial Intelligence & Data Science',
    'Information Technology',
    'Electronics & Communication Engineering',
    'Electrical & Electronics Engineering'
  ];

  useEffect(() => {
    fetchFaculty();
  }, [department]);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/faculty');
      let list = res.data || [];

      if (department !== 'All Departments') {
        list = list.filter(f => f.department?.toLowerCase() === department.toLowerCase());
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        list = list.filter(f =>
          f.name.toLowerCase().includes(q) ||
          f.department?.toLowerCase().includes(q) ||
          f.headline?.toLowerCase().includes(q) ||
          f.skills?.some(s => (s.name || s).toLowerCase().includes(q)) ||
          f.interests?.some(i => i.toLowerCase().includes(q))
        );
      }

      setFaculty(list);
    } catch (err) {
      console.error('Error fetching faculty directory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFaculty();
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Faculty Mentors & Research Advisors
              </span>
              <span className="text-xs text-slate-400">Total {faculty.length} Mentors Listed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Faculty Directory & Mentorship Network
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl">
              Connect with professors, principal researchers, and capstone supervisors across VLITS departments to seek mentorship for your project or research thesis.
            </p>
          </div>

          <Link
            to="/collaborators"
            className="btn-glass self-start md:self-auto text-xs sm:text-sm !py-2.5 !px-5 text-amber-300 border-amber-500/30 hover:border-amber-400"
          >
            <span>Student Matchmaker</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl space-y-4 border border-white/10 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search faculty by name, department, research interest, or skill..."
              className="w-full pl-10 pr-20 py-2.5 bg-dark-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/60 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold"
            >
              Search
            </button>
          </form>
        </div>

        {/* Department Filter Chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setDepartment(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                department === dept
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Loading faculty mentors from MongoDB Atlas...</p>
        </div>
      ) : faculty.length === 0 ? (
        <div className="py-16 text-center glass-card space-y-4">
          <GraduationCap className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Faculty Found</h3>
          <p className="text-xs text-slate-400">Try changing your search terms or selecting All Departments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculty.map(fac => (
            <div
              key={fac._id}
              className="glass-card p-6 flex flex-col justify-between hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 group space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={fac.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${fac.name}`}
                    alt={fac.name}
                    className="w-16 h-16 rounded-2xl bg-slate-800 object-cover flex-shrink-0 border border-amber-500/20"
                  />
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {fac.department || 'CSE'}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mt-1">
                      {fac.name}
                    </h3>
                    <p className="text-xs text-slate-400">{fac.headline || 'Professor & Capstone Mentor'}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">
                  {fac.bio || 'Mentoring VLITS scholars on research design, theoretical modeling, and practical implementations.'}
                </p>

                {/* Expertise Chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Research Areas & Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {fac.skills?.slice(0, 4).map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-white/5 text-amber-200 border border-white/5">
                        {s.name || s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
                <Link
                  to={`/faculty/${fac._id}`}
                  className="text-amber-300 hover:text-white flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>View Lab Profile</span>
                  <span>&rarr;</span>
                </Link>

                <a
                  href={`mailto:${fac.email}`}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  title={`Email ${fac.email}`}
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
