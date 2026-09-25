import express from 'express';
import { dataStore } from '../data/store.js';

const router = express.Router();

// Helper to extract all research papers across projects & faculty
const getAllResearchPapers = async () => {
  const { projects } = await dataStore.getProjects({}, '-createdAt', 1, 100);
  const users = await dataStore.getUsers();
  
  const papers = [];
  const seenTitles = new Set();

  projects.forEach((p, pIdx) => {
    p.researchPapers?.forEach((rp, rIdx) => {
      const cleanTitle = (rp.title || '').trim();
      if (!cleanTitle || seenTitles.has(cleanTitle.toLowerCase())) return;
      seenTitles.add(cleanTitle.toLowerCase());

      const paperId = `paper_${p._id}_${rIdx}`;
      papers.push({
        _id: paperId,
        title: cleanTitle,
        authors: rp.authors || `${p.facultySupervisor?.name || 'Dr. Ramesh Kumar'}, ${p.teamMembers?.[0]?.name || 'Student Researcher'}`,
        domain: p.domain || 'Computer Science & Engineering',
        year: rp.year || p.year || 2024,
        publication: rp.publication || 'IEEE / Springer Conference Proceedings',
        doi: rp.doi || `10.1109/VLITS.${p.year || 2024}.${1000 + rIdx}`,
        url: rp.url && rp.url.startsWith('http') ? rp.url : 'https://ieeexplore.ieee.org',
        abstract: rp.abstract || `Comprehensive research publication addressing key theoretical architectures, algorithmic benchmarks, and field deployments in ${p.domain}. Integrated into the ${p.title} capstone initiative at Vignan's Lara Institute of Technology & Science.`,
        relatedProjects: [
          { _id: p._id, title: p.title, domain: p.domain, year: p.year, thumbnail: p.thumbnail }
        ],
        skills: p.skillsRequired || ['Machine Learning', 'Data Analysis'],
        technologies: p.techStack || ['Python', 'PyTorch']
      });
    });
  });

  return papers;
};

// GET /api/research - List all research papers with domain & search filtering
router.get('/', async (req, res) => {
  try {
    const { domain, search } = req.query;
    let papers = await getAllResearchPapers();

    if (domain && domain !== 'All Domains') {
      papers = papers.filter(p => p.domain.toLowerCase() === domain.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      papers = papers.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        p.domain.toLowerCase().includes(q) ||
        p.skills?.some(s => s.toLowerCase().includes(q))
      );
    }

    return res.json({
      total: papers.length,
      papers
    });
  } catch (error) {
    console.error('Error fetching research papers:', error);
    return res.status(500).json({ message: 'Failed to fetch research library.' });
  }
});

// GET /api/research/:id - Single paper detail
router.get('/:id', async (req, res) => {
  try {
    const papers = await getAllResearchPapers();
    const paper = papers.find(p => p._id === req.params.id);

    if (!paper) {
      return res.status(404).json({ message: 'Research paper not found in college archives.' });
    }

    // Find all projects that cite or share technologies with this research paper
    const { projects } = await dataStore.getProjects({}, '-createdAt', 1, 100);
    const related = projects.filter(p =>
      p.domain === paper.domain ||
      p.skillsRequired?.some(s => paper.skills?.includes(s))
    ).slice(0, 4);

    return res.json({
      paper,
      relatedProjects: related
    });
  } catch (error) {
    console.error('Error fetching research paper detail:', error);
    return res.status(500).json({ message: 'Failed to fetch paper details.' });
  }
});

export default router;
