import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, PlusCircle, Network, Users } from 'lucide-react';

export default function MobileBottomNav() {
  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/discover', label: 'Discover', icon: Compass },
    { to: '/submit', label: 'Publish', icon: PlusCircle, highlight: true },
    { to: '/graph', label: 'Graph', icon: Network },
    { to: '/collaborators', label: 'Mentors', icon: Users },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-900/90 backdrop-blur-2xl border-t border-white/10 px-3 py-1.5 shadow-2xl flex items-center justify-around safe-area-bottom">
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={idx}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative
              ${item.highlight ? 'text-cyan-400 font-bold' : isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'}
            `}
          >
            {({ isActive }) => (
              <>
                {item.highlight ? (
                  <div className="w-10 h-10 -mt-5 rounded-full bg-gradient-to-r from-primary-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/40 border-2 border-dark-950">
                    <Icon className="w-5 h-5" />
                  </div>
                ) : (
                  <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-cyan-400' : ''} transition-transform`} />
                )}
                <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold text-cyan-300' : 'font-medium'}`}>
                  {item.label}
                </span>
                {isActive && !item.highlight && (
                  <span className="w-1 h-1 rounded-full bg-cyan-400 absolute bottom-0"></span>
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </div>
  );
}
