import express from 'express';
import { dataStore } from '../data/store.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/projects - List with Amazon-style multi-filters, sort, pagination
router.get('/', async (req, res) => {
  try {
    const { domain, year, batch, techStack, q, sort, page = 1, limit = 12 } = req.query;

    const filter = {};
    if (domain && domain !== 'All Domains') filter.domain = domain;
    if (year && year !== 'All Years') filter.year = year;
    if (batch && batch !== 'All Batches') filter.batch = batch;
    if (techStack) filter.techStack = techStack;
    if (q) filter.q = q;

    const result = await dataStore.getProjects(filter, sort, Number(page), Number(limit));

    return res.json(result);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ message: 'Failed to fetch projects.' });
  }
});

// GET /api/projects/featured - Featured projects
router.get('/featured', async (req, res) => {
  try {
    const all = await dataStore.getProjects({}, 'rating', 1, 10);
    const featured = all.projects.filter(p => p.isFeatured || p.rating?.average >= 4.8);
    return res.json(featured);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching featured projects.' });
  }
});

// GET /api/projects/trending - Trending this semester
router.get('/trending', async (req, res) => {
  try {
    const all = await dataStore.getProjects({}, 'views', 1, 6);
    return res.json(all.projects);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching trending projects.' });
  }
});

// GET /api/projects/compare - Compare multiple projects
router.get('/compare', async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) return res.status(400).json({ message: 'Provide project IDs to compare.' });
    
    const idList = ids.split(',');
    const projects = [];
    for (const id of idList) {
      const p = await dataStore.getProjectById(id);
      if (p) projects.push(p);
    }
    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ message: 'Error comparing projects.' });
  }
});

// GET /api/projects/:id - Single Project details & computed related projects
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const project = await dataStore.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found in college knowledge base.' });
    }

    // Compute related projects based on shared techStack or domain or skills
    const all = await dataStore.getProjects({}, '-createdAt', 1, 50);
    const related = all.projects
      .filter(p => p._id !== project._id)
      .map(p => {
        let score = 0;
        if (p.domain === project.domain) score += 3;
        const sharedTech = p.techStack?.filter(t => project.techStack?.includes(t)) || [];
        score += sharedTech.length * 2;
        const sharedSkills = p.skillsRequired?.filter(s => project.skillsRequired?.includes(s)) || [];
        score += sharedSkills.length * 2;
        if (p.facultySupervisor?.name === project.facultySupervisor?.name) score += 2;
        return { project: p, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.project);

    return res.json({
      project,
      relatedProjects: related
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching project.' });
  }
});

// POST /api/projects - Submit new project
router.post('/', protect, async (req, res) => {
  try {
    const {
      title, tagline, description, detailedOverview, domain, year, batch, semester,
      techStack, skillsRequired, datasets, researchPapers, problemsFaced,
      lessonsLearned, futureImprovements, teamMembers, facultySupervisor,
      githubLink, liveDemoLink, reportDocLink, thumbnail, badge
    } = req.body;

    if (!title || !description || !domain) {
      return res.status(400).json({ message: 'Title, description, and domain are required.' });
    }

    const newProject = await dataStore.createProject({
      title,
      tagline: tagline || '',
      description,
      detailedOverview: detailedOverview || description,
      domain,
      year: Number(year) || new Date().getFullYear(),
      batch: batch || '2023-2027',
      semester: semester || '8th Semester / Final Year Capstone',
      techStack: Array.isArray(techStack) ? techStack : (techStack ? techStack.split(',').map(s => s.trim()) : []),
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : (skillsRequired ? skillsRequired.split(',').map(s => s.trim()) : []),
      datasets: datasets || [],
      researchPapers: researchPapers || [],
      problemsFaced: problemsFaced || [],
      lessonsLearned: lessonsLearned || '',
      futureImprovements: futureImprovements || '',
      teamMembers: teamMembers && teamMembers.length > 0 ? teamMembers : [
        { name: req.user.name, role: 'Lead Author', email: req.user.email, batch: req.user.batch, avatar: req.user.avatar }
      ],
      facultySupervisor: facultySupervisor || {
        name: 'Dr. Ramesh Kumar',
        department: req.user.department || 'CSE',
        designation: 'Professor',
        email: 'ramesh.kumar@college.edu'
      },
      githubLink: githubLink || 'https://github.com',
      liveDemoLink: liveDemoLink || '',
      reportDocLink: reportDocLink || '',
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      screenshots: [thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'],
      badge: badge || '⭐ Newly Published Capstone'
    });

    return res.status(201).json(newProject);
  } catch (error) {
    console.error('Project submission error:', error);
    return res.status(500).json({ message: 'Failed to submit project to knowledge platform.' });
  }
});

// POST /api/projects/:id/reviews - Add review
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating (1-5) and comment are required.' });
    }

    const reviewData = {
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      userAvatar: req.user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${req.user.name}`,
      rating: Number(rating),
      comment
    };

    const updated = await dataStore.addReview(req.params.id, reviewData);
    if (!updated) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    return res.status(201).json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to post review.' });
  }
});

// POST /api/projects/:id/bookmark - Wishlist toggle
router.post('/:id/bookmark', protect, async (req, res) => {
  try {
    const result = await dataStore.toggleBookmark(req.user._id, req.params.id);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to toggle bookmark.' });
  }
});

export default router;
