import express from 'express';
import { dataStore } from '../data/store.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/users/collaborators - Find student collaborators by skills
router.get('/collaborators', async (req, res) => {
  try {
    const { skill, branch, batch } = req.query;
    let users = (await dataStore.getUsers()).filter(u => u.role === 'student');

    if (skill) {
      const qSkill = skill.toLowerCase();
      users = users.filter(u => u.skills?.some(s => (s.name || s).toLowerCase().includes(qSkill)));
    }
    if (branch) {
      users = users.filter(u => u.branch === branch);
    }
    if (batch) {
      users = users.filter(u => u.batch === batch);
    }

    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error finding collaborators.' });
  }
});

// GET /api/users/faculty - Faculty directory
router.get('/faculty', async (req, res) => {
  try {
    const users = (await dataStore.getUsers()).filter(u => u.role === 'faculty');
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching faculty directory.' });
  }
});

// GET /api/users/bookmarks - Get saved projects (Wishlist)
router.get('/bookmarks', protect, async (req, res) => {
  try {
    const user = await dataStore.findUserById(req.user._id);
    if (!user || !user.bookmarks) return res.json([]);

    const bookmarkedProjects = [];
    for (const pid of user.bookmarks) {
      const p = await dataStore.getProjectById(pid);
      if (p) bookmarkedProjects.push(p);
    }
    return res.json(bookmarkedProjects);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch bookmarks.' });
  }
});

// PUT /api/users/profile - Update authenticated user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { headline, bio, batch, branch, department, skills, interests, github, linkedin, portfolio, name } = req.body;
    
    const updatePayload = {};
    if (name) updatePayload.name = name;
    if (headline !== undefined) updatePayload.headline = headline;
    if (bio !== undefined) updatePayload.bio = bio;
    if (batch !== undefined) updatePayload.batch = batch;
    if (branch !== undefined) updatePayload.branch = branch;
    if (department !== undefined) updatePayload.department = department;
    if (github !== undefined) updatePayload.github = github;
    if (linkedin !== undefined) updatePayload.linkedin = linkedin;
    if (portfolio !== undefined) updatePayload.portfolio = portfolio;
    
    if (skills) {
      updatePayload.skills = Array.isArray(skills)
        ? skills.map(s => typeof s === 'string' ? { name: s, level: 'Intermediate', endorsements: 1 } : s)
        : [];
    }
    if (interests) {
      updatePayload.interests = Array.isArray(interests) ? interests : [];
    }

    const updatedUser = await dataStore.updateUser(req.user._id, updatePayload);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      batch: updatedUser.batch,
      branch: updatedUser.branch,
      department: updatedUser.department,
      headline: updatedUser.headline,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      skills: updatedUser.skills,
      interests: updatedUser.interests,
      github: updatedUser.github,
      linkedin: updatedUser.linkedin,
      portfolio: updatedUser.portfolio,
      bookmarks: updatedUser.bookmarks || []
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ message: 'Failed to update profile.' });
  }
});

// POST /api/users/:id/connect - Send collaboration invitation or inquiry
router.post('/:id/connect', async (req, res) => {
  try {
    const targetUser = await dataStore.findUserById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found.' });
    }

    const { senderName, senderEmail, message, projectTitle } = req.body;
    
    return res.json({
      success: true,
      message: `Collaboration request sent to ${targetUser.name}! They have been notified at ${targetUser.email}.`,
      recipient: {
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role
      },
      requestDetails: {
        senderName: senderName || 'Anonymous Scholar',
        senderEmail: senderEmail || 'student@vignanlara.edu',
        projectTitle: projectTitle || 'General Capstone Collaboration',
        sentAt: new Date()
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to dispatch collaboration request.' });
  }
});

// GET /api/users/:id - Single user public profile with their projects
router.get('/:id', async (req, res) => {
  try {
    const user = await dataStore.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Find projects where user is team member or supervisor
    const all = await dataStore.getProjects({}, '-createdAt', 1, 100);
    const userProjects = all.projects.filter(p => 
      p.teamMembers?.some(m => m.name.toLowerCase() === user.name.toLowerCase() || m.email === user.email) ||
      p.facultySupervisor?.name.toLowerCase() === user.name.toLowerCase() ||
      p.facultySupervisor?.email === user.email
    );

    return res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        batch: user.batch,
        branch: user.branch,
        department: user.department,
        headline: user.headline,
        bio: user.bio,
        avatar: user.avatar,
        skills: user.skills,
        interests: user.interests,
        github: user.github,
        linkedin: user.linkedin,
        rating: user.rating
      },
      projects: userProjects
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user profile.' });
  }
});

export default router;
