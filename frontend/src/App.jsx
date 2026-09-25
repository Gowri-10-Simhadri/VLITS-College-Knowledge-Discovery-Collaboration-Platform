import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import CompareDrawer from './components/CompareDrawer';
import AuthModal from './components/AuthModal';

import Home from './pages/Home';
import Discover from './pages/Discover';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import KnowledgeGraph from './pages/KnowledgeGraph';
import SubmitProject from './pages/SubmitProject';
import Compare from './pages/Compare';
import Collaborators from './pages/Collaborators';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import SkillsHub from './pages/SkillsHub';
import SkillDetail from './pages/SkillDetail';
import ResearchHub from './pages/ResearchHub';
import ResearchDetail from './pages/ResearchDetail';
import ResourcesHub from './pages/ResourcesHub';
import ResourceDetail from './pages/ResourceDetail';
import FacultyDirectory from './pages/FacultyDirectory';
import FacultyProfile from './pages/FacultyProfile';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';

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
            {/* Core & Discovery */}
            <Route path="/" element={<Home onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            <Route path="/discover" element={<Discover onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            <Route path="/graph" element={<KnowledgeGraph />} />
            
            {/* Projects & Capstone Repository */}
            <Route path="/projects" element={<Projects onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            <Route path="/projects/:id" element={<ProjectDetail onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            <Route path="/submit" element={<SubmitProject onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/bookmarks" element={<Bookmarks onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            
            {/* Skills & Competencies */}
            <Route path="/skills" element={<SkillsHub />} />
            <Route path="/skills/:name" element={<SkillDetail onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            
            {/* Research Library */}
            <Route path="/research" element={<ResearchHub />} />
            <Route path="/research/:id" element={<ResearchDetail />} />
            
            {/* Datasets & Lab Facilities */}
            <Route path="/resources" element={<ResourcesHub />} />
            <Route path="/resources/:id" element={<ResourceDetail />} />
            
            {/* Faculty Mentors & Student Collaborators */}
            <Route path="/faculty" element={<FacultyDirectory />} />
            <Route path="/faculty/:id" element={<FacultyProfile onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            <Route path="/collaborators" element={<Collaborators />} />
            <Route path="/students/:id" element={<Profile onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            <Route path="/profile" element={<Profile onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            <Route path="/profile/:id" element={<Profile onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            
            {/* Collaboration Inbox & Notifications */}
            <Route path="/notifications" element={<Notifications onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            
            {/* Admin Control Center */}
            <Route path="/admin" element={<AdminDashboard onOpenAuthModal={() => setAuthModalOpen(true)} />} />

            {/* Auth aliases for direct URL entry */}
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />

            {/* Graceful 404 Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
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
