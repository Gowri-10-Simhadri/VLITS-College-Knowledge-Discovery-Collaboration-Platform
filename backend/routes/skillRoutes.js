import express from 'express';
import { dataStore } from '../data/store.js';
import { sampleSkills } from '../data/seedData.js';
import { Skill } from '../models/Skill.js';
import { getDbStatus } from '../config/db.js';

const router = express.Router();

// GET /api/skills - List all skills with stats
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const { isConnected } = getDbStatus();

    let allSkills = sampleSkills;
    if (isConnected) {
      try {
        const atlasSkills = await Skill.find({}).lean();
        if (atlasSkills.length > 0) allSkills = atlasSkills;
      } catch (err) {}
    }

    const { projects } = await dataStore.getProjects({}, '-createdAt', 1, 100);
    const users = await dataStore.getUsers();

    // Enrich each skill with dynamic project & student counts
    const enrichedSkills = allSkills.map(skill => {
      const sName = (skill.name || '').toLowerCase();
      
      const matchingProjects = projects.filter(p => 
        p.skillsRequired?.some(s => s.toLowerCase().includes(sName)) ||
        p.techStack?.some(t => t.toLowerCase().includes(sName))
      );

      const matchingStudents = users.filter(u => 
        u.role === 'student' &&
        u.skills?.some(s => (s.name || s).toLowerCase().includes(sName))
      );

      const matchingFaculty = users.filter(u => 
        u.role === 'faculty' &&
        u.skills?.some(s => (s.name || s).toLowerCase().includes(sName))
      );

      return {
        _id: skill._id || `skill_${sName.replace(/\s+/g, '_')}`,
        name: skill.name,
        category: skill.category || 'General Computing',
        projectsCount: matchingProjects.length,
        studentsCount: matchingStudents.length,
        facultyCount: matchingFaculty.length,
        sampleProjects: matchingProjects.slice(0, 3).map(p => ({ _id: p._id, title: p.title, domain: p.domain }))
      };
    });

    let result = enrichedSkills;
    if (category && category !== 'All Categories') {
      result = result.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }

    return res.json(result);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return res.status(500).json({ message: 'Failed to fetch skill explorer index.' });
  }
});

// GET /api/skills/:name - Deep-dive knowledge path for a specific skill
router.get('/:name', async (req, res) => {
  try {
    const rawName = decodeURIComponent(req.params.name).trim();
    const sName = rawName.toLowerCase();

    const { projects } = await dataStore.getProjects({}, '-createdAt', 1, 100);
    const users = await dataStore.getUsers();

    // Matching Projects
    const matchingProjects = projects.filter(p => 
      p.skillsRequired?.some(s => s.toLowerCase().includes(sName)) ||
      p.techStack?.some(t => t.toLowerCase().includes(sName)) ||
      p.title.toLowerCase().includes(sName) ||
      p.description.toLowerCase().includes(sName)
    );

    // Matching Students
    const matchingStudents = users.filter(u => 
      u.role === 'student' &&
      u.skills?.some(s => (s.name || s).toLowerCase().includes(sName))
    );

    // Matching Faculty Mentors
    const matchingFaculty = users.filter(u => 
      u.role === 'faculty' && (
        u.skills?.some(s => (s.name || s).toLowerCase().includes(sName)) ||
        u.interests?.some(i => i.toLowerCase().includes(sName)) ||
        matchingProjects.some(p => p.facultySupervisor?.email === u.email || p.facultySupervisor?.name.toLowerCase() === u.name.toLowerCase())
      )
    );

    // Extract Related Technologies from projects using this skill
    const techSet = new Set();
    matchingProjects.forEach(p => {
      p.techStack?.forEach(t => {
        if (t.toLowerCase() !== sName) techSet.add(t);
      });
    });

    // Extract Research Papers cited by projects requiring this skill
    const researchPapers = [];
    matchingProjects.forEach(p => {
      p.researchPapers?.forEach((rp, idx) => {
        researchPapers.push({
          id: `paper_${p._id}_${idx}`,
          title: rp.title,
          url: rp.url,
          authors: rp.authors || p.facultySupervisor?.name || 'Academic Researchers',
          year: rp.year || p.year,
          projectId: p._id,
          projectTitle: p.title
        });
      });
    });

    // Extract Datasets utilized
    const datasets = [];
    matchingProjects.forEach(p => {
      p.datasets?.forEach((ds, idx) => {
        datasets.push({
          id: `ds_${p._id}_${idx}`,
          name: ds.name,
          url: ds.url,
          description: ds.description || 'Open academic dataset utilized for benchmark training.',
          projectId: p._id,
          projectTitle: p.title
        });
      });
    });

    // Sibling / Related Skills
    const relatedSkillsSet = new Set();
    matchingProjects.forEach(p => {
      p.skillsRequired?.forEach(s => {
        if (s.toLowerCase() !== sName) relatedSkillsSet.add(s);
      });
    });

    return res.json({
      skillName: rawName,
      summary: `Knowledge graph hub for ${rawName} across Vignan's Lara Institute of Technology & Science.`,
      stats: {
        projectsCount: matchingProjects.length,
        studentsCount: matchingStudents.length,
        facultyCount: matchingFaculty.length,
        researchPapersCount: researchPapers.length,
        datasetsCount: datasets.length
      },
      relatedTechnologies: Array.from(techSet).slice(0, 10),
      relatedSkills: Array.from(relatedSkillsSet).slice(0, 8),
      projects: matchingProjects,
      students: matchingStudents,
      faculty: matchingFaculty,
      researchPapers,
      datasets
    });
  } catch (error) {
    console.error('Error fetching skill detail:', error);
    return res.status(500).json({ message: 'Failed to generate skill knowledge graph.' });
  }
});

export default router;
