import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import CompareDrawer from './components/CompareDrawer';
import AuthModal from './components/AuthModal';

import Home from './pages/Home';
import Discover from './pages/Discover';
import ProjectDetail from './pages/ProjectDetail';
import KnowledgeGraph from './pages/KnowledgeGraph';
import SubmitProject from './pages/SubmitProject';
import Compare from './pages/Compare';
import Collaborators from './pages/Collaborators';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-dark-950 text-slate-100 relative selection:bg-primary-500 selection:text-white">
        
        {/* Sticky Global Navbar */}
        <Navbar onOpenAuthModal={() => setAuthModalOpen(true)} />

        {/* Dynamic Route Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            <Route path="/discover" element={<Discover onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            <Route path="/projects/:id" element={<ProjectDetail onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            <Route path="/graph" element={<KnowledgeGraph />} />
            <Route path="/submit" element={<SubmitProject onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/collaborators" element={<Collaborators />} />
            <Route path="/bookmarks" element={<Bookmarks onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            <Route path="/profile" element={<Profile onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            <Route path="/profile/:id" element={<Profile onOpenAuthModal={() => setAuthModalOpen(true)} />} />
          </Routes>
        </main>

        {/* Floating Compare Drawer (when 1+ projects selected) */}
        <CompareDrawer />

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav />

        {/* Auth Modal with One-Click Demo Access */}
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    </BrowserRouter>
  );
}
