import React from 'react';
import { Link } from 'react-router-dom';
import { GitCompare, X, ArrowRight } from 'lucide-react';
import { useCompareStore } from '../store/useCompareStore';

export default function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-16 lg:bottom-4 left-4 right-4 max-w-4xl mx-auto z-40 animate-in slide-in-from-bottom duration-300">
      <div className="glass-panel p-3.5 rounded-2xl border border-cyan-500/40 shadow-2xl shadow-black/80 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
        
        {/* Left info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Compare Capstone Projects</span>
              <span className="text-[11px] font-medium text-cyan-300">({compareList.length}/3 selected)</span>
            </h4>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Side-by-side analysis of architectures, datasets & solutions
            </p>
          </div>
        </div>

        {/* Selected Project Thumbnails */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {compareList.map((p) => (
            <div 
              key={p._id}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-white max-w-[160px] truncate"
            >
              <img src={p.thumbnail} alt="" className="w-6 h-6 rounded-md object-cover flex-shrink-0" />
              <span className="truncate text-[11px] font-medium">{p.title}</span>
              <button 
                onClick={() => removeFromCompare(p._id)}
                className="text-slate-400 hover:text-rose-400 ml-auto flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={clearCompare}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
          >
            Clear
          </button>
          <Link
            to="/compare"
            className="btn-gradient !py-2 !px-4 text-xs font-bold flex items-center gap-1.5"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
